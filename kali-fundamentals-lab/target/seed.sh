#!/usr/bin/env bash
# Seed the linux-target filesystem for the Kali Fundamentals Lab.
# Safe to re-run: pass --force to wipe and rebuild the exercise files.
set -euo pipefail

MARKER=/var/.kali-lab-seeded
FORCE="${1:-}"

if [[ -f "$MARKER" && "$FORCE" != "--force" ]]; then
    echo "[seed] already seeded (use --force to rebuild)"
    exit 0
fi

echo "[seed] building exercise files..."

# ---------------------------------------------------------------------------
# james
# ---------------------------------------------------------------------------
install -d -o james -g james /home/james/Desktop /home/james/Downloads

cat > /home/james/Desktop/script.py <<'PY'
#!/usr/bin/env python3
"""backup_agent.py - copied from james' Desktop to john's scripts folder.

Nothing here is dangerous: it just walks a directory and prints a summary.
The exercise is the scp command, not the code.
"""
import os
import sys

def walk(root: str) -> None:
    total = 0
    for base, _dirs, files in os.walk(root):
        total += len(files)
        for name in sorted(files):
            print(os.path.join(base, name))
    print(f"\n{total} files under {root}")

if __name__ == "__main__":
    walk(sys.argv[1] if len(sys.argv) > 1 else ".")
PY
chmod 0644 /home/james/Desktop/script.py

printf 'FLAG{linux_basics_done}\n' > /home/james/flag1.txt
chmod 0644 /home/james/flag1.txt

cat > /home/james/notes.txt <<'EOF'
james - lab notes
-----------------
TODO:
  - send /home/james/Desktop/script.py to john@192.168.10.5:/home/john/scripts
  - clean up the Downloads folder
  - ask francis about the encryption keys
EOF

cat > /home/james/Downloads/ubuntu-22.04.3-live-server-amd64.iso.txt <<'EOF'
placeholder - this is not really an ISO, just a decoy for find/ls practice
EOF

cat > /home/james/.bash_history <<'EOF'
ls -la
cd Desktop
python3 script.py .
scp /home/james/Desktop/script.py john@192.168.10.5:/home/john/scripts
exit
EOF

# ---------------------------------------------------------------------------
# john
# ---------------------------------------------------------------------------
install -d -o john -g john /home/john/scripts /home/john/logs /home/john/work

# The dash file. Keep the name exactly "- logs" so `mv - logs newlogs` fails.
cat > '/home/john/work/- logs' <<'EOF'
You found the file whose name starts with a dash.

`mv - logs newlogs` fails because mv treats "- logs" as options.
Use the end-of-options marker and quotes:

    mv -- '- logs' newlogs

or hide the dash behind a path:

    mv ./- logs newlogs
EOF

cat > /home/john/work/todo.txt <<'EOF'
- [x] create scripts folder
- [ ] copy script.py from james
- [x] archive the old logs
- [ ] figure out why mv hates "- logs"
EOF

cat > /home/john/work/old-report.txt <<'EOF'
Q3 2023 summary: nothing exploded. Backups ran every night at 02:00.
EOF

printf 'draft: rotate the lab keys every quarter\n' > /home/john/work/.hidden-draft

cat > /home/john/notes.md <<'EOF'
# john's box

- scripts/ : where james' script.py should land
- logs/    : francis' encryption keys go here
- work/    : scratch space (contains a badly named file)
EOF

# ---------------------------------------------------------------------------
# francis
# ---------------------------------------------------------------------------
install -d -o francis -g francis /home/francis/logs /home/francis/staging "/home/francis/encryption keys" /home/francis/archive

cat > /home/francis/staging/notes.txt <<'EOF'
staging area - everything in here belongs in /home/francis/logs
EOF
cat > /home/francis/staging/invoice_2023.pdf.txt <<'EOF'
not a real PDF, just a decoy file for mv practice
EOF
printf 'client,contact,status\nalpha,ops@alpha.test,active\nbeta,sec@beta.test,pending\n' > /home/francis/staging/clients.csv
printf 'fake tarball, do not extract\n' > /home/francis/staging/backup.tar.gz
printf 'remember: logs/ is the destination\n' > /home/francis/staging/.hidden_note

cat > "/home/francis/encryption keys/aes.key" <<'EOF'
-----BEGIN FAKE AES KEY-----
6f70656e20746865206c6f67732c206e6f7420746869732066696c65
-----END FAKE AES KEY-----
EOF
cat > "/home/francis/encryption keys/rsa.pub" <<'EOF'
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDFAKEKEYFORDECORATIONONLY francis@linux-target
EOF
cat > "/home/francis/encryption keys/README.txt" <<'EOF'
These keys belong to francis. john needs a copy in /home/john/logs.

Quote the directory name, because it contains a space:

    cp -r "encryption keys" /home/john/logs
EOF

cat > /home/francis/archive/2023-audit.txt <<'EOF'
audit complete: no findings
EOF

