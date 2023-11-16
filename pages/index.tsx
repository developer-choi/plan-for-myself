import styled from 'styled-components';
import Link from 'next/link';
import React from 'react';
import Button from '@component/common/Button';
import {useDispatchOpenModal} from '@store/reducers/modal';

export default function Home() {
  const hasChecked = false;
  const totalGoalList = [];

  const {openGoalModal} = useDispatchOpenModal()

  return (
    <Wrap>
      {totalGoalList.length === 0 ? (
        <div>
          <Button onClick={openGoalModal}>목표 추가하기</Button>
        </div>
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
              <StyledLink>
                {'체크하러가기 >'}
              </StyledLink>
            </Link>
          )}

          <h2 style={{marginTop: 20}}>연속 달성중인 목표</h2>
          <ul>
            <ol>
              <ContinuousDate>3d</ContinuousDate>
              xxxxxx하기
            </ol>
          </ul>

          <h2 style={{marginTop: 20}}>전체 목표 목록</h2>
          <div>
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
          </div>

          <ul>
            <ol>xxx 하기</ol>
            <ol>xxx 하기</ol>
            <ol>xxx 하기</ol>
            <ol>xxx 하기</ol>
            <ol>xxx 하기</ol>
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
  margin-left: 10px;
`;

const ContinuousDate = styled.span`
  color: ${props => props.theme.main};
  font-weight: bold;
  margin-right: 20px;
`;
