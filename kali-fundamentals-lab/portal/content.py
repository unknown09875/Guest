"""Room content for the Kali Fundamentals Lab.

This module holds the *room text* and the command-answer patterns that are
checked on the server.  The two real `FLAG{...}` values are **not** stored
here: they are read live out of the `linux-target` container by flags.py,
so the website can never be used as a flag cheat-sheet.
"""

import os

TARGET_IP = os.environ.get("LAB_TARGET_IP", "10.10.10.5")

ROOM = {
    "name": "Kali Fundamentals Lab",
    "code": "kali-fundamentals",
    "difficulty": "Easy",
    "author": "Arena Labs",
    "description": (
        "A hands-on Linux fundamentals room built for eJPT v2 preparation. "
        "You get a working Ubuntu target and drive everything from your Kali VM. "
        "Practise file management, quoting, copying, SCP and the "
        "<code>find</code> command, then capture both flags."
    ),
    "tags": ["linux", "fundamentals", "ejpt", "beginner"],
}

ACCESS_CODE = "docker exec -it linux-target bash"

TASKS = [
    {
        "id": "task-1",
        "number": 1,
        "title": "Introduction & Access",
        "subtitle": "Get a shell on the target",
        "blocks": [
            {
                "type": "p",
                "html": (
                    "Welcome to the <strong>Kali Fundamentals Lab</strong>. This room is a safe, "
                    "self-contained playground for the Linux basics you need in the eJPT v2 exam: "
                    "moving files, quoting awkward filenames, copying, transferring over "
                    "<code>scp</code>, and hunting files with <code>find</code>."
                ),
            },
            {
                "type": "p",
                "html": (
                    "Everything lives inside Docker on your Kali VM. There is a victim machine "
                    "called <code>linux-target</code> (Ubuntu 22.04) and this instruction portal. "
                    "There is no SSH port to fight with &mdash; you get a root shell with "
                    "<code>docker exec</code>:"
                ),
            },
            {"type": "code", "lang": "bash", "text": ACCESS_CODE},
            {
                "type": "note",
                "title": "Machine credentials",
                "html": (
                    "The target has three human accounts: <code>james</code>, "
                    "<code>john</code> and <code>francis</code>. Their home directories are "
                    "where the exercises happen. You are root when you use "
                    "<code>docker exec</code>, so you can <code>su - james</code> if you want "
                    "to feel like a real user."
                ),
            },
            {
                "type": "list",
                "items": [
                    "<code>james</code> &mdash; has a Desktop, a script and a flag.",
                    "<code>john</code> &mdash; has <code>scripts/</code>, <code>logs/</code> and a work folder.",
                    "<code>francis</code> &mdash; has <code>logs/</code>, a staging area and encryption keys.",
                ],
            },
            {
                "type": "p",
                "html": (
                    "Flags on this room are stored <strong>inside the target container</strong>. "
                    "The portal validates them live, so you can even move or rewrite the files "
                    "and the portal will follow you."
                ),
            },
        ],
        "questions": [
            {
                "id": "q-ip",
                "prompt": (
                    "What is the IP address of the target machine? "
                    '<span class="muted">(format: x.x.x.x)</span>'
                ),
                "placeholder": "x.x.x.x",
                "hint": "It is printed in the room header on the right, and the target is a Docker container.",
                "validator": "target_ip",
                "mono": True,
            }
        ],
    },
    {
        "id": "task-2",
        "number": 2,
        "title": "Moving Files with mv",
        "subtitle": "Globs, destinations and a nasty leading dash",
        "blocks": [
            {
                "type": "p",
                "html": (
                    "<code>mv</code> moves (or renames) files and directories: "
                    "<code>mv SOURCE... DEST</code>. If <code>DEST</code> is an existing "
                    "directory, every source is dropped inside it."
                ),
            },
            {
                "type": "p",
                "html": (
                    "Francis has made a mess in <code>/home/francis/staging</code>. "
                    "Take a look first, then clean it up:"
                ),
            },
            {
                "type": "code",
                "lang": "bash",
                "text": "cd /home/francis/staging\nls -la",
            },
            {
                "type": "note",
                "title": "Why not <code>mv * logs</code>?",
                "html": (
                    "It would work if <code>logs</code> was a directory inside staging &mdash; "
                    "but it is not. The destination in this question is the absolute path "
                    "<code>/home/francis/logs</code>."
                ),
            },
            {
                "type": "p",
                "html": (
                    "Now the classic exam trap. Inside <code>/home/john/work</code> there is a "
                    "file literally named <code>- logs</code> (dash, space, logs). "
                    "<code>mv - logs newlogs</code> fails because <code>mv</code> reads "
                    "<code>-&nbsp;logs</code> as options. You have to stop option parsing with "
                    "<code>--</code>, or hide the leading dash behind a path like <code>./</code>."
                ),
            },
            {
                "type": "code",
                "lang": "bash",
                "text": "cd /home/john/work\nls -la",
            },
            {
                "type": "note",
                "title": "The `--` marker",
                "html": (
                    "<code>--</code> means &ldquo;end of options&rdquo;. Everything after it is "
                    "an operand, even if it starts with a dash. Remember to quote the filename "
                    "because it contains a space."
                ),
            },
        ],
        "questions": [
            {
                "id": "q-mv",
                "prompt": (
                    "Inside <code>/home/francis/staging</code>, move <strong>all</strong> files "
                    "into <code>/home/francis/logs</code>. Submit the command."
                ),
                "placeholder": "mv ...",
                "hint": "The wildcard * matches every non-hidden file in the current directory. Destination: /home/francis/logs",
                "validator": "command",
                "patterns": [
                    r"^mv\s+(?:-[a-zA-Z]+\s+)*--?\s*(?:\*|'\*'|\"\*\"|\./\*)\s+/home/francis/logs/?$",
                    r"^mv\s+(?:-[a-zA-Z]+\s+)*(?:\*|'\*'|\"\*\"|\./\*)\s+/home/francis/logs/?$",
                    r"^mv\s+(?:-[a-zA-Z]+\s+)*/home/francis/staging/(?:\*|\.|\*\.\*)\s+/home/francis/logs/?$",
                ],
                "mono": True,
            },
            {
                "id": "q-dash",
                "prompt": (
                    "Inside <code>/home/john/work</code>, rename the file named "
                    "<code>- logs</code> to <code>newlogs</code>. Submit the command."
                ),
                "placeholder": "mv ...",
                "hint": "Use -- before the filename and quote the name: mv -- '- logs' newlogs. The ./- logs form works too.",
                "validator": "command",
                "patterns": [
                    r"^mv\s+(?:-[a-zA-Z]+\s+)*--\s+(?:'- logs'|\"- logs\"|- logs)\s+(?:\./)?newlogs/?$",
                    r"^mv\s+(?:-[a-zA-Z]+\s+)*\./- logs\s+(?:\./)?newlogs/?$",
                    r"^mv\s+(?:-[a-zA-Z]+\s+)*'/home/john/work/- logs'\s+(?:/home/john/work/)?newlogs/?$",
                    r"^mv\s+(?:-[a-zA-Z]+\s+)*/home/john/work/- logs\s+(?:/home/john/work/)?newlogs/?$",
                ],
                "mono": True,
            },
        ],
    },
    {
        "id": "task-3",
        "number": 3,
        "title": "Copying & Quoting",
        "subtitle": "Spaces are not your friend",
        "blocks": [
            {
                "type": "p",
                "html": (
                    "<code>cp</code> copies instead of moving. Directories need a recursive "
                    "flag (<code>-r</code> or <code>-a</code>), and any filename containing a "
                    "space must be quoted or escaped:"
                ),
            },
            {
                "type": "code",
                "lang": "bash",
                "text": "cp SOURCE DEST\ncp -r \"a directory with spaces\" DEST",
            },
            {
                "type": "p",
                "html": (
                    "Francis keeps the <code>encryption keys</code> directory in his home "
                    "directory (<code>/home/francis</code>). John needs a copy in his "
                    "<code>logs</code> folder. Have a look around first:"
                ),
            },
            {
                "type": "code",
                "lang": "bash",
                "text": "ls -la /home/francis\nls -la \"/home/francis/encryption keys\"",
            },
        ],
        "questions": [
            {
                "id": "q-cp",
                "prompt": (
                    "Copy the directory <code>encryption keys</code> from "
                    "<code>/home/francis</code> into <code>/home/john/logs</code>. "
                    "Submit the command."
                ),
                "placeholder": "cp ...",
                "hint": "Quote the name so the space stays part of it, and remember recursion for a directory.",
                "validator": "command",
                "patterns": [
                    r"^cp\s+(?:-[aArRv]+\s+)?(?:'/home/francis/encryption keys'|\"/home/francis/encryption keys\"|/home/francis/encryption\\ keys|'encryption keys'|\"encryption keys\"|encryption\\ keys)\s+/home/john/logs/?$",
                ],
                "mono": True,
            }
        ],
    },
    {
        "id": "task-4",
        "number": 4,
        "title": "Remote Transfers with SCP",
        "subtitle": "Copy a file to another machine",
        "blocks": [
            {
                "type": "p",
                "html": (
                    "<code>scp</code> copies over SSH. The remote side is written as "
                    "<code>user@host:path</code>:"
                ),
            },
            {
                "type": "code",
                "lang": "bash",
                "text": "scp LOCAL_FILE user@remote_host:/remote/path/",
            },
            {
                "type": "p",
                "html": (
                    "James has a script on his Desktop: <code>/home/james/Desktop/script.py</code>. "
                    "John's machine is reachable at <code>192.168.10.5</code> and he wants the "
                    "script in his <code>scripts</code> folder (<code>/home/john/scripts</code>). "
                    "The transfer is shown as a syntax exercise &mdash; no SSH service is needed "
                    "on the target, you already have root through Docker."
                ),
            },
            {
                "type": "code",
                "lang": "bash",
                "text": "cat /home/james/Desktop/script.py",
            },
            {
                "type": "note",
                "title": "Order matters",
                "html": (
                    "The source always comes first, the <code>user@host:path</code> destination "
                    "last. A trailing slash on the destination means &ldquo;put it inside this "
                    "directory&rdquo;."
                ),
            },
        ],
        "questions": [
            {
                "id": "q-scp",
                "prompt": (
                    "Copy <code>/home/james/Desktop/script.py</code> to "
                    "<code>/home/john/scripts</code> on the machine "
                    "<code>192.168.10.5</code> as the user <code>john</code>. "
                    "Submit the full command."
                ),
                "placeholder": "scp ...",
                "hint": "Pattern: scp user@host:path. Here john@192.168.10.5:/home/john/scripts and the source goes first.",
                "validator": "command",
                "patterns": [
                    r"^scp\s+(?:-[a-zA-Z]+\s+)*/home/james/Desktop/script\.py\s+john@192\.168\.10\.5:/home/john/scripts/?$",
                    r"^scp\s+(?:-[a-zA-Z]+\s+)*john@192\.168\.10\.5:/home/john/scripts/?\s+/home/james/Desktop/script\.py$",
                ],
                "mono": True,
            }
        ],
    },
    {
        "id": "task-5",
        "number": 5,
        "title": "Capture Flag 1",
        "subtitle": "Read a file, submit a flag",
        "blocks": [
            {
                "type": "p",
                "html": (
                    "Every good room hides flags. The first one is sitting in James's home "
                    "directory as <code>flag1.txt</code>. Enumerate before you read:"
                ),
            },
            {
                "type": "code",
                "lang": "bash",
                "text": "docker exec -it linux-target bash\nls -la /home/james\ncat /home/james/flag1.txt",
            },
            {
                "type": "p",
                "html": (
                    "Flags in this room use the format <code>FLAG{...}</code>. Type it exactly "
                    "as you find it (the portal checks it against the live container)."
                ),
            },
        ],
        "questions": [
            {
                "id": "q-flag1",
                "prompt": "Submit the flag from <code>/home/james/flag1.txt</code>.",
                "placeholder": "FLAG{...}",
                "hint": "You are root in the container, so no privilege escalation is needed. Just read the file.",
                "validator": "flag",
                "flag": "flag1",
                "mono": True,
            }
        ],
    },
    {
        "id": "task-6",
        "number": 6,
        "title": "Find the Hidden File",
        "subtitle": "find, grep and timestamps",
        "blocks": [
            {
                "type": "p",
                "html": (
                    "The second flag lives inside <code>/topsecret</code>, but that directory is "
                    "full of decoys with similar names and different timestamps. Do not browse "
                    "by hand &mdash; search:"
                ),
            },
            {
                "type": "code",
                "lang": "bash",
                "text": "find / -name readable.txt 2>/dev/null\nfind /topsecret -type f -name '*.txt'\ncat /topsecret/readable.txt",
            },
            {
                "type": "note",
                "title": "Using -newermt",
                "html": (
                    "<code>find PATH -type f -newermt '2024-01-01'</code> lists files changed "
                    "after a date. The decoys were touched in 2023, the interesting files are "
                    "newer &mdash; filtering saves you a lot of noise. The "
                    "<code>2&gt;/dev/null</code> throws away permission errors from "
                    "<code>/proc</code>."
                ),
            },
            {
                "type": "p",
                "html": (
                    "Once you know the path, <code>cat</code> the file and submit the second "
                    "flag. After that, try the <strong>Submit Flag</strong> box at the bottom of "
                    "this room as well &mdash; it accepts either flag."
                ),
            },
        ],
        "questions": [
            {
                "id": "q-flag2",
                "prompt": (
                    "Find <code>readable.txt</code> inside <code>/topsecret</code>, read it and "
                    "submit the second flag."
                ),
                "placeholder": "FLAG{...}",
                "hint": "find /topsecret -name readable.txt. Careful: there are files with the same name elsewhere and a readable.txt.bak decoy.",
                "validator": "flag",
                "flag": "flag2",
                "mono": True,
            }
        ],
    },
]

QUESTION_INDEX = {q["id"]: q for task in TASKS for q in task["questions"]}
TOTAL_QUESTIONS = len(QUESTION_INDEX)

# Flags that exist in the target container. Only the metadata lives here - the
# values themselves are read from the container at check time.
FLAG_SLOTS = [
    {"key": "flag1", "label": "Flag 1", "path": "/home/james/flag1.txt", "question": "q-flag1"},
    {"key": "flag2", "label": "Flag 2", "path": "/topsecret/readable.txt", "question": "q-flag2"},
]
