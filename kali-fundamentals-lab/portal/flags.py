"""Live flag reader.

The flag values are *never* stored in the repository or in the portal image.
They are read straight out of the `linux-target` container every time a flag
is submitted, so the only way to get them is to actually open the files on the
target machine.

Three transports are supported, tried in order:

1. Docker CLI (`docker exec linux-target cat <path>`) - used when the portal
   runs directly on the Kali host.
2. The Docker Engine API over /var/run/docker.sock - used when the portal runs
   inside its own container (docker-compose mounts the socket read-only).
3. A JSON file pointed at by LAB_FLAGS_FILE - only for offline development.
"""

from __future__ import annotations

import http.client
import json
import os
import shlex
import socket
import subprocess

CONTAINER = os.environ.get("LAB_TARGET_CONTAINER", "linux-target")
DOCKER_SOCK = os.environ.get("DOCKER_SOCK", "/var/run/docker.sock")
FLAGS_FILE = os.environ.get("LAB_FLAGS_FILE")
CACHE_TTL = float(os.environ.get("FLAG_CACHE_TTL", "2"))

_cache: dict[str, tuple[float, str]] = {}


# --------------------------------------------------------------------------
# transports
# --------------------------------------------------------------------------
def _read_with_cli(path: str) -> str:
    out = subprocess.run(
        ["docker", "exec", CONTAINER, "cat", path],
        capture_output=True,
        text=True,
        timeout=10,
    )
    if out.returncode != 0:
        raise RuntimeError(out.stderr.strip() or "docker exec failed")
    return out.stdout


class _UnixHTTPConnection(http.client.HTTPConnection):
    def __init__(self, socket_path: str, timeout: float = 10):
        super().__init__("localhost", timeout=timeout)
        self._socket_path = socket_path

    def connect(self):
        sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        sock.settimeout(self.timeout)
        sock.connect(self._socket_path)
        self.sock = sock


def _read_with_api(path: str) -> str:
    if not os.path.exists(DOCKER_SOCK):
        raise RuntimeError("docker socket not mounted")

    conn = _UnixHTTPConnection(DOCKER_SOCK)

    def call(method: str, url: str, body: bytes | None = None) -> bytes:
        headers = {"Content-Type": "application/json"}
        conn.request(method, url, body=body, headers=headers)
        resp = conn.getresponse()
        data = resp.read()
        if resp.status >= 400:
            raise RuntimeError(f"docker api {resp.status}: {data[:200]!r}")
        return data

    exec_id = json.loads(
        call(
            "POST",
            f"/v1.41/containers/{CONTAINER}/exec",
            json.dumps(
                {
                    "AttachStdout": True,
                    "AttachStderr": True,
                    "Cmd": ["cat", path],
                }
            ).encode(),
        )
    )["Id"]

    raw = call("POST", f"/v1.41/exec/{exec_id}/start", json.dumps({"Detach": False, "Tty": True}).encode())
    inspect = json.loads(call("GET", f"/v1.41/exec/{exec_id}/json"))
    conn.close()

    if inspect.get("ExitCode", 0) != 0:
        raise RuntimeError(
            f"cat {path} exited {inspect.get('ExitCode')}: {raw.decode('utf-8', 'replace')[:160]}"
        )

    # With Tty enabled the stream is raw; strip the 8 byte docker header if a
    # multiplexed stream is returned instead (non-TTY containers).
    if len(raw) > 8 and raw[0] in (1, 2) and raw[1:4] == b"\x00\x00\x00":
        payload = b""
        offset = 0
        while offset + 8 <= len(raw):
            size = int.from_bytes(raw[offset + 4 : offset + 8], "big")
            payload += raw[offset + 8 : offset + 8 + size]
            offset += 8 + size
        raw = payload

    return raw.decode("utf-8", "replace")


def _read_with_file(path: str) -> str:
    if not FLAGS_FILE or not os.path.exists(FLAGS_FILE):
        raise RuntimeError("no flag source available")
    with open(FLAGS_FILE, encoding="utf-8") as handle:
        data = json.load(handle)
    if path not in data:
        raise RuntimeError(f"{path} missing from {FLAGS_FILE}")
    return str(data[path])


def read_target_file(path: str) -> str:
    """Return the contents of a file inside the target container."""
    errors = []
    for reader in (_read_with_cli, _read_with_api, _read_with_file):
        try:
            return reader(path)
        except FileNotFoundError as exc:  # docker CLI not installed
            errors.append(f"{reader.__name__}: {exc}")
        except subprocess.TimeoutExpired:
            errors.append(f"{reader.__name__}: timed out")
        except Exception as exc:  # noqa: BLE001 - fall through to next transport
            errors.append(f"{reader.__name__}: {exc}")
    raise RuntimeError("; ".join(errors))


def _normalise(text: str) -> str:
    return " ".join(text.split()).strip()


def get_flag(path: str) -> str:
    """Read a flag file and normalise it (cached briefly)."""
    import time

    now = time.monotonic()
    cached = _cache.get(path)
    if cached and now - cached[0] < CACHE_TTL:
        return cached[1]

    value = _normalise(read_target_file(path))
    _cache[path] = (now, value)
    return value


def docker_status() -> dict:
    """Best-effort description of how the portal reaches the target."""
    if FLAGS_FILE and os.path.exists(FLAGS_FILE) and not os.path.exists(DOCKER_SOCK):
        return {"ok": True, "transport": "file"}

    if os.path.exists(DOCKER_SOCK):
        try:
            conn = _UnixHTTPConnection(DOCKER_SOCK, timeout=5)
            conn.request("GET", f"/v1.41/containers/{CONTAINER}/json")
            resp = conn.getresponse()
            data = resp.read()
            conn.close()
            if resp.status == 404:
                return {"ok": False, "transport": "socket", "error": f"container {CONTAINER} not found"}
            if resp.status >= 400:
                return {"ok": False, "transport": "socket", "error": f"http {resp.status}"}
            state = json.loads(data).get("State", {})
            return {
                "ok": bool(state.get("Running")),
                "transport": "socket",
                "status": state.get("Status", "unknown"),
            }
        except Exception as exc:  # noqa: BLE001
            return {"ok": False, "transport": "socket", "error": str(exc)}

    try:
        out = subprocess.run(
            ["docker", "inspect", "-f", "{{.State.Status}}", CONTAINER],
            capture_output=True,
            text=True,
            timeout=8,
        )
        if out.returncode == 0:
            return {"ok": out.stdout.strip() == "running", "transport": "cli", "status": out.stdout.strip()}
        return {"ok": False, "transport": "cli", "error": out.stderr.strip()[:200]}
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "transport": "none", "error": str(exc)}


def shell_hint() -> str:
    return "docker exec -it " + shlex.quote(CONTAINER) + " bash"
