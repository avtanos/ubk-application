import StatusBadge from '@/components/ui/StatusBadge';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ];
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = {
    id: id,
    applicantName: 'Айбек Кыдыров',
    status: 'under_review',
    submittedDate: '2024-01-15',
    amount: 50000,
    type: 'Первичная заявка'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Детали заявки</h1>
          <p className="text-neutral-600 mt-1">Информация о вашей заявке #{application.id}</p>
        </div>
        <StatusBadge 
          status="info"
          text="На рассмотрении"
        />
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Информация о заявке</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-600">ФИО заявителя</p>
            <p className="font-semibold">{application.applicantName}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-600">Тип заявки</p>
            <p className="font-semibold">{application.type}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-600">Дата подачи</p>
            <p className="font-semibold">{application.submittedDate}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-600">Сумма выплаты</p>
            <p className="font-semibold text-green-600">{application.amount.toLocaleString()} сом</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Действия</h3>
        <div className="flex space-x-3">
          <button className="btn-primary">
            <i className="ri-edit-line mr-2"></i>
            Редактировать заявку
          </button>
          <button className="btn-secondary">
            <i className="ri-download-line mr-2"></i>
            Скачать заявку
          </button>
        </div>
      </div>
    </div>
  );
}