# ---------------------------------------------------------------------------
# /topsecret - the find challenge
# ---------------------------------------------------------------------------
install -d /topsecret/archive /topsecret/old /topsecret/reports /topsecret/locked

printf 'FLAG{second_flag_found}\n' > /topsecret/readable.txt

cat > /topsecret/README <<'EOF'
/topsecret
==========
Three files in this tree are called exactly readable.txt.
Only one of them is new (2024) and only one contains a flag.
The rest are decoys with a similar name or an older timestamp.

Try:
  find /topsecret -type f -name 'readable.txt'
  find /topsecret -newermt 2024-01-01 -type f
EOF

# decoys with confusing names
printf 'decoy - this is not the flag\n' > /topsecret/readable.txt.bak
printf 'decoy - notes about readable files\n' > /topsecret/readable_notes.txt
printf 'permission denied is the point of this file\n' > /topsecret/not_readable.txt
printf 'rotated out of date\n' > /topsecret/readable.log
printf 'old copy, no flag here\n' > /topsecret/archive/readable.txt
printf 'old copy, no flag here either\n' > /topsecret/old/readable.txt
printf 'quarterly numbers\n' > /topsecret/reports/q4-2023.txt
printf 'still locked\n' > /topsecret/locked/payroll.txt
chmod 000 /topsecret/locked/payroll.txt
chmod 0644 /topsecret/not_readable.txt

# A pile of noise so `find / -name readable.txt` is not a one-line answer.
for i in $(seq 1 40); do
    printf 'log line %s: service healthy\n' "$i" > "/topsecret/reports/app-$i.log"
done
for dir in alpha bravo charlie delta echo; do
    install -d "/topsecret/$dir"
    for i in 1 2 3; do
        printf 'notes %s/%s\n' "$dir" "$i" > "/topsecret/$dir/note-$i.txt"
    done
done

# ---------------------------------------------------------------------------
# timestamps - decoys are old (2023), real targets are 2024+
# ---------------------------------------------------------------------------
# Start by ageing every file. This keeps `find / -newermt 2024-01-01` clean:
# only the real flags and the /topsecret README are newer than that.
find /home /topsecret -type f -exec touch -d '2023-06-01 12:00:00' {} +

touch -d '2023-01-11 08:14:00' /topsecret/readable.txt.bak
touch -d '2023-02-02 11:02:00' /topsecret/readable_notes.txt
touch -d '2023-03-19 16:41:00' /topsecret/readable.log
touch -d '2023-04-07 09:00:00' /topsecret/archive/readable.txt
touch -d '2023-05-23 13:27:00' /topsecret/old/readable.txt
touch -d '2023-06-14 10:15:00' /topsecret/reports /topsecret/locked
find /topsecret -name 'app-*.log' -exec touch -d '2023-09-09 03:33:00' {} +
find /topsecret/alpha /topsecret/bravo /topsecret/charlie /topsecret/delta /topsecret/echo -type f -exec touch -d '2023-10-01 07:07:00' {} +
find /topsecret -maxdepth 1 -type d -exec touch -d '2023-12-31 23:59:00' {} +

touch -d '2024-03-02 09:41:00' /topsecret/readable.txt
touch -d '2024-03-02 09:44:00' /topsecret/README
touch -d '2024-02-10 08:12:00' /home/james/flag1.txt
touch -d '2023-11-05 12:00:00' /home/james/Desktop/script.py
touch -d '2023-08-21 18:22:00' '/home/john/work/- logs'
touch -d '2023-08-21 18:30:00' /home/francis/staging/clients.csv
touch -d '2023-08-21 18:31:00' '/home/francis/encryption keys/README.txt'

# ---------------------------------------------------------------------------
# ownership & permissions
# ---------------------------------------------------------------------------
chown -R james:james /home/james
chown -R john:john /home/john
chown -R francis:francis /home/francis
chown -R root:root /topsecret
chmod 0755 /topsecret
chmod 0644 /home/james/notes.txt /home/john/notes.md
chmod 0700 "/home/francis/encryption keys"
chown francis:francis "/home/francis/encryption keys"
chmod 0755 /home/james /home/john /home/francis
chmod 1777 /tmp

install -m 0644 /dev/null /root/lab-info.txt
cat > /root/lab-info.txt <<'EOF'
Kali Fundamentals Lab - linux-target
====================================
Users: james, john, francis (password: password, sudo allowed)
Flags:
  /home/james/flag1.txt
  /topsecret/readable.txt

You are root inside this container. Exercises:
  Task 2  mv * /home/francis/logs        (from /home/francis/staging)
          mv -- '- logs' newlogs         (from /home/john/work)
  Task 3  cp -r "encryption keys" /home/john/logs
  Task 4  scp /home/james/Desktop/script.py john@192.168.10.5:/home/john/scripts
  Task 5  cat /home/james/flag1.txt
  Task 6  find /topsecret -name readable.txt
EOF

touch "$MARKER"
echo "[seed] done"
