import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // В реальном приложении здесь была бы генерация PDF
    // Пока возвращаем mock URL для скачивания
    const downloadUrl = `/api/files/invoice-${Date.now()}.pdf`;

    console.log('PDF накладной сгенерирован:', {
      invoiceId: body.id,
      downloadUrl
    });

    return NextResponse.json({
      success: true,
      data: { downloadUrl }
    });
  } catch (error) {
    console.error('Ошибка экспорта накладной в PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка экспорта накладной в PDF' },
      { status: 500 }
    );
  }
}
