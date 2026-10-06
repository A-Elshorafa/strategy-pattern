namespace ShippingStrategy.Strategies;

public class StandardShipping : IShippingStrategy
{
    public string Method => "standard";

    public decimal Calculate(decimal weightKg, decimal distanceKm) =>
        weightKg * 0.5m + distanceKm * 0.1m;
}
