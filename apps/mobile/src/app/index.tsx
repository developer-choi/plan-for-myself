import {Redirect} from 'expo-router';
import {getKoreanDate} from '@plan-for-myself/shared/date';
import {monthPath} from '@plan-for-myself/shared/study-record';

export default function HomeScreen() {
  const {year, month: monthIndex} = getKoreanDate();

  return <Redirect href={monthPath({year, month: monthIndex + 1})} />;
}
