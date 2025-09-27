import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const invoiceId = params.id;

    // В реальном приложении здесь была бы обновление в базе данных
    const rejectedInvoice = {
      id: invoiceId,
      status: 'REJECTED',
      rejectedBy: body.rejectedBy,
      rejectedAt: new Date().toISOString(),
      rejectionReason: body.rejectionReason,
      notes: body.notes,
      updatedAt: new Date().toISOString()
    };

    console.log('Накладная отклонена:', rejectedInvoice);

    return NextResponse.json({
      success: true,
      data: rejectedInvoice,
      message: 'Накладная отклонена'
    });
  } catch (error) {
    console.error('Ошибка отклонения накладной:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка отклонения накладной' },
      { status: 500 }
    );
  }
}
