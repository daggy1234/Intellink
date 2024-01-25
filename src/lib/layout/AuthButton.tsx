'use client';

import { Button } from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import type { Database } from '../../../database.types';

export default function AuthButton() {
  const [session, setSession] = useState(null);
  const supabase = createClientComponentClient<Database>();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    console.log('SIGN OUT');
    window.location.reload();
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();
  }, [supabase.auth]);

  if (!session) {
    return (
      <Link href="/login">
        <Button colorScheme="green">Sign In</Button>
      </Link>
    );
  }

  return (
    <Button onClick={handleSignOut} colorScheme="red">
      Sign Out
    </Button>
  );
}
