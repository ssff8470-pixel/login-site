# ⚽ LiveScore — сайт с live-спортивными событиями

## Структура проекта

login-site/
├── index.html         — форма входа (логин + пароль)
├── style.css          — общие стили
├── script.js          — логика входа → редирект на dashboard
├── dashboard.html     — страница с live-событиями
├── dashboard.css      — стили dashboard
├── dashboard.js       — реальные данные через OpenLigaDB API
└── .github/workflows/deploy.yml — авто-деплой на GitHub Pages

## Запуск локально

Открой index.html в браузере, либо запусти локальный сервер:

npx serve login-site

## Деплой на GitHub Pages

1. Создай репозиторий на GitHub
2. Загрузи все файлы
3. Settings → Pages → Source: GitHub Actions
4. Сайт будет доступен по ссылке

## Источник данных

- Футбол: OpenLigaDB API (https://www.openligadb.de) — бесплатно, без ключа
- Баскетбол/Теннис: демо-данные
