# 층과 층 사이

엘리베이터의 틈으로 떨어진 주인공이 규칙서를 읽고 탈출하는 한국어 텍스트 방탈출 게임입니다. 데스크톱 웹 브라우저용이며, 설치나 빌드 없이 실행할 수 있습니다.

## 실행

`index.html`을 브라우저에서 엽니다. 같은 폴더의 `assets` 디렉터리가 필요합니다.

## GitHub에 올리기

이 폴더의 **내용물**을 저장소 최상위에 올립니다. 저장소 첫 화면에 `index.html`과 `assets` 폴더가 보이는 구조입니다.

GitHub Pages에서는 업로드한 브랜치의 루트 디렉터리를 게시 대상으로 지정합니다. 별도의 빌드 명령이나 패키지 설치는 필요하지 않습니다.

## 파일 구성

- `index.html` — 화면 구성과 게임 진입점
- `assets/styles.css` — 화면 디자인
- `assets/game.js` — 지문, 규칙, 퍼즐, 아이템, 엔딩
- `assets/images/b2-main.png` — B2 정비구역
- `assets/images/service-desk.png` — 시설관리 창구
- `assets/images/emergency-stairs.png` — B2·B3 비상계단
- `assets/images/fire-door.png` — B1 방화문
- `assets/images/recovery-panel.png` — 회수권 투입구
- `assets/images/ending-bad.png` — 일반 배드 엔딩
- `assets/images/ending-return.png` — 지상 1층 탈출 엔딩
- `assets/images/ending-companion.png` — 히든 엔딩
- `assets/images/elevator-interior.png` — 첫 장면의 엘리베이터
- `assets/images/recovery-platform.png` — B1 회수 승강장과 회수 호출
- `assets/images/elevator-ticket.png` — 회수권 그림
- `.nojekyll` — 정적 파일 게시 설정
- `.gitignore` — 운영체제 임시 파일 제외

## 조작

장면에 나온 조사 대상이나 이동할 장소를 짧게 입력합니다. 퍼즐 답도 같은 입력칸에 입력합니다.

B2에서 `규칙서`를 입력하면 오른쪽에 규칙서가 나타납니다. 원문 아래에 개인 메모를 적거나 지문의 일부를 복사해 붙여넣을 수 있습니다.

회수권은 주머니에서 입력칸으로 끌어다 놓아 사용합니다. 아이템을 클릭한 뒤 사용 칸을 클릭해도 됩니다.

`재시작`을 입력하면 게임을 처음부터 시작합니다.

## 현재 구현

B2 창구의 조명 퍼즐, B3·B2·B1을 왕복하는 계단 퍼즐, 발권 퍼즐과 아이템 사용, 일반 엔딩 4개 및 히든 엔딩 1개가 포함됩니다.

장소와 엔딩별 이미지를 원본 전체 구도로 표시합니다. 구두는 임시 텍스트 아이콘이며, 세 종류의 권종은 같은 원화를 색상 효과와 이름으로 구분합니다.

진행 상황과 메모는 브라우저를 새로고침하면 초기화됩니다.
