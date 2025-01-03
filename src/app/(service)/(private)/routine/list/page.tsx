import {getRoutineListApi} from '@/utils/service/api/routine';
import {ButtonLink} from '@/components/element/Button';
import ReadableRoutineList from '@/components/service/routine/ReadableRoutineList';
import {PureRoutine} from '@/types/routine';

export default async function Page() {
  const record = await getRoutineListApi();
  return (
    <>
      <ButtonLink href="/routine/create" size="large" className="full">새 루틴 만들기</ButtonLink>
      <ReadableRoutineList record={record}/>
    </>
  );
}

const KEYWORD = {
  Sleep: 'Sleep',
  SpareTime: 'Spare_Time',
  InCompany: 'In_Company',
  EnglishStudy: 'English_Study',
  Depression: 'Depression',
  Sleepy: 'Sleepy',
  Health: 'Health'
};

const WEEKDAY_MORNING_ROUTINE: PureRoutine = {
  date_type: 'weekday',
  routine_type: 'morning',
  title: '평일 아침',
  steps: [
    {
      type: 'sleep_time',
    },
    {
      type: 'habit',
      text: '칼기상 - 손씻기 - 스트레칭',
      keyword: KEYWORD.Sleep
    },
    {
      type: 'habit',
      text: '멍은 회사가서',
      keyword: KEYWORD.SpareTime
    },
    {
      type: 'link',
      text: '기술 블로그',
      url: 'https://docs.google.com/document/d/1qx4KZkQ1U_7xCLqqB-8jToP_gnh0ki364QA3YY0oNdQ/edit?tab=t.0#heading=h.euly6qc2v9v5'
    },
    {
      type: 'habit',
      text: '캘린더, 구글문서 > 명사, 형용사를 영어로 대체',
      keyword: KEYWORD.EnglishStudy
    },
    {
      type: 'habit',
      text: '이후 출근전 옷입고 준비하는동안 영듣',
      keyword: KEYWORD.SpareTime
    },
    {
      type: 'studied_minutes',
    },
  ]
}

const WEEKDAY_BEFORE_LUNCH_ROUTINE: PureRoutine = {
  date_type: 'weekday',
  routine_type: 'custom',
  title: '출근 전 루틴',
  steps: [
    {
      type: 'habit',
      text: '신호 뒤집기 > 군것질 = 당뇨합병증',
      keyword: KEYWORD.Health
    },
    {
      type: 'habit',
      text: '00m ~ 50m = 일',
      keyword: KEYWORD.InCompany
    },
    {
      type: 'habit',
      text: '50m ~ 55m = 복습할 것 탐색',
      keyword: KEYWORD.InCompany
    },
    {
      type: 'habit',
      text: '55m ~ 00m = 내려가서 휴식 + PFM',
      keyword: KEYWORD.InCompany
    },
  ]
};

const WEEKDAY_LUNCH_ROUTINE: PureRoutine = {
  date_type: 'weekday',
  routine_type: 'lunch',
  title: '평일 점심',
  steps: [
    {
      type: 'studied_minutes'
    }
  ]
};

const WEEKDAY_NIGHT: PureRoutine = {
  date_type: 'weekday',
  routine_type: 'night',
  title: '평일 저녁 루틴',
  steps: [
    {
      type: 'habit',
      text: '저녁 퇴근전은 10+15 분전 부터 준비',
      keyword: KEYWORD.InCompany
    },
    {
      type: 'habit',
      text: '퇴근 후 30분 이내 공부준비',
      keyword: KEYWORD.SpareTime
    },
    {
      type: 'habit',
      text: '폰 구석에 넣기',
      keyword: KEYWORD.Sleep
    },
    {
      type: 'studied_minutes',
    },
    {
      type: 'sleep_time',
    },
  ]
};

const WEEKDAY_ROUTINE_LIST: PureRoutine[] = [
  WEEKDAY_MORNING_ROUTINE,
  WEEKDAY_BEFORE_LUNCH_ROUTINE,
  WEEKDAY_LUNCH_ROUTINE,
  WEEKDAY_NIGHT
];

const HOLIDAY_MORNING_ROUTINE: PureRoutine = {
  date_type: 'holiday',
  routine_type: 'morning',
  title: '주말 아침',
  steps: [
    {
      type: 'sleep_time',
    },
    {
      type: 'habit',
      text: '칼기상 - 손씻기 - 스트레칭',
      keyword: KEYWORD.Sleep
    },
    {
      type: 'link',
      text: '기술 블로그',
      url: 'https://docs.google.com/document/d/1qx4KZkQ1U_7xCLqqB-8jToP_gnh0ki364QA3YY0oNdQ/edit?tab=t.0#heading=h.euly6qc2v9v5'
    },
    {
      type: 'habit',
      text: '신호 뒤집기 > 라면, 햄버거, 샌드위치, 커피 = 당뇨합병증',
      keyword: KEYWORD.Health
    },
    {
      type: 'studied_minutes'
    }
  ]
}

const HOLIDAY_LUNCH_ROUTINE: PureRoutine = {
  date_type: 'holiday',
  routine_type: 'lunch',
  title: '주말 점심 루틴',
  steps: [
    {
      type: 'habit',
      text: '밥먹을때 공부영상 보기',
      keyword: KEYWORD.SpareTime
    },
    {
      type: 'habit',
      text: '영어문장 문서에 필기할 때 구,절 구조분석 같이하기',
      keyword: KEYWORD.EnglishStudy
    },
    {
      type: 'habit',
      text: '우울하면 걷기',
      keyword: KEYWORD.Depression
    },
    {
      type: 'studied_minutes'
    }
  ]
};

const HOLIDAY_AFTER_LUNCH_ROUTINE: PureRoutine = {
  date_type: 'holiday',
  routine_type: 'custom',
  title: '휴일 낮 루틴',
  steps: [
    {
      type: 'habit',
      text: '졸리면 양치>씻>집안일>걷, 낮잠X',
      keyword: KEYWORD.Sleepy
    },
    {
      type: 'habit',
      text: '설거지, 심부름 > Keep 고민',
      keyword: KEYWORD.SpareTime
    },
  ]
}

const HOLIDAY_NIGHT_ROUTINE: PureRoutine = {
  date_type: 'weekday',
  routine_type: 'custom',
  title: '주말 저녁',
  steps: [
    {
      type: 'habit',
      text: '폰 구석에 넣기',
      keyword: KEYWORD.Sleep
    },
    {
      type: 'studied_minutes',
    },
    {
      type: 'sleep_time'
    }
  ]
};

const HOLIDAY_ROUTINE_LIST: PureRoutine[] = [
  HOLIDAY_MORNING_ROUTINE,
  HOLIDAY_LUNCH_ROUTINE,
  HOLIDAY_AFTER_LUNCH_ROUTINE,
  HOLIDAY_NIGHT_ROUTINE
];
