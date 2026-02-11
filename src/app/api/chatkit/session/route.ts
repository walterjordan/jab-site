import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    // In production, use the authenticated user's ID
    const userId = body.user || 'anonymous-user-' + Math.random().toString(36).substring(7);

    // Create a ChatKit session using raw fetch for beta compatibility
    const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'chatkit_beta=v1' // Crucial for beta features
      },
      body: JSON.stringify({
        workflow: { id: "wf_68e743989d5c8190a8c280ad0d8294020570452e93a556d1" },
        user: userId
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create session');
    }

    const session = await response.json();
    return NextResponse.json({ client_secret: session.client_secret });
  } catch (error: any) {
    console.error('Error creating ChatKit session:', error);
    return NextResponse.json(
      { error: 'Failed to create session', details: error.message },
      { status: 500 }
    );
  }
}
