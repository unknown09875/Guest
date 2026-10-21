#!/usr/bin/env bash
# ===========================================================================
#  Kali Fundamentals Lab - one click setup
#  Usage:  chmod +x setup.sh && ./setup.sh
#          ./setup.sh --reset     (rebuild target + portal from scratch)
#          ./setup.sh --status
#          ./setup.sh --help
# ===========================================================================
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

GREEN=$'\033[0;92m'
YELLOW=$'\033[0;93m'
RED=$'\033[0;91m'
CYAN=$'\033[0;96m'
BOLD=$'\033[1m'
DIM=$'\033[2m'
NC=$'\033[0m'

info()  { printf '%s[*]%s %s\n' "$CYAN" "$NC" "$*"; }
ok()    { printf '%s[+]%s %s\n' "$GREEN" "$NC" "$*"; }
warn()  { printf '%s[!]%s %s\n' "$YELLOW" "$NC" "$*"; }
die()   { printf '%s[x]%s %s\n' "$RED" "$NC" "$*" >&2; exit 1; }

banner() {
    printf '\n%s%s' "$BOLD" "$GREEN"
    cat <<'ART'
  ============================================================
     KALI FUNDAMENTALS LAB  -  eJPT v2 preparation
  ============================================================
ART
    printf '%s\n' "$NC"
}

usage() {
    banner
    cat <<EOF

${BOLD}Usage${NC}
  ./setup.sh              install everything and start the lab
  ./setup.sh --reset      destroy the containers and rebuild them (fresh target)
  ./setup.sh --status     show what is running
  ./setup.sh --help       this message

${BOLD}What it does${NC}
  1. checks Docker (installs docker.io + the compose plugin with apt if missing)
  2. starts the Docker daemon
  3. builds the flask-portal and linux-target images
  4. runs docker compose up -d
  5. waits for http://localhost:5000 and prints the access details

EOF
}

# ---------------------------------------------------------------------------
# arguments
# ---------------------------------------------------------------------------
MODE="install"
case "${1:-}" in
    ""|--install|-i) MODE="install" ;;
    --reset|-r)      MODE="reset" ;;
    --status|-s)     MODE="status" ;;
    --help|-h)       usage; exit 0 ;;
    *)               usage; die "unknown option: $1" ;;
esac

# ---------------------------------------------------------------------------
# sudo handling
# ---------------------------------------------------------------------------
SUDO=()
if [ "$(id -u)" -ne 0 ]; then
    if command -v sudo >/dev/null 2>&1; then
        SUDO=(sudo)
    else
        die "Run this script as root, or install sudo first."
    fi
fi

as_root() {
    if [ "${#SUDO[@]}" -gt 0 ]; then "${SUDO[@]}" "$@"; else "$@"; fi
}

# ---------------------------------------------------------------------------
# docker detection / installation
# ---------------------------------------------------------------------------
install_docker() {
    warn "Docker was not found - installing it now."
    command -v apt-get >/dev/null 2>&1 || die "Automatic install needs apt-get (Debian/Kali/Ubuntu). Install Docker manually: https://docs.docker.com/engine/install/"

    info "apt-get update"
    as_root env DEBIAN_FRONTEND=noninteractive apt-get update -qq

    info "installing docker.io and compose support (this can take a few minutes)"
    as_root env DEBIAN_FRONTEND=noninteractive apt-get install -y -qq docker.io || \
        die "Could not install docker.io. Install Docker manually and re-run ./setup.sh"

    # compose plugin: package name differs between Kali / Debian releases
    as_root env DEBIAN_FRONTEND=noninteractive apt-get install -y -qq docker-compose-plugin >/dev/null 2>&1 || true
    as_root env DEBIAN_FRONTEND=noninteractive apt-get install -y -qq docker-compose >/dev/null 2>&1 || true

    ok "Docker installed"
}

