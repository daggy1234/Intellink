'use server';

import {
  Box,
  Button,
  Text,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
} from '@chakra-ui/react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

import type { Database } from '../../../database.types';
import PlatformLayout from '~/lib/layout/Platform';

export default async function Page() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const { data } = await supabase.auth.getSession();

  if (data.session) {
    <Box>Log In</Box>;
  }

  const { data: approvals } = await supabase
    .from('Approvals')
    .select('*')
    .eq('post_id', data.session?.user.id || 'a')
    .eq('approved', true);

  console.log(approvals);

  if (!approvals || approvals.length < 1) {
    <Box>No Matched Project yet</Box>;
  }

  return (
    <PlatformLayout>
      <Flex>
        <Box>
          <Heading>My Matched Projects</Heading>
        </Box>
        <Spacer />
        <Link href="/create-post">
          <Button leftIcon={<FaPlus />} bg="brand.100">
            Create Request
          </Button>
        </Link>
      </Flex>
      <Divider />
      <Box>
        {approvals?.length === 0 && <Heading>No Posts have matches</Heading>}
      </Box>
      <Box>
        <SimpleGrid m={4} columns={[1, 2, 3]} spacing={3}>
          {approvals?.length !== 0 &&
            approvals.map(async (f) => {
              const { data: pdat } = await supabase
                .from('Post')
                .select('*')
                .eq('post_id', f.post_author);
              const e = pdat[0];
              return (
                <Box key={e.title} p={4} rounded="lg" border="2px solid white">
                  <Link
                    key={e.title}
                    href={`${process.env.NEXT_PUBLIC_URL}/post/${e.post_id}`}
                  >
                    <Heading size="lg">{e.title}</Heading>
                    <Text>{e.request}</Text>
                  </Link>
                  <Flex>
                    <Link
                      key={e.title}
                      href={`${process.env.NEXT_PUBLIC_URL}/post/${e.post_id}`}
                    >
                      <Button bg="brand.300">Learn more</Button>
                    </Link>
                  </Flex>
                </Box>
              );
            })}
        </SimpleGrid>
      </Box>
    </PlatformLayout>
  );
}
