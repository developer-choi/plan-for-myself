import type {AppDispatch, RootState} from '@store/store';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

// https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
