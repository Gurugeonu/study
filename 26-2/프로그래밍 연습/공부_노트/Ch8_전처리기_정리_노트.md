# Ch8 전처리기 정리 노트

> 범위: A p2–16 · 출처 약어: A = chap8. Preprocessor.pdf
> 조건부 컴파일·미리 정의된 매크로는 이 자료(A p12–15) 범위만. 심화는 Ch13.

## 1. 핵심 개념
- **전처리기(preprocessor)**: 컴파일 전에 소스 코드를 바꿔 C의 기능·표기를 넓히는 단계. 컴파일러는 전처리 결과만 봄 [A p2]
- **전처리기 지시문(preprocessor directive)**: `#`로 시작하는 줄. 전처리기에게 주는 명령 [A p2]
  - 예: `#include <stdio.h>` → stdio.h 내용(약 800줄)으로 대체, `#define PI 3.14` 후 `PI` → `3.14` [A p2]
- **객체형 매크로(object-like macro)**: 쓸 때 데이터(값)처럼 보이는 매크로. `#define PI 3.14159` [A p4]
- **함수형 매크로(function-like macro)**: 함수 호출처럼 보이고 인자를 받는 매크로. `#define SQUARE(x) ((x) * (x))` [A p4]
- **문법 설탕(syntactic sugar)**: `#define`으로 C 문법을 취향에 맞게 바꾸기. `EQ`→`==`, `AND`→`&&`, `OR`→`||`, `NOT`→`!` [A p6]
- **조건부 컴파일(conditional compilation)**: 조건에 따라 코드 블록을 컴파일에 넣거나 뺌 [A p12]
- **미리 정의된 매크로(predefined macro)**: 컴파일러가 미리 정해 둔 매크로(`__DATE__` 등) [A p14]
- **static inline 함수**: 함수 본문을 호출 위치에 복사하도록 컴파일러에 요청하는 함수. `inline`은 C99에서 도입 [A p16]

## 2. 문법·핵심 사실

### #include 탐색 순서 [A p3]
| 형태 | 탐색 위치 |
|---|---|
| `#include <stdio.h>` | 시스템이 정한 여러 위치. **현재 디렉터리 제외** |
| `#include "filename"` | **현재 디렉터리 먼저**, 그다음 시스템이 정한 위치 |

- 표준 헤더 위치는 시스템마다 다름: Linux(GCC) `/usr/include/`, `/usr/include/x86_64-linux-gnu/`, `/usr/local/include/` · macOS(Clang) `/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include/` · Windows(MSVC) `C:\Program Files\Microsoft Visual Studio\2022\…\MSVC\<version>\include\`

### #define 형식
| 형식 | 의미 |
|---|---|
| `#define identifier token_string`$_{\text{opt}}$ | 파일의 **나머지 부분**에서 identifier를 token_string으로 모두 치환. **따옴표 문자열·주석 안은 제외**. token_string 생략 가능 [A p5] |
| `#define identifier(identifier, …, identifier) token_string`$_{\text{opt}}$ | 인자 있는 매크로 [A p7] |

- 상수 매크로 예: `PI 3.14159`, `C 299792.458`(광속 km/s), `EOF (-1)`(보통의 파일 끝 값), `MAXINT 2147483647`(4바이트 최대 정수), `(60*60*24)`(하루의 초) [A p5]

### stdio.h · ctype.h 매크로 [A p10–11]
| 헤더 | 매크로 | 의미 |
|---|---|---|
| stdio.h | `getchar()` | `getc(stdin)` |
| stdio.h | `putchar(c)` | `putc((c), stdout)` |
| ctype.h 검사 | `isalpha` / `isupper` / `islower` | 문자 / 대문자 / 소문자 |
| | `isdigit` / `isalnum` / `isxdigit` | 숫자 / 문자 또는 숫자 / 16진 숫자 |
| | `isspace` / `ispunct` | 공백 문자 / 구두점 |
| | `isprint` / `isgraph` | 출력 가능 / 출력 가능하되 공백 제외 |
| | `iscntrl` / `isascii`(비표준) | 제어 문자 / ASCII 코드 |
| ctype.h 변환 | `toupper(c)` / `tolower(c)` | 대응 대문자 / 소문자, 없으면 `c` 그대로 |
| | `toascii(c)`(비표준) | 대응 ASCII 값 |

- 검사 매크로: 조건이 참이면 **0이 아닌 값** 반환
- `c`: `char`·`int` 같은 정수형. 메모리에 저장된 `c` 값은 **바뀌지 않음**
- 매크로가 "값을 반환한다" = 전개된 식이 값으로 평가된다는 비공식 표현

### 제어 문자 (iscntrl이 참) [A p10]
| 이름 | 코드 | C 표기 | 뜻 |
|---|---|---|---|
| NUL | 0x00 | `'\0'` | 널 문자 |
| BEL | 0x07 | `'\a'` | 경고음 |
| BS | 0x08 | `'\b'` | 백스페이스 |
| HT | 0x09 | `'\t'` | 수평 탭 |
| LF | 0x0A | `'\n'` | 줄바꿈 |
| VT | 0x0B | `'\v'` | 수직 탭 |
| FF | 0x0C | `'\f'` | 폼 피드(새 페이지) |
| CR | 0x0D | `'\r'` | 캐리지 리턴 |
| ESC | 0x1B | `'\x1B'` | 이스케이프 |

