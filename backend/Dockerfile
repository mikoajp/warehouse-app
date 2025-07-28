FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libicu-dev \
    libzip-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo pdo_mysql intl zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN if [ -f "composer.json" ]; then composer install --no-interaction --prefer-dist --optimize-autoloader; fi

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]