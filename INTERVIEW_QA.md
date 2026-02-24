# ShoppingProject - Mülakat Soru & Cevapları

Bu döküman, ShoppingProject'teki her kod parçasını ve kullanılan teknoloji kararlarını açıklamak amacıyla hazırlanmıştır.

---

## BÖLÜM 1: Proje Genel Yapısı

---

### S1: Bu proje hangi teknolojilerden oluşuyor?

**Cevap:**
Proje iki ana katmandan oluşur:

- **Backend**: ASP.NET Core 10 Web API (.NET 10), Entity Framework Core 9, SQLite
- **Frontend**: React 18 + TypeScript + Vite, Material UI (MUI), Axios, React Router v7, React Context API

Bu yapıya **Full-Stack** uygulama denir. Backend REST API sunar, Frontend ise bu API'yi tüketen bir SPA (Single Page Application) olarak çalışır.

---

### S2: Projenin klasör yapısı nasıl tasarlanmış, neden bu şekilde?

**Cevap:**

```
/API       → ASP.NET Core Web API (backend)
  /Controllers   → HTTP endpoint'leri
  /Data          → EF Core DbContext
  /Entity        → Domain modelleri
  /DTO           → Veri transfer objeleri
  /Middlewares   → Global exception handling
  /Migrations    → Veritabanı migration geçmişi

/Client    → React TypeScript frontend
  /src/api          → HTTP client (Axios)
  /src/components   → Paylaşılan UI bileşenleri
  /src/pages        → Rota bazlı sayfa bileşenleri
  /src/context      → Global state (React Context)
  /src/model        → TypeScript arayüzleri (interface)
  /src/router       → React Router konfigürasyonu
  /src/errors       → Hata sayfaları
```

Bu yapı **Separation of Concerns** prensibine dayanır. Her klasör tek bir sorumluluğu taşır. Böylece kod okunabilirliği ve bakım kolaylığı artar.

---

## BÖLÜM 2: Backend (ASP.NET Core API)

---

### S3: `Program.cs` dosyasında neler yapılıyor ve her satırın amacı nedir?

**Cevap:**

```csharp
var builder = WebApplication.CreateBuilder(args);
```
Uygulamanın temel yapılandırmasını (config, DI container, logging) oluşturan builder nesnesi yaratılır.

```csharp
builder.Services.AddDbContext<DataContext>(options =>
{
    var connectionString = config.GetConnectionString("DefaultConnection");
    options.UseSqlite(connectionString);
});
```
**Entity Framework Core DbContext** DI (Dependency Injection) container'a eklenir. `UseSqlite` ile veritabanı olarak SQLite seçilir. Bağlantı string'i `appsettings.json`'dan okunur.

```csharp
builder.Services.AddCors();
```
**CORS (Cross-Origin Resource Sharing)** servisi eklenir. Frontend farklı bir port'tan (3000) çalıştığı için backend'e istekte bulunabilmek için CORS izni gerekir.

```csharp
builder.Services.AddControllers().AddJsonOptions(opt =>
{
    opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});
```
Controller'lar servise eklenir. `IgnoreCycles` ise JSON serileştirme sırasında oluşabilecek **dairesel referans (circular reference)** hatasını önler. Örneğin `Cart → CartItem → Cart` ilişkisi sonsuz döngüye girebilir.

```csharp
builder.Services.AddSwaggerGen();
```
Geliştirme ortamında API'yi test etmek için **Swagger/OpenAPI** dökümanı oluşturulur.

```csharp
app.UseMiddleware<ExceptionHandling>();
```
Tüm istekler için global hata yakalama middleware'i pipeline'a eklenir.

```csharp
app.UseCors(opt => opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials()
    .WithOrigins("http://localhost:3000"));
```
CORS politikası uygulanır: Yalnızca `http://localhost:3000` origin'inden gelen isteklere izin verilir. `AllowCredentials()` cookie'lerin gönderilmesine izin verir.

```csharp
app.UseStaticFiles();
```
`wwwroot` klasöründeki statik dosyaların (ürün görselleri) HTTP üzerinden erişilebilir olmasını sağlar.

---

