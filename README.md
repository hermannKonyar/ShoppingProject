# ShoppingProject

**ASP.NET Core Web API** (backend) ve **React + Vite + TypeScript** (frontend) ile geliştirilmiş tam yığın (full-stack) bir e-ticaret örnek projesidir.

## Proje Yapısı

```text
ShoppingProject/
├── API/                          # ASP.NET Core Web API
│   ├── Controllers/
│   │   ├── ProductsController.cs # Ürün CRUD endpointleri
│   │   ├── CartController.cs     # Sepet yönetimi endpointleri
│   │   └── ErrorController.cs    # Hata yönetimi
│   ├── Data/
│   │   └── DataContext.cs        # EF Core DbContext + seed data
│   ├── Entity/
│   │   ├── Product.cs            # Ürün entity
│   │   └── Cart.cs               # Sepet ve sepet öğesi entity
│   ├── DTO/
│   │   ├── CreateProductDto.cs   # Ürün oluşturma/güncelleme DTO
│   │   └── CardDTO.cs            # Sepet görüntüleme DTO
│   ├── Middlewares/
│   │   └── ExceptionHandling.cs  # Global hata yakalama middleware
│   ├── Migrations/               # EF Core migration'ları
│   ├── wwwroot/images/           # Ürün görselleri (static)
│   └── Program.cs
└── Client/                       # React + Vite frontend
    └── src/
        ├── api/
        │   └── requests.ts       # Axios tabanlı API istemcisi
        ├── components/
        │   ├── App.tsx           # Ana layout bileşeni
        │   └── Header.tsx        # Navigasyon başlığı
        ├── pages/
        │   ├── HomePage.tsx
        │   ├── AboutPage.tsx
        │   ├── ContactPage.tsx
        │   ├── catalog/
        │   │   ├── CatalogPage.tsx     # Ürün kataloğu
        │   │   ├── ProductList.tsx     # Ürün listesi
        │   │   ├── Product.tsx         # Ürün kartı
        │   │   └── ProductDetails.tsx  # Ürün detay sayfası
        │   └── ErrorPage.tsx
        ├── errors/
        │   ├── NotFound.tsx
        │   └── ServerError.tsx
        ├── model/
        │   └── IProducts.ts      # TypeScript tip tanımları
        └── router/
            └── Routes.tsx        # React Router yapılandırması
```

## Kullanılan Teknolojiler

### Backend (`API`)

| Teknoloji | Açıklama |
|-----------|----------|
| ASP.NET Core Web API | .NET 10 hedefli REST API |
| Entity Framework Core | ORM katmanı |
| SQLite | Geliştirme veritabanı |
| Swagger / Swashbuckle | API dokümantasyonu (sadece geliştirme) |

### Frontend (`Client`)

| Teknoloji | Sürüm | Açıklama |
|-----------|-------|----------|
| React | 18 | UI kütüphanesi |
| TypeScript | ~5.6 | Tip güvenliği |
| Vite | ^5.4 | Build aracı |
| Material UI | ^7 | Bileşen kütüphanesi |
| React Router | ^7 | İstemci taraflı yönlendirme |
| Axios | ^1 | HTTP istemcisi |
| React Toastify | ^11 | Bildirim sistemi |

## Özellikler

### Ürün Yönetimi
- Ürün listeleme (katalog sayfası)
- Ürün detay görüntüleme
- Yeni ürün ekleme (`POST`)
- Mevcut ürün güncelleme (`PUT`)
- Ürün görsellerini static dosya olarak sunma

### Sepet
- Cookie tabanlı anonim sepet (müşteri kimliği otomatik oluşturulur)
- Sepete ürün ekleme
- Sepetten ürün çıkarma / miktarını azaltma

### Genel
- Global hata yönetimi (özel middleware)
- 404 / Sunucu hatası sayfaları
- Seed data ile uygulama başlangıcında örnek ürünler

## Gereksinimler

- **.NET SDK 10+**
- **Node.js** 18+ ve **npm**

## Kurulum ve Çalıştırma

### 1. Backend'i başlat

```bash
cd API
dotnet restore
dotnet run
```

Backend varsayılan olarak `http://localhost:5094` adresinde çalışır.

Swagger UI (geliştirme ortamında):

```
http://localhost:5094/swagger
```

### 2. Frontend'i başlat

Yeni bir terminalde:

```bash
cd Client
npm install
npm run dev
```

Frontend varsayılan olarak `http://localhost:3000` adresinde çalışır.

> **Not:** Frontend, API çağrıları için `http://localhost:5094` adresini kullanır. Backend'in bu adreste çalışıyor olması gerekir.

## API Uç Noktaları

### Ürünler

| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| `GET` | `/api/products` | Tüm ürünleri getirir |
| `GET` | `/api/products/{id}` | Tek ürün getirir |
| `POST` | `/api/products` | Yeni ürün oluşturur |
| `PUT` | `/api/products/{id}` | Mevcut ürünü günceller |

### Sepet

| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| `GET` | `/api/cart` | Aktif sepeti getirir (yoksa oluşturur) |
| `POST` | `/api/cart/{productId}?quantity=N` | Sepete ürün ekler |
| `DELETE` | `/api/cart/{productId}?quantity=N` | Sepetten ürün çıkarır |

### Örnek `POST /api/products` gövdesi

```json
{
  "name": "iPhone 15",
  "description": "Telefon açıklaması",
  "imageUrl": "1.jpeg",
  "price": 45000,
  "isActive": true,
  "stock": 25
}
```

## Veritabanı

- SQLite bağlantısı `API/appsettings.Development.json` içindeki `DefaultConnection` ile yapılandırılır.
- Varsayılan veritabanı dosyası: `API/ecommerce.db`
- Başlangıç ürün verileri `DataContext.OnModelCreating` içinde seed edilir.

## Frontend Sayfaları

| Rota | Sayfa | Açıklama |
|------|-------|----------|
| `/` | HomePage | Ana sayfa |
| `/catalog` | CatalogPage | Ürün kataloğu |
| `/catalog/:id` | ProductDetails | Ürün detayı |
| `/about` | AboutPage | Hakkında |
| `/contact` | ContactPage | İletişim |
| `/not-found` | NotFound | 404 sayfası |
| `/server-error` | ServerError | Sunucu hatası sayfası |

## Geliştirme Notları

- CORS, backend'de yalnızca `http://localhost:3000` için açıktır.
- Sepet yönetimi cookie tabanlıdır; `CustomerId` cookie'si 30 gün geçerlidir.
- Frontend'de API base URL şu an sabit tanımlıdır; üretim için `.env` tabanlı yapılandırma önerilir.
- Static ürün görselleri `API/wwwroot/images/` dizininde tutulur ve `/images/...` yoluyla erişilebilir.

## Lisans

Bu depo eğitim / öğrenme amaçlıdır.
