namespace ShippingStrategy.Strategies;

public interface IShippingStrategy
{
    string Method { get; }
    decimal Calculate(decimal weightKg, decimal distanceKm);
}
