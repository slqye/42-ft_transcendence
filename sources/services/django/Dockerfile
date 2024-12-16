FROM python:3.14-rc-alpine3.21

# Run as user ?

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update && apk upgrade && apk add build-base libpq libpq-dev

WORKDIR /app
RUN mkdir -p frontend
COPY requirements.txt .
COPY frontend frontend
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY tools/entrypoint.sh ./tools/entrypoint.sh

RUN chmod +x ./tools/entrypoint.sh

ENTRYPOINT ["./tools/entrypoint.sh"]