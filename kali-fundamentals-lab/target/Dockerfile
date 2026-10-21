FROM ubuntu:22.04

LABEL org.opencontainers.image.title="linux-target" \
      org.opencontainers.image.description="Kali Fundamentals Lab victim machine" \
      org.opencontainers.image.source="https://github.com/"

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

# Small, realistic toolset. No SSH server on purpose - the portal reaches this
# box through `docker exec`, and Task 4 is about scp syntax, not a live daemon.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        bash \
        sudo \
        coreutils \
        findutils \
        grep \
        sed \
        gawk \
        less \
        vim-tiny \
        nano \
        tree \
        procps \
        net-tools \
        iputils-ping \
        openssh-client \
        python3 \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Three human accounts, password "password" (sudo enabled for realism).
RUN for u in james john francis; do \
        useradd -m -s /bin/bash "$u"; \
        echo "$u:password" | chpasswd; \
        usermod -aG sudo "$u"; \
    done \
    && echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

COPY seed.sh /usr/local/bin/seed.sh
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod 0755 /usr/local/bin/seed.sh /usr/local/bin/entrypoint.sh \
    && /usr/local/bin/seed.sh

WORKDIR /home/james
USER root

# Keep the container alive; all access is through docker exec.
CMD ["/usr/local/bin/entrypoint.sh"]
