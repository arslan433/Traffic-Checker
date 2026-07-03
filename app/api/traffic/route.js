import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 });
    }

    const url = 'https://similarweb-api1.p.rapidapi.com/v1/visitsInfo';
    
    const options = {
      method: 'POST', // The external API requires POST
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '727b64d020mshaeb7d23253d9d8ap1433edjsn34f70c3f9a7a',
        'x-rapidapi-host': process.env.RAPIDAPI_HOST || 'similarweb-api1.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: domain.trim() }) 
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      return NextResponse.json(
        { error: `RapidAPI responded with status: ${response.status}` }, 
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error("Internal Server Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
