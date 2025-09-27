import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

// Mock данные для директора
const mockInvoices = [
  {
    id: 'INV-001',
    invoiceData: {
      id: 'INV-001',
      departmentName: 'Управление социального развития по Октябрьскому административному району города Бишкек',
      purpose: 'На зачисление денежных средств на карточные счета получателей уй булоого комок в ЗАО «КИКБ»',
      companyAccount: '1280190090000142',
      valueDate: '2025-01-25',
      totalAmount: 63600,
      payments: [
        { number: 1, fullName: 'Гүлнара Осмонова', accountNumber: '1234567890123456', amount: 4140 },
        { number: 2, fullName: 'Жамиля Турдубекова', accountNumber: '2345678901234567', amount: 3880 },
        { number: 3, fullName: 'Асель Маматова', accountNumber: '3456789012345678', amount: 2400 }
      ],
      headName: 'Дурусалиев Т.Б.',
      accountantName: 'Эгембаева Д.Н.'
    },
    submittedBy: 1,
    submittedAt: '2025-01-20T10:00:00Z',
    status: 'PENDING',
    region: 'Бишкек',
    departmentName: 'Управление социального развития по Октябрьскому административному району города Бишкек',
    totalAmount: 63600,
    paymentCount: 3,
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-01-20T10:00:00Z'
  },
  {
    id: 'INV-002',
    invoiceData: {
      id: 'INV-002',
      departmentName: 'Управление социального развития по Ошской области',
      purpose: 'На зачисление денежных средств на карточные счета получателей уй булоого комок в ЗАО «КИКБ»',
      companyAccount: '1280190090000142',
      valueDate: '2025-01-25',
      totalAmount: 45000,
      payments: [
        { number: 1, fullName: 'Айжан Абдуллаева', accountNumber: '4567890123456789', amount: 3600 },
        { number: 2, fullName: 'Бурул Эркебекова', accountNumber: '5678901234567890', amount: 1380 }
      ],
      headName: 'Абдыраимов А.К.',
      accountantName: 'Токтобекова С.М.'
    },
    submittedBy: 2,
    submittedAt: '2025-01-19T14:30:00Z',
    status: 'APPROVED',
    region: 'Ош',
    departmentName: 'Управление социального развития по Ошской области',
    totalAmount: 45000,
    paymentCount: 2,
    approvedBy: 1,
    approvedAt: '2025-01-21T09:15:00Z',
    createdAt: '2025-01-19T14:30:00Z',
    updatedAt: '2025-01-21T09:15:00Z'
  },
  {
    id: 'INV-003',
    invoiceData: {
      id: 'INV-003',
      departmentName: 'Управление социального развития по Нарынской области',
      purpose: 'На зачисление денежных средств на карточные счета получателей уй булоого комок в ЗАО «КИКБ»',
      companyAccount: '1280190090000142',
      valueDate: '2025-01-25',
      totalAmount: 32000,
      payments: [
        { number: 1, fullName: 'Нургул Кыдырбекова', accountNumber: '6789012345678901', amount: 2800 }
      ],
      headName: 'Мамбетов К.А.',
      accountantName: 'Асанова Г.Т.'
    },
    submittedBy: 3,
    submittedAt: '2025-01-18T16:45:00Z',
    status: 'REJECTED',
    region: 'Нарын',
    departmentName: 'Управление социального развития по Нарынской области',
    totalAmount: 32000,
    paymentCount: 1,
    rejectedBy: 1,
    rejectedAt: '2025-01-20T11:20:00Z',
    rejectionReason: 'Неверные данные получателей',
    createdAt: '2025-01-18T16:45:00Z',
    updatedAt: '2025-01-20T11:20:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const region = searchParams.get('region');

    // Фильтрация данных
    let filteredInvoices = [...mockInvoices];

    if (status) {
      const statusArray = status.split(',');
      filteredInvoices = filteredInvoices.filter(invoice => 
        statusArray.includes(invoice.status)
      );
    }

    if (region) {
      const regionArray = region.split(',');
      filteredInvoices = filteredInvoices.filter(invoice => 
        regionArray.includes(invoice.region)
      );
    }

    // Пагинация
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        data: paginatedInvoices,
        total: filteredInvoices.length,
        page,
        limit,
        totalPages: Math.ceil(filteredInvoices.length / limit)
      }
    });
  } catch (error) {
    console.error('Ошибка получения накладных:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка получения накладных' },
      { status: 500 }
    );
  }
}
