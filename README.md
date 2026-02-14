# ShoppingProject

ShoppingProject, **ASP.NET Core Web API** (backend) ve **React + Vite + TypeScript** (frontend) kullanılarak geliştirilmiş basit bir e-ticaret örnek projesidir.

## Proje Yapısı

```text
ShoppingProject/
├── API/      # ASP.NET Core Web API (ürün endpointleri + SQLite)
└── Client/   # React + Vite frontend
```

## Kullanılan Teknolojiler

### Backend (`API`)
- ASP.NET Core Web API
- Entity Framework Core
- SQLite
- Swagger (geliştirme ortamında)

### Frontend (`Client`)
- React 18
- TypeScript
- Vite
- Material UI
- React Router

## Özellikler

- Ürünleri listeleme (`GET /api/products`)
- Ürün detayı görüntüleme (`GET /api/products/{id}`)
- Ürün ekleme (`POST /api/products`)
- Ürün görsellerini static dosya olarak sunma (`/images/...`)

## Gereksinimler

- **.NET SDK** (proje dosyasında `net10.0` hedefleniyor)
- **Node.js** ve **npm**

## Kurulum ve Çalıştırma

### 1) Backend'i başlat

```bash
cd API
dotnet restore
dotnet run
```

Backend varsayılan olarak `http://localhost:5094` adresinde çalışır.

Swagger geliştirme ortamında şu adreste açılır:
- `http://localhost:5094/swagger`

### 2) Frontend'i başlat

Yeni bir terminalde:

```bash
cd Client
npm install
npm run dev
```

Frontend varsayılan olarak `http://localhost:3000` adresinde çalışır.

> Not: Frontend, API çağrıları için `http://localhost:5094` adresini kullanır. Backend'in bu adreste çalışıyor olması gerekir.

## API Uç Noktaları

- `GET /api/products` → tüm ürünler
- `GET /api/products/{id}` → tek ürün
- `POST /api/products` → yeni ürün

Örnek `POST` body:

```json
{
  "name": "iPhone 15",
  "description": "telefon açıklaması",
  "imageUrl": "1.jpeg",
  "price": 45000,
  "isActive": true,
  "stock": 25
}
```

## Veritabanı

- SQLite bağlantısı `API/appsettings.Development.json` içindeki `DefaultConnection` üzerinden yapılandırılır.
- Varsayılan veritabanı dosyası: `API/ecommerce.db`
- Başlangıç ürün verileri `DataContext` içinde seed edilir.

## Geliştirme Notları

- CORS ayarı backend'de `http://localhost:3000` için açıktır.
- Frontend tarafında API URL'i şu an sabit kullanılıyor; üretim için `.env` tabanlı yapı önerilir.
- Projede bazı lint/type uyarıları mevcut olabilir; geliştirme sürecinde temizlenmesi önerilir.

## Lisans

Bu repo eğitim/öğrenme amaçlıdır.
