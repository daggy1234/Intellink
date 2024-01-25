'use server';

import { Box } from '@chakra-ui/react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import type { Database } from '../../../database.types';
import MyPage from '../user/[id]/page';
import PlatformLayout from '~/lib/layout/Platform';

export default async function Page() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const { data } = await supabase.auth.getSession();

  if (data.session) {
    <Box>Log In</Box>;
  }

  return (
    <PlatformLayout>
      <Box>
        <MyPage params={{ id: data.session?.user.id || 'Error' }} />
      </Box>
    </PlatformLayout>
  );
}
