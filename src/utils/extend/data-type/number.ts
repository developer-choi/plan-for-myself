export function getAbsoluteValueWithSign(value: number) {
  const absoluteValue = Math.abs(value);
  const signType = value >= 0 ? 'positive' : 'negative';

  return {
    signType, // 클래스에 전달해서 양/음 스타일링 할 때 사용

    // 화면에 렌더링 할 때 사용
    absoluteValue, // 그중 숫자 부분만 따로 형식을 바꿀 때 사용 (3자리 마다 콤마를 끊거나 등)
    sign: signType === 'positive' ? '+' : '-',
  };
}
