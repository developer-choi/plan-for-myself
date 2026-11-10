import {createRef} from 'react';
import {describe, expect, it} from '@jest/globals';
import {colors, type FailureTagStatus, type StudyRecordMonthly} from '@plan-for-myself/shared';
import type {TextStyle, View} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {createFailureTag, createMonthly} from '@/study-record-stats/test-utils';
import FailCard, {TAG_ROW_TEST_ID_PREFIX} from './FailCard';

const REPEATED_TAG = createFailureTag({count: 3, previousCount: 2, status: 'repeated'});
const APPEARED_TAG = createFailureTag({count: 2, previousCount: 0, status: 'appeared'});
const REDUCED_TAG = createFailureTag({count: 1, previousCount: 3, status: 'reduced'});

const GROUPS: {status: FailureTagStatus; label: string; title: string}[] = [
  {status: 'repeated', label: '반복', title: '반복하고 있어요'},
  {status: 'appeared', label: '새로 생긴', title: '새로 생겼어요'},
  {status: 'reduced', label: '줄어든', title: '줄어들고 있어요'},
];

const PHRASES: {name: string; monthly: StudyRecordMonthly; phrase: string}[] = [
  {
    name: '진행 중인 달이면 반복 줄에 지난달 횟수를 벌써 넘었다고 보여야 한다',
    monthly: createMonthly({failureTags: [REPEATED_TAG]}),
    phrase: '지난달 2번 → 벌써 3번',
  },
  {
    name: '끝난 달이면 반복 줄에 「벌써」 없이 지난달과 그 달 횟수만 보여야 한다',
    monthly: createMonthly({inProgress: false, failureTags: [REPEATED_TAG]}),
    phrase: '지난달 2번 → 3번',
  },
  {
    name: '진행 중인 달이면 새로 생긴 줄이 달 이름 대신 이번 달에 처음 생겼다고 보여야 한다',
    monthly: createMonthly({failureTags: [APPEARED_TAG]}),
    phrase: '이번 달 처음 · 2번',
  },
  {
    name: '끝난 달이면 새로 생긴 줄이 그 달 이름으로 처음 생겼다고 보여야 한다',
    monthly: createMonthly({month: '2026-09', inProgress: false, failureTags: [APPEARED_TAG]}),
    phrase: '9월 처음 · 2번',
  },
  {
    name: '진행 중인 달이면 줄어든 묶음 제목이 아직 줄어드는 중이라고 말해야 한다',
    monthly: createMonthly({failureTags: [REDUCED_TAG]}),
    phrase: '줄어들고 있어요',
  },
  {
    name: '끝난 달이면 줄어든 묶음 제목이 이미 줄었다고 말해야 한다',
    monthly: createMonthly({inProgress: false, failureTags: [REDUCED_TAG]}),
    phrase: '줄었어요',
  },
  {
    name: '줄어든 줄에 지난달 횟수와 그 달 횟수를 보여야 한다',
    monthly: createMonthly({failureTags: [REDUCED_TAG]}),
    phrase: '지난달 3번 → 1번',
  },
];

