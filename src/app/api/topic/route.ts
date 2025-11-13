import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {Topic, TopicCategory} from '@/types/topic';

export async function GET(request: NextRequest) {
  const user_id = request.headers.get('User-Id') as string;

  try {
    const {rows} = await sql<Topic>`SELECT * FROM topics WHERE "user_id" = ${user_id} ORDER BY category;`;
    return Response.json(rows);
  } catch (error) {
    console.error('Failed to fetch topics:', error);
    return new Response('Failed to fetch topics.', {status: 500});
  }
}

export async function POST(request: NextRequest) {
  const user_id = request.headers.get('User-Id') as string;
  if (!user_id) {
    return new Response('Unauthorized', {status: 401});
  }

  const {content, category} = (await request.json()) as {
    content: string;
    category: TopicCategory;
  };

  if (!content || !category) {
    return new Response('Missing content or category.', {
      status: 400,
    });
  }

  try {
    await sql`INSERT INTO topics (content, category, "user_id") VALUES (${content}, ${category}, ${user_id});`;
    return new Response('', {status: 201});
  } catch (error) {
    console.error('Failed to create topic:', error);
    return new Response('Failed to create topic.', {status: 500});
  }
}
