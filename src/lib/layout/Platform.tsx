/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
// components/PlatformLayout.js
import { Flex, Box, VStack, Heading } from '@chakra-ui/react';
import NextLink from 'next/link';

const PlatformLayout = ({ children }: any) => {
  return (
    <Flex>
      <VStack
        display={{ base: 'none', md: 'inline-block' }}
        height="80vh"
        bg="brand.300"
        p={8}
        spacing={5}
        rounded="lg"
        color="white"
        alignItems="flex-start"
      >
        <NextLink href="/platform" passHref>
          <Heading my={2} size="lg">
            Home
          </Heading>
        </NextLink>
        <NextLink href="/create-post" passHref>
          <Heading my={2} size="lg">
            New Request
          </Heading>
        </NextLink>
        <NextLink href="/projects" passHref>
          <Heading my={2} size="lg">
            {' '}
            Collab Projects
          </Heading>
        </NextLink>
        <NextLink href="/matched" passHref>
          <Heading my={2} size="lg">
            Matched Projects
          </Heading>
        </NextLink>
        <NextLink href="/inbox" passHref>
          <Heading my={2} size="lg">
            Inbox
          </Heading>
        </NextLink>
        <NextLink href="/my-profile" passHref>
          <Heading my={2} size="lg">
            Profile
          </Heading>
        </NextLink>
        <NextLink href="/my-lab" passHref>
          <Heading my={2} size="lg">
            Lab
          </Heading>
        </NextLink>
        {/* Add more navigation links as needed */}
      </VStack>
      <Box flex="1" p="5">
        {children}
      </Box>
    </Flex>
  );
};

export default PlatformLayout;
