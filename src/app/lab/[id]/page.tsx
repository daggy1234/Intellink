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

  //   console.log(id);

  if (!id) {
    return <Heading>Invalid ID</Heading>;
  }

  const { data, error } = await supabase
    .from('Labs')
    .select('*')
    .eq('uuid', id);

  //   console.log(data);

  if (error) {
    return <Heading>Error</Heading>;
  }

  if (data.length === 0) {
    return <Heading>Lab Does not Exist</Heading>;
  }

  const lab = data[0];

  const members = await supabase.from('Users').select('*').eq('lab_id', id);

  //   const components = (
  //     <Box>
  //       {members.data.map((e) => (
  //         <Link href={`http://localhost:3000/user/${e.user_id}`}>{e.name}</Link>
  //       ))}
  //     </Box>
  //   );

  return (
    <Box>
      <Heading>Lab Profile</Heading>
      <SimpleGrid my={4} spacing={3}>
        <Box>
          <Text fontSize="large" fontWeight="bold">
            Name
          </Text>
          <Divider />
          <Text>{lab.name}</Text>
        </Box>
        <Box>
          <Text fontSize="large" fontWeight="bold">
            Url
          </Text>
          <Divider />
          <Link color="blue.100" href={lab.url}>
            Website
          </Link>
        </Box>
        <Box>
          <Text fontSize="large" fontWeight="bold">
            Field
          </Text>
          <Divider />
          <Text>{lab.field}</Text>
        </Box>

        {members.data && (
          <Box>
            <Text fontSize="large" fontWeight="bold">
              Members
            </Text>
            <Divider />
            {/* <VStack>{components}</VStack> */}
          </Box>
        )}

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
