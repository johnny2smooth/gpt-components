import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return new Response('Hello, Next.js!');
}

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { prompt, blob } = await request.json();

  const fileName = generateUniqueFileName(prompt);

  const { data, error } = await supabase.storage
    .from('friend-drawings')
    .upload(fileName, blob, { contentType: 'image/png' });
  if (error) {
    return new Response('Error:' + error.message);
  }

  return NextResponse.json(data);
}

function generateUniqueFileName(prompt: string) {
  const timestamp = new Date().toISOString();
  const randomString = Math.random().toString(36).slice(2, 9);
  return `${prompt.split(' ').join('-')}-${timestamp}-${randomString}.png`;
}
