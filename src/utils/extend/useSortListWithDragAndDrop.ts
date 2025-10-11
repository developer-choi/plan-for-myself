import {preventDefault} from '@forworkchoe/core/utils';
import {HTMLAttributes, useCallback, DragEvent} from 'react';

export interface SortListWithDragAndDropParam<T> {
  list: T[];
  onChange: {
    all: (list: T[]) => void
  } | {
    moveIndex: (fromIndex: number, toIndex: number) => void // react-hook-form의 useFieldArray의 move()를 대응하기위함
  };
}

export interface SortListWithDragAndDropResult<E> extends Pick<HTMLAttributes<E>, 'draggable' | 'onDragOver'> {
  onDragStartCallback: (index: number) => (event: DragEvent<E>) => void;
  onDropCallback: (index: number) => (event: DragEvent<E>) => void;
}

export function useSortListWithDragAndDrop<T, E>({onChange, list}: SortListWithDragAndDropParam<T>): SortListWithDragAndDropResult<E> {
  const onDragStartCallback = useCallback((index: number) => {
    return (event: DragEvent<E>) => {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index.toString());
    };
  }, []);

  const onDropCallback = useCallback((droppedIndex: number) => {
    return (event: DragEvent<E>) => {
      const droppingIndex = Number(event.dataTransfer.getData('text/plain'));
      const rect = (event.target as HTMLDivElement).getBoundingClientRect();
      const isDroppedAboveMiddle = event.clientY < rect.top + rect.height / 2;

      const droppingItem = list[droppingIndex];

      if ('all' in onChange) {
        onChange.all(list.reduce((a, b, currentIndex) => {
          if (currentIndex === droppedIndex) {
            if (isDroppedAboveMiddle) {
              return a.concat(droppingItem).concat(b);
            } else {
              return a.concat(b).concat(droppingItem);
            }
          }

          if (currentIndex !== droppingIndex) {
            return a.concat(b);
          }

          return a;
        }, [] as T[]));
      } else if('moveIndex' in onChange) {
        onChange.moveIndex(droppingIndex, droppedIndex);
      }
    };
  }, [list, onChange]);

  return {
    draggable: true,
    onDragOver: preventDefault,
    onDragStartCallback,
    onDropCallback,
  };
}
