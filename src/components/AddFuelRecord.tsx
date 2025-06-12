import React, { useState } from 'react';
import { Vehicle, FuelRecord, FuelTypeOption } from '../types';
import { Car, MapPin, Fuel, Calendar, FileText, Camera, X, Plus, Percent } from 'lucide-react';

interface AddFuelRecordProps {
  vehicles: Vehicle[];
  fuelRecords: FuelRecord[];
  fuelTypes: FuelTypeOption[];
  onAddRecord: (record: Omit<FuelRecord, 'id' | 'createdAt'>) => void;
  onAddFuelType: (name: string) => void;
}

export function AddFuelRecord({ vehicles, fuelRecords, fuelTypes, onAddRecord, onAddFuelType }: AddFuelRecordProps) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    date: new Date().toISOString().split('T')[0],
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

  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddFuelType, setShowAddFuelType] = useState(false);
  const [newFuelTypeName, setNewFuelTypeName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pricePerLiter = formData.pricePerLiter 
      ? parseFloat(formData.pricePerLiter)
      : parseFloat(formData.cost) / parseFloat(formData.fuelAmount);

    const discountedPricePerLiter = formData.actualPayment
      ? parseFloat(formData.actualPayment) / parseFloat(formData.fuelAmount)
      : pricePerLiter;

    onAddRecord({
      vehicleId: formData.vehicleId,
      date: formData.date,
      odometer: parseInt(formData.odometer),
      fuelAmount: parseFloat(formData.fuelAmount),
      cost: parseFloat(formData.cost),
      actualPayment: formData.actualPayment ? parseFloat(formData.actualPayment) : parseFloat(formData.cost),
      pricePerLiter,
      discountedPricePerLiter,
      station: formData.station,
      location: formData.location,
      fuelType: formData.fuelType,
      notes: formData.notes,
      images: formData.images,
    });

    // Reset form
    setFormData({
      vehicleId: formData.vehicleId,
      date: new Date().toISOString().split('T')[0],
      odometer: '',
      fuelAmount: '',
      cost: '',
      actualPayment: '',
      pricePerLiter: '',
      discountedPricePerLiter: '',
      station: formData.station,
      location: formData.location,
      fuelType: formData.fuelType,
      notes: '',
      images: [],
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCostChange = (cost: string) => {
    setFormData({ ...formData, cost });
    if (cost && formData.fuelAmount) {
      const pricePerLiter = (parseFloat(cost) / parseFloat(formData.fuelAmount)).toFixed(2);
      setFormData(prev => ({ ...prev, cost, pricePerLiter }));
    }
  };

  const handleActualPaymentChange = (actualPayment: string) => {
    setFormData({ ...formData, actualPayment });
    if (actualPayment && formData.fuelAmount) {
      const discountedPricePerLiter = (parseFloat(actualPayment) / parseFloat(formData.fuelAmount)).toFixed(2);
      setFormData(prev => ({ ...prev, actualPayment, discountedPricePerLiter }));
    }
  };

  const handleFuelAmountChange = (fuelAmount: string) => {
    setFormData({ ...formData, fuelAmount });
    if (fuelAmount && formData.cost) {
      const pricePerLiter = (parseFloat(formData.cost) / parseFloat(fuelAmount)).toFixed(2);
      setFormData(prev => ({ ...prev, fuelAmount, pricePerLiter }));
    }
    if (fuelAmount && formData.actualPayment) {
      const discountedPricePerLiter = (parseFloat(formData.actualPayment) / parseFloat(fuelAmount)).toFixed(2);
      setFormData(prev => ({ ...prev, fuelAmount, discountedPricePerLiter }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, result]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddFuelType = () => {
    if (newFuelTypeName.trim()) {
      onAddFuelType(newFuelTypeName.trim());
      setNewFuelTypeName('');
      setShowAddFuelType(false);
    }
  };

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
  const vehicleRecords = fuelRecords.filter(r => r.vehicleId === formData.vehicleId);
  const lastRecord = vehicleRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const savings = formData.cost && formData.actualPayment 
    ? parseFloat(formData.cost) - parseFloat(formData.actualPayment)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">添加加油记录</h2>
        <p className="text-gray-600 mt-1">记录您的最新加油信息</p>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                加油记录已成功添加！
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4" />
                    <span>选择车辆</span>
                  </div>
                </label>
                <select
                  required
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">请选择车辆...</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.licensePlate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>加油日期</span>
                    </div>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">里程数 (km)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.odometer}
                    onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="当前里程数"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Fuel className="w-4 h-4" />
                      <span>加油量 (L)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.fuelAmount}
                    onChange={(e) => handleFuelAmountChange(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">标准单价 (¥/L)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerLiter}
                    onChange={(e) => setFormData({ ...formData, pricePerLiter: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                    placeholder="自动计算"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">标准费用 (¥)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => handleCostChange(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">实际付款 (¥)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.actualPayment}
                    onChange={(e) => handleActualPaymentChange(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="实际支付金额"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Percent className="w-4 h-4" />
                      <span>优惠单价 (¥/L)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountedPricePerLiter}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                    placeholder="自动计算"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">节省金额 (¥)</label>
                  <input
                    type="text"
                    value={savings > 0 ? `¥${savings.toFixed(2)}` : '¥0.00'}
                    className="w-full rounded-lg border-gray-300 shadow-sm bg-green-50 text-green-700 font-medium"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>加油站</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.station}
                    onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="中石油、中石化等"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">位置</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="城市或具体地址"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center justify-between">
                    <span>燃料类型</span>
                    <button
                      type="button"
                      onClick={() => setShowAddFuelType(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>添加类型</span>
                    </button>
                  </div>
                </label>
                <select
                  required
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">请选择燃料类型...</option>
                  {fuelTypes.map(type => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {showAddFuelType && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newFuelTypeName}
                      onChange={(e) => setNewFuelTypeName(e.target.value)}
                      placeholder="输入新的燃料类型"
                      className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddFuelType}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      添加
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddFuelType(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>附件图片</span>
                  </div>
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`附件 ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>备注 (可选)</span>
                  </div>
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="加油相关的备注信息..."
                />
              </div>

              <button
                type="submit"
                disabled={!formData.vehicleId}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                添加加油记录
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {selectedVehicle && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">车辆信息</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">车辆:</span>
                  <span className="text-gray-900 font-medium">{selectedVehicle.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">车牌:</span>
                  <span className="text-gray-900">{selectedVehicle.licensePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">型号:</span>
                  <span className="text-gray-900">{selectedVehicle.brand} {selectedVehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">油箱容量:</span>
                  <span className="text-gray-900">{selectedVehicle.tankCapacity}L</span>
                </div>
              </div>
            </div>
          )}

          {lastRecord && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">上次加油</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">日期:</span>
                  <span className="text-gray-900">{new Date(lastRecord.date).toLocaleDateString('zh-CN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">里程:</span>
                  <span className="text-gray-900">{lastRecord.odometer.toLocaleString()}km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">油量:</span>
                  <span className="text-gray-900">{lastRecord.fuelAmount}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">费用:</span>
                  <span className="text-gray-900">¥{lastRecord.cost.toFixed(2)}</span>
                </div>
                {lastRecord.actualPayment !== lastRecord.cost && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">实付:</span>
                    <span className="text-green-600 font-medium">¥{lastRecord.actualPayment.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">小贴士</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• 建议每次加油后立即记录，避免遗忘</li>
              <li>• 记录准确的里程数有助于计算油耗</li>
              <li>• 保留加油小票可以核对信息</li>
              <li>• 上传小票照片便于后续查证</li>
              <li>• 记录实际付款可跟踪优惠情况</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}