# Деплой Vite React приложения на Hostinger

Эти инструкции помогут вам загрузить статическую сборку (папка `dist/`) на Hostinger.

1) Сборка локально

```powershell
cd C:\Users\Ruslan\Desktop\Project\SMARTECH1.2
npm ci
npm run build
# В результате появится папка dist/
```

2) Загрузка на Hostinger

- Войдите в hPanel → Files → File Manager → откройте `public_html`.
- Удалите (или сохраните) существующие файлы и загрузите содержимое `dist/` в `public_html`.
- Либо используйте FTP (FileZilla) и загрузите все файлы из `dist/` в `public_html`.

3) Настройка routing

Если вы используете react-router (client-side routing), в корне `public_html` должен присутствовать файл `.htaccess` со следующим содержимым (включён в этом репозитории `deploy/.htaccess`):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ index.html [L]
</IfModule>

Options -Indexes
```

4) Включение SSL

- В hPanel перейдите в SSL → включите бесплатный сертификат Let's Encrypt для вашего домена.

5) Проверка

- Откройте ваш домен в браузере и пройдите по маршрутам приложения, чтобы убедиться, что fallback на `index.html` работает.

6) Автоматизация (опционально)

В корне `deploy/` присутствует PowerShell-скрипт `upload-dist-ftp.ps1` для быстрой загрузки по FTP. Заполните в скрипте ваши FTP-данные и запустите в PowerShell.

Если появятся ошибки — пришлите вывод, помогу отладить.

7) Optional: централизованное хранение с Supabase (без VPS)

- На сайте https://app.supabase.com создайте новый проект.
- В разделе "Table Editor" создайте таблицу `products` с полями, например:
  - id (integer) — primary key
  - title_en (text)
  - title_es (text)
  - description_en (text)
  - description_es (text)
  - category (text)
  - images (json)

- В разделе "Storage" создайте бакет `public` если хотите хранить файлы отдельно (опционально).
- В Project Settings → API скопируйте URL (SUPABASE_URL) и anon key (SUPABASE_ANON_KEY).
- В вашем проекте создайте `.env` или CI variables:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

- При сборке (npm run build) Vite подтянет эти переменные и приложение будет пытаться синхронизировать products с Supabase.
- Примечание: текущая реализация приложения выполняет простую синхронизацию (затирает и вставляет набор продуктов). Для продакшена рекомендуется реализовать дифф/безопасную авторизацию и хранить уникальные идентификаторы.

Security & Auth (Supabase)
- Если вы хотите включить аутентификацию через Supabase, в `.env` добавьте:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_AUTH_ENABLED=true
VITE_ADMIN_EMAIL=admin@example.com # опционально, если хотите фиксированный email
```

- После этого UI входа будет использовать Supabase Auth (email + password). Рекомендуется:
  - Создать администратора в Supabase Auth и задать ему email/password.
  - Настроить Row Level Security (RLS) для таблицы `products`, чтобы разрешить операции только аутентифицированным пользователям или через функции.
  - Для безопасной загрузки файлов используйте Supabase Storage и правила доступа (private/public) и подпись URL при необходимости.

Storage
- Для изображений используйте Supabase Storage: создайте бакет и настройте публичный доступ для чтения (если хотите публичные URL).
- Не используйте имя `public` — это может конфликтовать с зарезервированными именами; рекомендуется назвать бакет, например, `product-images`.
- Если вы выбрали имя бакета отличное от `public`, укажите его в переменных окружения как `SUPABASE_BUCKET` (для импортного скрипта) и `VITE_SUPABASE_BUCKET` (для встраивания в клиент при сборке):

```text
SUPABASE_BUCKET=product-images
VITE_SUPABASE_BUCKET=product-images
```

Скрипт импорта и приложение по умолчанию используют бакет `product-images` если переменные не заданы.

Экспорт существующих продуктов (localStorage) и импорт в Supabase

1) Экспорт из браузера
- Откройте сайт в браузере, откройте DevTools → Console.
- Выполните:

```javascript
copy(localStorage.getItem('smartech_products_v1'))
```

Это скопирует JSON с продуктами в буфер обмена. Вставьте в файл `products.json` локально.

2) Запуск импорта в Supabase (локально)
- Установите зависимости: `npm i @supabase/supabase-js`
- Выполните (замените переменные):

```powershell
setx SUPABASE_URL "https://your-project.supabase.co"
setx SUPABASE_SERVICE_KEY "your-service-role-key"
node scripts/import-to-supabase.js .\products.json
```

3) После импорта проверьте таблицу `products` в Supabase Studio и обновите сайт (сборка не нужна для чтения данных, только для вшитых env при build).