### S4: Entity Framework Core nedir ve bu projede nasıl kullanılıyor?

**Cevap:**
Entity Framework Core (EF Core), .NET için bir ORM (Object-Relational Mapper) kütüphanesidir. SQL yazmak yerine C# sınıfları ile veritabanı işlemleri yapılır.

**Bu projede kullanımı:**
- **Code-First Approach**: Önce C# entity sınıfları (`Product`, `Cart`, `CartItem`) yazılır, ardından `dotnet ef migrations add` ile migration oluşturulur ve veritabanı bu sınıflara göre yaratılır.
- **DbContext**: `DataContext` sınıfı `DbContext`'i miras alır ve veritabanı tabloları `DbSet<T>` olarak tanımlanır.
- **Migration**: `Migrations/` klasöründe her değişikliğin geçmişi tutulur.

---

### S5: `DataContext.cs`'te `OnModelCreating` metodu ne işe yarar?

**Cevap:**

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);
    modelBuilder.Entity<Product>().HasData(new List<Product> { ... });
}
```

`OnModelCreating`, EF Core'un model yapılandırmasını özelleştirmek için override edilen bir metottur. Burada `HasData()` kullanılarak **Seed Data** (başlangıç verisi) tanımlanmıştır. Uygulama ilk çalıştırıldığında veritabanına otomatik olarak iPhone 12 ve iPhone 13 ürünleri eklenir.

---

### S6: `Product.cs` entity'sinde `[Key]` ve `[Required]` attribute'ları ne anlama gelir?

**Cevap:**

```csharp
[Key]
public int Id { get; set; }

