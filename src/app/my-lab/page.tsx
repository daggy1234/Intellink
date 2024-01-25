'use server';

import { Box } from '@chakra-ui/react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import type { Database } from '../../../database.types';
import MyPage from '../lab/[id]/page';
import PlatformLayout from '~/lib/layout/Platform';

export default async function Page() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    <Box>Log In</Box>;
  }

  const { data: user } = await supabase
    .from('Users')
    .select('*')
    .eq('user_id', data.session?.user.id || 'a');

  if (!user || user.length < 1) {
    <Box>Error</Box>;
  }

  return (
    <PlatformLayout>
      <Box>
        <MyPage params={{ id: user[0].lab_id }} />
      </Box>
    </PlatformLayout>
  );
}
