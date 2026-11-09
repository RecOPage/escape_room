const byId = id => document.getElementById(id);
let room, items, selected, drag, rulesFound;
const endings = new Set();
let activeItem;
const views = {
  b3: ['B3 계단참', 'assets/images/emergency-stairs.png'],
  lift: ['엘리베이터', 'assets/images/elevator-interior.png'],
  hall: ['B2 정비구역', 'assets/images/b2-main.png'],
  desk: ['시설관리 창구', 'assets/images/service-desk.png'],
  stairs: ['B2 비상계단', 'assets/images/emergency-stairs.png'],
  door: ['B1 방화문', 'assets/images/fire-door.png'],
  bay: ['B1 회수 승강장', 'assets/images/recovery-platform.png'],
  panel: ['회수 점검구', 'assets/images/recovery-panel.png'],
  arrival: ['회수 호출', 'assets/images/recovery-platform.png'],
  ending: ['운행 종료', 'assets/images/ending-bad.png']
};
const names = {
  b3: 'ACT 1 / B3 계단참',
  lift: 'ACT 1 / 마지막 승객', hall: 'ACT 1 / 대기실',
  desk: 'ACT 1 / 시설관리 창구', stairs: 'ACT 1 / 비상계단',
  door: 'ACT 1 / 방화문', bay: 'ACT 2 / 회수 승강장',
  panel: 'ACT 2 / 점검구', ending: '운행 종료'
};
const rules = `[꾹 눌러 쓴 검은 볼펜]

계단 가기 전에 불부터 켜.
어두워도 보인다고 그냥 가지 말고.
창구에 있는 거, 지금 켜진 개수 먼저.
그다음 설치된 개수. 그 순서야.

─────
[줄을 맞춘 작은 연필 글씨]

메아리가 멎은 곳부터.
올라오며 본 숫자는 적고, 내려가며 본 숫자는 지우십시오.
남은 숫자를 낮은 층부터 입력.

적어 두세요. 저는 외웠다고 생각했습니다.

─────
[중간부터 잉크가 옅어진 파란 글씨]

발권 코드
① 지금 타는 지하층 숫자
② 돌아갈 지상층 숫자
③ 같이 가는 사람 수
나까지 세는 거 아님. 동행만.

─────
[바로 아래, 다른 필체]

소리 났다고 된 거 아니에요.
글자 꼭 보세요. 깨졌으면 다시 뽑아요.
그걸 넣지는 마세요. 제발.

─────
[종이 가장자리를 따라 급하게 쓴 글씨]

표는 점검구에.
넣었으면 노란 선 뒤에서 기다려요.
인터폰이 먼저 이름 부르면 대답하지 말아요.
아는 목소리여도요.
끝까지 듣지 않아도 돼요.`;
function setUse(active) {
  selected = active;
  byId('keyword').hidden = active;
  byId('submit').hidden = active;
  byId('use').hidden = !active;
  byId('command').classList.toggle('ready', active);
}
function actions(options) {
  byId('actions').replaceChildren();
  for (const [label, act] of options) {
    const button = document.createElement('button');
    button.textContent = label;
    button.onclick = act;
    byId('actions').append(button);
  }
}
function show(story, choices) {
  setUse(false);
  actions([]);
  const hideRules = !rulesFound;
  byId('notes').classList.toggle('unavailable', hideRules);
  byId('notes').inert = hideRules;
  byId('notes').setAttribute('aria-hidden', String(hideRules));
  byId('location').textContent = names[room];
  byId('story').textContent = story;
  const visible = choices.split(' / ').filter(choice => choice !== '?');
  byId('choices').textContent = visible.length ? '이동 · ' + visible.join(' · ') : '';
  byId('feedback').textContent = '';
  for (const id of ['ticket', 'damaged', 'grant', 'shoes']) byId(id).hidden = !items.has(id);
  const [caption, image] = views[room];
  setSceneImage(image, caption);
  byId('scroll').scrollTop = 0;
}
function setSceneImage(source, caption) {
  const image = byId('scene-art').querySelector('img');
  image.src = source;
  image.alt = caption;
  byId('scene-caption').textContent = caption;
}
function enter(next, observation = '') {
  room = next;
  switch (room) {
    case 'lift':
      show('퇴근길, 지하 1층 버튼을 눌렀다. 문이 닫히고 나서야 거울 속에 나 혼자라는 걸 확인했다.\n등을 기대자 벽이 한 뼘 뒤로 밀렸다. 등 뒤로 가느다란 틈이 벌어졌다. 손잡이에 손이 닿기 전에 발이 바닥에서 떨어졌다.', '?');
      break;
    case 'hall':
      show('녹슨 철판에 B2가 찍혀 있다. 바닥에는 규칙서가 놓여 있다. 시설관리 창구 옆으로 비상계단이 이어진다.\n' +
        (items.has('복구된 조명') ? '되돌아오니 형광등이 켜져 있었다. 불빛이 창구 옆 비상계단의 첫 계단참까지 닿는다.' : '형광등이 꺼져 있다. 비상구 너머에서 구두 소리가 난다.'), '? / 창구 / 비상계단');
      break;
    case 'desk':
      show("창구 유리에 ‘근무자 0명’이라고 적혀 있다. 유리 너머 빈 의자가 천천히 돌아간다.\n창구 아래 스위치 옆에 두 자리 입력창이 있다. 작은 점검창 너머 형광등 네 개 중 두 개가 켜져 있다.", "대기실");
      break;
    case 'stairs':
      show(observation + "B2 계단참이다. 위로 올라가면 B1, 아래로 내려가면 B3다.", "B1 / B3 / 대기실");
      break;
    case 'door':
      show("올라오며 본 B1 점검판에는 3 6 9가 찍혀 있다.\nB1 방화문에는 두 자리 키패드가 있다.", "B2");
      break;
    case 'bay':
      show("방화문이 바닥을 긁었다. 또 다른 승강장이 보였다. 바닥에 노란 안전선이 있다. 벽에는 인터폰과 텅 빈 점검구가 보인다. 구석에는 발권기가 놓여 있다.", "?");
      break;
    case 'panel':
      show('점검구 안에 종이 한 장 너비의 투입구가 있다. 유리에 ‘회수표 전용’이라는 글씨가 희미하다.', '승강장');
      break;
  }
}
function end(title, story) {
  room = 'ending';
  endings.add(title);
  const total = [...endings].some(found => found.startsWith('히든')) ? 5 : 4;
  show(title + '\n\n' + story + '\n\n발견한 엔딩 ' + endings.size + ' / ' + total, '?');
  if (title === '엔딩 3 / 지상 1층') {
    setSceneImage('assets/images/ending-return.png', '1F · 로비');
    const note = 'B3, 구두가 신경쓰인다.';
    byId('entries').value += (byId('entries').value ? '\n\n' : '') + note;
    rulesFound = true;
    byId('notes').classList.remove('unavailable');
    byId('notes').inert = false;
    byId('notes').setAttribute('aria-hidden', 'false');
  }
  if (title.startsWith('히든')) setSceneImage('assets/images/ending-companion.png', '1F · 동행');
  actions([['재시작', start]]);
}
function start() {
  items = new Set();
  rulesFound = false;
  byId('rules-text').textContent = rules;
  enter('lift');
}
function run(raw) {
  const key = raw.normalize('NFKC').toLowerCase().replace(/\s+/g, '');
  if (!key) return;
  if (key === '재시작') return start();
  if (key === '힌트' || key === '규칙서') {
    if (key === '규칙서' && room === 'hall' && !rulesFound) {
      rulesFound = true;
      enter('hall');
    }
    if (rulesFound) byId('rules-text').focus();
    return;
  }
  if (room === 'lift' && key === '틈') return enter('hall');
  if (room === 'hall') {
    if (key === '대기실') return enter('hall');
    if (key === '창구') return enter('desk');
    if (key === '비상계단') {
      if (items.has('복구된 조명')) return enter('stairs');
      return end('엔딩 1 / 아래층', '첫 발을 내딛자 바로 아래에서 구두 굽 소리가 났다.\n멈췄다. 아래의 소리도 멈췄다.\n다시 발을 들기도 전에 내 발밑에서 다음 걸음이 올라왔다.');
    }
  }
  if (room === 'desk' && key === '24') {
    items.add('복구된 조명');
    return show('제어기에 숫자를 입력하자 계단 쪽 형광등이 켜졌다. 동시에 구두 굽 소리가 끊겼다. 유리 너머 의자는 창구를 향한 채 멈춰 있다.', '대기실');
  }
  if ((room === 'desk' || room === 'stairs') && key === '대기실') return enter('hall');
  if (room === 'stairs' && key === 'b1') return enter('door');
  if (room === 'stairs' && key === 'b3') {
    room = 'b3';
    return show('내려가기 전 돌아본 B2 점검판에는 4 2가 찍혀 있었다.\nB3 계단참에 발을 디디자 발소리가 더는 울리지 않았다. 아래로 이어지는 계단은 없다. 난간 너머에 흐트러진 구두 한 켤레가 보였다.', 'B2');
  }
  if (room === 'b3' && key === '구두') {
    items.add('shoes');
    return show('구두 한 켤레를 챙겼다. 밑창이 닳아 한쪽으로 기울어져 있다.', 'B2');
  }
  if (room === 'b3' && key === 'b2') return enter('stairs', '올라오며 본 B2 점검판에는 4 8 2가 찍혀 있다.\n');
  if (room === 'door') {
    if (key === 'b2') return enter('stairs', '내려가기 전 돌아본 B1 점검판에는 3 9가 찍혀 있었다. 나사 네 개는 그대로였다.\n');
    if (key === '86') return enter('bay');
  }
  if (room === 'bay') {
    if (key === '안내문' || key === '발권기') {
      return show('발권기에 세 자리 입력창이 있다. 표시등이 일정한 간격으로 깜박인다.' + (items.has('shoes') ? '\n\n거울에 희미한 실루엣이 비친다.' : ''), '?');
    }
    if (/^\d{3}$/.test(key)) {
      if (key === '111' && items.has('shoes')) {
        items.add('grant');
        return show('발권음이 두 번 울렸다. 종이에 ‘지급권’이라고 선명하게 인쇄되어 있다.', '점검구 / 승강장');
      }
      const valid = key === '110';
      items.add(valid ? 'ticket' : 'damaged');
      return show(!valid ? '발권음이 울렸다. 종이에 ‘회�권 / B▒ → ▓F’가 찍혀 있다. 표를 주머니에 넣었다.' : '발권음이 울렸다. 종이에 ‘회수권 / B1 → 1F’가 선명하다. 표를 주머니에 넣었다.', '점검구 / 승강장');
    }
    if (key === '점검구') return enter('panel');
    if (key === '인터폰') {
      show('수화기에 손을 대기도 전에 스피커에서 내 이름이 나왔다. 발음이 어색했다. 두 번째는 어머니의 목소리였다.', '?');
      return actions([['수화기 들기', answer], ['안전선 뒤로 물러서기', () => enter('bay')]]);
    }
    if (key === '승강장') return enter('bay');
  }
  if (room === 'panel') {
    if (key === '승강장') return enter('bay');
  }
  byId('feedback').textContent = '입력이 통하지 않았다. 지문에서 다른 단서를 찾아보자.';
  byId('feedback').scrollIntoView({block: 'nearest'});
}
function answer() {
  end('엔딩 2 / 수신 확인', '“네.”\n스피커가 그 한 음절을 몇 번이고 재생했다. 매번 내 목소리에 조금씩 가까워졌다.\n마지막에는 내가 묻기도 전에 스피커가 내 입을 빌려 다음 사람의 이름을 불렀다.');
}
function useTicket() {
  setUse(false);
  if (!items.has(activeItem)) return;
  if (room !== 'panel') {
    byId('feedback').textContent = '회수표를 받아 줄 투입구가 보이지 않는다.';
    byId('feedback').scrollIntoView({block: 'nearest'});
    return;
  }
  if (activeItem === 'grant') {
    items.delete('grant');
    items.delete('shoes');
    return end('히든 엔딩 / 동행', '점검구가 지급권을 삼켰다. 인터폰은 처음으로 내 이름 대신 안내 방송을 내보냈다.\n\n“동행 한 분의 물품이 확인되었습니다.”\n\n손에 들고 있던 구두가 사라졌다. 열린 승강기 문 너머, 바닥에 그 한 켤레가 가지런히 놓여 있었다.\n\n승강기를 타고 지상 1층 로비에 내렸다. 문이 닫히기 직전 뒤를 돌아봤다.\n\n거울 속 실루엣이 희미하게 흔들렸다.');
  }
  items.delete(activeItem);
  if (activeItem === 'damaged') return end('엔딩 4 / 행선지 불명', '기계가 표를 삼켰다. 층 표시창에 방금 표에서 본 글자가 켜졌다.\n▓F.\n문이 열렸다. 승강기 안에서 내가 이쪽으로 걸어오는 게 보였다.');
  room = 'arrival';
  show('기계가 회수표를 삼켰다. 등 뒤에서 도착음이 울렸다.\n인터폰이 내 이름을 부른다. 이번에는 어머니 목소리다.\n“듣고 있으면 대답 좀 해.”', '?');
  actions([
    ['수화기 들기', answer],
    ['안전선 뒤에 머물기', () => end('엔딩 3 / 지상 1층', '나는 안전선 뒤에서 기다렸다. 인터폰이 조용해지고 승강기 문이 열렸다. 안으로 들어가자 1층 버튼이 저절로 켜졌다. 승강기가 위로 움직였다. 표시창의 B1이 1로 바뀌고, 문 너머로 익숙한 건물 로비가 보였다.\n밖으로 나와서야 코트 주머니가 불룩하다는 걸 알았다. 기계가 삼킨 회수권이 그 안에 있었다.\n\n회수권 뒤에는 붉은 글자로 ‘규칙서는 두고 가세요.’라고 적혀 있었다.\n\n나는 규칙서에 한 줄을 남겼다.\n‘B3, 구두가 신경쓰인다.’\n\n규칙서를 바닥에 내려놓았다.')]
  ]);
}
names.arrival = 'ACT 2 / 회수 호출';
byId('use').onclick = useTicket;
for (const id of ['ticket', 'damaged', 'grant']) {
const item = byId(id);
item.addEventListener('click', event => {
  if (event.detail === 0) activeItem = id;
  if (event.detail === 0) setUse(!selected);
});
item.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  event.preventDefault();
  activeItem = id;
  event.currentTarget.setPointerCapture(event.pointerId);
  drag = {x: event.clientX, y: event.clientY, ghost: null};
});
item.addEventListener('pointermove', event => {
  if (!drag || !event.isPrimary) return;
  if (!drag.ghost && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 7) {
    setUse(true);
    drag.ghost = document.createElement('div');
    drag.ghost.id = 'ticket-ghost';
    drag.ghost.append(item.querySelector('.ticket-art').cloneNode(true));
    document.body.append(drag.ghost);
  }
  if (drag.ghost) {
    drag.ghost.style.left = event.clientX + 'px';
    drag.ghost.style.top = event.clientY + 'px';
  }
});
function finishDrag(event) {
  if (!drag || !event.isPrimary) return;
  const ghost = drag.ghost;
  drag = null;
  ghost?.remove();
  if (event.type === 'pointercancel') return setUse(false);
  if (!ghost) return setUse(!selected);
  const hit = document.elementFromPoint(event.clientX, event.clientY);
  if (byId('command').contains(hit)) return useTicket();
  setUse(false);
}
item.addEventListener('pointerup', finishDrag);
item.addEventListener('pointercancel', finishDrag);
}
byId('command').addEventListener('submit', event => {
  event.preventDefault();
  run(byId('keyword').value);
  byId('keyword').value = '';
});
start();
