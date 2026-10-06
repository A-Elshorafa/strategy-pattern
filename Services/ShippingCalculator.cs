using ShippingStrategy.Strategies;

namespace ShippingStrategy.Services;

public class ShippingCalculator
{
    private readonly Dictionary<string, IShippingStrategy> _strategies;

    public ShippingCalculator(IEnumerable<IShippingStrategy> strategies) =>
        _strategies = strategies.ToDictionary(s => s.Method, StringComparer.OrdinalIgnoreCase);

    public IEnumerable<string> Methods => _strategies.Keys;

    public decimal? Quote(string method, decimal weightKg, decimal distanceKm) =>
        _strategies.TryGetValue(method, out var strategy)
            ? Math.Round(strategy.Calculate(weightKg, distanceKm), 2)
            : null;
}
