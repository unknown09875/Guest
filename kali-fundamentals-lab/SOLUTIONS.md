# Kali Fundamentals Lab - answer key

**Spoilers ahead.** Try the boxes first; every answer below is accepted by the
portal, including the alternative forms listed.

Get a root shell on the target before you start:

```bash
docker exec -it linux-target bash
```

---

## Task 1 - Introduction & Access

**Q: What is the IP address of the target machine?**

```
10.10.10.5
```

The container is pinned to that address inside the `kali-lab-net` bridge
network, and the portal shows it in the right-hand panel. Because it is a
Docker bridge address it is reachable from the other containers (not from the
Kali host), which is why you work through `docker exec` instead of SSH.

---

## Task 2 - Moving files with `mv`

**Q: Inside `/home/francis/staging`, move all files into `/home/francis/logs`.**

```bash
mv * /home/francis/logs
```

Also accepted: `mv -- * /home/francis/logs`, `mv ./* /home/francis/logs`,
`mv /home/francis/staging/* /home/francis/logs`.

`mv * logs` would only be right if `logs` existed inside `staging`; here the
destination is the sibling directory `/home/francis/logs`. Hidden files such as
`.hidden_note` are not matched by `*` - use `mv .[!.]* * /home/francis/logs`
if you want those too.

**Q: Inside `/home/john/work`, rename the file named `- logs` to `newlogs`.**

```bash
mv -- '- logs' newlogs
```

Why the plain version fails:

```bash
cd /home/john/work
mv - logs newlogs
# mv: invalid option -- ' '
```

`mv` parses anything starting with `-` as an option, and even `mv - logs
newlogs` sees `-` plus a separate word. `--` ends option parsing so everything
after it is a filename operand; the quotes keep `- logs` as one argument.

Alternatives that also pass:

```bash
mv ./- logs newlogs
mv '/home/john/work/- logs' /home/john/work/newlogs
```

---

## Task 3 - Copying & quoting

**Q: Copy the directory `encryption keys` from `/home/francis` into `/home/john/logs`.**

```bash
cp -r "/home/francis/encryption keys" /home/john/logs
```

`cp -a` and `cp -R` work too. The quotes (or a backslash: `encryption\ keys`)
stop the shell from splitting the name into two arguments. Recursion is needed
because it is a directory.

Note the directory is owned by `root` with mode `0700`, so a normal user needs
`sudo`. As root via `docker exec`, no sudo is required.

---

## Task 4 - Remote transfers with `scp`

**Q: Copy `/home/james/Desktop/script.py` to `/home/john/scripts` on `192.168.10.5` as `john`.**

```bash
scp /home/james/Desktop/script.py john@192.168.10.5:/home/john/scripts
```

Order: local source first, `user@host:path` second. A trailing `/` on the
destination simply says "this is a directory". This task is about the syntax -
no SSH daemon runs on the target, so nothing actually transfers.

---

## Task 5 - Capture flag 1

```bash
cat /home/james/flag1.txt
```

**Flag 1**

```
FLAG{linux_basics_done}
```

---

## Task 6 - Find the hidden file

Enumerate instead of guessing:

```bash
find /topsecret -type f -name 'readable.txt'
# /topsecret/readable.txt
# /topsecret/archive/readable.txt
# /topsecret/old/readable.txt
```

Use timestamps to tell them apart - the decoys are from 2023:

```bash
find /topsecret -type f -newermt 2024-01-01
stat /topsecret/readable.txt
cat /topsecret/readable.txt
```

You can also search the whole filesystem (permission errors from `/proc` are
harmless):

```bash
find / -name readable.txt 2>/dev/null
```

**Flag 2**

```
FLAG{second_flag_found}
```

---

## Quick copy-paste block

```bash
docker exec -it linux-target bash

cd /home/francis/staging
mv * /home/francis/logs
cd /home/john/work
ls -la
mv -- '- logs' newlogs
cd /home/francis
cp -r "encryption keys" /home/john/logs
cat /home/james/flag1.txt
find /topsecret -name readable.txt 2>/dev/null
cat /topsecret/readable.txt
```

Both flags are also accepted by the **Submit Flag** box at the bottom of the
portal, which ticks the corresponding question when it matches.

---

## If you want to change the answers

Everything is data-driven:

- question text, hints and accepted patterns: `portal/content.py`
- regex matching / normalisation: `portal/app.py` (`normalise_answer`, `check_answer`)
- flag contents and files: `target/seed.sh`

After editing the target script, rebuild:

```bash
docker compose build linux-target
docker compose up -d linux-target
./setup.sh --status
```
