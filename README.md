# Trello
### Приложение написано на React + TypeScript, NestJS, Docker
Для развертывания приложения требуется проделать следующие шаги:
1. Установить репозиторий 
```
git clone https://github.com/shvetsHoG/trello.git
```
2. Создать и настроить .env в корневой директории (/trello) по следующему принципу:
```
POSTGRES_HOST=db
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_PORT=5432
APP_PORT=3000
JWT_SECRET=""

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
```
3. Развернуть приложение с помощью docker compose:
```
docker compose up -d
```
### Клиент открывается на http://localhost:4000, сервер лежит на http://localhost:3000
:shipit::shipit::shipit:
