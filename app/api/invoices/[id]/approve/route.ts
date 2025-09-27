import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const invoiceId = params.id;

    // В реальном приложении здесь была бы обновление в базе данных
    const approvedInvoice = {
      id: invoiceId,
      status: 'APPROVED',
      approvedBy: body.approvedBy,
      approvedAt: new Date().toISOString(),
      notes: body.notes,
      updatedAt: new Date().toISOString()
    };

    console.log('Накладная утверждена:', approvedInvoice);

    return NextResponse.json({
      success: true,
      data: approvedInvoice,
      message: 'Накладная успешно утверждена'
    });
  } catch (error) {
    console.error('Ошибка утверждения накладной:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка утверждения накладной' },
      { status: 500 }
    );
  }
}
