'use client';

import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Box,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { Database } from '../../../database.types';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (res.error) {
      toast({
        title: 'Error',
        description: res.error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    window.location.reload();
    router.push('/');

    // Here you can add your logic to handle the login
  };

  return (
    <Box mx="auto" maxW={800} p={4}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Heading>Sign In</Heading>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue">
            Sign In
          </Button>

          <Button as="a" href="/sign-up" colorScheme="green">
            Sign Up
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
