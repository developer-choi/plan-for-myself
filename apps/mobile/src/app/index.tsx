import {Redirect} from 'expo-router';
import {getKoreanDate, monthPath} from '@plan-for-myself/shared';

export default function HomeScreen() {
  const {year, month: monthIndex} = getKoreanDate();

  return <Redirect href={monthPath({year, month: monthIndex + 1})} />;
}
