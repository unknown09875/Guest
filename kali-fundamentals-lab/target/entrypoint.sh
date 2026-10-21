#!/usr/bin/env bash
# Keep linux-target running so the portal can `docker exec` into it.
set -euo pipefail

# Re-seed if the marker vanished (e.g. someone deleted the files).
if [[ ! -f /var/.kali-lab-seeded ]]; then
    /usr/local/bin/seed.sh
fi

cat <<'BANNER'

  ==============================================================
     kali fundamentals lab - target machine (ubuntu 22.04)
  ==============================================================
     container : linux-target
     shell     : docker exec -it linux-target bash
     users     : james / john / francis   (password: password)
     flags     : /home/james/flag1.txt
                 /topsecret/readable.txt
  ==============================================================

BANNER

exec tail -f /dev/null
