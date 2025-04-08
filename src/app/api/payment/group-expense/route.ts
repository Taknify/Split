import { NextRequest, NextResponse } from 'next/server';
import { processGroupExpense } from '../../../../lib/stripe/groupPaymentFlow';

export async function POST(req: NextRequest) {
  try {
    const {
      expenseId,
      groupId,
      title,
      totalAmount,
      participants
    } = await req.json();
    
    // Validate request
    if (!expenseId || !groupId || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json({ error: 'At least one participant is required' }, { status: 400 });
    }
    
    // Validate participants
    for (const participant of participants) {
      if (!participant.id || !participant.paymentMethodId || !participant.amount) {
        return NextResponse.json({ 
          error: 'Each participant must have id, paymentMethodId, and amount' 
        }, { status: 400 });
      }
      
      if (isNaN(participant.amount) || participant.amount <= 0) {
        return NextResponse.json({ 
          error: 'Each participant amount must be greater than 0' 
        }, { status: 400 });
      }
    }
    
    // Calculate total from participants to verify it matches provided total
    const calculatedTotal = participants.reduce((sum, p) => sum + p.amount, 0);
    
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) { // Allow for small rounding differences
      return NextResponse.json({ 
        error: `Sum of participant amounts (${calculatedTotal}) doesn't match total amount (${totalAmount})` 
      }, { status: 400 });
    }
    
    // Process the group expense
    const result = await processGroupExpense({
      id: expenseId,
      groupId,
      title,
      totalAmount,
      participants
    });
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Group expense processing error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}