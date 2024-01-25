/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable no-nested-ternary */

'use client';

import {
  Heading,
  Button,
  Flex,
  VStack,
  IconButton,
  DrawerFooter,
  HStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Icon,
} from '@chakra-ui/react';
import Link from 'next/link';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaHome } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

import AuthButton from './AuthButton';

type MyDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

function MyDrawer({ isOpen, onClose }: MyDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Menu</DrawerHeader>

        <DrawerBody mr="30px">
          <VStack spacing={5} align="stretch" textAlign="center">
            <Link href="/">
              <Button leftIcon={<Icon as={FaHome} />} w="100%" bg="brand.500">
                Home
              </Button>
            </Link>
            <Link href="/">
              <Button leftIcon={<Icon as={FaHome} />} w="100%" bg="brand.500">
                Platform
              </Button>
            </Link>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        zIndex={1}
        align="center"
        justify="space-between"
        wrap="wrap"
        alignItems="center"
        bg="brand.200"
        top={0}
        position="sticky"
        color="white"
      >
        <Flex align="left" m={5}>
          <Heading
            alignItems="center"
            as="h1"
            size={{ base: 'xl', xl: '2xl' }}
            letterSpacing="-.1rem"
          >
            <Link href="/">
              <Heading>Intellink</Heading>
            </Link>
          </Heading>
        </Flex>
        <HStack
          display={{ base: 'none', lg: 'flex' }}
          width={{ base: 'full', lg: 'auto' }}
          alignItems="center"
          m={4}
          spacing={4}
          flexShrink={1}
        >
          <Link href="/platform">
            <Button leftIcon={<MdDashboard />} variant="solid" bg="brand.500">
              Platform
            </Button>
          </Link>
          <AuthButton />
        </HStack>

        <IconButton
          onClick={onOpen}
          display={{
            base: 'flex',
            lg: 'none',
          }}
          aria-label="Open menu"
          mx={3}
          fontSize="20px"
          color="white"
          variant="ghost"
          icon={<AiOutlineMenu />}
        />
      </Flex>
      <MyDrawer onClose={onClose} isOpen={isOpen} />
    </>
  );
}