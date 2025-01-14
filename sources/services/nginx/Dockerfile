FROM nginx:1.27-alpine3.20

COPY conf/transcendance.conf /etc/nginx/sites-available/transcendance.conf

CMD ["tail", "-f", "/dev/urandom"]

#RUN ln -s /etc/nginx/sites-available/transcendance.conf /etc/nginx/sites-enabled/
#RUN nginx -t

#CMD ["nginx", "-g", "daemon off;"]
