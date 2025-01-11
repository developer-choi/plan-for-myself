'use client';

import {PureRoutine} from '@/types/routine';
import {DateType} from '@/utils/service/constant/date-type';
import {useCallback, useMemo} from 'react';
import Button from '@/components/element/Button';
import {postRoutineApi} from '@/utils/service/api/routine';
import {useMutation} from '@tanstack/react-query';
import {useHandleClientSideError} from '@/utils/service/error/client-side';
import {revalidateTagOnServerAction} from '@/utils/extend/library/revalidate-tag';

export interface RollbackRoutineProps {
  dateType: DateType;
}

export default function RollbackRoutine({dateType}: RollbackRoutineProps) {
  const list = useMemo(() => ROUTINE_RECORD[dateType], [dateType]);
  const handleClientSideError = useHandleClientSideError();

  const {mutateAsync} = useMutation({
    mutationFn: postRoutineApi
  });
  
  const rollbackRoutine = useCallback(async (routine: PureRoutine) => {
    try {
      await mutateAsync(routine);
      await revalidateTagOnServerAction('READABLE_ROUTINE_LIST');
    } catch (error) {
      handleClientSideError(error);
    }
  }, [handleClientSideError, mutateAsync]);

  return (
    <div>
      {list.map((routine) => (
        <Button key={routine.title} variant="outlined" size="small" onClick={() => rollbackRoutine(routine)}>{routine.title} 루틴 복구하기</Button>
      ))}
    </div>
  );
}


const KEYWORD = {
  Sleep: 'Sleep',
  SpareTime: 'Spare_Time',
  InCompany: 'In_Company',
  EnglishStudy: 'English_Study',
  Depression: 'Depression',
  Sleepy: 'Sleepy',
  Health: 'Health',
  Review: 'Review',
  Effort: 'Effort',
  StudyRule: 'StudyRule'
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
      type: 'link',
      text: 'P1, S2 진행',
      url: 'https://docs.google.com/document/d/1fCIh5gV9aqoILTWnU7p0FHffSQVoBLC-13IJdcK4lEE/edit?tab=t.0#heading=h.d77gh1hf6g9r'
    },
    {
      type: 'habit',
      text: '지난주 > 어제 > 새벽 복습',
      keyword: KEYWORD.Review
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
  title: '출근 전 습관 복기 루틴',
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
      type: 'habit',
      text: '회사 오전 정리',
      keyword: KEYWORD.Review
    },
    {
      type: 'habit',
      text: '새벽 > 오전 복습',
      keyword: KEYWORD.Review
    },
    {
      type: 'studied_minutes'
    }
  ]
};

const WEEKDAY_BEFORE_LEAVE_WORK_ROUTINE: PureRoutine = {
  date_type: 'weekday',
  routine_type: 'custom',
  title: '퇴근 직전~직후 루틴',
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
      text: '(퇴근 후 ~ 자기 전 내내) 폰 구석에 넣기',
      keyword: KEYWORD.Sleep
    },
    {
      type: 'link',
      text: '이력서 정리',
      url: 'https://docs.google.com/document/d/1DM2lhY3KFy0Vh98iC_HP2nxcBUzGZwQiRMzw3hi3l8M/edit?tab=t.0'
    },
    {
      type: 'link',
      text: '히스토리 정리',
      url: 'https://docs.google.com/document/d/1zDSa7Z4FJzFAbwOu84h5xLs8VgYZiaIwd1y1nyZUJCU/edit?tab=t.0#heading=h.4x5fr5ue44yi'
    },
    {
      type: 'habit',
      text: 'RP, TP, LW, LT, LA 커밋, 구글킵, 구글문서 정리',
      keyword: KEYWORD.StudyRule
    },
    {
      type: 'link',
      text: '목표 이력서 확인',
      url: 'https://docs.google.com/document/d/16FQFmdvvssLpjBZ4kmjmo_Y4AZH0RzBXHvvKQXeX-Bk/edit?tab=t.0#heading=h.zevby2z2imrc'
    },
  ]
};

const WEEKDAY_NIGHT_ROUTINE: PureRoutine = {
  date_type: 'weekday',
  routine_type: 'night',
  title: '평일 저녁 루틴',
  steps: [
    {
      type: 'habit',
      text: '새벽 > 오전 > 점심 > 저녁 복습',
      keyword: KEYWORD.Review
    },
    {
      type: 'link',
      text: '루틴문서 정리',
      url: 'https://docs.google.com/document/d/1fCIh5gV9aqoILTWnU7p0FHffSQVoBLC-13IJdcK4lEE/edit?tab=t.0'
    },
    {
      type: 'studied_minutes',
    },
    {
      type: 'sleep_time',
    },
  ]
};

