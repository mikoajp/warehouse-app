# 📦 Aplikacja Magazynowa

Prosta aplikacja do zarządzania magazynem produktów. Backend w Symfony 7.3, frontend w React 19 z TypeScript.

## 🚀 Szybki start

### Wymagania
- **Docker Desktop** (najnowsza wersja)
- **Git**

### Uruchomienie w 3 krokach

#### 1. Pobierz projekt
```bash
git clone <repository-url>
cd warehouse-app
```

#### 2. Uruchom kontenery
```bash
docker-compose up -d
```

#### 3. Przygotuj bazę danych
```bash

docker-compose exec backend php bin/console doctrine:migrations:diff

docker-compose exec backend php bin/console doctrine:migrations:migrate --no-interaction

docker-compose exec backend php bin/console doctrine:fixtures:load --no-interaction
```

### ✅ Gotowe!

- **Aplikacja**: http://localhost:3000
- **API**: http://localhost:8000
- **Token do logowania**: `test-token-123`

## 🎯 Jak używać

1. Otwórz http://localhost:3000
2. Zaloguj się tokenem: `test-token-123`
3. Dodawaj produkty i zarządzaj stanem magazynowym

## 🛠 Przydatne komendy

### Sprawdzenie statusu
```bash
# Status kontenerów
docker-compose ps

# Logi aplikacji
docker-compose logs -f
```

### Zatrzymanie
```bash
# Zatrzymaj kontenery
docker-compose down

# Zatrzymaj i usuń dane
docker-compose down -v
```

### Restart
```bash
# Restart wszystkich kontenerów
docker-compose restart

# Restart tylko backendu
docker-compose restart backend
```

## 🔧 Rozwiązywanie problemów

### Port zajęty?
Jeśli porty 3000 lub 8000 są zajęte, zmień je w `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # frontend na porcie 3001
  - "8001:8000"  # backend na porcie 8001
```

### Błąd bazy danych?
```bash
# Sprawdź logi bazy
docker-compose logs db

# Restart bazy danych
docker-compose restart db
```

### Problemy z cache?
```bash
# Wyczyść cache Symfony
docker-compose exec backend php bin/console cache:clear

# Przebuduj kontenery
docker-compose build --no-cache
```

## 📱 Funkcjonalności

- ➕ **Dodawanie produktów** - nowe produkty do magazynu
- 📦 **Zarządzanie stanem** - zwiększanie ilości produktów
- 📋 **Lista produktów** - przegląd wszystkich produktów
- 🔍 **Szczegóły produktu** - historia ruchów magazynowych
- 🔐 **Autoryzacja** - bezpieczny dostęp tokenem

## 🏗 Architektura

```
📁 backend/          # Symfony 7.3 + PHP 8.4
├── src/Controller/  # API endpoints
├── src/Entity/      # Modele danych
├── src/Service/     # Logika biznesowa
└── src/Repository/  # Dostęp do danych

📁 frontend/         # React 19 + TypeScript
├── src/components/  # Komponenty UI
├── src/services/    # Komunikacja z API
├── src/hooks/       # Custom hooks
└── src/types/       # Typy TypeScript

📁 docker/           # Konfiguracja Docker
└── docker-compose.yml
```

## 🌐 API Endpoints

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/products` | Lista produktów |
| POST | `/api/products` | Dodaj produkt |
| GET | `/api/products/{id}` | Szczegóły produktu |
| POST | `/api/products/{id}/stock` | Dodaj stan |
| GET | `/health` | Status aplikacji |

### Przykład użycia API
```bash
# Dodaj produkt
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer test-token-123" \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "quantity": 5}'

# Dodaj stan
curl -X POST http://localhost:8000/api/products/1/stock \
  -H "Authorization: Bearer test-token-123" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 10}'
```

## 🔐 Bezpieczeństwo

- Wszystkie API endpoints wymagają tokenu autoryzacji
- Walidacja danych po stronie backend i frontend
- CORS skonfigurowany dla bezpiecznej komunikacji
- Sanityzacja danych wejściowych

## 🚀 Deployment produkcyjny

```bash
# Użyj konfiguracji produkcyjnej
docker-compose -f docker-compose.prod.yml up -d

# Lub ustaw zmienne środowiskowe
export APP_ENV=prod
export APP_SECRET=your-secret-key
docker-compose up -d
```

## 📞 Pomoc

**Problemy?** Sprawdź:
1. Czy Docker Desktop jest uruchomiony
2. Czy porty 3000 i 8000 są wolne
3. Logi: `docker-compose logs`

**Kontakt**: Zespół deweloperski