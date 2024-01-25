import { Flex, Heading, Text } from '@chakra-ui/react';

const Home = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <Heading size="4xl">Intellink</Heading>
      <Text fontSize="3xl">Enabling Collaborative Research</Text>
    </Flex>
  );
};

export default Home;
