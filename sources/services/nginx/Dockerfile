FROM nginx:1.27-alpine3.20

COPY conf/transcendance.conf /etc/nginx/sites-available/transcendance.conf

RUN apk add openssl \
    && openssl req -x509 -noenc -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt -subj "/C=FR/ST=GrandEst/L=Mulhouse/O=42Mulhouse/CN=briganscendence"

RUN ln -s /etc/nginx/sites-available/transcendance.conf /etc/nginx/sites-enabled/
RUN nginx -t

CMD ["nginx", "-g", "daemon off;"]
