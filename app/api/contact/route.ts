import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(20).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      );
    }

    // TODO: Integrate with actual email service (Resend, SendGrid, etc.)
    // For now, log to console and return success
    console.log('Contact form submission:', {
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message.substring(0, 100) + '...',
      timestamp: new Date().toISOString(),
    });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
