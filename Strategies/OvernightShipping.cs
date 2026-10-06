namespace ShippingStrategy.Strategies;

public class OvernightShipping : IShippingStrategy
{
    public string Method => "overnight";

    public decimal Calculate(decimal weightKg, decimal distanceKm) =>
        weightKg * 1.0m + distanceKm * 0.4m + 25m;
}
