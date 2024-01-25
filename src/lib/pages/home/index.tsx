import { Flex, Heading, Text, Image } from '@chakra-ui/react';

const Home = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <Image height={300} src="/intellink.png" />
      <Heading size="4xl">Intellink</Heading>
      <Text fontSize="3xl">Enabling Collaborative Research</Text>
    </Flex>
  );
};

export default Home;
