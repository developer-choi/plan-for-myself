import styled from 'styled-components';
import Link from 'next/link';
import React from 'react';
import {useDispatchOpenModal} from '@store/reducers/modal';
import {HorizontalFieldset} from '@component/common/etc';
import Button, {BaseButton} from '@component/common/button';

export default function Home() {
  const hasChecked = true;
  const totalGoalList = [1];

  const {openGoalModal} = useDispatchOpenModal()

  return (
    <Wrap>
      {totalGoalList.length === 0 ? (
        <Button onClick={openGoalModal}>목표 추가하기</Button>
      ) : (
        <>
          {hasChecked ? (
            <div>
              <div>
                누적 목표 달성률 : 00%
              </div>

              <div>
                금일 정산금액 : 000,000원
                <Link href="/check-today">
                  <StyledLink>
                    {'내역 보기 >'}
                  </StyledLink>
                </Link>
              </div>
            </div>
          ) : (
            <Link href="/check-today">
              <Button>
                {'오늘 목표 체크하러가기 >'}
              </Button>
            </Link>
          )}

          <H2>연속 달성중인 목표</H2>
          <ul>
            <ContinuousGoal>
              <span className="date">3d</span>
              <span className="title">이거저거 하기</span>
            </ContinuousGoal>
            <ContinuousGoal>
              <span className="date">3d</span>
              <span className="title">이거저거 하기</span>
            </ContinuousGoal>
            <ContinuousGoal>
              <span className="date">3d</span>
              <span className="title">이거저거 하기</span>
            </ContinuousGoal>
          </ul>

          <H2>전체 목표 목록</H2>
          <HorizontalFieldset style={{marginBottom: 10}}>
            <label>
              <input type="radio" defaultChecked/>
              All
            </label>
            <label>
              <input type="radio"/>
              Daily
            </label>
            <label>
              <input type="radio"/>
              Weekly
            </label>
            <label>
              <input type="radio"/>
              Monthly
            </label>
          </HorizontalFieldset>

          <ul>
            <GoalOl>
              이거저거 하기
              <GoalPrice className="plus">+2,000원</GoalPrice>
              <GoalPrice className="minus">-2,000원</GoalPrice>
              <EditButton>수정</EditButton>
            </GoalOl>
            <GoalOl>
              이거저거 하기
              <GoalPrice className="plus">+2,000원</GoalPrice>
              <EditButton>수정</EditButton>
            </GoalOl>
          </ul>
        </>
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  padding: 20px;
`;

const StyledLink = styled.a`
  color: ${props => props.theme.main};
  font-weight: bold;
`;

const ContinuousGoal = styled.ol`
  display: flex;
  align-items: center;
  
  span.date {
    color: ${props => props.theme.main};
    font-weight: bold;
    margin-right: 10px;
    font-size: 18px;
  }
`;

const H2 = styled.h2`
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 5px;
`;

const GoalPrice = styled.span`
  margin-inline: 2px;
  &.plus {
    color: blue;
  }
  
  &.minus {
    color: red;
  }
`;

const GoalOl = styled.ol`
  display: flex;
  align-items: center;
  
  &:not(:first-child) {
    margin-top: 5px;
  }
`;

const EditButton = styled(BaseButton)`
  padding: 2px 8px;
  margin-left: 4px;
  
  background: orange;
  color: white;
  font-size: 12px;
`;
