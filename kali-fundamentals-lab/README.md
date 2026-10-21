# Kali Fundamentals Lab

A self-contained, TryHackMe-style Linux room for **eJPT v2** preparation.
Everything runs in Docker on your Kali VM: a dark instruction portal on
`http://localhost:5000` and a real Ubuntu 22.04 victim box called
`linux-target` with the flags hidden inside it.

```
  browser ──► localhost:5000 ──► flask-portal ──(docker.sock)──► linux-target
                                                                 10.10.10.5
```

---

## Quick start (one click)

Copy the whole `kali-fundamentals-lab/` folder to your Kali VM, then:

```bash
cd kali-fundamentals-lab
chmod +x setup.sh && ./setup.sh
```

`setup.sh` is idempotent. It will:

1. verify Docker is installed (installs `docker.io` + Compose with `apt` if missing),
2. make sure the Docker daemon is running and add you to the `docker` group,
3. build the `flask-portal` and `linux-target` images,
4. run `docker compose up -d`,
5. wait for the health check and print the access details.

When it finishes you will see:

```
================================================================
Lab is ready! Open http://localhost:5000 - Target machine is linux-target, use: docker exec -it linux-target bash
================================================================
```

Then open **http://localhost:5000** in your browser and get a root shell on the
target with:

```bash
docker exec -it linux-target bash
```

There is no VPN, no SSH port and no external network access involved.

---

## Requirements

| Item | Notes |
|---|---|
| Kali Linux VM (or any Debian/Ubuntu host) | Tested layout targets Kali rolling |
| Docker Engine + Compose v2 | Installed automatically by `setup.sh` if missing |
| ~2 GB free disk, 2 GB RAM | Ubuntu + Python base images |
| Internet on first run | To pull `ubuntu:22.04` and `python:3.11-slim` |
| Port 5000 free | Override with `PORTAL_PORT=5001 ./setup.sh` |

---

## The room

Six tasks, seven submissions in total. Questions are validated **server-side**;
the two `FLAG{...}` values are read live from `linux-target` at submit time, so
they are not present anywhere in the web app, the HTML, or the JavaScript.

| Task | Topic | What you practise |
|---|---|---|
| 1 | Introduction & Access | `docker exec`, target IP, account layout |
| 2 | Moving files with `mv` | globs, absolute destinations, the `--` end-of-options marker, a file literally named `- logs` |
| 3 | Copying & quoting | `cp -r`, filenames with spaces (`encryption keys`) |
| 4 | Remote transfers with `scp` | `user@host:path` syntax |
| 5 | Capture flag 1 | reading `/home/james/flag1.txt` |
| 6 | Find the hidden file | `find`, `-name`, `-newermt`, decoys and permission noise |

Flags on the target:

```
/home/james/flag1.txt      FLAG{...}
/topsecret/readable.txt    FLAG{...}
```

Task 6 also tells you to try the room-level **Submit Flag** box at the bottom of
the page; it accepts either flag and ticks the matching question.

A spoiler-filled answer key lives in [`SOLUTIONS.md`](SOLUTIONS.md).

---

## Using the portal

- **Left column** - Task 1-6 list with per-task progress, clicking scrolls to the task.
- **Task cards** - each card opens straight on the questions so you can answer
  immediately. The walkthrough for a task is **hidden by default**: use the
  **Show instructions** button underneath the questions to reveal it (the choice
  is remembered per task in your browser, and `Hide` closes it again).
- **Questions** - every question has an answer box, a `Submit` button and a
  `Show hint` toggle. Hints only appear when you click them and are fetched on
  demand, so nothing is revealed automatically. Correct answers turn the box
  green with a tick, wrong ones shake and show a red message that clears as soon
  as you start typing again.
- **Right column** - target `IP` box with copy button, a fake 60 minute timer,
  `+ Add 1 Hour` and `Terminate` buttons (UI only, they never touch Docker),
  the access command and a small cheat sheet.
- **Reset** - the `Reset` button (or *Reset my answers* in the footer) clears
  your submitted answers and flags for this browser.
- **Progress bar** - updates live from the API. Each task shows `x/y` and a green
  tick when it is complete.

### Instructions & hints

Instructions never open on their own. Open **Show instructions** under the
questions of a task when you want the walkthrough, and close it with **Hide**.
Hints work the same way: the `Show hint` link loads one hint for that question
and nothing else is revealed until you ask for it.

The navbar/timer/streak/points elements are part of the theme, not real accounts.

---

## Useful commands

```bash
./setup.sh                  # install / start the lab
./setup.sh --status         # what is running
./setup.sh --reset          # destroy and rebuild both containers (fresh target)

docker compose ps           # container status
docker compose logs -f flask-portal
docker exec -it linux-target bash
docker exec linux-target ls -la /home/james
docker exec linux-target /usr/local/bin/seed.sh --force   # rebuild target files
```

Stop without losing anything:

```bash
docker compose down
```

---

## Reset

**Reset the target files** (flags restored, renamed files gone, `- logs` back in
place):

```bash
./setup.sh --reset
```

or, if you prefer the raw commands:

```bash
docker compose down --volumes --remove-orphans
docker compose up -d --build
```

Re-creating the `linux-target` container restores the pristine filesystem from
the image. There are no volumes holding your changes.

