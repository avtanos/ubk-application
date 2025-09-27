import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceIds, rejectedBy, rejectionReason, notes } = body;

    // В реальном приложении здесь была бы массовое обновление в базе данных
    const result = {
      rejected: invoiceIds.length,
      failed: 0,
      errors: []
    };

    console.log('Массовое отклонение накладных:', {
      invoiceIds,
      rejectedBy,
      rejectionReason,
      notes,
      result
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `Отклонено ${result.rejected} накладных`
    });
  } catch (error) {
    console.error('Ошибка массового отклонения накладных:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка массового отклонения накладных' },
      { status: 500 }
    );
  }
}
