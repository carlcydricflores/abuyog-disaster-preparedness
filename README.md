# Abuyog Disaster Preparedness and Emergency Information System
Laravel 12 + Inertia + React (TypeScript) + Tailwind + MySQL. This folder is an OVERLAY: it adds the app on top of a fresh Laravel + Breeze install.

## Setup (Herd / XAMPP / Laragon)
Prerequisites: PHP 8.2+, Composer, Node 20+, MySQL.

1. `composer create-project laravel/laravel abuyog-ready && cd abuyog-ready`
2. `composer require laravel/breeze --dev`
3. `php artisan breeze:install react --typescript`   (choose Pest or PHPUnit when asked)
4. `php artisan install:api`                          (installs Laravel Sanctum + routes/api.php)
5. Copy everything from this overlay into the project root, overwriting files when asked (app/, database/, routes/, resources/).
6. In `.env` set: DB_CONNECTION=mysql, DB_DATABASE=abuyog_ready, DB_USERNAME, DB_PASSWORD; APP_TIMEZONE=Asia/Manila (in config/app.php or .env).
7. Create the empty MySQL database `abuyog_ready`.
8. `php artisan migrate --seed`
9. `php artisan storage:link`
10. `npm install` then `npm run dev`
11. In a second terminal: `php artisan serve` (Herd serves it automatically at http://abuyog-ready.test).

Logins (change the password immediately): admin@abuyog.test / ChangeMe!2026, resident@abuyog.test / password123

## Security notes
- role is not mass-assignable; registration always creates role=user.
- EnsureAdmin middleware protects every /admin route on the server.
- Users can only read their own incidents; incident POST is throttled (10/min).
- Validation on every write; uploads are image-checked, size-capped, randomly named.
- CSV export neutralizes spreadsheet formula injection; CSRF handled by Laravel + Inertia.
- Before production: APP_DEBUG=false, HTTPS, strong admin password, real hotline data.
