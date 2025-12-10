import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  
  try {
    const response = await fetch(`${BASE_URL}/api/codes`);
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({error: 'Failed to fetch codes'}, {status: 500})
  }

}