### 조건부 컴파일 지시문 [A p12]
| 지시문 | 의미 | 예 |
|---|---|---|
| `#if expr` | expr이 0이 아니면 블록 컴파일 | `#if DEBUG` |
| `#ifdef name` | name이 정의되어 있으면 컴파일 | `#ifdef DEBUG` |
| `#ifndef name` | name이 정의되어 있지 **않으면** 컴파일 | `#ifndef MYHEADER_H` |
| `#elif expr` | else-if: 다른 조건 검사 | `#elif defined(SUN4)` |
| `#else` | 앞 분기가 모두 불일치일 때 | `#else` |
| `#endif` | 조건 블록 끝 | `#endif` |
| `defined(name)` | `#if` 안에서, 정의되어 있으면 1, 아니면 0 | `#if defined(A) && !defined(B)` |
| `#undef name` | 매크로 정의 제거 | `#undef DEBUG` |

### 미리 정의된 매크로 [A p14]
| 매크로 | 의미 | 예 |
|---|---|---|
| `__DATE__` | 컴파일 날짜, `"Mmm dd yyyy"` | `"Mar 15 2023"` |
| `__TIME__` | 컴파일 시각, `"hh:mm:ss"` | `"14:20:50"` |
| `__STDC__` | ISO C 표준 준수 여부 | 준수 시 `1` |
| `__FILE__` | 컴파일 중인 파일 이름 | `"my_program.c"` |
| `__LINE__` | 매크로가 놓인 줄 번호 | 50번 줄이면 `50` |
| `__func__` | C99 이후(및 C++)의 미리 정의된 **식별자**. 함수 안에서 함수 이름 문자열 리터럴 | `"main"` |

## 3. 원리·결론
- 단순 `#define`의 이점: 프로그램 **명확성(clarity)**, **이식성(portability)** [A p5]
- 완전 괄호화 `((x) * (x))`: 어떤 인자에도 안전. `SQ(7 + w)` → `((7 + w) * (7 + w))` [A p7]
- 매크로로 함수 호출을 인라인 코드로 대체 → 함수 호출 오버헤드 없음 → 더 효율적 [A p9]
- 매크로 본문에 함수와 다른 매크로 모두 사용 가능. `CUBE(x) (SQ(x) * (x))`, `F_POW(x) sqrt(sqrt(CUBE(x)))` = $x^{3/4}$ [A p9]
- 매크로로 다른 매크로 조합: `min4(a, b, c, d) min(min(a, b), min(c, d))` [A p9]
- `#if`는 매크로의 **값**, `#ifdef`는 **정의 여부**만 검사 [A p13]
- `&&`가 `||`보다 우선순위 높음 → `A || (B && !C)`의 괄호는 생략해도 같은 뜻 [A p13]
- 함수형 매크로 원칙: 인자에 괄호, 매크로 전체에 괄호, 세미콜론 피하기, static inline 함수 선호 [A p16]
- inline: 호출 오버헤드 없음 / **힌트일 뿐**, 인라인 여부는 컴파일러가 결정 / 매크로와 달리 **타입 검사**, 인자 **한 번만** 평가 [A p16]

## 4. 문제 유형별 접근
- 매크로 전개 결과 구하기: 인자를 글자 그대로 붙여 넣기 → 괄호 그대로 유지 → 그 뒤 연산자 우선순위로 계산
- 중첩 매크로(`SQ(SQ(*p))`): 바깥 매크로를 먼저 펼친 뒤 남은 매크로를 다시 펼침
- 디버그 출력 켜고 끄기: `#define DEBUG 1` + `#if DEBUG` 또는 `#define DEBUG` + `#ifdef DEBUG`. 코드 수정 없이 켜기는 `gcc -DDEBUG main.c` [A p13]
- 플랫폼별 코드: `#if defined(HP9000) || (defined(SUN4) && !defined(VAX))` … `#endif`. 긴 줄은 끝에 `\`로 이어 씀 [A p13]
- 헤더 중복 포함 방지(헤더 가드): `#ifndef MYHEADER_H` → `#define MYHEADER_H` → 선언 → `#endif` [A p13]
- 위치 정보 디버그 출력: 매크로 안에서 `__FILE__`, `__LINE__`, `__func__`를 `printf`에 넘김 [A p15]

## 5. 실수 포인트
- 인자에 괄호 없음 `#define SQ(x) x * x`: `SQ(a + b)` → `a + b * a + b` = $a + (b \cdot a) + b$ [A p7]
- 본문 전체 괄호 없음 `#define SQ(x) (x) * (x)`: `4 / SQ(2)` → `4 / (2) * (2)` = $(4/2)\cdot 2 = 4$, 1 아님 [A p7]
- 이름 뒤 공백 `#define SQ (x) ((x) * (x))`: SQ가 **객체형** 매크로가 됨. `SQ(7)` → `(x) ((x) * (x)) (7)` [A p8]
- 본문 끝 세미콜론 `((x) * (x));`: 문장에서는 `;;`(빈 문장)로 무해, 식 안에서는 `if (((x) * (x)); > 10)` 문법 오류 [A p8]
- `#include <…>`는 현재 디렉터리를 찾지 않음. 직접 만든 헤더는 `"…"` [A p3]
- 문자열 `"PI"`·주석 속 `PI`는 치환되지 않음 [A p5]
- `toupper(c)` 등은 `c` 변수 자체를 바꾸지 않음. 결과를 받아 써야 함 [A p11]
- `__func__`는 매크로가 아니라 미리 정의된 **식별자** [A p14]
- `SECONDS_PER-DAY`(A p5)의 하이픈은 식별자에 못 씀(원본 오타 의심, `SECONDS_PER_DAY`가 맞음)
