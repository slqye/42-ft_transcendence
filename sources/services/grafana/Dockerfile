FROM grafana/grafana:11.5.2-ubuntu

RUN mkdir -p /etc/grafana/provisioning/datasources
COPY ./conf/grafana.ini /etc/grafana/grafana.ini
COPY ./conf/prometheus-datasource.yml /etc/grafana/provisioning/datasources/prometheus-datasource.yml
COPY ./conf/dashboard-provisioning.yml /etc/grafana/provisioning/dashboards/dashboard-provisioning.yml
COPY ./conf/dashboards /etc/grafana/dashboards