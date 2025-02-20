FROM python:3.14-rc-alpine3.20

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apk update && apk upgrade && apk add --no-cache build-base libpq libpq-dev curl

WORKDIR /app
RUN mkdir -p user_media
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY tools/entrypoint.sh ./tools/entrypoint.sh
RUN chmod +x ./tools/entrypoint.sh

ENTRYPOINT ["./tools/entrypoint.sh"]