import Button from '@component/common/Button';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

export default function Page() {
  const hasChecked = false;
  const frequency = 'all'
  const originalList = hasChecked ? ['checkedGoalList', 1, 2, 3] : ['goalList', 1, 2, 3];
  const goalList = frequency === 'all' ? originalList : originalList.filter(value => value === frequency)

  return (
    <StyledForm>
      {goalList.map(value => (
        <label key={value}>
          <input type="checkbox" disabled={hasChecked}/>
          xx하기
        </label>
      ))}
      {!hasChecked ? null : (
        <div>
          정산 : 000원 / 제출시작 : 00시 00분
        </div>
      )}
      <div>
        <Link href="/">
          <Button className="gray">취소</Button>
        </Link>
        <Button disabled={hasChecked}>제출</Button>
      </div>
    </StyledForm>
  );
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;