FROM nginx:latest

COPY conf/transcendance.conf /etc/nginx/sites-available/transcendance.conf

RUN ln -s /etc/nginx/sites-available/transcendance.conf /etc/nginx/sites-enabled/transcendance.conf
RUN nginx -t

CMD ["nginx", "-g", "daemon off;"]
