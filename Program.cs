using ShippingStrategy.Models;
using ShippingStrategy.Services;
using ShippingStrategy.Strategies;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IShippingStrategy, StandardShipping>();
builder.Services.AddSingleton<IShippingStrategy, ExpressShipping>();
builder.Services.AddSingleton<IShippingStrategy, OvernightShipping>();
builder.Services.AddSingleton<ShippingCalculator>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/api/shipping/methods", (ShippingCalculator calc) => calc.Methods);

app.MapPost("/api/shipping/quote", (QuoteRequest req, ShippingCalculator calc) =>
{
    if (req.WeightKg <= 0 || req.DistanceKm <= 0)
        return Results.BadRequest("weightKg and distanceKm must be positive.");

    var cost = calc.Quote(req.Method, req.WeightKg, req.DistanceKm);
    return cost is null
        ? Results.BadRequest($"Unknown method '{req.Method}'. Available: {string.Join(", ", calc.Methods)}")
        : Results.Ok(new QuoteResponse(req.Method.ToLowerInvariant(), cost.Value));
});

app.Run();
