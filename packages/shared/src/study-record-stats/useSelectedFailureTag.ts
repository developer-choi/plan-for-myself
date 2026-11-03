import {useEffect, useEffectEvent, useState} from 'react';
import type {FailureTag} from '../study-record/type';
import {type FailureTagSelection, findSelectedFailure, toggleSelectedTag} from './selected-tag';

interface UseSelectedFailureTagParams {
  failureTags: FailureTag[];
  onOpen: () => void;
}

interface UseSelectedFailureTagResult {
  selection: FailureTagSelection;
  /* 고른 태그가 없거나 목록에 없으면 undefined */
  selectedFailure: FailureTag | undefined;
}

export default function useSelectedFailureTag({
  failureTags,
  onOpen,
}: UseSelectedFailureTagParams): UseSelectedFailureTagResult {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const handleOpen = useEffectEvent(onOpen);

  /* 카드가 그려진 뒤에야 ref가 채워지므로 렌더가 끝난 뒤 부른다 */
  useEffect(() => {
    if (selectedTag !== null) {
      handleOpen();
    }
  }, [selectedTag]);

  const onSelect = (tag: string) => {
    setSelectedTag((current) => toggleSelectedTag(current, tag));
  };

  return {
    selection: {selectedTag, onSelect},
    selectedFailure: findSelectedFailure(failureTags, selectedTag),
  };
}
