FROM nginx:latest

RUN apt-get update && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/ssl

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/local.dev.key \
    -out /etc/nginx/ssl/local.dev.crt \
    -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=local.dev"

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]