**Reset your portal answers**: click `Reset` in the room header (stored in a
signed browser session cookie, not in the containers).

**Full clean-up** including images:

```bash
docker compose down --rmi local --volumes --remove-orphans
```

---

## How flag validation works

The portal never stores flag values. On each flag submission it reads the file
from the target:

1. `docker exec linux-target cat /path` when the portal runs on the host,
2. the Docker Engine API over the mounted `/var/run/docker.sock` when the portal
   runs in its own container (the normal compose path),
3. a local JSON file (`LAB_FLAGS_FILE`) for offline development.

There is a two-second cache per path, so if you edit the flags inside the
container the portal follows you almost immediately.

Because the portal needs the Docker socket to do this, it is mounted
read-only (`:ro`) and the container runs as root. **That is effectively root
access to the Docker daemon** - fine for a local lab, but never expose port 5000
to the internet or run this on a shared host.

---

## Project structure

```
kali-fundamentals-lab/
├── setup.sh                 # the one-click installer
├── docker-compose.yml       # flask-portal (5000) + linux-target (10.10.10.5)
├── README.md
├── SOLUTIONS.md             # answer key (spoilers)
├── portal/                  # Flask instructions page
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app.py               # routes, answer checking, progress session
│   ├── content.py           # room text, tasks, questions, patterns
│   ├── flags.py             # live flag reader (docker cli / socket / file)
│   ├── templates/index.html
│   └── static/
│       ├── css/thm.css      # dark TryHackMe-style theme, responsive
│       └── js/app.js        # accordions, submission, hints, timer, toast
└── target/                  # Ubuntu 22.04 victim
    ├── Dockerfile
    ├── seed.sh              # creates users, files, decoys, timestamps
    └── entrypoint.sh
```

### Target filesystem

```
/home/james/Desktop/script.py     dummy python script (task 4 source)
/home/james/flag1.txt             FLAG{linux_basics_done}
/home/james/notes.txt
/home/john/scripts/               empty (scp destination)
/home/john/logs/                  empty (cp destination)
/home/john/work/- logs            the dash-named file (task 2)
/home/john/work/todo.txt
/home/francis/logs/               empty (mv destination)
/home/francis/staging/            files to move (task 2)
/home/francis/encryption keys/    directory with a space (task 3, mode 0700 francis)
/topsecret/readable.txt           FLAG{second_flag_found}   (mtime 2024-03-02)
/topsecret/readable.txt.bak       decoy
/topsecret/archive/readable.txt   decoy
/topsecret/old/readable.txt       decoy
/topsecret/reports/app-*.log      40 noise files, mtime 2023
/topsecret/locked/payroll.txt     mode 000, unreadable for non-root
/root/lab-info.txt                quick reference inside the container
```

Decoys are deliberately timestamped in 2023 while the real files are 2024+, so
`find / -newermt 2024-01-01 -type f` is a fast way to cut the noise.

---

## Troubleshooting

**Port 5000 already in use**

```bash
PORTAL_PORT=5001 ./setup.sh        # then open http://localhost:5001
```

**`permission denied` talking to the Docker socket**

```bash
sudo usermod -aG docker "$USER"
newgrp docker       # or log out and back in
```

**Portal says the target is offline**

```bash
docker compose ps
docker compose logs --tail 50 linux-target
./setup.sh --reset
```

**Compose commands not found**

```bash
sudo apt update && sudo apt install -y docker-compose-plugin
# older Kali: sudo apt install -y docker-compose
```

**Wrong flags / portal cannot read the files**

Re-create the target so `seed.sh` runs again:

```bash
docker compose rm -sf linux-target
docker compose up -d linux-target
```

**Docker network subnet clash**

The lab pins `10.10.10.0/24` so the target really is `10.10.10.5`. If that range
is already used on your VM (some VPNs do), Compose will fail with
"pool overlaps". Change the subnet/gateway/IPs in `docker-compose.yml` and
`LAB_TARGET_IP` in the portal service, then rebuild.

**Rootless Docker**

The portal needs the Docker API socket. With rootless Docker the socket lives
under `/run/user/<uid>/docker.sock`; point the volume at it:

```yaml
volumes:
  - /run/user/1000/docker.sock:/var/run/docker.sock:ro
```

**Everything is broken, start over**

```bash
docker compose down --rmi local --volumes --remove-orphans
./setup.sh
```

---

## Notes on the design

- Answers are validated with anchored regular expressions on a normalised
  command string (whitespace collapsed, trailing `;`, `sudo` and `$` stripped,
  backticks removed). Alternative correct forms are accepted, e.g.
  `mv -- '- logs' newlogs`, `mv ./- logs newlogs`,
  and `cp -r "encryption keys" /home/john/logs`.
- Hints and instructions are opt-in: hints are fetched on demand from
  `/api/hint` and instruction blocks are hidden behind a per-task toggle, so the
  initial page never spoils an answer.
- `setup.sh` writes a random Flask session secret to `.env` (mode 600) the first
  time it runs and reuses it afterwards. Delete `.env` to rotate the secret.
- The UI is inspired by TryHackMe's dark room layout but uses its own "KaliLab"
  branding and no third-party assets. Fonts fall back to your system fonts.
- Everything is vanilla HTML/CSS/JS - no build step, no CDN, works offline after
  the images are built.