install_compose_plugin() {
    warn "No Docker Compose found - trying to install the compose v2 plugin."
    if command -v apt-get >/dev/null 2>&1; then
        as_root env DEBIAN_FRONTEND=noninteractive apt-get install -y -qq docker-compose-plugin >/dev/null 2>&1 || true
        as_root env DEBIAN_FRONTEND=noninteractive apt-get install -y -qq docker-compose >/dev/null 2>&1 || true
    fi

    if docker compose version >/dev/null 2>&1 || as_root docker compose version >/dev/null 2>&1; then
        return 0
    fi

    # last resort: official standalone plugin binary
    if command -v curl >/dev/null 2>&1; then
        case "$(uname -m)" in
            x86_64|amd64)  ARCH="x86_64" ;;
            aarch64|arm64) ARCH="aarch64" ;;
            *)             warn "Unsupported architecture $(uname -m) for the compose binary."; return 1 ;;
        esac
        info "downloading compose v2 plugin binary (${ARCH})"
        as_root mkdir -p /usr/local/lib/docker/cli-plugins
        if as_root curl -fsSL \
            "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-${ARCH}" \
            -o /usr/local/lib/docker/cli-plugins/docker-compose; then
            as_root chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
            ok "Compose plugin installed to /usr/local/lib/docker/cli-plugins"
        fi
    fi
}

start_daemon() {
    if as_root docker info >/dev/null 2>&1; then
        return 0
    fi

    info "starting the Docker service"
    if command -v systemctl >/dev/null 2>&1; then
        as_root systemctl enable --now docker >/dev/null 2>&1 || as_root systemctl start docker >/dev/null 2>&1 || true
    fi
    if ! as_root docker info >/dev/null 2>&1; then
        as_root service docker start >/dev/null 2>&1 || true
    fi

    # give the daemon a moment to come up
    for _ in $(seq 1 15); do
        if as_root docker info >/dev/null 2>&1; then return 0; fi
        sleep 1
    done

    die "The Docker daemon is not running. Start it with: sudo systemctl start docker"
}

ensure_docker() {
    if ! command -v docker >/dev/null 2>&1; then
        install_docker
    fi

    start_daemon

    # Add the invoking user to the docker group (takes effect on next login).
    local_login_user="${USER:-$(id -un)}"
    if [ "$(id -u)" -ne 0 ] && [ "${#SUDO[@]}" -gt 0 ]; then
        if ! id -nG "$local_login_user" | tr ' ' '\n' | grep -qx docker; then
            info "adding $local_login_user to the docker group (log out/in to use docker without sudo)"
            as_root usermod -aG docker "$local_login_user" >/dev/null 2>&1 || true
        fi
    fi

    # Prefer the unprivileged CLI, fall back to sudo.
    if docker info >/dev/null 2>&1; then
        DOCKER=(docker)
    elif as_root docker info >/dev/null 2>&1; then
        if [ "${#SUDO[@]}" -gt 0 ]; then
            DOCKER=("${SUDO[@]}" docker)
        else
            DOCKER=(docker)
        fi
    else
        die "Cannot talk to the Docker daemon. Try: sudo systemctl start docker"
    fi

    # Compose: v2 plugin first, then legacy docker-compose.
    if "${DOCKER[@]}" compose version >/dev/null 2>&1; then
        COMPOSE=("${DOCKER[@]}" compose)
    elif command -v docker-compose >/dev/null 2>&1; then
        if [ "${#SUDO[@]}" -gt 0 ] && ! docker-compose version >/dev/null 2>&1; then
            COMPOSE=("${SUDO[@]}" docker-compose)
        else
            COMPOSE=(docker-compose)
        fi
    else
        install_compose_plugin
        if "${DOCKER[@]}" compose version >/dev/null 2>&1; then
            COMPOSE=("${DOCKER[@]}" compose)
        elif command -v docker-compose >/dev/null 2>&1; then
            COMPOSE=(docker-compose)
        else
            die "Docker Compose is missing. Install it with: sudo apt install docker-compose-plugin"
        fi
    fi

    ok "Using: ${DOCKER[*]} + ${COMPOSE[*]}"
}

# ---------------------------------------------------------------------------
# session secret
# ---------------------------------------------------------------------------
gen_secret() {
    if command -v openssl >/dev/null 2>&1; then
        openssl rand -hex 32
    elif command -v python3 >/dev/null 2>&1; then
        python3 -c 'import secrets; print(secrets.token_hex(32))'
    else
        head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n'
    fi
}

ensure_env() {
    local env_file="$SCRIPT_DIR/.env"
    if [ -f "$env_file" ] && grep -q '^PORTAL_SECRET_KEY=..*' "$env_file"; then
        ok "reusing the session secret from .env"
        return 0
    fi

    {
        echo "# generated by setup.sh on $(date -u +%Y-%m-%dT%H:%M:%SZ)"
        echo "# a fresh secret is created automatically if you delete this file"
        echo "PORTAL_SECRET_KEY=$(gen_secret)"
    } >> "$env_file"
    chmod 600 "$env_file" 2>/dev/null || true
    ok "generated a random Flask session secret in .env"
}

