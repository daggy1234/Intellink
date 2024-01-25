/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { useState } from 'react';

import type { Database } from '../../../database.types';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toast = useToast();
  const supabase = createClientComponentClient<Database>();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // Basic validation
    if (!email || !password || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
      return;
    }

    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
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
    toast({
      title: 'Success',
      description: 'Check your email to verify your login',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Here you can add your logic to handle the sign-up
    console.log('Sign up with:', email, password);
  };

  return (
    <Box mx="auto" maxW={800} p={4}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Heading>Sign Up</Heading>
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

          <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue">
            Sign Up
          </Button>

          <Button as="a" href="/sign-in" colorScheme="green">
            Sign In
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
