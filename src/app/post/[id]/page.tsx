/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

'use client';

import {
  Box,
  Text,
  Flex,
  Heading,
  Divider,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
} from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import type { Database } from '../../../../database.types';
import PlatformLayout from '~/lib/layout/Platform';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [session, setSession] = useState<Session | null | boolean>(true);
  const [author, setAuthor] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [note, setNote] = useState('');
  const [hasPerms, SetHasPerms] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOwner, SetOwner] = useState<boolean>(false);
  const router = useRouter();
  const toast = useToast();
  const supabase = createClientComponentClient<Database>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();
  }, [supabase.auth]);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    const fetchUser = async () => {
      if (session !== true && session) {
        const { data } = await supabase
          .from('Post')
          .select('*')
          .eq('post_id', id);
        if (data) {
          const plyr = data[0];
          setUser(plyr);
          const { data: authors } = await supabase
            .from('Users')
            .select('*')
            .eq('user_id', plyr.author_id);

          if (authors && authors.length > 0) {
            setAuthor(authors[0]);
            if (plyr.author_id === session.user.id) {
              SetHasPerms(true);
              SetOwner(true);
            } else {
              const { data: perms } = await supabase
                .from('Approvals')
                .select('*')
                .eq('request_author', session.user.id)
                .eq('post_author', id);
              if (perms.length > 0) {
                console.log('CHECK');
                SetHasPerms(perms[0].approved || false);
              }
            }
          }
        }
      }
    };
    fetchUser();
  }, [session, supabase, hasPerms, author, id]);

  if (session !== true && !session) {
    router.push('/login');
  }
  if (!user) {
    return (
      <PlatformLayout>
        <Text>Error Occured</Text>
      </PlatformLayout>
    );
  }

  if (!author) {
    return (
      <PlatformLayout>
        <Text>Error Occured</Text>
      </PlatformLayout>
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Collaboration Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Enter a brief note:</Text>
            <Textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={async () => {
                const v = {
                  post_id: author.user_id,
                  //   @ts-ignore
                  request_author: session.user.id,
                  post_author: id,
                };
                const res = await supabase.from('Approvals').insert({
                  post_id: v.post_id,
                  request_author: v.request_author,
                  post_author: v.post_author,
                  note,
                });

                if (!res.error) {
                  toast({
                    title: 'Success',
                    description: 'Created Profile',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                } else {
                  toast({
                    title: 'Error',
                    description: res.error?.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                  });
                }
                onClose();
              }}
              bg="brand.100"
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <PlatformLayout>
        <Flex>
          <Box>
            <Heading>{user.title}</Heading>
          </Box>
        </Flex>
        <Divider />
        <Box my={2}>
          <Text fontSize="large" fontWeight="bold">
            Summary
          </Text>
          <Divider />
          <Text>{user.summary}</Text>
        </Box>
        <Box my={2}>
          <Text fontSize="large" fontWeight="bold">
            Ask
          </Text>
          <Divider />
          <Text>{user.request}</Text>
        </Box>
        {(hasPerms || author.user_id !== session.user.id) && (
          <Box>
            <Box my={2}>
              <Text fontSize="large" fontWeight="bold">
                Description
              </Text>
              <Divider />
              <Textarea readOnly value={user.extended_description} />
            </Box>
          </Box>
        )}
        {!hasPerms && author.user_id !== session.user.id && (
          <Box my={2}>
            <Text fontSize="large" fontWeight="bold">
              Request Access
            </Text>
            <Divider />
            <Text>Request Access to learn more and collaborate!</Text>
          </Box>
        )}
        <Flex
          direction="column"
          textAlign="left"
          p={8}
          rounded="lg"
          border="1px solid white"
        >
          <Text fontWeight="bold">Author</Text>
          <Divider />
          <Text>{author.name}</Text>
          <Text>{author.position}</Text>
          <Link href={author.CV}>CV</Link>
          <Link href={`${process.env.NEXT_PUBLIC_URL}/user/${author.user_id}`}>
            <Button my={2} bg="brand.400">
              Author Page
            </Button>
          </Link>
          {hasPerms && author.user_id !== session.user.id && (
            <Button maxW="sm" bg="brand.100">
              Contact
            </Button>
          )}
          {!hasPerms && author.user_id !== session.user.id && (
            <Button onClick={onOpen} maxW="sm" bg="brand.100">
              Request Collaboration
            </Button>
          )}
        </Flex>
      </PlatformLayout>
    </>
  );
}
