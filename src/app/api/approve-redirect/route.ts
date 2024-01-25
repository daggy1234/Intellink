import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import type { Database } from '../../../../database.types';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  console.log(code);
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    });
    const resp = await supabase
      .from('Approvals')
      .update({
        approved: true,
      })
      .eq('id', parseInt(code, 10));
    console.log(resp);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/inbox`);
  }
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/`);
  // URL to redirect to after sign in process completes
}
