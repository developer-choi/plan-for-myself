import {getRoutineListApi} from '@/utils/service/api/routine';
import {ButtonLink} from '@/components/element/Button';
import ReadableRoutineList from '@/components/service/routine/ReadableRoutineList';

export default async function Page() {
  const record = await getRoutineListApi();
  return (
    <>
      <ButtonLink href="/routine/create" size="large" className="full">새 루틴 만들기</ButtonLink>
      <ReadableRoutineList record={record}/>
    </>
  );
}
