FROM nginx:latest

COPY ./nginx-default.conf.template /etc/nginx/templates/default.conf.template
COPY ssl/localhost.crt /etc/nginx/ssl/crt
COPY ssl/localhost.key /etc/nginx/ssl/key
