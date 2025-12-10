
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: {params: any}
) {
  
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const { code, year, semester } = await context.params;

  try {
    const response = await fetch(`${BASE_URL}/api/${code}/${year}/${semester}`);
    if (!response.ok) {
      return NextResponse.json({ error: 'Backend request failed' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

