namespace ShippingStrategy.Strategies;

public class ExpressShipping : IShippingStrategy
{
    public string Method => "express";

    public decimal Calculate(decimal weightKg, decimal distanceKm) =>
        (weightKg * 0.5m + distanceKm * 0.1m) * 2 + 10m;
}
