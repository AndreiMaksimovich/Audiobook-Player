FROM nginx:latest

COPY ./nginx-default.conf /etc/nginx/conf.d/default.conf
COPY ssl/localhost.crt /etc/nginx/ssl/crt
COPY ssl/localhost.key /etc/nginx/ssl/key
