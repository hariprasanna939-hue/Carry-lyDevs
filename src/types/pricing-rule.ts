export interface PricingRule {
  id?: string;
  city: string; // e.g. "Coimbatore"
  vehicleType: string; // e.g. "tata_ace", "3_wheeler_cargo"
  baseFare: number; // in Rupees
  perKmRate: number; // in Rupees per Km
  helperRate: number; // in Rupees per Helper
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}
