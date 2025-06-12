export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  tankCapacity: number;
  createdAt: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  fuelAmount: number;
  cost: number;
  actualPayment: number;
  pricePerLiter: number;
  discountedPricePerLiter: number;
  station: string;
  location: string;
  fuelType: string;
  notes?: string;
  images?: string[];
  createdAt: string;
}

export interface Statistics {
  totalCost: number;
  totalFuel: number;
  averageFuelEfficiency: number;
  averageCostPerKm: number;
  totalDistance: number;
  recordCount: number;
  totalSavings: number;
}

export interface FuelTypeOption {
  id: string;
  name: string;
  createdAt: string;
}