'use server';

import { Box, Heading, Spacer, Text, Flex, Button } from '@chakra-ui/react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

import type { Database } from '../../../database.types';
import PlatformLayout from '~/lib/layout/Platform';

export default async function Page() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    <Box>Log In</Box>;
  }

  console.log(data.session?.user.id);

  const { data: approvals } = await supabase
    .from('Approvals')
    .select('*')
    .eq('post_id', data.session?.user.id || 'a')
    .eq('approved', false);

  if (!approvals || approvals.length < 1) {
    return (
      <PlatformLayout>
        <Heading>Nothing to approve yet!</Heading>
      </PlatformLayout>
    );
  }

  console.log(approvals);

  const newData = approvals?.map(async (f) => {
    const requestProfile = await supabase
      .from('Users')
      .select('*')
      .eq('user_id', f.request_author);
    return {
      post_id: f.post_id,
      requestor: requestProfile.data[0],
      created: f.created_at,
      id: f.id,
      note: f.note,
    };
  });

  return (
    <PlatformLayout>
      <Box>
        {approvals?.map((i) => (
          <Box key={i.id}>
            <Box>
              {newData?.map(async (g, ind) => {
                const promis = await g;
                return (
                  <Box
                    rounded="lg"
                    p={4}
                    border="2px solid white"
                    key={promis.id}
                  >
                    <Flex>
                      <Flex direction="column">
                        <Heading size="lg">{promis.requestor.name}</Heading>
                        <Text>
                          {promis.requestor.interests},{' '}
                          {promis.requestor.position}
                        </Text>
                      </Flex>
                      <Spacer />
                      <Flex direction="column">
                        <Link
                          href={`/user/${promis.requestor.user_id}`}
                          color="blue.100"
                        >
                          <Button>Profile Url</Button>
                        </Link>
                        <Link href={`/post/${promis.post_id}`} color="blue.100">
                          <Button my={1}>Post</Button>
                        </Link>
                        <Link href={promis.requestor.CV} color="blue.100">
                          <Button my={1}>CV</Button>
                        </Link>
                      </Flex>
                    </Flex>
                    <Text my={2}>{promis.note}</Text>
                    <Link
                      href={`/api/approve-redirect?code=${approvals[ind].id}`}
                    >
                      <Button colorScheme="green">Approve</Button>
                    </Link>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </PlatformLayout>
  );
}
