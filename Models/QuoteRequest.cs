namespace ShippingStrategy.Models;

public record QuoteRequest(string Method, decimal WeightKg, decimal DistanceKm);
