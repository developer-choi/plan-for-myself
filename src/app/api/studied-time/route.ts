import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {PostDailyStudyTimeParameter} from '@/utils/service/api/studied-time';
import {convertStudiedTimeTimestamp, insertStudiedTimeCalendar} from '@/utils/server/studied-time';

export async function GET(request: NextRequest) {
  const user_id = request.headers.get('User-Id');
  const searchParams = request.nextUrl.searchParams
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  try {
    const response = await sql`
SELECT pk, studied_minutes, fail_keywords, date_type, timestamp 
FROM studied_time 
WHERE user_id = ${user_id}
AND (TIMESTAMP 'epoch' + timestamp / 1000 * INTERVAL '1 second') BETWEEN ${start} AND ${end}
ORDER BY timestamp ASC;
`;
    return Response.json(response.rows.map(row => ({
      ...row,
      fail_keywords: row.fail_keywords.length === 1 && row.fail_keywords[0] === '' ? [] : row.fail_keywords,
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
  const user_id = request.headers.get('User-Id') as string;
  const parameter: PostDailyStudyTimeParameter = await request.json();

  try {
    const {year, month, date} = parameter;
    const timestamp = convertStudiedTimeTimestamp(year, month, date);
    const {rows} = await sql`select pk from studied_time where timestamp=${timestamp}`;

    if (rows.length) {
      return new Response('Resource already exists.', {
        status: 409
      });
    }

    await insertStudiedTimeCalendar(user_id, parameter);
    return new Response('');
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}
