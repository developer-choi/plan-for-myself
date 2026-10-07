import type {FailureTag, FailureTagStatus} from '@plan-for-myself/shared';
import {render, screen, within} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {createMonthly} from '@/study-record-stats/test-utils';
import FailCard from './FailCard';

const REDUCED_TITLE_IN_PROGRESS = '줄어들고 있어요';
const REDUCED_TITLE_FINISHED = '줄었어요';
const ALREADY = '벌써';
const FIRST_IN_PROGRESS = '이번 달 처음';
const FIRST_IN_FINISHED_MONTH = '8월 처음';

const GROUPS: {status: FailureTagStatus; label: string; title: string}[] = [
  {status: 'repeated', label: '반복', title: '반복하고 있어요'},
  {status: 'appeared', label: '새로 생긴', title: '새로 생겼어요'},
  {status: 'reduced', label: '줄어든', title: REDUCED_TITLE_IN_PROGRESS},
];

const OVERSLEEP: FailureTag = {tag: '늦잠', count: 4, previousCount: 3, status: 'repeated'};
const PHONE_GAME: FailureTag = {tag: '폰게임', count: 2, previousCount: 0, status: 'appeared'};
const SNACK: FailureTag = {tag: '야식', count: 0, previousCount: 3, status: 'reduced'};

describe('FailCard', () => {
  describe('General cases', () => {
    GROUPS.forEach(({status, label, title}) => {
      it(`${label} 태그가 있으면 ${label} 묶음이 보인다`, () => {
        render(<FailCard monthly={createMonthly({failureTags: [createTag(status)]})} />);

        expect(screen.getByRole('heading', {name: title})).toBeInTheDocument();
      });

      it(`${label} 태그가 없으면 ${label} 묶음이 보이지 않는다`, () => {
        const otherTags = GROUPS.filter((group) => group.status !== status).map((group) => createTag(group.status));
        render(<FailCard monthly={createMonthly({failureTags: otherTags})} />);

        expect(screen.queryByRole('heading', {name: title})).not.toBeInTheDocument();
      });
    });

    it('진행 중인 달이면 줄어든 묶음 제목이 아직 줄어드는 중이라고 말한다', () => {
      render(<FailCard monthly={createMonthly({inProgress: true, failureTags: [SNACK]})} />);

      expect(screen.getByRole('heading', {name: REDUCED_TITLE_IN_PROGRESS})).toBeInTheDocument();
    });

    it('끝난 달이면 줄어든 묶음 제목이 이미 줄었다고 말한다', () => {
      render(<FailCard monthly={createMonthly({month: '2026-08', inProgress: false, failureTags: [SNACK]})} />);

      expect(screen.getByRole('heading', {name: REDUCED_TITLE_FINISHED})).toBeInTheDocument();
    });

    it('진행 중인 달이면 반복 줄에 「벌써」가 보인다', () => {
      render(<FailCard monthly={createMonthly({inProgress: true, failureTags: [OVERSLEEP]})} />);

      expect(screen.getByRole('button')).toHaveTextContent(ALREADY);
    });

    it('끝난 달이면 반복 줄에 「벌써」가 보이지 않는다', () => {
      render(<FailCard monthly={createMonthly({month: '2026-08', inProgress: false, failureTags: [OVERSLEEP]})} />);

      expect(screen.getByRole('button')).not.toHaveTextContent(ALREADY);
    });

    it('진행 중인 달이면 새로 생긴 줄에 이번 달 처음이라고 보인다', () => {
      render(<FailCard monthly={createMonthly({inProgress: true, failureTags: [PHONE_GAME]})} />);

      expect(screen.getByRole('button')).toHaveTextContent(`${FIRST_IN_PROGRESS} · ${PHONE_GAME.count}번`);
    });

    it('끝난 달이면 새로 생긴 줄에 그 달 이름으로 처음이라고 보인다', () => {
      render(<FailCard monthly={createMonthly({month: '2026-08', inProgress: false, failureTags: [PHONE_GAME]})} />);

      expect(screen.getByRole('button')).toHaveTextContent(`${FIRST_IN_FINISHED_MONTH} · ${PHONE_GAME.count}번`);
    });

    it('줄어든 묶음 제목 오른쪽에 그 묶음 태그 수만큼 개선된 실패가 보인다', () => {
      const appearedTags = [PHONE_GAME, {...PHONE_GAME, tag: '유튜브'}];
      const reducedTags = [SNACK, {...SNACK, tag: '군것질'}, {...SNACK, tag: '지각'}, {...SNACK, tag: '과식'}];
      render(<FailCard monthly={createMonthly({failureTags: [OVERSLEEP, ...appearedTags, ...reducedTags]})} />);

      const reducedGroup = getGroupByTitle(REDUCED_TITLE_IN_PROGRESS);
      expect(reducedGroup).toHaveTextContent(`개선된 실패 +${reducedTags.length}`);
    });
  });

  describe('Edge cases', () => {
    it('실패 태그가 없으면 그 달에 적은 실패가 없다는 안내가 보인다', () => {
      render(<FailCard monthly={createMonthly({failureTags: []})} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('실패 태그가 있으면 실패가 없다는 안내가 보이지 않는다', () => {
      render(<FailCard monthly={createMonthly({failureTags: [OVERSLEEP]})} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('횟수로는 반복인 태그를 줄어들었다고 받으면 줄어든 묶음에 보인다', () => {
      const mismatchedTag: FailureTag = {...OVERSLEEP, status: 'reduced'};
      render(<FailCard monthly={createMonthly({failureTags: [mismatchedTag]})} />);

      const reducedGroup = getGroupByTitle(REDUCED_TITLE_IN_PROGRESS);
      expect(within(reducedGroup).getByRole('button')).toHaveTextContent(mismatchedTag.tag);
    });

    GROUPS.forEach(({status, label, title}) => {
      it(`횟수·줄어든 정도·이름 어느 순서도 아니게 받으면 ${label} 묶음에 받은 순서대로 보인다`, () => {
        const previousCount = {repeated: 1, appeared: 0, reduced: 6}[status];
        const unsortedTags: FailureTag[] = [
          {tag: '야식', count: 2, previousCount, status},
          {tag: '늦잠', count: 3, previousCount, status},
          {tag: '폰게임', count: 1, previousCount, status},
        ];
        render(<FailCard monthly={createMonthly({failureTags: unsortedTags})} />);

        const rows = within(getGroupByTitle(title)).getAllByRole('button');
        expect(rows).toHaveLength(unsortedTags.length);
        unsortedTags.forEach(({tag}, index) => expect(rows[index]).toHaveTextContent(tag));
      });
    });
  });
});

function createTag(status: FailureTagStatus): FailureTag {
  return {tag: `${status}-태그`, count: 1, previousCount: 1, status};
}

function getGroupByTitle(title: string): HTMLElement {
  const group = screen.getByRole('heading', {name: title}).closest('section');

  if (!group) {
    throw new Error(`「${title}」 묶음이 없다`);
  }

  return group;
}
