/* JSON이 깨진 본문만 undefined로 돌려 INVALID_BODY로 거절하게 하고, 그 밖의 읽기 실패는 그대로 던진다 */
export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return undefined;
    }
    throw error;
  }
}
