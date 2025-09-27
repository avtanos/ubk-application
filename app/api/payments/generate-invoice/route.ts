import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Генерируем данные накладной
    const invoiceData = {
      id: `INV-${Date.now()}`,
      departmentName: body.departmentName || 'Управление социального развития по Октябрьскому административному району города Бишкек',
      purpose: body.purpose || 'На зачисление денежных средств на карточные счета получателей уй булоого комок в ЗАО «КИКБ»',
      companyAccount: body.companyAccount || '1280190090000142',
      valueDate: body.valueDate || new Date().toISOString().split('T')[0],
      totalAmount: body.totalAmount || 0,
      payments: body.payments || [],
      headName: body.headName || 'Дурусалиев Т.Б.',
      accountantName: body.accountantName || 'Эгембаева Д.Н.'
    };

    console.log('Данные накладной сгенерированы:', invoiceData);

    return NextResponse.json({
      success: true,
      data: invoiceData
    });
  } catch (error) {
    console.error('Ошибка генерации данных накладной:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка генерации данных накладной' },
      { status: 500 }
    );
  }
}