[Required]
public string? Name { get; set; }
```

- **`[Key]`**: Bu alanın birincil anahtar (Primary Key) olduğunu EF Core'a bildirir. EF Core `Id` adlı alanı zaten otomatik PK olarak kabul eder ama `[Key]` ile bu açık hale getirilir.
- **`[Required]`**: Bu alanın `null` olamayacağını belirtir. Hem EF Core validation hem de API model validation tarafından kullanılır.
- **`string?`**: C# nullable reference type syntax'ı — soru işareti nullable olabileceğini gösterir.

---

### S7: `Cart.cs`'te domain logic neden entity'nin içine yazıldı?

**Cevap:**

```csharp
public class Cart
{
    public void AddItem(Product product, int quantity) { ... }
    public void RemoveItem(int productId, int quantity) { ... }
}
```

Bu yaklaşım **Rich Domain Model** olarak adlandırılır. Entity kendi davranışlarını barındırır. Alternatifi **Anemic Domain Model**'dir; entity sadece property tutar, iş mantığı servis katmanında olur.

Bu projedeki avantajı: `cart.AddItem(product, 1)` çağrısı, controller'ı basit tutar. Dezavantajı: Büyük projelerde domain logic entity'e girince test etmek zorlaşabilir.

---

### S8: `CartController.cs`'te `GetOrCreateCart()` metodu nasıl çalışıyor?

**Cevap:**

```csharp
private async Task<Cart> GetOrCreateCart()
{
    var cart = await _context.Carts
        .Include(i => i.Items)
        .ThenInclude(i => i.Product)
        .FirstOrDefaultAsync(x => x.CustomerId == Request.Cookies["CustomerId"]);

    if(cart == null)
    {
        var customerId = Guid.NewGuid().ToString();
        var cookieOptions = new CookieOptions
        {
            IsEssential = true,
            Expires = DateTime.Now.AddDays(30)
        };
        Response.Cookies.Append("CustomerId", customerId, cookieOptions);
        cart = new Cart { CustomerId = customerId };
        _context.Carts.Add(cart);
        await _context.SaveChangesAsync();
    }
    return cart;
}
```

1. İstekten `CustomerId` cookie'si okunur
2. Bu cookie ile eşleşen sepet veritabanında aranır
3. **`Include` ve `ThenInclude`**: İlişkili tabloları (CartItems ve Products) **Eager Loading** ile tek sorguda çeker. Aksi hâlde `cart.Items` boş gelir.
4. Sepet bulunamazsa: `Guid.NewGuid()` ile benzersiz bir müşteri ID'si oluşturulur, cookie olarak tarayıcıya gönderilir, yeni sepet veritabanına kaydedilir.

Bu yaklaşım session veya authentication gerektirmeden **anonim sepet** yönetimi sağlar.

---

### S9: DTO (Data Transfer Object) neden kullanılıyor? Entity'i doğrudan döndürmek yeterli olmaz mıydı?

**Cevap:**
Bu projede `CardDTO` ve `CartItemDTO` kullanılmaktadır. Nedenler:

1. **Dairesel referans önleme**: `Cart → CartItem → Product → (başka ilişkiler)` zinciri JSON'a serialize edildiğinde sonsuz döngü oluşabilir. DTO ile sadece gerekli alanlar gönderilir.
2. **API sözleşmesi kontrolü**: Entity'de yapılan bir değişiklik otomatik olarak API'yi değiştirmez; kontrollü bir yüzey sunar.
3. **Bilgi gizleme**: İç entity alanları (ör. navigation properties) frontend'e gereksiz yere gönderilmez.

```csharp
private CardDTO CartToDTO(Cart cart)
{
    return new CardDTO
    {
        CartId = cart.CartId,
        Items = cart.Items.Select(i => new CartItemDTO { ... }).ToList()
    };
}
```

---

### S10: `ExceptionHandling.cs` middleware nasıl çalışıyor?

**Cevap:**

```csharp
public async Task InvokeAsync(HttpContext context)
{
    try
    {
        await _next(context); // Sonraki middleware'e geç
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, ex.Message);
        context.Response.StatusCode = 500;
        var response = new ProblemDetails
        {
            Title = ex.Message,
            Detail = _env.IsDevelopment() ? ex.Message : null,
            Status = 500
        };
        var json = JsonSerializer.Serialize(response, options);
        await context.Response.WriteAsync(json);
    }
}
```

ASP.NET Core middleware'i **pipeline** mantığıyla çalışır. `_next(context)` bir sonraki aşamayı çağırır. Herhangi bir exception olursa catch bloğu devreye girer:
- 500 status code set edilir
- **`ProblemDetails`** RFC 7807 standartına uygun hata formatıdır
- Geliştirme ortamında detaylı hata mesajı, prodüksiyon'da ise yalnızca başlık gönderilir — güvenlik için önemlidir

Bu merkezi yaklaşım sayesinde her controller'da try-catch yazmak gerekmez.

---

### S11: `ProductsController.cs`'te `[FromForm]` attribute'u ne anlama geliyor?

**Cevap:**

```csharp
[HttpPost]
public async Task<IActionResult> CreateProduct([FromForm] CreateProductDto productDto)
```

`[FromForm]` parametrenin `multipart/form-data` olarak geleceğini belirtir. `[FromBody]` ise JSON body'den okur. Ürün oluşturma işleminde dosya yükleme (resim) de planlanıyorsa `[FromForm]` kullanmak gerekir çünkü dosyalar JSON'a serielize edilemez.

---

### S12: `CreatedAtAction` neden kullanılıyor?

**Cevap:**

```csharp
return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
```

Bu metot HTTP **201 Created** status döner ve `Location` header'ına yeni kaynağın URL'ini ekler (ör. `/api/products/3`). Bu, REST API standartlarına uygun bir pratiktir — istemci oluşturulan kaynağa nasıl erişeceğini bilir.

---

## BÖLÜM 3: Frontend (React + TypeScript)

---

### S13: `main.tsx` dosyasının rolü nedir?

**Cevap:**

```tsx
ReactDOM.createRoot(document.getElementById("root")!).render(
  <CartContextProvider>
    <RouterProvider router={router} />
  </CartContextProvider>
);
```

`main.tsx` React uygulamasının giriş noktasıdır. `index.html`'deki `<div id="root">` elementine React ağacını bağlar. `CartContextProvider` tüm uygulamayı sardığı için cart state'i global olarak erişilebilir olur.

---

### S14: React Context API neden kullanıldı, Redux yerine neden tercih edildi?

**Cevap:**

`CartContext.tsx`:
```tsx
export const CartContext = createContext<ICartContextValue | null>(null);

export function CartContextProvider({ children }) {
    const [cart, setCart] = useState<ICart | null>(null);
    return (
        <CartContext.Provider value={{ cart, setCart, deleteItem }}>
            {children}
        </CartContext.Provider>
    );
}
```

Context API, prop drilling (state'i birçok component katmanından aşağı iletme) sorununu çözer. Sepet verisi `Header`, `Product`, `ShoppingCartPage` gibi farklı derinlikteki bileşenler tarafından kullanılır.

Redux yerine Context seçilmesinin nedenleri:
- Uygulama küçük ölçeklidir, Redux'un boilerplate maliyeti gerekmez
- Sepet gibi tek bir global state için Context yeterlidir
- Öğrenme amaçlı proje için daha sade bir çözümdür

---

### S15: `useCartContext()` custom hook'u neden `useContext` yerine kullanılıyor?

**Cevap:**

```tsx
export function useCartContext() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCartContext must be used within a CartContextProvider");
    }
    return context;
}
```

Doğrudan `useContext(CartContext)` kullansaydık, bileşen `CartContextProvider` dışında kullanılırsa `null` dönerdi ve runtime hatası anlaşılması güç bir şekilde oluşurdu. Custom hook ile:
1. Anlamlı bir hata mesajı alınır
2. Her bileşende `null` kontrolü yazmak gerekmez
3. Context kullanımı merkezi hale gelir

---

### S16: `requests.ts`'teki Axios interceptor neden kullanıldı?

**Cevap:**

```ts
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 404: router.navigate("/not-found"); break;
      case 500: router.navigate("/server-error"); break;
      default: toast.error("Something went wrong");
    }
    return Promise.reject(error.response);
  }
);
```

İnterceptor, her HTTP isteğinin cevabını merkezi olarak yakalar. Avantajları:
- Her `fetch/axios` çağrısında ayrı hata yönetimi yazmak gerekmez
- 404 ve 500 hatalarında otomatik yönlendirme sağlanır
- Kullanıcıya toast bildirimi gösterilir

---

### S17: `axios.defaults.withCredentials = true` neden gerekli?

**Cevap:**

```ts
axios.defaults.withCredentials = true;
```

Cookie'lerin **cross-origin** isteklerde gönderilmesi için gereklidir. Tarayıcılar güvenlik gereği farklı domain/port'lara cookie göndermez. Bu ayar açıldığında ve backend'de `AllowCredentials()` aktif olduğunda, `CustomerId` cookie'si her istekte backend'e iletilir. Bu sayede sepet tanımlanır.

---

### S18: `agent` pattern neden kullanıldı?

**Cevap:**

```ts
const Catalog = {
  list: () => requests.get<IProducts[]>("products"),
  details: (id: number) => requests.get<IProducts>(`products/${id}`),
};

const Cart = {
  get: () => requests.get<ICart>("cart"),
  addItem: (productId: number, quantity: number) =>
    requests.post<ICart>(`cart/${productId}?quantity=${quantity}`, {}),
};

const agent = { Catalog, Cart, Errors };
```

Bu yaklaşım API çağrılarını mantıksal gruplara ayırır. Avantajları:
- `agent.Catalog.list()` okunabilir ve açıklayıcıdır
- URL'ler tek yerde tanımlıdır; değiştiğinde sadece bir yerde güncellenir
- Generic tip parametresi (`<IProducts[]>`) ile TypeScript tip güvenliği sağlanır

---

### S19: React Router'da `createBrowserRouter` ve nested routes (iç içe rotalar) neden kullanıldı?

**Cevap:**

```tsx
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "catalog", element: <CatalogPage /> },
            { path: "catalog/:id", element: <ProductDetails /> },
            { path: "*", element: <Navigate replace to="/not-found" /> }
        ]
    }
]);
```

- **`createBrowserRouter`**: HTML5 History API kullanır (`/catalog`, `/cart` gibi gerçek URL'ler). `HashRouter`'a (`/#/catalog`) göre daha modern ve SEO dostudur.
- **Nested routes**: `App` bileşeni tüm sayfalar için ortak layout'u (Header, ToastContainer) sağlar. `<Outlet />` ile alt rotaların içeriği `App`'in içinde render edilir. Bu sayede Header her sayfada görünür.
- **`path: "*"`**: Tanımlanmamış tüm URL'leri 404 sayfasına yönlendirir.

