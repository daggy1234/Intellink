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

  if (!data.session) {
    return (
      <Link href="/login">
        <Button size="lg">Sign In</Button>
      </Link>
    );
  }

  const { data: user } = await supabase
    .from('Users')
    .select('*')
    .eq('user_id', data.session?.user.id || 'a');

  if (!user || user.length < 1) {
    return <Box>Error</Box>;
  }

  const profile = user[0];

  if (!profile || profile === undefined) {
    return <Box>Log In Again</Box>;
  }
  console.log(profile);

  const category = profile.category || 'Biology';

  const { data: posts } = await supabase
    .from('Post')
    .select('*')
    .eq('field', category);

  return (
    <PlatformLayout>
      <Flex>
        <Box>
          <Heading>Welcome, {profile.name}</Heading>
        </Box>
        <Spacer />
        <Link href="/create-post">
          <Button leftIcon={<FaPlus />} bg="brand.100">
            Create Request
          </Button>
        </Link>
      </Flex>
      <Divider />
      <Box>{posts?.length === 0 && <Heading>No Available Posts</Heading>}</Box>
      <Box>
        <SimpleGrid m={4} columns={[1, 2, 3]} spacing={3}>
          {posts?.length !== 0 &&
            posts.map((e) => (
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
            ))}
        </SimpleGrid>
      </Box>
    </PlatformLayout>
  );
}
