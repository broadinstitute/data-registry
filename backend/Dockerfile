FROM python:3.9-slim

RUN apt-get update && apt-get install -y git && apt-get install -y default-mysql-client

ARG BACKEND_REPO
ARG GITHUB_TOKEN
RUN echo "machine github.com\nlogin ${GITHUB_TOKEN}\n" > ~/.netrc && git clone ${BACKEND_REPO} /app

WORKDIR /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

COPY scripts /app/
RUN chmod +x /app/entrypoint.sh /app/wait-for-it.sh
CMD ["/app/entrypoint.sh"]


