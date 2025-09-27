import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // В реальном приложении здесь была бы генерация Excel
    // Пока возвращаем mock URL для скачивания
    const downloadUrl = `/api/files/invoice-${Date.now()}.xlsx`;

    console.log('Excel накладной сгенерирован:', {
      invoiceId: body.id,
      downloadUrl
    });

    return NextResponse.json({
      success: true,
      data: { downloadUrl }
    });
  } catch (error) {
    console.error('Ошибка экспорта накладной в Excel:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка экспорта накладной в Excel' },
      { status: 500 }
    );
  }
}
