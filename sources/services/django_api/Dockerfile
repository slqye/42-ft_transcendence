FROM python:3.14-rc-alpine3.20

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apk update && apk upgrade && \
    apk add --no-cache build-base libpq libpq-dev curl \
    jpeg-dev zlib-dev libpng-dev freetype-dev lcms2-dev openjpeg-dev tiff-dev libwebp-dev tcl-dev tk-dev

RUN adduser -D appuser

WORKDIR /app
RUN mkdir -p user_media

COPY requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY tools/entrypoint.sh ./tools/entrypoint.sh
RUN chmod +x ./tools/entrypoint.sh

USER appuser

ENTRYPOINT [ "./tools/entrypoint.sh" ]