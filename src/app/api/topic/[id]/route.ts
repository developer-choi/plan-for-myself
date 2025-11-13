import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';

export async function DELETE(request: NextRequest, {params}: { params: { id: string } }) {
  const user_id = request.headers.get('User-Id') as string;
  const id = Number(params.id);

  try {
    const result = await sql`DELETE FROM topics WHERE id = ${id} AND "user_id" = ${user_id};`;
    
    if (result.rowCount === 0) {
      return new Response('Topic not found or user not authorized.', {
        status: 404
      });
    }
    
    return new Response('');
  } catch (error) {
    console.error(error);
    return new Response('Failed to delete topic.', {
      status: 500
    });
  }
}
