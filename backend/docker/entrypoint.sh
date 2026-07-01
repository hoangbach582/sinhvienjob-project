#!/bin/sh

# Install dependencies if not already installed (usually done in Dockerfile, but keeping this just in case)
# composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize config and routing for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
# IMPORTANT: Make sure your DB is accessible from this container before running migrations
php artisan migrate --force

# Start php-fpm in background
php-fpm -D

# Start Nginx in foreground
nginx -g "daemon off;"
