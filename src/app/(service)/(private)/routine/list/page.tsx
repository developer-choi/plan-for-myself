import {getRoutineListApi} from '@/utils/service/api/routine';
import {ButtonLink} from '@/components/element/Button';
import ReadableRoutineList from '@/components/service/routine/ReadableRoutineList';

export default async function Page() {
  const record = await getRoutineListApi();
  // TODO 현재 선택된 date_type으로 생성페이지 date_type 기본값 넣어주기
  return (
    <>
      <ButtonLink href="/routine/create" size="large" className="full">새 루틴 만들기</ButtonLink>
      <ReadableRoutineList record={record}/>
    </>
  );
}
