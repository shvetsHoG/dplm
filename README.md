# Trello

### Приложение написано на React + TypeScript, NestJS, Docker

Для развертывания приложения требуется проделать следующие шаги:

1. Установить репозиторий

```
https://github.com/shvetsHoG/dplm.git
```

2. Создать и настроить .env в корневой директории (/trello) по следующему принципу:

```
POSTGRES\_HOST=db
POSTGRES\_USER=
POSTGRES\_PASSWORD=
POSTGRES\_DB=
POSTGRES\_PORT=5432
APP\_PORT=3000
JWT\_SECRET=""

DATABASE\_URL="postgresql://${POSTGRES\_USER}:${POSTGRES\_PASSWORD}@${POSTGRES\_HOST}:${POSTGRES\_PORT}/${POSTGRES\_DB}?schema=public"
```

3. Развернуть приложение с помощью docker compose:

```
docker compose up -d
```

### Клиент открывается на http://localhost:4000, сервер лежит на http://localhost:3000

:shipit::shipit::shipit:

