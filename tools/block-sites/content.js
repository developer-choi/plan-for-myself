const REMIND_MESSAGE = 'MP에 있는거 RP로 옮기자.';

const INVEN_LIST = [
  'inven.co.kr/',
  'lostark.inven.co.kr/',
  'maple.inven.co.kr/',
  'lol.inven.co.kr/',
  'inven.co.kr/lol/',
  'inven.co.kr/maple/',
  'inven.co.kr/lostark/',
  'inven.co.kr/board/black/3583',
  'inven.co.kr/board/webzine',
];

const YOUTUBE_LIST = [
  // GAME
  '@ALTUBETV',
  '@blackwoonjang',
  '@MeDacBull',
  '@memolkim',
  '@penguinmonster',
  '@gsbg', // G식백과
  '@WolfYoutube_Official',
  '@publicst', // 얘는 무료야

  // WOMAN
  '@trollya217',
  '@nerububu',
  '@showtube91', // 소니쇼

  // 블루아카이브
  '@BlueSechi',
  '@Beliatan_',
  '@Zeroku777',
  '@jeenyburger',
  '@ZitaArchive',
  '@ZitaArchive',
  '@%EB%B0%B1%EC%9D%BC%EC%84%9C', // 백일서ㅈ

  // ETC
  '@gogumameori',
  '@REVA-STUDIO',
  '@chokbro'
].map(channelId => `www.youtube.com/${channelId}`);

const BLOCK_STIES = [
  ...INVEN_LIST,
  ...YOUTUBE_LIST,
];

function handleBlockSites() {
  if (!BLOCK_STIES.some(site => window.location.href.includes(site))) {
    return;
  }

  const box = document.createElement('div');
  box.style.position = 'fixed';
  box.style.left = 0;
  box.style.right = 0;
  box.style.top = 0;
  box.style.bottom = 0;
  box.style.zIndex = 9999;
  box.style.background = 'white';

  box.style.display = 'flex';
  box.style.alignItems = 'center';
  box.style.justifyContent = 'center';
  box.style.fontSize = '72px';
  box.style.fontWeight = 'bold';
  box.innerText = REMIND_MESSAGE;

  document.body.innerHTML = '';
  document.body.appendChild(box);
}

// Client Side Routing 환경에서도 URL 체크
function observeChangingUrl(callback) {
  let lastUrl = window.location.href;

  // DOM 변화 감지를 통해 Client Side Routing 감지
  const observer = new MutationObserver(() => {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      callback();
    }
  });

  observer.observe(document.body, {childList: true, subtree: true});
}

function main() {
  // 첫 사이트 접근 시 실행
  handleBlockSites();

  // 그 사이트 접근 이후 Client Side Routing 할때도 감지하도록 추가
  observeChangingUrl(handleBlockSites);
}

main();
