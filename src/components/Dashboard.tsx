import React from 'react';
import { Vehicle, FuelRecord } from '../types';
import { calculateStatistics, formatCurrency } from '../utils/calculations';
import { Fuel, TrendingUp, BarChart, Calendar, MapPin, Image } from 'lucide-react';

interface DashboardProps {
  vehicles: Vehicle[];
  fuelRecords: FuelRecord[];
  selectedVehicleId: string;
  onVehicleChange: (vehicleId: string) => void;
}

export function Dashboard({ vehicles, fuelRecords, selectedVehicleId, onVehicleChange }: DashboardProps) {
  const currentVehicle = vehicles.find(v => v.id === selectedVehicleId);
  const vehicleRecords = fuelRecords.filter(record => record.vehicleId === selectedVehicleId);
  const stats = calculateStatistics(vehicleRecords);
  
  const recentRecords = vehicleRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ElementType;
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">仪表板</h2>
            <p className="text-gray-600 mt-1">查看您的燃油使用统计和趋势</p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedVehicleId}
              onChange={(e) => onVehicleChange(e.target.value)}
              className="block w-full sm:w-auto rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            >
              <option value="">选择车辆</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.licensePlate})
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentVehicle && (
          <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Fuel className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{currentVehicle.name}</h3>
                <p className="text-blue-100">{currentVehicle.brand} {currentVehicle.model} ({currentVehicle.year})</p>
                <p className="text-blue-100">车牌号: {currentVehicle.licensePlate}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {vehicleRecords.length === 0 ? (
        <div className="text-center py-12">
          <Fuel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无加油记录</h3>
          <p className="text-gray-500">开始添加您的第一条加油记录吧！</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="总花费"
              value={formatCurrency(stats.totalCost)}
              icon={({ className }: { className: string }) => <span className={className}>¥</span>}
              color="bg-gradient-to-br from-green-500 to-emerald-600"
            />
            <StatCard
              title="总加油量"
              value={`${stats.totalFuel.toFixed(1)}L`}
              icon={Fuel}
              color="bg-gradient-to-br from-blue-500 to-cyan-600"
            />
            <StatCard
              title="平均油耗"
              value={`${stats.averageFuelEfficiency.toFixed(1)}km/L`}
              icon={TrendingUp}
              color="bg-gradient-to-br from-purple-500 to-pink-600"
            />
            <StatCard
              title="总节省"
              value={formatCurrency(stats.totalSavings)}
              subtitle={`记录数量: ${stats.recordCount}`}
              icon={BarChart}
              color="bg-gradient-to-br from-orange-500 to-red-600"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">最近加油记录</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>日期</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">里程</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">油量</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">费用</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">实付</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>加油站</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <Image className="w-4 h-4" />
                        <span>附件</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.odometer.toLocaleString()}km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.fuelAmount}L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(record.cost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={record.actualPayment < record.cost ? 'text-green-600' : 'text-gray-900'}>
                          {formatCurrency(record.actualPayment)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.station}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.images && record.images.length > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {record.images.length} 张
                          </span>
                        ) : (
                          <span className="text-gray-400">无</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}