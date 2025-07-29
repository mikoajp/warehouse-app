FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libicu-dev \
    libzip-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo pdo_mysql intl zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./

RUN composer install --no-interaction --prefer-dist --no-scripts

COPY . .

RUN composer run-script post-install-cmd --no-interaction || true

RUN composer require --dev doctrine/doctrine-fixtures-bundle --no-interaction || true
RUN composer require --dev symfony/maker-bundle --no-interaction || true

RUN composer dump-autoload --optimize

RUN chown -R www-data:www-data /var/www/html \
    && chmod +x bin/console

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
