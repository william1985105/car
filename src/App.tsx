import React, { useState } from 'react';
import { Vehicle, FuelRecord, FuelTypeOption, GasStationOption } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { VehicleManager } from './components/VehicleManager';
import { AddFuelRecord } from './components/AddFuelRecord';
import { Login } from './components/Login';

function App() {
  const [vehicles, setVehicles] = useLocalStorage<Vehicle[]>('fuel-tracker-vehicles', []);
  const [fuelRecords, setFuelRecords] = useLocalStorage<FuelRecord[]>('fuel-tracker-records', []);
  const [fuelTypes, setFuelTypes] = useLocalStorage<FuelTypeOption[]>('fuel-tracker-fuel-types', [
    { id: '1', name: '92号汽油', createdAt: new Date().toISOString() },
    { id: '2', name: '95号汽油', createdAt: new Date().toISOString() },
    { id: '3', name: '98号汽油', createdAt: new Date().toISOString() },
    { id: '4', name: '0号柴油', createdAt: new Date().toISOString() },
    { id: '5', name: '-10号柴油', createdAt: new Date().toISOString() },
  ]);
  const [gasStations, setGasStations] = useLocalStorage<GasStationOption[]>('fuel-tracker-gas-stations', [
    { id: '1', name: '中石油', createdAt: new Date().toISOString() },
    { id: '2', name: '中石化', createdAt: new Date().toISOString() },
    { id: '3', name: '中海油', createdAt: new Date().toISOString() },
    { id: '4', name: '壳牌', createdAt: new Date().toISOString() },
    { id: '5', name: '道达尔', createdAt: new Date().toISOString() },
  ]);
  const [password, setPassword] = useLocalStorage<string>('fuel-tracker-password', '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  // Auto-select first vehicle if none selected
  React.useEffect(() => {
    if (!selectedVehicleId && vehicles.length > 0) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  const handleLogin = (inputPassword: string) => {
    if (!password) {
      // First time login - set password
      setPassword(inputPassword);
      setIsLoggedIn(true);
    } else if (password === inputPassword) {
      setIsLoggedIn(true);
    } else {
      alert('密码错误，请重试');
    }
  };

  const handleAddVehicle = (vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setVehicles([...vehicles, newVehicle]);
    
    // Auto-select the new vehicle if it's the first one
    if (vehicles.length === 0) {
      setSelectedVehicleId(newVehicle.id);
    }
  };

  const handleEditVehicle = (id: string, vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) => {
    setVehicles(vehicles.map(vehicle => 
      vehicle.id === id 
        ? { ...vehicleData, id, createdAt: vehicle.createdAt }
        : vehicle
    ));
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('确定要删除这辆车及其所有加油记录吗？')) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      setFuelRecords(fuelRecords.filter(record => record.vehicleId !== id));
      
      // If deleted vehicle was selected, select first remaining vehicle
      if (selectedVehicleId === id) {
        const remainingVehicles = vehicles.filter(vehicle => vehicle.id !== id);
        setSelectedVehicleId(remainingVehicles.length > 0 ? remainingVehicles[0].id : '');
      }
    }
  };

  const handleAddFuelRecord = (recordData: Omit<FuelRecord, 'id' | 'createdAt'>) => {
    const newRecord: FuelRecord = {
      ...recordData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setFuelRecords([...fuelRecords, newRecord]);
  };

  const handleEditFuelRecord = (id: string, recordData: Omit<FuelRecord, 'id' | 'createdAt'>) => {
    setFuelRecords(fuelRecords.map(record => 
      record.id === id 
        ? { ...recordData, id, createdAt: record.createdAt }
        : record
    ));
  };

  const handleDeleteFuelRecord = (id: string) => {
    if (confirm('确定要删除这条加油记录吗？')) {
      setFuelRecords(fuelRecords.filter(record => record.id !== id));
    }
  };

  const handleAddFuelType = (name: string) => {
    const newFuelType: FuelTypeOption = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
    };
    setFuelTypes([...fuelTypes, newFuelType]);
  };

  const handleDeleteFuelType = (id: string) => {
    if (confirm('确定要删除这个燃料类型吗？')) {
      setFuelTypes(fuelTypes.filter(type => type.id !== id));
    }
  };

  const handleAddGasStation = (name: string) => {
    const newGasStation: GasStationOption = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
    };
    setGasStations([...gasStations, newGasStation]);
  };

  const handleDeleteGasStation = (id: string) => {
    if (confirm('确定要删除这个加油站吗？')) {
      setGasStations(gasStations.filter(station => station.id !== id));
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            vehicles={vehicles}
            fuelRecords={fuelRecords}
            selectedVehicleId={selectedVehicleId}
            onVehicleChange={setSelectedVehicleId}
            onEditRecord={handleEditFuelRecord}
            onDeleteRecord={handleDeleteFuelRecord}
            fuelTypes={fuelTypes}
            gasStations={gasStations}
          />
        );
      case 'vehicles':
        return (
          <VehicleManager
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onEditVehicle={handleEditVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        );
      case 'add-record':
        return (
          <AddFuelRecord
            vehicles={vehicles}
            fuelRecords={fuelRecords}
            fuelTypes={fuelTypes}
            gasStations={gasStations}
            onAddRecord={handleAddFuelRecord}
            onAddFuelType={handleAddFuelType}
            onDeleteFuelType={handleDeleteFuelType}
            onAddGasStation={handleAddGasStation}
            onDeleteGasStation={handleDeleteGasStation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
}

export default App;