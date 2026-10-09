## Требования к окружению

- **Bun 1.4.2+**

## Установка

```bash
git clone https://github.com/MrSesbianLexovich/wellwet.git
cd wellwet
bun i
```

## Переменные окружения

.env.example:
```
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/wellwet"
BETTER_AUTH_URL = "http://localhost:3000"
BETTER_AUTH_SECRET = "qYOau9LtxhJdAutyoA17MBupEcjmxV3I"
REDIS_URL = "redis://:password@localhost:6379/01"
MAIN_ADMIN_EMAIL = "admin@mail.com"
MAIN_ADMIN_PASSWORD = "adminPassword"

S3_USER = "minioUser"
S3_PASSWORD = "minioPassword"

S3_ENDPOINT = "http://localhost:9000"

S3_BUCKET = ""
S3_ACCESS_KEY = ""
S3_SECRET_KEY = ""
```

Запустите контейнер:
```bash
docker-compose up -d
```

Перейдите на http://localhost:9090, войдите с помощью `S3_USER` и `S3_PASSWORD`

Создайте новый bucket, его имя, access_key и secret_key запишите в переменные `S3_BUCKET`, `S3_ACCESS_KEY` и `S3_SECRET_KEY`

## Запуск

Запустите миграции базы данных:

```
bunx drizzle-kit migrate
```

Запустите dev сервер:

```bash
bun dev
```
