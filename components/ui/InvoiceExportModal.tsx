'use client';

import { useState, useEffect } from 'react';
import MobileOptimizedModal from './MobileOptimizedModal';
import AccessibleButton from './AccessibleButton';
import paymentService, { InvoiceData } from '@/lib/api/paymentService';

interface InvoiceExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPayments: any[];
  onExportComplete: () => void;
}

export default function InvoiceExportModal({ 
  isOpen, 
  onClose, 
  selectedPayments,
  onExportComplete 
}: InvoiceExportModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    departmentName: 'Управление социального развития по Октябрьскому административному району города Бишкек',
    purpose: 'На зачисление денежных средств на карточные счета получателей уй булоого комок в ЗАО «КИКБ»',
    companyAccount: '1280190090000142',
    valueDate: new Date().toISOString().split('T')[0],
    headName: 'Дурусалиев Т.Б.',
    accountantName: 'Эгембаева Д.Н.'
  });

  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isOpen && selectedPayments.length > 0) {
      generateInvoiceData();
    }
  }, [isOpen, selectedPayments]);

  const generateInvoiceData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const paymentIds = selectedPayments.map(p => p.id);
      const result = await paymentService.generateInvoiceData(
        paymentIds,
        formData.departmentName,
        formData.companyAccount,
        formData.valueDate,
        formData.headName,
        formData.accountantName
      );

      if (result.success && result.data) {
        setInvoiceData(result.data);
      } else {
        // Fallback: создаем данные вручную
        const totalAmount = selectedPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const invoice: InvoiceData = {
          id: `INV-${Date.now()}`,
          departmentName: formData.departmentName,
          purpose: formData.purpose,
          companyAccount: formData.companyAccount,
          valueDate: formData.valueDate,
          totalAmount,
          payments: selectedPayments.map((payment, index) => ({
            number: index + 1,
            fullName: payment.applicantName,
            accountNumber: payment.bankAccount,
            amount: payment.amount
          })),
          headName: formData.headName,
          accountantName: formData.accountantName
        };
        setInvoiceData(invoice);
      }
    } catch (error) {
      console.error('Ошибка генерации данных накладной:', error);
      setError('Ошибка генерации данных накладной');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!invoiceData) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await paymentService.exportInvoiceToPDF(invoiceData);
      if (result.success && result.data) {
        // Скачиваем файл
        const link = document.createElement('a');
        link.href = result.data.downloadUrl;
        link.download = `Сводная_ведомость_№8_${invoiceData.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        onExportComplete();
        handleClose();
      } else {
        // Fallback: создаем PDF вручную
        createFallbackPDF();
      }
    } catch (error) {
      console.error('Ошибка экспорта в PDF:', error);
      createFallbackPDF();
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = async () => {
    if (!invoiceData) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await paymentService.exportInvoiceToExcel(invoiceData);
      if (result.success && result.data) {
        // Скачиваем файл
        const link = document.createElement('a');
        link.href = result.data.downloadUrl;
        link.download = `Сводная_ведомость_№8_${invoiceData.id}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        onExportComplete();
        handleClose();
      } else {
        // Fallback: создаем Excel вручную
        createFallbackExcel();
      }
    } catch (error) {
      console.error('Ошибка экспорта в Excel:', error);
      createFallbackExcel();
    } finally {
      setIsLoading(false);
    }
  };

  const createFallbackPDF = () => {
    // Создаем простой PDF через window.print()
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generateHTMLContent());
      printWindow.document.close();
      printWindow.print();
    }
  };

  const createFallbackExcel = () => {
    // Создаем CSV файл
    if (!invoiceData) return;

    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Сводная_ведомость_№8_${invoiceData.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateHTMLContent = () => {
    if (!invoiceData) return '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Сводная ведомость №8</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
          .subtitle { font-size: 14px; margin-bottom: 20px; }
          .info { margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th, .table td { border: 1px solid #000; padding: 8px; text-align: left; }
          .table th { background-color: #f0f0f0; font-weight: bold; }
          .total { font-weight: bold; }
          .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
          .signature { text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Сводная ведомость №8</div>
          <div class="subtitle">${invoiceData.departmentName}</div>
        </div>
        
        <div class="info">
          <div><strong>Назначение:</strong> ${invoiceData.purpose}</div>
          <div><strong>Просим дебетовать счет компании №</strong> ${invoiceData.companyAccount}</div>
          <div><strong>Датой валютирования:</strong> ${new Date(invoiceData.valueDate).toLocaleDateString('ru-RU')}</div>
          <div><strong>На общую сумму:</strong> ${invoiceData.totalAmount.toLocaleString('ru-KG')},0</div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>№</th>
              <th>ФИО</th>
              <th>Расчетный счет</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.payments.map(payment => `
              <tr>
                <td>${payment.number}</td>
                <td>${payment.fullName}</td>
                <td>${payment.accountNumber}</td>
                <td>${payment.amount.toLocaleString('ru-KG')},0</td>
              </tr>
            `).join('')}
            <tr class="total">
              <td colspan="3">Итого:</td>
              <td>${invoiceData.totalAmount.toLocaleString('ru-KG')},0</td>
            </tr>
          </tbody>
        </table>

        <div class="signatures">
          <div class="signature">
            <div>Начальник</div>
            <div style="margin-top: 30px;">${invoiceData.headName}</div>
          </div>
          <div class="signature">
            <div>Главный бухгалтер</div>
            <div style="margin-top: 30px;">${invoiceData.accountantName}</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const generateCSVContent = () => {
    if (!invoiceData) return '';

    const rows = [
      ['Сводная ведомость №8'],
      [invoiceData.departmentName],
      [''],
      ['Назначение:', invoiceData.purpose],
      ['Просим дебетовать счет компании №', invoiceData.companyAccount],
      ['Датой валютирования:', new Date(invoiceData.valueDate).toLocaleDateString('ru-RU')],
      ['На общую сумму:', `${invoiceData.totalAmount.toLocaleString('ru-KG')},0`],
      [''],
      ['№', 'ФИО', 'Расчетный счет', 'Сумма']
    ];

    invoiceData.payments.forEach(payment => {
      rows.push([
        payment.number.toString(),
        payment.fullName,
        payment.accountNumber,
        `${payment.amount.toLocaleString('ru-KG')},0`
      ]);
    });

    rows.push(['', '', 'Итого:', `${invoiceData.totalAmount.toLocaleString('ru-KG')},0`]);
    rows.push(['']);
    rows.push(['Начальник', '', '', invoiceData.headName]);
    rows.push(['Главный бухгалтер', '', '', invoiceData.accountantName]);

    return rows.map(row => row.join(';')).join('\n');
  };

  const handleClose = () => {
    setInvoiceData(null);
    setShowPreview(false);
    setError(null);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <MobileOptimizedModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Выгрузка накладной (Сводная ведомость №8)" 
      size="xl"
    >
      <div className="space-y-6">
        {/* Информация о выбранных выплатах */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Выбранные выплаты
          </h3>
          <div className="text-sm text-blue-700">
            <div>Количество выплат: <strong>{selectedPayments.length}</strong></div>
            <div>Общая сумма: <strong>{selectedPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('ru-KG')} сом</strong></div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Форма настройки накладной */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Наименование управления *
            </label>
            <input
              type="text"
              value={formData.departmentName}
              onChange={(e) => handleInputChange('departmentName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Назначение платежа *
            </label>
            <textarea
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Счет компании *
              </label>
              <input
                type="text"
                value={formData.companyAccount}
                onChange={(e) => handleInputChange('companyAccount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата валютирования *
              </label>
              <input
                type="date"
                value={formData.valueDate}
                onChange={(e) => handleInputChange('valueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Начальник *
              </label>
              <input
                type="text"
                value={formData.headName}
                onChange={(e) => handleInputChange('headName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Главный бухгалтер *
              </label>
              <input
                type="text"
                value={formData.accountantName}
                onChange={(e) => handleInputChange('accountantName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Предварительный просмотр */}
        {invoiceData && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Предварительный просмотр</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div><strong>Общая сумма:</strong> {invoiceData.totalAmount.toLocaleString('ru-KG')},0 сом</div>
              <div><strong>Количество получателей:</strong> {invoiceData.payments.length}</div>
              <div><strong>Дата валютирования:</strong> {new Date(invoiceData.valueDate).toLocaleDateString('ru-RU')}</div>
            </div>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-neutral-200">
          <AccessibleButton
            onClick={handleClose}
            variant="ghost"
            size="md"
            disabled={isLoading}
            className="sm:w-auto w-full"
          >
            Отмена
          </AccessibleButton>
          
          <AccessibleButton
            onClick={generateInvoiceData}
            variant="secondary"
            size="md"
            disabled={isLoading}
            className="sm:w-auto w-full"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-line animate-spin mr-2"></i>
                Генерация...
              </>
            ) : (
              <>
                <i className="ri-refresh-line mr-2"></i>
                Обновить данные
              </>
            )}
          </AccessibleButton>

          <AccessibleButton
            onClick={handleExportPDF}
            variant="primary"
            size="md"
            disabled={isLoading || !invoiceData}
            className="sm:w-auto w-full"
          >
            <i className="ri-file-pdf-line mr-2"></i>
            Экспорт PDF
          </AccessibleButton>

          <AccessibleButton
            onClick={handleExportExcel}
            variant="success"
            size="md"
            disabled={isLoading || !invoiceData}
            className="sm:w-auto w-full"
          >
            <i className="ri-file-excel-line mr-2"></i>
            Экспорт Excel
          </AccessibleButton>
        </div>
      </div>
    </MobileOptimizedModal>
  );
}
