FROM nginx:latest

COPY ./nginx-default.conf /etc/nginx/conf.d/default.conf
COPY ssl/crt /etc/nginx/ssl/crt
COPY ssl/key /etc/nginx/ssl/key
COPY ssl/dhparam.pem /etc/nginx/ssl/dhparam.pem
