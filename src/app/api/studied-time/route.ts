import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {PostDailyStudyTimeParameter} from '@/type/studied-time';

export async function GET(request: NextRequest) {
  const user_id = request.headers.get('User-Id');
  const searchParams = request.nextUrl.searchParams
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  try {
    const response = await sql`
SELECT pk, studied_minutes, fail_keywords, fail_reason, date_type, timestamp from studied_time where user_id=${user_id}
AND (TIMESTAMP 'epoch' + timestamp / 1000 * INTERVAL '1 second')
    BETWEEN ${start} AND ${end};
`;
    return Response.json(response.rows.map(row => ({
      ...row,
      timestamp: Number(row.timestamp)
    })));
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}

export async function POST(request: NextRequest) {
  const user_id = request.headers.get('User-Id');
  const parameter: PostDailyStudyTimeParameter = await request.json();
  const {fail_keywords = [], fail_reason = '', studied_minutes, date_type} = parameter;

  const formattedStudiedMinutes = `{${studied_minutes.join(',')}}`;
  const formattedFailKeywords = `{${fail_keywords.map(k => `"${k}"`).join(',')}}`;

  try {
    await sql`
        INSERT INTO studied_time (studied_minutes, fail_keywords, fail_reason, date_type, timestamp, user_id)
        VALUES (${formattedStudiedMinutes}, ${formattedFailKeywords}, ${fail_reason}, ${date_type}, ${Date.now()}, ${user_id})`;
    return new Response('');

  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}