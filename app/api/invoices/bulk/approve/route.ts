import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceIds, approvedBy, notes } = body;

    // В реальном приложении здесь была бы массовое обновление в базе данных
    const result = {
      approved: invoiceIds.length,
      failed: 0,
      errors: []
    };

    console.log('Массовое утверждение накладных:', {
      invoiceIds,
      approvedBy,
      notes,
      result
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `Утверждено ${result.approved} накладных`
    });
  } catch (error) {
    console.error('Ошибка массового утверждения накладных:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка массового утверждения накладных' },
      { status: 500 }
    );
  }
}
