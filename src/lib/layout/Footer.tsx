import { Flex, Link, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Flex as="footer" width="full" justifyContent="center">
      <Text fontSize="sm">
        {new Date().getFullYear()} -{' '}
        <Link isExternal rel="noopener noreferrer">
          Intellink Team
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
