'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import RegistryBulkActions from '@/components/ui/RegistryBulkActions';
import CreateRegistryForm from '@/components/ui/CreateRegistryForm';
import DuplicateRegistryForm from '@/components/ui/DuplicateRegistryForm';
import MergeRegistriesForm from '@/components/ui/MergeRegistriesForm';
import AutoRegistriesForm from '@/components/ui/AutoRegistriesForm';

export default function RegistriesPage() {
  const [selectedRegistry, setSelectedRegistry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRegistries, setSelectedRegistries] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showAutoModal, setShowAutoModal] = useState(false);

  const metrics = [
    {
      title: 'Всего реестров',
      value: '156',
      change: { value: '+8%', type: 'positive' as const },
      icon: <i className="ri-file-list-3-line"></i>
    },
    {
      title: 'Активных',
      value: '23',
      change: { value: '+3%', type: 'positive' as const },
      icon: <i className="ri-file-check-line"></i>
    },
    {
      title: 'Завершенных',
      value: '128',
      change: { value: '+12%', type: 'positive' as const },
      icon: <i className="ri-check-line"></i>
    },
    {
      title: 'Архивных',
      value: '5',
      change: { value: '+1', type: 'positive' as const },
      icon: <i className="ri-archive-line"></i>
    }
  ];

  const registries = [
    {
      id: 'REG-001',
      name: 'Реестр выплат за январь 2024',
      type: 'Ежемесячный',
      status: 'active',
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-15',
      recordsCount: 2456,
      totalAmount: 125000000,
      creator: 'Айжан Кыдырова'
    },
    {
      id: 'REG-002',
      name: 'Реестр выплат за декабрь 2023',
      type: 'Ежемесячный',
      status: 'completed',
      createdDate: '2023-12-01',
      lastUpdated: '2023-12-31',
      recordsCount: 2234,
      totalAmount: 118000000,
      creator: 'Айжан Кыдырова'
    },
    {
      id: 'REG-003',
      name: 'Реестр единовременных выплат',
      type: 'Специальный',
      status: 'active',
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-15',
      recordsCount: 156,
      totalAmount: 7800000,
      creator: 'Айжан Кыдырова'
    },
    {
      id: 'REG-004',
      name: 'Реестр выплат по регионам',
      type: 'Аналитический',
      status: 'draft',
      createdDate: '2024-01-14',
      lastUpdated: '2024-01-14',
      recordsCount: 89,
      totalAmount: 4450000,
      creator: 'Айжан Кыдырова'
    },
    {
      id: 'REG-005',
      name: 'Реестр выплат за ноябрь 2023',
      type: 'Ежемесячный',
      status: 'archived',
      createdDate: '2023-11-01',
      lastUpdated: '2023-11-30',
      recordsCount: 2156,
      totalAmount: 112000000,
      creator: 'Айжан Кыдырова'
    }
  ];

  // Функции для массовых действий
  const handleSelectRegistry = (registry: any, isSelected: boolean) => {
    if (isSelected) {
      setSelectedRegistries(prev => [...prev, registry]);
    } else {
      setSelectedRegistries(prev => prev.filter(r => r.id !== registry.id));
    }
  };

  const handleSelectAll = () => {
    setSelectedRegistries([...registries]);
  };

  const handleDeselectAll = () => {
    setSelectedRegistries([]);
  };

  const handleBulkAction = (action: string, registryIds: string[]) => {
    console.log(`Выполнение массового действия: ${action} для реестров:`, registryIds);
    
    switch (action) {
      case 'export':
        // Логика экспорта реестров
        alert(`Экспорт ${registryIds.length} реестров...`);
        break;
      case 'merge':
        // Логика объединения реестров
        alert(`Объединение ${registryIds.length} реестров...`);
        break;
      case 'archive':
        // Логика архивирования реестров
        alert(`Архивирование ${registryIds.length} реестров...`);
        break;
      case 'delete':
        // Логика удаления реестров
        alert(`Удаление ${registryIds.length} реестров...`);
        break;
    }
    
    // Очищаем выбор после действия
    setSelectedRegistries([]);
  };

  // Функции для быстрых действий
  const handleCreateRegistry = () => {
    setShowCreateModal(true);
  };

  const handleDuplicateRegistry = () => {
    setShowDuplicateModal(true);
  };

  const handleMergeRegistries = () => {
    setShowMergeModal(true);
  };

  const handleAutoRegistries = () => {
    setShowAutoModal(true);
  };

  const handleCreateNewRegistry = (formData: any) => {
    console.log('Создание нового реестра:', formData);
    alert(`Создан новый реестр: ${formData.name}`);
    setShowCreateModal(false);
  };

  const handleDuplicateSelectedRegistry = (formData: any) => {
    console.log('Дублирование реестра:', formData);
    alert(`Реестр ${formData.sourceRegistry} дублирован как ${formData.newName}`);
    setShowDuplicateModal(false);
  };

  const handleMergeSelectedRegistries = (formData: any) => {
    console.log('Объединение реестров:', formData);
    alert(`Объединены реестры: ${formData.registries.join(', ')} в ${formData.mergedName}`);
    setShowMergeModal(false);
  };

  const handleCreateAutoRegistries = (formData: any) => {
    console.log('Создание автоматических реестров:', formData);
    alert(`Настроены автоматические реестры: ${formData.schedule}`);
    setShowAutoModal(false);
  };

  const columns = [
    {
      key: 'select',
      label: 'Выбор',
      render: (value: any, row: any) => (
        <input
          type="checkbox"
          checked={selectedRegistries.some(r => r.id === row.id)}
          onChange={(e) => handleSelectRegistry(row, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
        />
      )
    },
    {
      key: 'id',
      label: 'ID реестра',
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600">{value}</span>
      )
    },
    {
      key: 'name',
      label: 'Название реестра'
    },
    {
      key: 'type',
      label: 'Тип'
    },
    {
      key: 'status',
      label: 'Статус',
      render: (value: string) => (
        <StatusBadge 
          status={
            value === 'completed' ? 'success' :
            value === 'active' ? 'info' :
            value === 'draft' ? 'warning' : 'secondary'
          }
        >
          {value === 'completed' ? 'Завершен' :
           value === 'active' ? 'Активный' :
           value === 'draft' ? 'Черновик' : 'Архивный'}
        </StatusBadge>
      )
    },
    {
      key: 'recordsCount',
      label: 'Записей',
      render: (value: number) => (
        <span className="font-semibold">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'totalAmount',
      label: 'Общая сумма',
      render: (value: number) => (
        <span className="font-semibold text-green-600">{value.toLocaleString()} сом</span>
      )
    },
    {
      key: 'lastUpdated',
      label: 'Обновлен'
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewRegistry(row)}
            className="btn-primary text-xs px-3 py-1"
          >
            <i className="ri-eye-line mr-1"></i>
            Просмотр
          </button>
          <button className="btn-secondary text-xs px-3 py-1">
            <i className="ri-download-line mr-1"></i>
            Экспорт
          </button>
        </div>
      )
    }
  ];

  const handleViewRegistry = (registry: any) => {
    setSelectedRegistry(registry);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Управление реестрами</h1>
          <p className="text-neutral-600 mt-1">Создание и ведение реестров выплат</p>
        </div>

      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
          />
        ))}
      </div>



      {/* Registries Table */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Список реестров</h3>
          <p className="text-neutral-600 mt-1">Все реестры с возможностью фильтрации и поиска</p>
        </div>
        
        {/* Mass Actions */}
        <RegistryBulkActions
          selectedRegistries={selectedRegistries}
          onBulkAction={handleBulkAction}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          totalRegistries={registries.length}
          isAllSelected={selectedRegistries.length === registries.length && registries.length > 0}
        />
        
        <DataTable
          data={registries}
          columns={columns}
          searchable={true}
          sortable={true}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <button 
              onClick={handleCreateRegistry}
              className="w-full btn-primary text-left"
            >
              <i className="ri-add-circle-line mr-2"></i>
              Создать новый реестр
            </button>
            <button 
              onClick={handleDuplicateRegistry}
              className="w-full btn-secondary text-left"
            >
              <i className="ri-file-copy-line mr-2"></i>
              Дублировать реестр
            </button>
            <button 
              onClick={handleMergeRegistries}
              className="w-full btn-warning text-left"
            >
              <i className="ri-merge-cells-line mr-2"></i>
              Объединить реестры
            </button>
            <button 
              onClick={handleAutoRegistries}
              className="w-full btn-info text-left"
            >
              <i className="ri-calendar-line mr-2"></i>
              Автоматические реестры
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Статистика реестров</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Создано сегодня</span>
              <span className="font-semibold text-blue-600">2 реестра</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Обновлено сегодня</span>
              <span className="font-semibold text-green-600">5 реестров</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Средний размер</span>
              <span className="font-semibold text-purple-600">1,847 записей</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Завершено</span>
              <span className="font-semibold text-orange-600">82%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Registry Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Детали реестра"
        size="lg"
      >
        {selectedRegistry && (
          <div className="space-y-6">
            {/* Registry Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Информация о реестре</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">ID реестра:</span>
                    <span className="font-mono text-blue-600">{selectedRegistry.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Название:</span>
                    <span>{selectedRegistry.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Тип:</span>
                    <span>{selectedRegistry.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Создатель:</span>
                    <span>{selectedRegistry.creator}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Статистика</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Статус:</span>
                    <StatusBadge 
                      status={
                        selectedRegistry.status === 'completed' ? 'success' :
                        selectedRegistry.status === 'active' ? 'info' :
                        selectedRegistry.status === 'draft' ? 'warning' : 'secondary'
                      }
                    >
                      {selectedRegistry.status === 'completed' ? 'Завершен' :
                       selectedRegistry.status === 'active' ? 'Активный' :
                       selectedRegistry.status === 'draft' ? 'Черновик' : 'Архивный'}
                    </StatusBadge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Записей:</span>
                    <span className="font-semibold">{selectedRegistry.recordsCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Общая сумма:</span>
                    <span className="font-semibold text-green-600">{selectedRegistry.totalAmount.toLocaleString()} сом</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Последнее обновление:</span>
                    <span>{selectedRegistry.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Registry Content Preview */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Содержимое реестра</h3>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <div className="text-sm text-neutral-600 mb-3">
                  Превью первых 5 записей из {selectedRegistry.recordsCount.toLocaleString()} записей
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'PAY-001', applicant: 'Айбек Кыдыров', amount: 50000, status: 'Выплачено' },
                    { id: 'PAY-002', applicant: 'Нургуль Асанова', amount: 75000, status: 'Выплачено' },
                    { id: 'PAY-003', applicant: 'Марат Беков', amount: 60000, status: 'Выплачено' },
                    { id: 'PAY-004', applicant: 'Айгуль Токтосунова', amount: 80000, status: 'В обработке' },
                    { id: 'PAY-005', applicant: 'Эркин Садыков', amount: 45000, status: 'Ожидает' }
                  ].map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs text-blue-600">{record.id}</span>
                        <span className="text-sm">{record.applicant}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-semibold text-green-600">{record.amount.toLocaleString()} сом</span>
                        <StatusBadge 
                          status={
                            record.status === 'Выплачено' ? 'success' :
                            record.status === 'В обработке' ? 'warning' : 'info'
                          }
                        >
                          {record.status}
                        </StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Registry Actions */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Действия с реестром</h3>
              
              {/* First Row - Main Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center whitespace-nowrap">
                  <i className="ri-eye-line mr-2"></i>
                  Просмотр
                </button>
                <button className="border border-red-600 text-red-600 bg-white px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center whitespace-nowrap">
                  <i className="ri-download-line mr-2"></i>
                  Экспорт
                </button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center whitespace-nowrap">
                  <i className="ri-edit-line mr-2"></i>
                  Редактировать
                </button>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center whitespace-nowrap text-sm">
                  <i className="ri-share-line mr-2"></i>
                  Поделиться
                </a>
              </div>

              {/* Second Row - Status Actions */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center whitespace-nowrap">
                  <i className="ri-check-line mr-2"></i>
                  Завершить реестр
                </button>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center whitespace-nowrap">
                  <i className="ri-archive-line mr-2"></i>
                  Архивировать
                </button>
                <a href="#" className="text-red-600 hover:text-red-700 transition-colors flex items-center justify-center whitespace-nowrap text-sm">
                  <i className="ri-delete-bin-line mr-2"></i>
                  Удалить реестр
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Registry Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Создать новый реестр"
        size="lg"
      >
        <CreateRegistryForm onSubmit={handleCreateNewRegistry} />
      </Modal>

      {/* Duplicate Registry Modal */}
      <Modal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        title="Дублировать реестр"
        size="lg"
      >
        <DuplicateRegistryForm 
          registries={registries}
          onSubmit={handleDuplicateSelectedRegistry} 
        />
      </Modal>

      {/* Merge Registries Modal */}
      <Modal
        isOpen={showMergeModal}
        onClose={() => setShowMergeModal(false)}
        title="Объединить реестры"
        size="lg"
      >
        <MergeRegistriesForm 
          registries={registries}
          onSubmit={handleMergeSelectedRegistries} 
        />
      </Modal>

      {/* Auto Registries Modal */}
      <Modal
        isOpen={showAutoModal}
        onClose={() => setShowAutoModal(false)}
        title="Автоматические реестры"
        size="lg"
      >
        <AutoRegistriesForm onSubmit={handleCreateAutoRegistries} />
      </Modal>
    </div>
  );
}
