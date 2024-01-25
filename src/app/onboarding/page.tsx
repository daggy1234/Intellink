/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable sonarjs/no-duplicate-string */

'use client';

import {
  Box,
  Radio,
  RadioGroup,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Stack,
  Select,
  Textarea,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import type { Session } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Formik, Field, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';

import type { Database } from '../../../database.types';
import labs from '../../lib/data/labs';

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  gender: Yup.string().required('Gender is required'),
  university: Yup.string().required('University is required'),
  researchCategory: Yup.string().required('Research category is required'),
  subInterests: Yup.string().required('Sub interests are required'),
  position: Yup.string().required('Position is required'),
  lab: Yup.string().required('Lab is required'),
  cv: Yup.string().url('Invalid URL').required('CV URL is required'),
  link1: Yup.string().url('Invalid URL'),
  link2: Yup.string().url('Invalid URL'),
  link3: Yup.string().url('Invalid URL'),
});

export default function Login() {
  const [session, setSession] = useState<Session | null | boolean>(true);
  const [user, setUser] = useState(null);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const toast = useToast();
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();
  }, [supabase.auth]);

  useEffect(() => {
    const fetchUser = async () => {
      if (session !== true && session) {
        const { data } = await supabase
          .from('Users')
          .select('*')
          .eq('user_id', session.user.id);
        if (data) {
          const plyr = data[0];
          // @ts-ignore
          setUser(plyr);
        }
      }
    };
    fetchUser();
  }, [session, supabase]);

  console.log(session);

  if (session !== true && !session) {
    router.push('/login');
  }
  if (user) {
    router.push('/platform');
  }
  return (
    <Box mx="auto" maxW={800} p={4}>
      <Heading mb={6}>Onboarding</Heading>
      <Formik
        initialValues={{
          name: '',
          gender: '',
          university: '',
          researchCategory: '',
          subInterests: '',
          position: '',
          lab: '',
          cv: '',
          link1: '',
          link2: '',
          link3: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          const res = await supabase.from('Users').insert({
            name: values.name,
            // @ts-ignore
            user_id: session.user.id.toString(),
            category: values.researchCategory,
            bio: '',
            CV: values.cv,
            gender: values.gender,
            interests: values.subInterests,
            position: values.position,
            lab_id: values.lab,
            links: JSON.stringify([values.link1, values.link2, values.link3]),
          });

          if (!res.error) {
            toast({
              title: 'Success',
              description: 'Created Profile',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            //    @ts-ignore
            router.push(`/platform`);
          } else {
            toast({
              title: 'Error',
              description: res.error?.message,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
          //   alert(JSON.stringify(values));
          actions.setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting, values }) => (
          <Form>
            <Stack spacing={4}>
              <Field name="name">
                {({ field }: { field: any }) => (
                  <FormControl
                    isInvalid={(errors.name && touched.name) || false}
                  >
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input {...field} id="name" />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="gender">
                {({ field }: { field: any }) => (
                  <FormControl
                    isInvalid={(errors.gender && touched.gender) || false}
                  >
                    <FormLabel htmlFor="gender">Gender</FormLabel>
                    <Select {...field} id="gender" placeholder="Select gender">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                    </Select>
                    <FormErrorMessage>{errors.gender}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="university">
                {({ field }: { field: any }) => (
                  <FormControl
                    isInvalid={
                      (errors.university && touched.university) || false
                    }
                  >
                    <FormLabel htmlFor="university">University</FormLabel>
                    <Input {...field} id="university" />
                    <FormErrorMessage>{errors.university}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="researchCategory">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    isInvalid={
                      form.errors.researchCategory &&
                      form.touched.researchCategory
                    }
                  >
                    <FormLabel
                      defaultValue="Biology"
                      htmlFor="researchCategory"
                    >
                      Research Category
                    </FormLabel>
                    <RadioGroup
                      {...field}
                      id="researchCategory"
                      onChange={(val) =>
                        form.setFieldValue('researchCategory', val)
                      }
                    >
                      <Stack direction="column">
                        <Radio value="Biology">Biology</Radio>
                        <Radio value="Computer Science">Computer Science</Radio>
                        <Radio value="Journalism">Journalism</Radio>
                        <Radio value="Economics">Economics</Radio>
                      </Stack>
                    </RadioGroup>
                    <FormErrorMessage>
                      {errors.researchCategory}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="subInterests">
                {({ field }: { field: any }) => (
                  <FormControl
                    isInvalid={
                      (errors.subInterests && touched.subInterests) || false
                    }
                  >
                    <FormLabel htmlFor="subInterests">Sub Interests</FormLabel>
                    <Textarea {...field} id="subInterests" />
                    <FormErrorMessage>{errors.subInterests}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="position">
                {({ field }: { field: any }) => (
                  <FormControl
                    isInvalid={(errors.position && touched.position) || false}
                  >
                    <FormLabel htmlFor="position">Position</FormLabel>
                    <Select
                      {...field}
                      id="position"
                      placeholder="Select position"
                    >
                      <option value="PhD student">PhD Student</option>
                      <option value="PI">PI</option>
                      <option value="Professor">Professor</option>
                      {/* Add other positions here */}
                    </Select>
                    <FormErrorMessage>{errors.position}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="lab">
                {({ field }: { field: any }) => (
                  <FormControl isInvalid={(errors.lab && touched.lab) || false}>
                    <FormLabel htmlFor="lab">Lab</FormLabel>
                    <Select {...field} id="lab" placeholder="Select lab">
                      {labs.map((v) => {
                        if (v.field === values.researchCategory) {
                          return <option value={v.uuid}>{v.name}</option>;
                        }
                        return <br />;
                      })}
                    </Select>
                    <FormErrorMessage>{errors.lab}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="cv">
                {({ field }: { field: any }) => (
                  <FormControl isInvalid={(errors.cv && touched.cv) || false}>
                    <FormLabel htmlFor="cv">Attach CV (URL)</FormLabel>
                    <Input {...field} id="cv" />
                    <FormErrorMessage>{errors.cv}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Heading>Extra Links</Heading>
              {/* Attach up to 3 links */}
              <Field name="link1">
                {({ field }: { field: any }) => (
                  <FormControl
                    isInvalid={(errors.link1 && touched.link1) || false}
                  >
                    <FormLabel htmlFor="link1">Link 1</FormLabel>
                    <Input {...field} id="link1" />
                    <FormErrorMessage>{errors.link1}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="link2">
                {({ field }: { field: any }) => (
                  <FormControl
                    isInvalid={(errors.link2 && touched.link2) || false}
                  >
                    <FormLabel htmlFor="link2">Link 2</FormLabel>
                    <Input {...field} id="link2" />
                    <FormErrorMessage>{errors.link2}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="link3">
                {({ field }: { field: any }) => (
                  <FormControl
                    isInvalid={(errors.link3 && touched.link3) || false}
                  >
                    <FormLabel htmlFor="link3">Link 3</FormLabel>
                    <Input {...field} id="link3" />
                    <FormErrorMessage>{errors.link3}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Button
                mt={4}
                colorScheme="blue"
                isLoading={isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