const HOLIDAY_MORNING_ROUTINE: PureRoutine = {
  date_type: 'holiday',
  routine_type: 'morning',
  title: '휴일 아침 루틴',
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
      text: 'Weekly Remind',
      url: 'https://docs.google.com/document/d/19zD1wMyKvAu1Qwc3K5MHwRgbFjOJGBydcQfHnO6L03s/edit?tab=t.0#heading=h.826886qqpxfp'
    },
    {
      type: 'link',
      text: '기술 블로그',
      url: 'https://docs.google.com/document/d/1qx4KZkQ1U_7xCLqqB-8jToP_gnh0ki364QA3YY0oNdQ/edit?tab=t.0#heading=h.euly6qc2v9v5'
    },
    {
      type: 'link',
      text: 'Other resumes',
      url: 'https://docs.google.com/document/d/1nvrFVwVlglmW3O8YbQ8HuU4A9VYGceDz5KocGP99KEg/edit?tab=t.0'
    },
    {
      type: 'link',
      text: '나1무합',
      url: 'https://docs.google.com/document/d/1k5-3pJ1qNTzcK-1-73LmqbrYuWr5gxe2xJglYMd2E_0/edit?tab=t.0'
    },
    {
      type: 'link',
      text: '평일에 진도 못뺀만큼 채워야함',
      url: 'https://docs.google.com/document/d/1fCIh5gV9aqoILTWnU7p0FHffSQVoBLC-13IJdcK4lEE/edit?tab=t.0'
    },
    {
      type: 'habit',
      text: '신호 뒤집기 > 라면, 햄버거, 샌드위치, 커피 = 당뇨합병증',
      keyword: KEYWORD.Health
    },
    {
      type: 'habit',
      text: '신호 뒤집기 > 게임 하고싶어지면 [게임 하면 생기는 일]',
      keyword: KEYWORD.Effort
    },
    {
      type: 'link',
      text: 'P1, S2 진행',
      url: 'https://docs.google.com/document/d/1fCIh5gV9aqoILTWnU7p0FHffSQVoBLC-13IJdcK4lEE/edit?tab=t.0'
    },
    {
      type: 'studied_minutes'
    }
  ]
}

const HOLIDAY_LUNCH_ROUTINE: PureRoutine = {
  date_type: 'holiday',
  routine_type: 'lunch',
  title: '휴일 점심 루틴',
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
      type: 'link',
      text: 'P1, S2 진행',
      url: 'https://docs.google.com/document/d/1fCIh5gV9aqoILTWnU7p0FHffSQVoBLC-13IJdcK4lEE/edit?tab=t.0'
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
      text: '1주일간 RP에 수정한 공통코드 PFM에도 반영',
      keyword: KEYWORD.StudyRule
    },
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
  date_type: 'holiday',
  routine_type: 'night',
  title: '휴일 저녁 루틴',
  steps: [
    {
      type: 'habit',
      text: '폰 구석에 넣기',
      keyword: KEYWORD.Sleep
    },
    {
      type: 'link',
      text: 'P1, S2 진행',
      url: 'https://docs.google.com/document/d/1fCIh5gV9aqoILTWnU7p0FHffSQVoBLC-13IJdcK4lEE/edit?tab=t.0'
    },
    {
      type: 'habit',
      text: 'RP, TP, 구글문서 정리',
      keyword: KEYWORD.StudyRule
    },
    {
      type: 'habit',
      text: '새벽 > 오전 > 점심 > 저녁 복습',
      keyword: KEYWORD.Review
    },
    {
      type: 'link',
      text: '루틴문서 정리',
      url: 'https://docs.google.com/document/d/1fCIh5gV9aqoILTWnU7p0FHffSQVoBLC-13IJdcK4lEE/edit?tab=t.0'
    },
    {
      type: 'studied_minutes',
    },
    {
      type: 'sleep_time'
    }
  ]
};

const ROUTINE_RECORD: Record<DateType, PureRoutine[]> = {
  weekday: [
    WEEKDAY_MORNING_ROUTINE,
    WEEKDAY_BEFORE_LUNCH_ROUTINE,
    WEEKDAY_LUNCH_ROUTINE,
    WEEKDAY_BEFORE_LEAVE_WORK_ROUTINE,
    WEEKDAY_NIGHT_ROUTINE
  ],
  holiday: [
    HOLIDAY_MORNING_ROUTINE,
    HOLIDAY_LUNCH_ROUTINE,
    HOLIDAY_AFTER_LUNCH_ROUTINE,
    HOLIDAY_NIGHT_ROUTINE
  ]
};
