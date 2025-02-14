# syntax=docker/dockerfile:1.2
FROM python:3.9-slim

RUN apt-get update && apt-get install -y git && apt-get install -y default-mysql-client && apt-get install -y curl

ARG BACKEND_REPO
ARG GIT_HASH
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN --mount=type=ssh git clone ${BACKEND_REPO} /app && \
    cd /app && \
    git checkout ${GIT_HASH}

WORKDIR /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

COPY scripts /app/
RUN chmod +x /app/entrypoint.sh /app/wait-for-it.sh
CMD ["/app/entrypoint.sh"]


