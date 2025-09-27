import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Генерируем ID накладной
    const invoiceId = `INV-${Date.now()}`;
    
    // Создаем накладную
    const invoice = {
      id: invoiceId,
      invoiceData: body.invoiceData,
      submittedBy: body.submittedBy,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
      region: body.region,
      departmentName: body.departmentName,
      totalAmount: body.invoiceData.totalAmount,
      paymentCount: body.invoiceData.payments.length,
      notes: body.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // В реальном приложении здесь была бы запись в базу данных
    console.log('Накладная отправлена на утверждение:', invoice);

    return NextResponse.json({
      success: true,
      data: invoice,
      message: 'Накладная успешно отправлена на утверждение'
    });
  } catch (error) {
    console.error('Ошибка отправки накладной:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка отправки накладной' },
      { status: 500 }
    );
  }
}