---

### S20: `useParams` hook'u `ProductDetails.tsx`'te nasıl kullanılıyor?

**Cevap:**

```tsx
const { id } = useParams<{ id: string }>();
useEffect(() => {
    id && agent.Catalog.details(parseInt(id))
        .then(data => setProduct(data))
        .finally(() => setLoading(false));
}, [id]);
```

`useParams`, URL'deki dinamik segment değerini alır. `/catalog/3` URL'i için `id = "3"` döner. `parseInt(id)` ile string'den number'a dönüştürülür çünkü API integer ID bekler. `id &&` ise `id` undefined ise API çağrısı yapılmamasını sağlar.

---

### S21: `App.tsx`'te `useEffect` ve `setCart` neden dependency array'de var?

**Cevap:**

```tsx
useEffect(() => {
    agent.Cart.get()
        .then((cart) => setCart(cart))
        .finally(() => setLoading(false));
}, [setCart]);
```

`useEffect`'in ikinci parametresi bağımlılık dizisidir. Effect, bu değerler değiştiğinde yeniden çalışır. `[]` (boş dizi) yalnızca mount'ta çalışır. Burada `setCart` eklenmiş çünkü ESLint rules of hooks bunu zorunlu kılar; ancak `setCart` (useState setter'ları) referans olarak sabit kaldığından bu effect pratikte yalnızca bir kez çalışır.

Amaç: Uygulama açıldığında kullanıcının mevcut cookie'si kontrol edilir ve sepet state'e yüklenir.

---

### S22: MUI (Material UI) neden kullanıldı, başka bir alternatif tercih edilebilir miydi?

**Cevap:**
MUI, hazır ve erişilebilir (accessible) bileşenler sunar. Projede kullanılan bileşenler:
- `AppBar`, `Toolbar` → Navigation bar
- `Card`, `CardMedia`, `CardContent`, `CardActions` → Ürün kartları
- `Badge` → Sepet ürün sayacı
- `Grid` → Responsive düzen
- `Table`, `TableRow`, `TableCell` → Sepet sayfası
- `CircularProgress` → Yükleme göstergesi
- `Typography` → Tutarlı metin stilleri

Alternatifler: Tailwind CSS (utility-first), Ant Design, Chakra UI. MUI tercih edilmesinin nedeni geniş ekosistem ve hazır Google Material Design uyumlu bileşenler sunmasıdır.

---

### S23: `Header.tsx`'te `Badge` bileşeni nasıl çalışıyor?

**Cevap:**

```tsx
const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0);

<Badge badgeContent={itemCount} color="secondary">
    <ShoppingCart />
</Badge>
```

`reduce` metodu sepetteki tüm ürünlerin miktarını toplar. `cart?.items` ise sepet henüz yüklenmediyse hata vermeden `undefined` döner (optional chaining). `Badge` bu toplam sayıyı alışveriş sepeti ikonunun üzerinde gösterir. Sepet boşsa badge görünmez.

---

### S24: TypeScript interface'leri neden ayrı `model/` klasöründe tutulmuş?

**Cevap:**

```ts
// IProducts.ts
export interface IProducts {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
    isActive: boolean;
}
```

Interface'lerin ayrı dosyada tutulması:
1. **Tek sorumluluk**: Her dosya sadece tip tanımı içerir
2. **Yeniden kullanım**: Birden fazla bileşen aynı interface'i import eder
3. **Bakım kolaylığı**: API yanıt yapısı değiştiğinde sadece bir dosya güncellenir
4. **TypeScript güvenliği**: Component prop'larında ve API çağrılarında tip hatası compile time'da yakalanır

---

## BÖLÜM 4: Mimari ve Genel Tasarım Kararları

---

### S25: Projede neden SQLite kullanıldı?

**Cevap:**
SQLite bir **sunucu gerektirmeyen** (serverless), dosya tabanlı veritabanıdır. Bu proje için seçilme nedenleri:
- Geliştirme ve öğrenme ortamı için kurulum gerekmez
- EF Core ile tam uyumludur, migration'lar çalışır
- `ecommerce.db` dosyası proje içinde taşınabilir

Prodüksiyon ortamı için SQL Server, PostgreSQL veya MySQL'e geçiş gerekir; EF Core provider değiştirmek yeterlidir.

---

### S26: Cookie tabanlı sepet yönetimi nasıl çalışıyor ve güvenli midir?

**Cevap:**

**Akış:**
1. Kullanıcı ilk kez sepete ürün eklediğinde backend `Guid.NewGuid()` ile unique bir ID oluşturur
2. Bu ID `CustomerId` adıyla 30 günlük cookie olarak tarayıcıya gönderilir
3. Sonraki isteklerde tarayıcı bu cookie'yi otomatik olarak gönderir
4. Backend bu ID ile sepeti veritabanından bulur

**Güvenlik değerlendirmesi:**
- `IsEssential = true` → GDPR uyumu için gerekli cookie olarak işaretler
- Herhangi bir kimlik doğrulama (authentication) yoktur
- Cookie çalınırsa başkasının sepetine erişilebilir — prodüksiyonda HTTPS ve `HttpOnly`/`Secure` flag'leri gereklidir

---

### S27: Projede servis katmanı (Service Layer) neden yok, bu bir sorun mu?

**Cevap:**
Bu projede controller'lar doğrudan `DbContext`'i kullanıyor:

```csharp
private readonly DataContext _context;
public ProductsController(DataContext context) { _context = context; }
```

**Dezavantajları:**
- Business logic doğrudan controller'da → test etmek zorlaşır
- Kodun yeniden kullanımı zor

**Bu projede kabul edilebilir çünkü:**
- Öğrenme amaçlı, küçük ölçekli bir uygulamadır
- Repository Pattern veya Service Layer eklenmesi gereksiz karmaşıklık yaratır
- Proje büyüdükçe servis katmanı eklenebilir

---

### S28: `ReferenceHandler.IgnoreCycles` neden gerekli?

**Cevap:**

```csharp
opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
```

EF Core'da navigation property'ler iki yönlü olabilir:
- `Cart` → `CartItem` → `Cart` → `CartItem` → (sonsuz döngü)

JSON serializer bu döngüyü tespit edemez ve `StackOverflowException` fırlatır. `IgnoreCycles` ile döngüdeki ikinci görünüm atlanır. DTO pattern kullanıldığında bu sorun zaten ortadan kalkar ama her endpoint'te DTO zorunlu değildir.

---

### S29: Frontend'de hata yönetimi nasıl çalışıyor?

**Cevap:**

İki katmanlı hata yönetimi:

**1. Axios Interceptor (Global):**
```ts
case 404: router.navigate("/not-found"); break;
case 500: router.navigate("/server-error"); break;
```

**2. Component Seviyesi:**
```tsx
if (!product) return <NotFound />;
```

Interceptor API düzeyindeki hataları yakalar ve kullanıcıyı uygun sayfaya yönlendirir. Component seviyesinde ise yükleme sonrası boş veri kontrolü yapılır. Toast notification'lar (`react-toastify`) ise anlık kullanıcı bildirimleri için kullanılır.

---

### S30: Projede tamamlanmamış veya geliştirilebilecek yerler neler?

**Cevap:**

1. **`CartContext.deleteItem` implementasyonu boş** — UI'daki "Sepetten çıkar" butonu çalışmıyor
2. **Hardcoded URL'ler** — `http://localhost:5094` birden fazla dosyada tekrar ediyor; `.env` ile konfigüre edilmeli
3. **Servis katmanı eksik** — Controller'lar doğrudan DbContext kullanıyor
4. **Authentication yok** — Sepet yalnızca cookie ile tanımlanıyor, kullanıcı girişi yok
5. **Input validation eksik** — Sunucu tarafında kapsamlı doğrulama yapılmıyor
6. **Pagination yok** — Tüm ürünler tek sorguda çekiliyor
7. **`product` tipinin `any` olması** — `Product.tsx`'te `{ product: any }` yerine `IProducts` kullanılmalı
8. **`CardDTO` isim hatası** — `CartDTO` olmalıydı (typo)

---

## BÖLÜM 5: Sık Sorulan Kavramsal Sorular

---

### S31: REST API nedir, bu projede nasıl uygulanmış?

**Cevap:**
REST (Representational State Transfer), HTTP protokolü üzerine kurulu mimari bir stildir. Temel kurallar:

| HTTP Metodu | Kullanım | Bu Projede |
|-------------|---------|------------|
| GET | Veri okuma | `GET /api/products` |
| POST | Yeni kayıt oluşturma | `POST /api/cart/{productId}` |
| PUT | Güncelleme | `PUT /api/products/{id}` |
| DELETE | Silme | `DELETE /api/cart/{productId}` |

Status kodları: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Server Error.

---

### S32: Dependency Injection (DI) nedir ve bu projede nerede kullanılıyor?

**Cevap:**
DI, bir nesnenin bağımlılıklarını dışarıdan almasını sağlar — nesne kendi bağımlılıklarını oluşturmaz.

```csharp
// DI Container'a kayıt
builder.Services.AddDbContext<DataContext>(...);

// Constructor injection ile alma
public ProductsController(DataContext context)
{
    _context = context;
}
```

Avantajları: Test edilebilirlik (mock DbContext verilebilir), gevşek bağlantı (loose coupling), yaşam döngüsü yönetimi.

---

### S33: `async/await` ve `Task` neden kullanılıyor?

**Cevap:**

```csharp
public async Task<IActionResult> GetProducts()
{
    var products = await _context.Products.ToListAsync();
    return Ok(products);
}
```

Veritabanı sorguları I/O işlemidir. `async/await` ile thread bloklanmaz; sorgu beklenirken thread başka isteklere hizmet verebilir. Bu, yüksek eş zamanlı istek sayısında (scalability) kritiktir. `Task<T>` metodun asenkron olarak T tipinde sonuç döneceğini belirtir.

---

### S34: Frontend'de `useEffect` hook'u nasıl kullanılıyor ve ne zaman gerekli?

**Cevap:**
`useEffect`, bileşen render'dan sonra çalıştırılacak yan etkileri (side effects) yönetir. API çağrıları, event listener ekleme/kaldırma, timer kurma gibi işlemler için kullanılır.

```tsx
useEffect(() => {
    agent.Catalog.list()
        .then(data => setProducts(data))
        .finally(() => setLoading(false));
}, []); // [] → sadece component mount'ta çalışır
```

Bağımlılık dizisi `[id]` olsaydı, `id` her değiştiğinde effect yeniden çalışırdı — `ProductDetails`'te bu şekilde kullanılmıştır.

---

### S35: TypeScript'in bu projede sağladığı avantajlar nelerdir?

**Cevap:**

1. **Tip güvenliği**: `IProducts` interface'i sayesinde `product.nme` gibi yazım hataları compile time'da yakalanır
2. **IDE desteği**: Autocomplete, refactoring, "Go to definition" özellikleri çalışır
3. **API sözleşmesi**: `requests.get<IProducts[]>()` ile dönüş tipi belli olur
4. **Bakım kolaylığı**: Büyük ekiplerde kod anlaşılırlığı artar
5. **`interface` ile belgeleme**: `ICartItems` interfacei, backend'den gelen JSON yapısını dokümante eder

---

### S36: `NavLink` ve `Link` arasındaki fark nedir?

**Cevap:**

```tsx
// NavLink - aktif rotada CSS class ekler
<ListItem component={NavLink} to={link.to} sx={styles}>

// Link - basit navigasyon, aktif stil yok
<Button component={Link} to={`/catalog/${product.id}`}>
```

`NavLink`, aktif rota olduğunda otomatik olarak `active` CSS class'ı ekler. `Header.tsx`'teki `styles` nesnesindeki `"&.active": { color: "text.secondary" }` bu sayede çalışır. `Link` ise sadece navigasyon sağlar, aktif stilleme gereksiz olduğunda tercih edilir.

---

*Bu döküman ShoppingProject'teki tüm önemli kod kararlarını kapsamaktadır. Her soru ve cevap, gerçek koddan örneklerle desteklenmiştir.*