# ---------------------------------------------------------------------------
# status / health
# ---------------------------------------------------------------------------
wait_for_portal() {
    local url="http://localhost:${PORTAL_PORT}/healthz"
    info "waiting for the portal on http://localhost:${PORTAL_PORT} ..."
    for _ in $(seq 1 45); do
        if command -v curl >/dev/null 2>&1; then
            if curl -fsS --max-time 3 "$url" >/dev/null 2>&1; then return 0; fi
        elif command -v python3 >/dev/null 2>&1; then
            if python3 - "$url" <<'PY' >/dev/null 2>&1
import sys, urllib.request
urllib.request.urlopen(sys.argv[1], timeout=3)
PY
            then return 0; fi
        else
            sleep 2
        fi
        sleep 2
    done
    return 1
}

show_status() {
    printf '\n%sLab status%s\n' "$BOLD" "$NC"
    if ! command -v docker >/dev/null 2>&1; then
        echo "  docker: not installed"
        return 0
    fi
    for name in flask-portal linux-target; do
        as_root docker inspect -f '  {{.Name}}  {{.State.Status}}  {{.Config.Image}}' "$name" 2>/dev/null || \
            echo "  $name  not created"
    done
    echo
}

if [ "$MODE" = "status" ]; then
    banner
    ensure_docker
    show_status
    exit 0
fi

# ---------------------------------------------------------------------------
# run
# ---------------------------------------------------------------------------
banner
PORTAL_PORT="${PORTAL_PORT:-5000}"
export PORTAL_PORT

info "checking Docker and Docker Compose"
ensure_docker

info "checking project folders"
mkdir -p "$SCRIPT_DIR/portal" "$SCRIPT_DIR/target"

ensure_env

if [ "$MODE" = "reset" ]; then
    warn "resetting the lab (containers and their filesystem changes are removed)"
    "${COMPOSE[@]}" down --remove-orphans --volumes >/dev/null 2>&1 || true
    ok "previous lab removed"
fi

info "building images (first run downloads Ubuntu 22.04 + Python, be patient)"
"${COMPOSE[@]}" build

info "starting containers"
"${COMPOSE[@]}" up -d

# Sanity checks -------------------------------------------------------------
sleep 2
if ! as_root docker inspect -f '{{.State.Running}}' linux-target 2>/dev/null | grep -q true; then
    warn "linux-target does not look healthy. Showing logs:"
    "${COMPOSE[@]}" logs --tail 40 linux-target || true
    die "linux-target failed to start."
fi
ok "linux-target is running"

if ! wait_for_portal; then
    warn "The portal did not answer on port ${PORTAL_PORT}. Showing logs:"
    "${COMPOSE[@]}" logs --tail 60 flask-portal || true
    cat <<EOF

${YELLOW}Common fixes${NC}
  - port ${PORTAL_PORT} already in use:  PORTAL_PORT=5001 ./setup.sh   then open http://localhost:5001
  - docker permission denied:           sudo usermod -aG docker \$USER  (then log out/in)
  - inspect manually:                   ${COMPOSE[*]} ps

EOF
    exit 1
fi
ok "flask-portal is healthy"

echo
printf '%s%s================================================================%s\n' "$BOLD" "$GREEN" "$NC"
printf '%sLab is ready! Open http://localhost:%s - Target machine is linux-target, use: docker exec -it linux-target bash%s\n' "$BOLD" "${PORTAL_PORT}" "$NC"
printf '%s%s================================================================%s\n' "$BOLD" "$GREEN" "$NC"
cat <<EOF

  ${DIM}Portal      ${NC}http://localhost:${PORTAL_PORT}
  ${DIM}Target IP   ${NC}10.10.10.5   (inside the kali-lab-net bridge network)
  ${DIM}Root shell  ${NC}docker exec -it linux-target bash
  ${DIM}Flag files  ${NC}/home/james/flag1.txt and /topsecret/readable.txt
  ${DIM}Stop        ${NC}${COMPOSE[*]} down
  ${DIM}Reset       ${NC}./setup.sh --reset
  ${DIM}Status      ${NC}./setup.sh --status

  ${YELLOW}Note:${NC} the portal container mounts /var/run/docker.sock read-only so it can
  verify flags live. Keep this lab on your own machine and do not expose port ${PORTAL_PORT}
  to the internet.

EOF
