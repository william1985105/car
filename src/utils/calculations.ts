import { FuelRecord } from '../types';

export function calculateFuelEfficiency(records: FuelRecord[]): number {
  if (records.length < 2) return 0;
  
  const sortedRecords = [...records].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let totalDistance = 0;
  let totalFuel = 0;
  
  for (let i = 1; i < sortedRecords.length; i++) {
    const distance = sortedRecords[i].odometer - sortedRecords[i - 1].odometer;
    if (distance > 0) {
      totalDistance += distance;
      totalFuel += sortedRecords[i].fuelAmount;
    }
  }
  
  return totalFuel > 0 ? (totalDistance / totalFuel) * 100 : 0;
}

export function calculateStatistics(records: FuelRecord[]) {
  if (records.length === 0) {
    return {
      totalCost: 0,
      totalFuel: 0,
      averageFuelEfficiency: 0,
      averageCostPerKm: 0,
      totalDistance: 0,
      recordCount: 0,
      totalSavings: 0,
    };
  }

  const totalCost = records.reduce((sum, record) => sum + record.cost, 0);
  const totalActualPayment = records.reduce((sum, record) => sum + record.actualPayment, 0);
  const totalSavings = totalCost - totalActualPayment;
  const totalFuel = records.reduce((sum, record) => sum + record.fuelAmount, 0);
  
  const sortedRecords = [...records].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const totalDistance = sortedRecords.length > 1 
    ? sortedRecords[sortedRecords.length - 1].odometer - sortedRecords[0].odometer 
    : 0;
  
  const averageFuelEfficiency = calculateFuelEfficiency(records);
  const averageCostPerKm = totalDistance > 0 ? totalActualPayment / totalDistance : 0;

  return {
    totalCost,
    totalFuel,
    averageFuelEfficiency,
    averageCostPerKm,
    totalDistance,
    recordCount: records.length,
    totalSavings,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}