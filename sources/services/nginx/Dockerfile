FROM nginx:1.27-alpine3.20

COPY conf/briganscendance.conf /etc/nginx/default.conf

RUN mkdir -p /etc/nginx/ssl/

RUN apk add openssl \
    && openssl req -x509 -noenc -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt -subj "/C=FR/ST=GrandEst/L=Mulhouse/O=42Mulhouse/CN=briganscendence"

RUN nginx -t

CMD ["nginx", "-g", "daemon off;"]
