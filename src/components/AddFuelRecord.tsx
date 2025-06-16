import React, { useState } from 'react';
import { Vehicle, FuelRecord, FuelTypeOption, GasStationOption } from '../types';
import { Car, MapPin, Fuel, Calendar, FileText, Camera, X, Plus, Percent, Trash2, Scan } from 'lucide-react';

interface AddFuelRecordProps {
  vehicles: Vehicle[];
  fuelRecords: FuelRecord[];
  fuelTypes: FuelTypeOption[];
  gasStations: GasStationOption[];
  onAddRecord: (record: Omit<FuelRecord, 'id' | 'createdAt'>) => void;
  onAddFuelType: (name: string) => void;
  onDeleteFuelType: (id: string) => void;
  onAddGasStation: (name: string) => void;
  onDeleteGasStation: (id: string) => void;
}

export function AddFuelRecord({ 
  vehicles, 
  fuelRecords, 
  fuelTypes, 
  gasStations,
  onAddRecord, 
  onAddFuelType, 
  onDeleteFuelType,
  onAddGasStation,
  onDeleteGasStation
}: AddFuelRecordProps) {
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
  const [showAddGasStation, setShowAddGasStation] = useState(false);
  const [newFuelTypeName, setNewFuelTypeName] = useState('');
  const [newGasStationName, setNewGasStationName] = useState('');
  const [isScanning, setIsScanning] = useState(false);

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

  const handleReceiptScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setIsScanning(true);
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        
        // Add image to the images array
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result]
        }));

        // Simulate OCR processing (in a real app, you'd use an OCR service like Tesseract.js or cloud OCR)
        try {
          await simulateOCRProcessing(result);
        } catch (error) {
          console.error('OCR processing failed:', error);
          alert('小票识别失败，请手动输入信息');
        } finally {
          setIsScanning(false);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const simulateOCRProcessing = async (imageData: string): Promise<void> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock OCR results - in a real implementation, you would use actual OCR
    const mockOCRResults = {
      station: '中石油',
      fuelAmount: '45.67',
      cost: '320.69',
      actualPayment: '315.50',
      date: new Date().toISOString().split('T')[0],
      location: '北京市朝阳区',
      fuelType: '95号汽油'
    };

    // Auto-fill form with OCR results
    setFormData(prev => ({
      ...prev,
      station: mockOCRResults.station,
      fuelAmount: mockOCRResults.fuelAmount,
      cost: mockOCRResults.cost,
      actualPayment: mockOCRResults.actualPayment,
      date: mockOCRResults.date,
      location: mockOCRResults.location,
      fuelType: mockOCRResults.fuelType,
      pricePerLiter: (parseFloat(mockOCRResults.cost) / parseFloat(mockOCRResults.fuelAmount)).toFixed(2),
      discountedPricePerLiter: (parseFloat(mockOCRResults.actualPayment) / parseFloat(mockOCRResults.fuelAmount)).toFixed(2)
    }));

    alert('小票识别成功！已自动填入相关信息，请核对后提交。');
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

  const handleAddGasStation = () => {
    if (newGasStationName.trim()) {
      onAddGasStation(newGasStationName.trim());
      setNewGasStationName('');
      setShowAddGasStation(false);
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
            {/* Receipt Scanning Section */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-blue-900 flex items-center space-x-2">
                  <Scan className="w-5 h-5" />
                  <span>智能小票识别</span>
                </h3>
                {isScanning && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">识别中...</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-blue-700 mb-3">
                上传加油小票照片，系统将自动识别并填入相关信息
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleReceiptScan}
                disabled={isScanning}
                className="w-full text-sm text-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer disabled:opacity-50"
              />
            </div>

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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>加油站</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddGasStation(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>添加</span>
                      </button>
                    </div>
                  </label>
                  <select
                    required
                    value={formData.station}
                    onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">请选择加油站...</option>
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
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="城市或具体地址"
                  />
                </div>
              </div>

              {showAddGasStation && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="text"
                      value={newGasStationName}
                      onChange={(e) => setNewGasStationName(e.target.value)}
                      placeholder="输入新的加油站名称"
                      className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddGasStation}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      添加
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddGasStation(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">现有加油站:</h4>
                    <div className="flex flex-wrap gap-2">
                      {gasStations.map(station => (
                        <div key={station.id} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-lg border border-gray-200">
                          <span className="text-sm text-gray-700">{station.name}</span>
                          <button
                            type="button"
                            onClick={() => onDeleteGasStation(station.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

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
                  <div className="flex items-center space-x-2 mb-4">
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
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">现有燃料类型:</h4>
                    <div className="flex flex-wrap gap-2">
                      {fuelTypes.map(type => (
                        <div key={type.id} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-lg border border-gray-200">
                          <span className="text-sm text-gray-700">{type.name}</span>
                          <button
                            type="button"
                            onClick={() => onDeleteFuelType(type.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
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
                disabled={!formData.vehicleId || isScanning}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? '识别中...' : '添加加油记录'}
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
              <li>• 使用智能识别功能快速录入信息</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}