describe('FailCard', () => {
  describe('General cases', () => {
    describe('진행 중인 달', () => {
      GROUPS.forEach(({status, label, title}) => {
        it(`${label} 태그가 있으면 ${label} 묶음에 그 태그가 보여야 한다`, async () => {
          await render(
            <FailCard
              monthly={createMonthly({failureTags: [createFailureTag({tag: '늦잠', status})]})}
              selection={NO_SELECTION}
            />,
          );

          expect(screen.getByText(title)).toBeOnTheScreen();
          expect(screen.getByText('늦잠')).toBeOnTheScreen();
        });

        it(`${label} 태그가 없으면 ${label} 묶음만 빠져야 한다`, async () => {
          const otherGroups = GROUPS.filter((group) => group.status !== status);
          const otherTags = otherGroups.map((group) => createFailureTag({tag: group.label, status: group.status}));

          await render(<FailCard monthly={createMonthly({failureTags: otherTags})} selection={NO_SELECTION} />);

          otherGroups.forEach((group) => expect(screen.getByText(group.title)).toBeOnTheScreen());
          expect(screen.queryByText(title)).not.toBeOnTheScreen();
        });
      });
    });

    PHRASES.forEach(({name, monthly, phrase}) => {
      it(name, async () => {
        await render(<FailCard monthly={monthly} selection={NO_SELECTION} />);

        expect(screen.getByText(phrase)).toBeOnTheScreen();
      });
    });
  });

  describe('Edge cases', () => {
    it('그 달에 적은 실패가 없으면 실패가 없다는 안내가 보여야 한다', async () => {
      await render(<FailCard monthly={createMonthly({failureTags: []})} selection={NO_SELECTION} />);

      expect(screen.getByText('10월에 적은 실패가 없어요')).toBeOnTheScreen();
      expect(screen.getByText('실패를 적으면 지난달과 비교해 보여 줘요')).toBeOnTheScreen();
    });

    it('실패 태그가 하나라도 있으면 실패가 없다는 안내가 보이지 않아야 한다', async () => {
      await render(<FailCard monthly={createMonthly({failureTags: [REPEATED_TAG]})} selection={NO_SELECTION} />);

      expect(screen.queryByText('10월에 적은 실패가 없어요')).not.toBeOnTheScreen();
    });

    describe('횟수로는 반복인 태그', () => {
      it('서버가 줄어듦으로 주면 반복 묶음이 아니라 줄어든 묶음에 보여야 한다', async () => {
        await render(
          <FailCard
            monthly={createMonthly({failureTags: [createFailureTag({count: 3, previousCount: 2, status: 'reduced'})]})}
            selection={NO_SELECTION}
          />,
        );

        expect(screen.getByText('줄어들고 있어요')).toBeOnTheScreen();
        expect(screen.queryByText('반복하고 있어요')).not.toBeOnTheScreen();
      });
    });
  });

  describe('선택된 태그 줄', () => {
    GROUPS.forEach(({status, label}) => {
      it(`${label} 묶음에서 선택된 태그의 줄 바탕이 강조돼야 한다`, async () => {
        const tag = createFailureTag({tag: `${status}-태그`, status});
        await render(
          <FailCard monthly={createMonthly({failureTags: [tag]})} selection={{selectedTag: tag.tag, onSelect: noop}} />,
        );

        expect(screen.getByTestId(`${TAG_ROW_TEST_ID_PREFIX}${tag.tag}`)).toHaveStyle(SELECTED_ROW_STYLE);
      });

      it(`${label} 묶음에서 선택된 태그의 줄 글자가 굵어야 한다`, async () => {
        const tag = createFailureTag({tag: `${status}-태그`, status});
        await render(
          <FailCard monthly={createMonthly({failureTags: [tag]})} selection={{selectedTag: tag.tag, onSelect: noop}} />,
        );

        [screen.getByText(tag.tag), screen.getByText(MORE)].forEach((text) =>
          expect(text).toHaveStyle(SELECTED_TEXT_STYLE),
        );
      });
    });

    it('선택되지 않은 태그의 줄은 강조되지 않아야 한다', async () => {
      await render(
        <FailCard
          monthly={createMonthly({failureTags: [OVERSLEEP, SNACK]})}
          selection={{selectedTag: OVERSLEEP.tag, onSelect: noop}}
        />,
      );

      expect(screen.getByTestId(`${TAG_ROW_TEST_ID_PREFIX}${SNACK.tag}`)).not.toHaveStyle(SELECTED_ROW_STYLE);
      expect(screen.getByText(SNACK.tag)).not.toHaveStyle(SELECTED_TEXT_STYLE);
    });

    it('선택된 태그가 없으면 어느 줄도 강조되지 않아야 한다', async () => {
      const failureTags = [OVERSLEEP, SNACK];
      await render(<FailCard monthly={createMonthly({failureTags})} selection={NO_SELECTION} />);

      failureTags.forEach(({tag}) => {
        expect(screen.getByTestId(`${TAG_ROW_TEST_ID_PREFIX}${tag}`)).not.toHaveStyle(SELECTED_ROW_STYLE);
        expect(screen.getByText(tag)).not.toHaveStyle(SELECTED_TEXT_STYLE);
      });
    });
  });

  describe('체험 말풍선이 짚을 줄', () => {
    it('묶음 순서로 맨 앞인 태그 줄에 말풍선 ref가 붙어야 한다', async () => {
      const firstTagRowRef = createRef<View>();
      const failureTags = [
        createFailureTag({tag: '새로 생긴 태그', status: 'appeared'}),
        createFailureTag({tag: '반복 태그', status: 'repeated'}),
      ];
      await render(
        <FailCard
          monthly={createMonthly({failureTags})}
          selection={NO_SELECTION}
          tourTargets={{failGroupsRef: createRef<View>(), firstTagRowRef}}
        />,
      );

      expect(firstTagRowRef.current?.props.testID).toBe(`${TAG_ROW_TEST_ID_PREFIX}반복 태그`);
    });
  });
});

const SELECTED_ROW_STYLE = {backgroundColor: colors.failSoft};
const SELECTED_TEXT_STYLE = {fontWeight: 'bold'} satisfies TextStyle;
const MORE = '자세히 ›';
const OVERSLEEP = createFailureTag({tag: '늦잠'});
const SNACK = createFailureTag({tag: '야식'});

const NO_SELECTION = {selectedTag: null, onSelect: noop};

function noop() {}
