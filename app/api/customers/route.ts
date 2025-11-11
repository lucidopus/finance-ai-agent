import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Customer } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const analystEmail = searchParams.get('analyst');

    if (!analystEmail) {
      return NextResponse.json({ error: 'Analyst email required' }, { status: 400 });
    }

    const db = await getDatabase();
    const customers = await db
      .collection<Customer>('customers')
      .find({ assignedTo: analystEmail })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}