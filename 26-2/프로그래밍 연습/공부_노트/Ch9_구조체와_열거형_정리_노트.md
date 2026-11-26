# Ch9 구조체와 열거형 정리 노트

> 범위: A p2–27 · 출처 약어: A = chap9. Structures and Enumeration Types.pdf

## 1. 핵심 개념
| 구분 | 배열(array) | 구조체(structure) |
|---|---|---|
| 담는 데이터 | 같은 형(homogeneous) | 서로 다른 형(heterogeneous) |
| 원소 접근 | `a[i]` | `s.member`, `p->member` |

- **구조체 태그(tag)**: `struct card { int pips; char suit; };`의 `card`. 선언으로 파생 자료형 `struct card` 생성 [A p2]
- **struct 정의 = 틀(template)**: 사용자 정의형, 정의만으로는 메모리 할당 없음 [A p2]
- **구조체 배열**: `struct card {...} deck[52];` → deck은 struct card 52개짜리 배열 [A p4]
- **익명 구조체**: 태그 없는 struct, 이후 선언에서 그 형 재사용 불가 [A p6]
- **중첩 구조체(nested structure)**: 다른 구조체를 멤버로 둔 구조체, 복잡한 데이터 계층 표현 [A p18]
- **패딩 바이트(padding)**: 각 멤버가 최적 정렬 경계에서 시작하도록 컴파일러가 멤버 사이에 넣는 빈 바이트 [A p19]
- **정렬 경계(alignment)**: 4바이트 int는 4의 배수 주소, 8바이트 double은 8의 배수 주소가 이상적 [A p20]
- **비트 필드(bit field)**: 멤버가 차지할 비트 수 지정, 플래그·설정·임베디드용, 메모리 절약·비트 단위 배치 제어 [A p21]
- **열거형(enum)**: int형의 이름 붙은 정수 상수 집합(C 표준), 새 사용자 정의형, 그 형 변수는 상수 중 하나를 가짐 [A p22, p23]

## 2. 문법
| 문법 | 뜻 | 비고 |
|---|---|---|
| `struct card c1, c2;` / `struct card {...} c1, c2;` | 구조체 변수 선언(정의 뒤 / 정의와 동시) | [A p3] |
| `typedef struct card card;` → `card c1;` | 형에 짧은 이름 부여 | [A p3] |
| `typedef struct { double re, im; } Complex;` | typedef 시 태그 생략 가능 | [A p8] |
| `c1.pips = 3;` | 멤버 접근 `변수.멤버` | [A p4] |
| `c1 = c2;` | 구조체 통째 대입 | 같은 형끼리 [A p4] |
| `p->member` ≡ `(*p).member` | 포인터로 멤버 접근 | `->`가 더 읽기 쉬움 [A p11] |
| `card c = {13, 'h'};` | 멤버 순서대로 초기화 | [A p17] |
| `struct home_address {...} address = {...};` | 정의와 동시에 초기화 | [A p17] |
| `= {0};` / `= {};`(C23) | 모든 멤버 0 또는 NULL | [A p17] |
| `s.birthdate.day = 15;` | 중첩 멤버 접근 | [A p18] |
| `typeof(today) next_day;` | C23: 기존(익명) 구조체형 재사용 | [A p6, p7] |
| `unsigned int is_visible : 1;` | 비트 필드, 기반형 unsigned int, `:1`이 기본 크기 대체 | [A p21] |
| `enum day { MON, TUE, ..., SUN };` | 기본값 0부터 1씩(MON=0 … SUN=6) | [A p22] |
| `enum grade { A = 4, B = 3, C = 2, D = 1, F = 0 };` | 값 직접 지정 | [A p22] |
| `enum color : unsigned char { RED, GREEN, BLUE };` | C23: 기반형 고정 | [A p22] |
| `typedef enum { RED, GREEN, BLUE } Color;` | `enum` 반복 제거 | [A p25] |

