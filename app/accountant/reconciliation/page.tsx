'use client';

import { useState, useEffect } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';

export default function ReconciliationPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedDuplicates, setSelectedDuplicates] = useState<any[]>([]);
  const [showDuplicateDetailsModal, setShowDuplicateDetailsModal] = useState(false);
  const [selectedDuplicate, setSelectedDuplicate] = useState<any>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [duplicates, setDuplicates] = useState<any[]>([]);

  // Функции для работы с дубликатами
  const handleSelectDuplicate = (duplicate: any, checked: boolean) => {
    if (checked) {
      setSelectedDuplicates([...selectedDuplicates, duplicate]);
    } else {
      setSelectedDuplicates(selectedDuplicates.filter(d => d.id !== duplicate.id));
    }
  };

  const handleSelectAllDuplicates = () => {
    setSelectedDuplicates([...duplicates]);
  };

  const handleDeselectAllDuplicates = () => {
    setSelectedDuplicates([]);
  };

  const handleBulkAction = (action: string, duplicateIds: string[]) => {
    switch (action) {
      case 'resolve':
        console.log('Разрешение дубликатов:', duplicateIds);
        alert(`Разрешение ${duplicateIds.length} дубликатов...`);
        break;
      case 'cancel':
        console.log('Отмена дубликатов:', duplicateIds);
        alert(`Отмена ${duplicateIds.length} дубликатов...`);
        break;
      case 'export':
        console.log('Экспорт дубликатов:', duplicateIds);
        alert(`Экспорт ${duplicateIds.length} дубликатов...`);
        break;
    }
    
    // Очищаем выбор после действия
    setSelectedDuplicates([]);
  };

  // Функции для сканирования дубликатов
  const handleStartScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Имитация процесса сканирования
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setScanProgress(i);
    }
    
    setIsScanning(false);
    // Обновляем список дубликатов после сканирования
    setDuplicates(mockDuplicates);
  };

  const handleViewDuplicateDetails = (duplicate: any) => {
    setSelectedDuplicate(duplicate);
    setShowDuplicateDetailsModal(true);
  };

  const handleResolveDuplicate = (duplicate: any) => {
    setSelectedDuplicate(duplicate);
    setShowResolveModal(true);
  };

  const handleResolveSubmit = (formData: any) => {
    console.log('Разрешение дубликата:', formData);
    alert(`Дубликат ${formData.duplicateId} разрешен: ${formData.action}`);
    setShowResolveModal(false);
    setSelectedDuplicate(null);
  };

  // Мокап данные для дубликатов
  const mockDuplicates = [
    {
      id: 'DUP-001',
      applicantName: 'Айбек Кыдыров',
      applicantPin: '12345678901234',
      invoiceId: 'INV-2024-001',
      applicationId: 'APP-2024-001',
      duplicatePayments: [
        { 
          id: 'PAY-001', 
          amount: 50000, 
          date: '2024-01-15', 
          status: 'completed',
          bankTransactionId: 'TXN-001',
          paymentMethod: 'bank_transfer'
        },
        { 
          id: 'PAY-045', 
          amount: 50000, 
          date: '2024-01-16', 
          status: 'completed',
          bankTransactionId: 'TXN-045',
          paymentMethod: 'bank_transfer'
        }
      ],
      totalDuplicateAmount: 100000,
      severity: 'high',
      detectedDate: '2024-01-17',
      status: 'pending'
    },
    {
      id: 'DUP-002',
      applicantName: 'Нургуль Асанова',
      applicantPin: '12345678901235',
      invoiceId: 'INV-2024-002',
      applicationId: 'APP-2024-002',
      duplicatePayments: [
        { 
          id: 'PAY-002', 
          amount: 75000, 
          date: '2024-01-14', 
          status: 'completed',
          bankTransactionId: 'TXN-002',
          paymentMethod: 'bank_transfer'
        },
        { 
          id: 'PAY-067', 
          amount: 75000, 
          date: '2024-01-15', 
          status: 'processing',
          bankTransactionId: 'TXN-067',
          paymentMethod: 'bank_transfer'
        }
      ],
      totalDuplicateAmount: 150000,
      severity: 'medium',
      detectedDate: '2024-01-16',
      status: 'investigating'
    },
    {
      id: 'DUP-003',
      applicantName: 'Марат Беков',
      applicantPin: '12345678901236',
      invoiceId: 'INV-2024-003',
      applicationId: 'APP-2024-003',
      duplicatePayments: [
        { 
          id: 'PAY-003', 
          amount: 60000, 
          date: '2024-01-13', 
          status: 'completed',
          bankTransactionId: 'TXN-003',
          paymentMethod: 'bank_transfer'
        },
        { 
          id: 'PAY-089', 
          amount: 60000, 
          date: '2024-01-14', 
          status: 'completed',
          bankTransactionId: 'TXN-089',
          paymentMethod: 'bank_transfer'
        },
        { 
          id: 'PAY-123', 
          amount: 60000, 
          date: '2024-01-15', 
          status: 'pending',
          bankTransactionId: 'TXN-123',
          paymentMethod: 'bank_transfer'
        }
      ],
      totalDuplicateAmount: 180000,
      severity: 'critical',
      detectedDate: '2024-01-16',
      status: 'pending'
    },
    {
      id: 'DUP-004',
      applicantName: 'Айгуль Токтоева',
      applicantPin: '12345678901237',
      invoiceId: 'INV-2024-004',
      applicationId: 'APP-2024-004',
      duplicatePayments: [
        { 
          id: 'PAY-004', 
          amount: 45000, 
          date: '2024-01-12', 
          status: 'completed',
          bankTransactionId: 'TXN-004',
          paymentMethod: 'bank_transfer'
        },
        { 
          id: 'PAY-156', 
          amount: 45000, 
          date: '2024-01-13', 
          status: 'completed',
          bankTransactionId: 'TXN-156',
          paymentMethod: 'bank_transfer'
        }
      ],
      totalDuplicateAmount: 90000,
      severity: 'medium',
      detectedDate: '2024-01-15',
      status: 'resolved'
    }
  ];

  // Метрики для сверки
  const metrics = [
    {
      title: 'Утвержденных выплат',
      value: '2,456',
      change: '+12%',
      changeType: 'positive' as const,
      icon: <i className="ri-money-dollar-circle-line"></i>
    },
    {
      title: 'На проверке дубликатов',
      value: '156',
      change: '+8%',
      changeType: 'positive' as const,
      icon: <i className="ri-search-line"></i>
    },
    {
      title: 'Найдено дубликатов',
      value: duplicates.length.toString(),
      change: '+3',
      changeType: 'positive' as const,
      icon: <i className="ri-alert-line"></i>
    },
    {
      title: 'Разрешенных дубликатов',
      value: duplicates.filter(d => d.status === 'resolved').length.toString(),
      change: '+2',
      changeType: 'positive' as const,
      icon: <i className="ri-check-line"></i>
    }
  ];

  // Колонки для таблицы дубликатов
  const columns = [
    {
      key: 'select',
      label: 'Выбор',
      render: (value: any, row: any) => (
        <input
          type="checkbox"
          checked={selectedDuplicates.some(d => d.id === row.id)}
          onChange={(e) => handleSelectDuplicate(row, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
        />
      )
    },
    {
      key: 'id',
      label: 'ID дубликата',
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600">{value}</span>
      )
    },
    {
      key: 'applicantName',
      label: 'Заявитель',
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500 font-mono">{row.applicantPin}</div>
        </div>
      )
    },
    {
      key: 'invoiceId',
      label: 'Накладная',
      render: (value: string) => (
        <span className="font-mono text-sm text-green-600">{value}</span>
      )
    },
    {
      key: 'duplicatePayments',
      label: 'Количество дубликатов',
      render: (value: any[]) => (
        <span className="font-semibold text-red-600">{value.length}</span>
      )
    },
    {
      key: 'totalDuplicateAmount',
      label: 'Сумма дубликатов',
      render: (value: number) => (
        <span className="font-semibold text-red-600">{value.toLocaleString()} сом</span>
      )
    },
    {
      key: 'severity',
      label: 'Критичность',
      render: (value: string) => (
        <StatusBadge
          status={
            value === 'critical' ? 'error' :
            value === 'high' ? 'error' :
            value === 'medium' ? 'warning' : 'info'
          }
        >
          {value === 'critical' ? 'Критический' :
           value === 'high' ? 'Высокий' :
           value === 'medium' ? 'Средний' : 'Низкий'}
        </StatusBadge>
      )
    },
    {
      key: 'status',
      label: 'Статус',
      render: (value: string) => (
        <StatusBadge
          status={
            value === 'resolved' ? 'success' :
            value === 'investigating' ? 'warning' :
            value === 'pending' ? 'error' : 'info'
          }
        >
          {value === 'resolved' ? 'Разрешено' :
           value === 'investigating' ? 'Расследуется' :
           value === 'pending' ? 'Ожидает' : 'Неизвестно'}
        </StatusBadge>
      )
    },
    {
      key: 'detectedDate',
      label: 'Обнаружено',
      render: (value: string) => (
        <span className="text-sm">{new Date(value).toLocaleDateString('ru-RU')}</span>
      )
    }
  ];

  // Инициализация данных
  useEffect(() => {
    setDuplicates(mockDuplicates);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Сверка по заявкам</h1>
          <p className="text-neutral-600 mt-1">Проверка дубликатов утвержденных выплат</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Последние 7 дней</option>
            <option value="30d">Последние 30 дней</option>
            <option value="90d">Последние 90 дней</option>
            <option value="1y">Последний год</option>
          </select>
          <button 
            onClick={handleStartScan}
            disabled={isScanning}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <i className="ri-loader-line animate-spin mr-2"></i>
                Сканирование... {scanProgress}%
              </>
            ) : (
              <>
                <i className="ri-search-line mr-2"></i>
                Сканировать дубликаты
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isScanning && (
        <div className="card">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Сканирование в процессе</h3>
            <p className="text-neutral-600">Проверка выплат на наличие дубликатов...</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {scanProgress}% завершено
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Duplicates Table */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Обнаруженные дубликаты</h3>
          <p className="text-neutral-600 mt-1">Список дублирующихся выплат, требующих внимания</p>
        </div>
        
        {/* Mass Actions */}
        {selectedDuplicates.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  Выбрано: {selectedDuplicates.length} дубликатов
                </span>
                <button
                  onClick={handleDeselectAllDuplicates}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Снять выделение
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('resolve', selectedDuplicates.map(d => d.id))}
                  className="btn-success text-sm"
                >
                  <i className="ri-check-line mr-1"></i>
                  Разрешить все
                </button>
                <button
                  onClick={() => handleBulkAction('cancel', selectedDuplicates.map(d => d.id))}
                  className="btn-danger text-sm"
                >
                  <i className="ri-close-line mr-1"></i>
                  Отменить все
                </button>
                <button
                  onClick={() => handleBulkAction('export', selectedDuplicates.map(d => d.id))}
                  className="btn-info text-sm"
                >
                  <i className="ri-download-line mr-1"></i>
                  Экспорт
                </button>
              </div>
            </div>
          </div>
        )}
        
        <DataTable
          data={duplicates}
          columns={columns}
          searchable={true}
          sortable={true}
          actions={[
            {
              label: 'Детали',
              icon: 'ri-eye-line',
              onClick: handleViewDuplicateDetails,
              className: 'btn-primary text-sm'
            }
          ]}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <button 
              onClick={handleStartScan}
              disabled={isScanning}
              className="w-full btn-primary text-left disabled:opacity-50"
            >
              <i className="ri-search-line mr-2"></i>
              Запустить сканирование дубликатов
            </button>
            <button 
              onClick={() => handleBulkAction('export', duplicates.map(d => d.id))}
              className="w-full btn-secondary text-left"
            >
              <i className="ri-download-line mr-2"></i>
              Экспорт всех дубликатов
            </button>
            <button 
              onClick={() => setDuplicates(duplicates.filter(d => d.status !== 'resolved'))}
              className="w-full btn-warning text-left"
            >
              <i className="ri-eye-line mr-2"></i>
              Показать только неразрешенные
            </button>
            <button 
              onClick={() => setDuplicates(mockDuplicates)}
              className="w-full btn-info text-left"
            >
              <i className="ri-refresh-line mr-2"></i>
              Обновить список
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Статистика дубликатов</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Обнаружено сегодня</span>
              <span className="font-semibold text-blue-600">2 дубликата</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Критических</span>
              <span className="font-semibold text-red-600">1 дубликат</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Разрешено</span>
              <span className="font-semibold text-green-600">1 дубликат</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Общая сумма дубликатов</span>
              <span className="font-semibold text-orange-600">520,000 сом</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showDuplicateDetailsModal}
        onClose={() => {
          setShowDuplicateDetailsModal(false);
          setSelectedDuplicate(null);
        }}
        title="Детали дубликата"
        size="large"
      >
        {selectedDuplicate && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Дубликат {selectedDuplicate.id}
              </h3>
              <p className="text-neutral-600">
                Заявитель: {selectedDuplicate.applicantName} ({selectedDuplicate.applicantPin})
              </p>
              <p className="text-neutral-600">
                Накладная: {selectedDuplicate.invoiceId}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-neutral-900 mb-3">Дублирующиеся выплаты:</h4>
              <div className="space-y-3">
                {selectedDuplicate.duplicatePayments.map((payment: any, index: number) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-sm text-blue-600">{payment.id}</span>
                        <span className="font-semibold">{payment.amount.toLocaleString()} сом</span>
                        <span className="text-sm text-neutral-600">{payment.date}</span>
                      </div>
                      <StatusBadge 
                        status={
                          payment.status === 'completed' ? 'success' :
                          payment.status === 'processing' ? 'warning' : 'info'
                        }
                        text={
                          payment.status === 'completed' ? 'Выплачено' :
                          payment.status === 'processing' ? 'В обработке' : 'Ожидает'
                        }
                      />
                    </div>
                    <div className="text-sm text-neutral-600">
                      <div>Банковская транзакция: {payment.bankTransactionId}</div>
                      <div>Способ оплаты: {payment.paymentMethod === 'bank_transfer' ? 'Банковский перевод' : payment.paymentMethod}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-neutral-600">Общая сумма дубликатов:</span>
                  <span className="ml-2 font-semibold text-red-600 text-lg">
                    {selectedDuplicate.totalDuplicateAmount.toLocaleString()} сом
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowDuplicateDetailsModal(false);
                      handleResolveDuplicate(selectedDuplicate);
                    }}
                    className="btn-success"
                  >
                    <i className="ri-check-line mr-2"></i>
                    Разрешить
                  </button>
                  <button
                    onClick={() => setShowDuplicateDetailsModal(false)}
                    className="btn-secondary"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showResolveModal}
        onClose={() => {
          setShowResolveModal(false);
          setSelectedDuplicate(null);
        }}
        title="Разрешение дубликата"
        size="medium"
      >
        {selectedDuplicate && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Разрешение дубликата {selectedDuplicate.id}
              </h3>
              <p className="text-neutral-600">
                Заявитель: {selectedDuplicate.applicantName}
              </p>
              <p className="text-neutral-600">
                Сумма дубликатов: {selectedDuplicate.totalDuplicateAmount.toLocaleString()} сом
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleResolveSubmit({
                duplicateId: selectedDuplicate.id,
                action: formData.get('action'),
                comment: formData.get('comment')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Действие
                  </label>
                  <select
                    name="action"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Выберите действие</option>
                    <option value="cancel_duplicates">Отменить дублирующиеся выплаты</option>
                    <option value="keep_first">Оставить первую выплату</option>
                    <option value="keep_last">Оставить последнюю выплату</option>
                    <option value="manual_review">Требует ручной проверки</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Комментарий
                  </label>
                  <textarea
                    name="comment"
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Опишите причину и детали разрешения..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="btn-secondary"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <i className="ri-check-line mr-2"></i>
                  Разрешить дубликат
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}