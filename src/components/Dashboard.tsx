import React, { useState } from 'react';
import { Vehicle, FuelRecord, FuelTypeOption, GasStationOption } from '../types';
import { calculateStatistics, formatCurrency } from '../utils/calculations';
import { Fuel, TrendingUp, BarChart, Calendar, MapPin, Image, Edit2, Trash2, X, Car } from 'lucide-react';

interface DashboardProps {
  vehicles: Vehicle[];
  fuelRecords: FuelRecord[];
  selectedVehicleId: string;
  onVehicleChange: (vehicleId: string) => void;
  onEditRecord: (id: string, record: Omit<FuelRecord, 'id' | 'createdAt'>) => void;
  onDeleteRecord: (id: string) => void;
  fuelTypes: FuelTypeOption[];
  gasStations: GasStationOption[];
}

export function Dashboard({ 
  vehicles, 
  fuelRecords, 
  selectedVehicleId, 
  onVehicleChange, 
  onEditRecord, 
  onDeleteRecord,
  fuelTypes,
  gasStations
}: DashboardProps) {
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null);
  const [editFormData, setEditFormData] = useState({
    vehicleId: '',
    date: '',
    odometer: '',
    fuelAmount: '',
    cost: '',
    actualPayment: '',
    pricePerLiter: '',
    discountedPricePerLiter: '',
    station: '',
    location: '',
    fuelType: '',
    notes: '',
    images: [] as string[],
  });

  const currentVehicle = vehicles.find(v => v.id === selectedVehicleId);
  const vehicleRecords = fuelRecords.filter(record => record.vehicleId === selectedVehicleId);
  const stats = calculateStatistics(vehicleRecords);
  
  const recentRecords = vehicleRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleEditRecord = (record: FuelRecord) => {
    setEditingRecord(record);
    setEditFormData({
      vehicleId: record.vehicleId,
      date: record.date,
      odometer: record.odometer.toString(),
      fuelAmount: record.fuelAmount.toString(),
      cost: record.cost.toString(),
      actualPayment: record.actualPayment.toString(),
      pricePerLiter: record.pricePerLiter.toString(),
      discountedPricePerLiter: record.discountedPricePerLiter.toString(),
      station: record.station,
      location: record.location,
      fuelType: record.fuelType,
      notes: record.notes || '',
      images: record.images || [],
    });
  };

  const handleSaveEdit = () => {
    if (!editingRecord) return;

    const pricePerLiter = editFormData.pricePerLiter 
      ? parseFloat(editFormData.pricePerLiter)
      : parseFloat(editFormData.cost) / parseFloat(editFormData.fuelAmount);

    const discountedPricePerLiter = editFormData.actualPayment
      ? parseFloat(editFormData.actualPayment) / parseFloat(editFormData.fuelAmount)
      : pricePerLiter;

    onEditRecord(editingRecord.id, {
      vehicleId: editFormData.vehicleId,
      date: editFormData.date,
      odometer: parseInt(editFormData.odometer),
      fuelAmount: parseFloat(editFormData.fuelAmount),
      cost: parseFloat(editFormData.cost),
      actualPayment: parseFloat(editFormData.actualPayment),
      pricePerLiter,
      discountedPricePerLiter,
      station: editFormData.station,
      location: editFormData.location,
      fuelType: editFormData.fuelType,
      notes: editFormData.notes,
      images: editFormData.images,
    });

    setEditingRecord(null);
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
  };

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditRecord(record)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteRecord(record.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">编辑加油记录</h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">车辆</label>
                    <select
                      value={editFormData.vehicleId}
                      onChange={(e) => setEditFormData({ ...editFormData, vehicleId: e.target.value })}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} ({vehicle.licensePlate})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
                    <input
                      type="date"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">里程数 (km)</label>
                    <input
                      type="number"
                      value={editFormData.odometer}
                      onChange={(e) => setEditFormData({ ...editFormData, odometer: e.target.value })}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">加油量 (L)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.fuelAmount}
                      onChange={(e) => setEditFormData({ ...editFormData, fuelAmount: e.target.value })}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">标准费用 (¥)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.cost}
                      onChange={(e) => setEditFormData({ ...editFormData, cost: e.target.value })}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">实际付款 (¥)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.actualPayment}
                      onChange={(e) => setEditFormData({ ...editFormData, actualPayment: e.target.value })}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">加油站</label>
                    <select
                      value={editFormData.station}
                      onChange={(e) => setEditFormData({ ...editFormData, station: e.target.value })}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {gasStations.map(station => (
                        <option key={station.id} value={station.name}>
                          {station.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">位置</label>
                    <input
                      type="text"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">燃料类型</label>
                  <select
                    value={editFormData.fuelType}
                    onChange={(e) => setEditFormData({ ...editFormData, fuelType: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {fuelTypes.map(type => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                  <textarea
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
                  >
                    保存修改
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}