- const 위치 [A p11]

| 선언 | p로 문자열 쓰기 | p 자체 변경 |
|---|---|---|
| `const char *p` | 불가 | 가능 |
| `char *const p` | 가능 | 불가 |
| `const char *const p` | 불가 | 불가 |

## 3. 원리·결론
- 멤버 이름은 구조체 안에서만 유일하면 됨, 구조체마다 자기 이름 공간 [A p5]
- struct 정의마다 새 형: 멤버가 같은 익명 정의 2개도 다른 형 → 서로 대입 오류, typedef로 한 번 정의하면 대입 가능 [A p7]
- 우선순위: `() [] . ->`·후위 `++ --`(최상위, 좌→우) > 단항 `++ -- ! ~ sizeof (type) + - & *`(우→좌) > `* / %` > `+ -` > `<< >>` > 관계 > `== !=` > `&` > `^` > `|` > `&&` > `||` > `?:`(우→좌) > 대입(우→좌) > `,`(좌→우) [A p14]
- `*p->x` = `*(p->x)`, `r.a.b` = `(r.a).b`, `p->a.b` = `(p->a).b` [A p11, p16]
- 함수 인자 전달 = 값에 의한 호출, 지역 사본 생성, 배열 멤버까지 memcpy식 바이트 복사(얕은 복사), 큰 구조체는 비효율 [A p15]
- 배열 매개변수 `struct student class[]` ≡ `struct student *class` [A p10]
- 초기값이 모자라면 나머지 멤버·원소는 0 [A p17]
- 비정렬 접근: 추가 사이클로 느려짐, 일부 CPU(임베디드)는 크래시·하드웨어 예외, C에서는 하드웨어와 무관하게 정의되지 않은 동작 [A p20]
- 일반 변수는 컴파일러가 정렬, 비정렬은 강제 포인터 캐스트에서 발생 [A p20]
- enum 기반형은 컴파일러 의존(GCC unsigned int, MSVC int), 음수 열거자가 있으면 GCC도 int [A p22, p23]
- enum 장점: 가독성·유지보수, 디버거에 1 대신 green 표시, 관련 상수를 한 형으로 묶음, 구조체 안에서 상태 표현·매직 넘버 방지, switch 제어 논리 명확 [A p22–26]

## 4. 문제 유형별 접근
- 멤버 접근 식 값 구하기: 우선순위표로 괄호 치기 → `->`/`.` 먼저 → `*`·`+` 순서 계산 [A p13]
- `*ptr++` → `*(ptr++)`(후위 우선) / `++*ptr` → 같은 우선순위, 우→좌 → `++(*ptr)` [A p14]
- 함수로 구조체 수정: 값 전달이면 수정본 반환 `e = update(e);`, 포인터 전달이면 `update(&e);` + `p->멤버` [A p16]
- 구조체 크기: 멤버별 정렬 경계 확인 → 앞 멤버 뒤 패딩 계산 → 합계(`char`+`int` = 1+3+4 = 8), 실제 값은 `sizeof`로 확인 [A p19]
- enum 활용: 상태를 enum으로 정의 → 구조체 멤버로 저장 → switch의 case로 분기 [A p24, p26]

## 5. 실수 포인트
- 같은 태그를 한 스코프에서 두 번 정의하면 재정의 오류 [A p7]
- `*p->last_name += 1`은 last_name이 `const char *`라 컴파일 오류 [A p11]
- `=+` 금지: `= +1`로 해석, `+=` 아님 [A p11]
- 패딩·정렬은 구현 의존 → 크기를 손계산으로 단정하지 말고 `sizeof()`로 확인 [A p19]
- `int *p = (int *)(buf + 1);`(buf는 char 배열) → 4의 배수 아닌 주소, 비정렬 [A p20]
- 비트 필드 배치·이식성은 컴파일러마다 다름(GCC·Clang·MSVC, 구현 정의) [A p21]
