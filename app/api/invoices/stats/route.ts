import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock статистика
    const stats = {
      total: 15,
      pending: 8,
      approved: 5,
      rejected: 2,
      totalAmount: 450000,
      byRegion: [
        { region: 'Бишкек', count: 5, amount: 180000 },
        { region: 'Ош', count: 4, amount: 120000 },
        { region: 'Нарын', count: 3, amount: 90000 },
        { region: 'Джалал-Абад', count: 2, amount: 60000 },
        { region: 'Иссык-Куль', count: 1, amount: 30000 }
      ]
    };

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Ошибка получения статистики накладных:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка получения статистики' },
      { status: 500 }
    );
  }
}
