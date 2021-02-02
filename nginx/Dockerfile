FROM nginx:alpine

COPY entrypoint-nginx.sh /

RUN set -ex && \
  apk add --no-cache bash && \
  chmod +x /entrypoint-nginx.sh

COPY default.conf /etc/nginx/conf.d/default.conf

CMD ["/entrypoint-nginx.sh"]