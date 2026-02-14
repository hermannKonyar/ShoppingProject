using API.Data;
using API.Middlewares;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Add services to the container.
builder.Services.AddDbContext<DataContext>(options =>
{
    var config = builder.Configuration;
    var connectionString = config.GetConnectionString("DefaultConnection");
    options.UseSqlite(connectionString);
});
//Dışarıdan erişim izni vermek için
builder.Services.AddCors();

//JsonOptions eklemek için
//
builder.Services.AddControllers().AddJsonOptions(opt => 
{
    opt.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseMiddleware<ExceptionHandling>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//Dışarıdan erişim izni vermek için
app.UseCors(opt=>opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000"));

//Static dosyaları kullanabilmek için
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
