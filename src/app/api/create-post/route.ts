// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY, // This is the default and can be omitted
});

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const PROMPT = `
Your job is to summarize the following request. Try to be briefin the summary and try to be informative while also hide key details to ensure the project security is not comprimised. Try to be 2-3 lines max.
PROJECT_DESCRIPTION: ${body.extended_description}
ASK: ${body.request}
Use the description and ask to generate the following data and output a json with two fields. One being a quick blurb as stated above, the other being candidate they are looking for.The Data MUST be a Json with the schema: {summary: '', requirements: ''}
`;
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [{ role: 'user', content: PROMPT }],
    model: 'gpt-3.5-turbo',
  };

  const chatCompletion: OpenAI.Chat.ChatCompletion =
    await openai.chat.completions.create(params);

  if (chatCompletion.choices.length < 1) {
    return NextResponse.json(
      { summary: '', requirements: body.ask, ...body },
      { status: 200 }
    );
  }

  let resp;
  try {
    resp = JSON.parse(chatCompletion.choices[0].message.content || '{}');
  } catch (err) {
    resp = {
      summary: '',
      requirements: body.ask,
    };
  }
  console.log(resp);

  return NextResponse.json(
    {
      summary: resp.summary || '',
      requirements: resp.candidate || body.ask,
      ...body,
    },
    { status: 200 }
  );
};
