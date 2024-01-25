'use client';

// Adjust the necessary imports if any new components are used

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Stack,
  Textarea,
  Radio,
  RadioGroup,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-nextjs';
import { Formik, Field, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';

import type { Database } from '../../../database.types';
import PlatformLayout from '~/lib/layout/Platform';

// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  request: Yup.string().required('Request is required'),
  extended_description: Yup.string().required(
    'Extended description is required'
  ),
  field: Yup.string().required('Field is required'),
});

export default function CreatePost() {
  const supabase = createClientComponentClient<Database>();
  const toast = useToast();
  const router = useRouter();
  const [session, setSession] = useState<Session | null | boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();
  }, [supabase.auth]);

  if (session !== true && !session) {
    router.push('/login');
  }

  return (
    <PlatformLayout>
      <Box mx="auto" maxW={800} p={4}>
        <Heading mb={6}>Create New Post</Heading>
        <Formik
          initialValues={{
            title: '',
            request: '',
            extended_description: '',
            field: '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            // Submit logic here
            // Example:

            if (session === true || !session) {
              toast({
                title: 'Error',
                description: 'No Session?',
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
              actions.setSubmitting(false);
              return;
            }

            const body = {
              title: values.title,
              request: values.request,
              extended_description: values.extended_description,
              field: values.field,
            };

            const resp = await fetch('/api/create-post', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });

            const js = await resp.json();

            // Handle the response
            if (resp.status !== 200) {
              toast({
                title: 'Error',
                description: 'Oopsies',
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            } else {
              const respA = await supabase.from('Post').insert({
                summary: js.summary,
                ask: js.requirements,
                title: values.title,
                extended_description: values.extended_description,
                request: values.request,
                field: values.field,
                author_id: session.user.id,
              });
              if (!respA.error) {
                toast({
                  title: 'Success',
                  description: 'Post created successfully',
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
                });
                router.push('/platform');
              } else {
                toast({
                  title: 'Error',
                  description: respA.error.message,
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
                });
              }

              //   router.push('/some-redirect-path'); // Redirect as needed
            }
            actions.setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Stack spacing={4}>
                {/* Title Field */}
                <Field name="title">
                  {({ field }) => (
                    <FormControl isInvalid={errors.title && touched.title}>
                      <FormLabel htmlFor="title">Title</FormLabel>
                      <Input {...field} id="title" />
                      <FormErrorMessage>{errors.title}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* Request Field */}
                <Field name="request">
                  {({ field }) => (
                    <FormControl isInvalid={errors.request && touched.request}>
                      <FormLabel htmlFor="request">Request</FormLabel>
                      <Textarea {...field} id="request" />
                      <FormErrorMessage>{errors.request}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* Extended Description Field */}
                <Field name="extended_description">
                  {({ field }) => (
                    <FormControl
                      isInvalid={
                        errors.extended_description &&
                        touched.extended_description
                      }
                    >
                      <FormLabel htmlFor="extended_description">
                        Extended Description
                      </FormLabel>
                      <Textarea {...field} id="extended_description" />
                      <FormErrorMessage>
                        {errors.extended_description}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="field">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.researchCategory &&
                        form.touched.researchCategory
                      }
                    >
                      <FormLabel defaultValue="Biology" htmlFor="field">
                        Research Category
                      </FormLabel>
                      <RadioGroup
                        {...field}
                        id="field"
                        onChange={(val) => form.setFieldValue('field', val)}
                      >
                        <Stack direction="column">
                          <Radio value="Biology">Biology</Radio>
                          <Radio value="Computer Science">
                            Computer Science
                          </Radio>
                          <Radio value="Journalism">Journalism</Radio>
                          <Radio value="Economics">Economics</Radio>
                        </Stack>
                      </RadioGroup>
                      <FormErrorMessage>{errors.field}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* Submit Button */}
                <Button
                  mt={4}
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Create Post
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </PlatformLayout>
  );
}
