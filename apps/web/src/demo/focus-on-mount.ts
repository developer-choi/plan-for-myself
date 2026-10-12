/*
 * 예시 창이 열리면 첫 포커스를 제목에 둔다.
 * 투어 끝 창은 누른 [마치기]가 투어와 함께 사라진 뒤 열려, Radix가 첫 버튼(닫기)에 주는 포커스에 키보드 포커스 링이 그려진다.
 * 디자인 시스템 Dialog가 onOpenAutoFocus를 내보내지 않아, 제목이 붙는 순간(Radix FocusScope의 effect보다 먼저) 포커스를 둬
 * 창 안에 이미 포커스가 있으면 건너뛰는 Radix 자동 포커스를 비켜 간다
 */
export function focusOnMount(element: HTMLElement | null) {
  element?.focus();
}
