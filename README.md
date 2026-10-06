# Strategy Pattern: Shipping Cost API

A small .NET (C#) minimal API that demonstrates the **Strategy pattern**, with a Next.js + Tailwind frontend. The shipping cost is calculated by interchangeable algorithms, and the right one is chosen at runtime from the request, with no if/else or switch chain.

## How the pattern maps to the code

| Role | Class | File |
|------|-------|------|
| Strategy interface | `IShippingStrategy` | `ShippingStrategy/Strategies/IShippingStrategy.cs` |
| Concrete strategies | `StandardShipping`, `ExpressShipping`, `OvernightShipping` | `ShippingStrategy/Strategies/` |
| Context | `ShippingCalculator` | `ShippingStrategy/Services/ShippingCalculator.cs` |

`ShippingCalculator` receives every registered `IShippingStrategy` through dependency injection, indexes them by their `Method` key, and delegates the calculation to the one that matches the request.

### Pricing rules

| Method | Formula |
|--------|---------|
| `standard` | `weightKg * 0.5 + distanceKm * 0.1` |
| `express` | `(weightKg * 0.5 + distanceKm * 0.1) * 2 + 10` |
| `overnight` | `weightKg * 1.0 + distanceKm * 0.4 + 25` |

### Adding a new strategy

1. Create a class implementing `IShippingStrategy` in `Strategies/`.
2. Register it in `Program.cs`: `builder.Services.AddSingleton<IShippingStrategy, MyShipping>();`

`ShippingCalculator` and the endpoints need no changes (Open/Closed Principle).

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/shipping/methods` | Lists the available shipping methods |
| `POST` | `/api/shipping/quote` | Returns the cost for a method, weight and distance |

Example request:

```bash
curl -X POST http://localhost:5292/api/shipping/quote \
  -H 'Content-Type: application/json' \
  -d '{"method":"express","weightKg":2,"distanceKm":50}'
```

Response:

```json
{ "method": "express", "cost": 22.0 }
```

An unknown method, or a weight or distance that is not positive, returns `400 Bad Request`.

## Running

Requires the .NET 10 SDK and, for the UI, Node 20.9 or later (Next.js 16).

```bash
# terminal 1: API on http://localhost:5292 (Swagger UI at /swagger)
cd ShippingStrategy && dotnet run

# terminal 2: UI on http://localhost:3000
cd ShippingStrategy/ClientApp && npm install && npm run dev
```

## Frontend (Next.js + React + Tailwind)

The frontend lives in `ShippingStrategy/ClientApp`, the folder name the ASP.NET Core SPA templates use for a client app. It is a single-page UI in `ShippingStrategy/ClientApp/app/page.tsx` that loads the methods from the API and requests quotes. `ShippingStrategy/ClientApp/next.config.ts` rewrites `/api/*` to the backend, so the browser needs no CORS setup. Set `API_URL` if the API runs on a different address (default `http://localhost:5292`).

## Project layout

```
ShippingStrategy/
  ClientApp/                 Next.js app (app/page.tsx is the UI)
  Program.cs                 DI registration, endpoints, Swagger
  Strategies/                IShippingStrategy + concrete strategies
  Services/                  ShippingCalculator (the context)
  Models/                    QuoteRequest, QuoteResponse
```
