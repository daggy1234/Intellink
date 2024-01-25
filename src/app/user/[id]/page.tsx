'use server';

// pages/users/[id]/page.tsx
import {
  Box,
  Divider,
  Heading,
  Link,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import type { Database } from '../../../../database.types';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  if (!id) {
    return <Heading>Invalid ID</Heading>;
  }

  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('user_id', id?.toString());

  if (error) {
    return <Heading>Error</Heading>;
  }

  if (data.length === 0) {
    return <Heading>User Does not Exist</Heading>;
  }

  const user = data[0];

  return (
    <Box>
      <Heading>User Profile</Heading>
      <SimpleGrid my={4} columns={[1, 2, 3]} spacing={3}>
        <Box>
          <Text fontSize="large" fontWeight="bold">
            Name
          </Text>
          <Divider />
          <Text>{user.name}</Text>
        </Box>
        <Box>
          <Text fontSize="large" fontWeight="bold">
            Gender
          </Text>
          <Divider />
          <Text>{user.gender}</Text>
        </Box>
        <Box>
          <Text fontSize="large" fontWeight="bold">
            Field
          </Text>
          <Divider />
          <Text>{user.category}</Text>
        </Box>
        <Box>
          <Text fontSize="large" fontWeight="bold">
            Position
          </Text>
          <Divider />
          <Text>{user.position}</Text>
        </Box>
        <Box>
          <Text fontSize="large" fontWeight="bold">
            CV
          </Text>
          <Divider />
          <Text>
            <Link href={user.CV} color="blue.100">
              Click
            </Link>
          </Text>
        </Box>
        <Box>
          <Text fontSize="large" fontWeight="bold">
            Lab Link
          </Text>
          <Divider />
          <Text>
            <Link
              href={`${process.env.NEXT_PUBLIC_URL}/lab/${user.lab_id}`}
              color="blue.100"
            >
              Lab Page
            </Link>
          </Text>
        </Box>
        {/* <Box>
          <Text fontSize="large" fontWeight="bold">
            Links
          </Text>
          <Divider />
          {JSON.parse(user.links).map((itm: string) => {
            if (itm !== '') {
              return <Link color="blue.100">{itm}</Link>;
            }
            return <br />;
          })}
        </Box> */}
      </SimpleGrid>
    </Box>
  );
}
