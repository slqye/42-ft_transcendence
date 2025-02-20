FROM prom/prometheus:v3.2.0

RUN mkdir -p /prometheus/data_storage/
COPY ./conf/prometheus.yml /prometheus/prometheus.yml
COPY ./conf/alert.rules.yml /prometheus/rules/alert.rules.yml