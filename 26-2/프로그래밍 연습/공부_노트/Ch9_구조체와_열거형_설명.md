# Ch9 구조체와 열거형 설명

> 출처 약어: A = chap9. Structures and Enumeration Types.pdf

민수가 학교 카드 게임 대회를 관리하는 프로그램을 C로 만든다고 해 볼게요. 카드 52장, 참가자 명단, 참가자 주소, 게임 상태(시작·정지·일시정지)까지 모두 컴퓨터에 담아야 해요. 이 단원은 민수가 이 일을 하나씩 해결해 가는 이야기예요.

## 1. 구조체: 서로 다른 형을 한 묶음으로

**왜 필요한가.** 카드 한 장에는 숫자(1~13)와 무늬('c', 'd', 'h', 's')가 있어요. 숫자는 `int`, 무늬는 `char`예요. 배열(array)은 같은 형(homogeneous) 데이터만 담는 파생형이라 이 둘을 한 덩어리로 묶을 수 없어요. 구조체(structure)는 서로 다른 형(heterogeneous)의 변수를 하나로 묶어 줘요. [A p2]

**직관.** 구조체 정의는 칸이 나뉜 **빈 신청서 양식**이에요. 양식을 디자인했다고 종이가 생기지는 않아요. 이 비유를 단원 끝까지 써요.

```c
struct card {
    int pips;   /* 1,2,3,...,13 */
    char suit;  /* 'c', 'd', 'h', and 's' */
};
```

`card`가 구조체 태그(tag) 이름이에요. 이 선언으로 사용자 정의형 `struct card`가 생기지만, 틀(template)일 뿐이라 메모리는 할당되지 않아요. [A p2]

실제 종이(변수)를 만드는 방법은 세 가지예요. [A p3]
- 정의한 뒤 따로 선언: `struct card c1, c2;`
- 정의 끝에 바로 붙이기: `struct card { ... } c1, c2;`
- `typedef struct card card;`로 짧은 이름을 붙인 뒤 `card c1, c2;`

양식이 생겼으니 칸을 채워야겠죠?

## 2. 칸 채우기: `.` 연산자와 구조체 배열

멤버 접근 연산자 `.`은 `구조체변수.멤버이름` 꼴이에요. `c1.pips = 3; c1.suit = 's';`처럼 칸 하나를 골라 써요. 같은 형 구조체는 `c1 = c2;`로 통째로 대입할 수도 있어요. [A p4]

카드는 52장이니 양식도 52장이 필요해요. `struct card { ... } deck[52];`이라고 쓰면 deck은 struct card의 배열이 돼요. [A p4]

멤버 이름은 한 구조체 안에서만 겹치지 않으면 돼요. 과일 양식과 채소 양식에 둘 다 `calories` 칸이 있어도 괜찮아요. 멤버 이름은 자기 구조체에 지역적이고, 구조체마다 자기 이름 공간(name space)을 가지기 때문이에요. [A p5]

```c
a.calories = 100;   /* struct fruit a */
b.calories = 120;   /* struct vegetable b */
```

그런데 양식에 이름(태그)을 안 붙이면 어떻게 될까요?

## 3. 태그 없는 구조체와 "정의마다 새 형"

태그를 빼고 `struct { int day, month, year; ... } yesterday, today, tomorrow;`처럼 쓰면 익명 구조체가 돼요. 이름이 없으니 나중에 같은 형 변수를 또 선언할 수 없어요. 태그를 붙인 `struct date`는 `struct date yesterday, today, tomorrow;`처럼 언제든 다시 쓸 수 있고요. [A p6]

더 중요한 규칙이 있어요. **struct 정의를 쓸 때마다 새 형이 생겨요.** 멤버가 똑같은 익명 정의를 두 번 쓰면 겉모습만 같은 두 양식이라, `yesterday = today;`가 오류예요. typedef로 한 번만 정의해 두면 한 형이니 대입이 돼요. [A p7]

```c
typedef struct { int day, month, year; char day_name[4]; char month_name[4]; } Date;
Date yesterday, today;
yesterday = today;   /* OK */
```

typedef를 쓰면 이처럼 태그를 생략해도 돼요. `typedef struct { double re; double im; } Complex;` 뒤에 `Complex a, b, c[100];`처럼 써요(`Point`도 같은 방식). [A p8]

- C23에서는 `typeof(today) next_day;`나 `typeof(yesterday) today;`로 익명 구조체형도 재사용할 수 있어요. [A p6, p7]
- 같은 태그를 한 스코프에서 두 번 정의하면(`struct card {…}` 두 번) 재정의 오류예요. [A p7]

카드는 해결됐어요. 이제 참가자 명단을 만들어 볼까요?

## 4. 참가자 명단: 구조체 배열을 함수로 처리하기

민수는 헤더 `class_info.h`에 학생 양식을 둬요. [A p9]

```c
struct student { const char *last_name; int student_id; char grade; };
struct student tmp, class[CLASS_SIZE];
tmp.grade = 'A';
```

낙제(F) 학생 수를 세는 함수에서 핵심 줄은 다음과 같아요. [A p10]

```c
int fail(struct student class[])        /* ⇔ struct student *class */
    cnt += class[i].grade == 'F';       /* ⇔ cnt += (((class[i]).grade) == 'F'); */
```

- 매개변수의 `struct student class[]`는 `struct student *class`와 같아요.
- `[]`와 `.`이 `==`보다 먼저 묶여서 오른쪽 괄호식과 같아요.

> 보충: 배열을 인자로 넘기면 첫 원소의 주소가 넘어가요. 그래서 두 매개변수 선언이 같은 뜻이에요. 또 비교식 `==`의 결과는 참이면 1, 거짓이면 0이라 `cnt +=`로 바로 셀 수 있어요.

그런데 양식이 있는 곳의 주소(포인터)만 알 때는 칸을 어떻게 고를까요?

## 5. 포인터로 칸 고르기: `->`와 우선순위

**왜 필요한가.** `p`가 구조체를 가리킬 때 `*p.grade`라고 쓰면 안 돼요. 우선순위표에서 `.`이 `*`보다 높아서 `*(p.grade)`로 읽히기 때문이에요. 그래서 `(*p).grade`처럼 괄호가 필요하고, 이걸 줄인 것이 `->`예요. [A p11, p14]

$$\texttt{p->member} \equiv \texttt{(*p).member}$$

`->`는 포인터로 멤버에 접근하는 연산자이고, 괄호 버전보다 읽기 쉬워요. [A p11] 복소수 덧셈 함수도 `a->re = b->re + c->re; a->im = b->im + c->im;`처럼 포인터 세 개로 계산해요. [A p12]

**우선순위표에서 꼭 볼 것.** [A p14]
- 최상위: `() [] . ->`, 후위 `++ --` (좌→우)
- 그다음 단항: 전위 `++ --`, `! ~ sizeof (type)`, 단항 `+ -`, `&`, `*` (우→좌)
- 이어서 `* / %` → `+ -` → `<< >>` → `< <= > >=` → `== !=` → `&` → `^` → `|` → `&&` → `||` (모두 좌→우)
- `?:`와 대입 `= += -= ...`은 우→좌, 맨 아래 콤마는 좌→우

**예제: 식의 값 구하기** [A p13]. `struct student tmp, *p = &tmp;`에 grade 'A', last_name "Casanova", student_id 910017을 넣었어요.

| 식 | 같은 식 | 값 |
|---|---|---|
| `tmp.grade` | `p->grade` | `'A'` |
| `tmp.last_name` | `p->last_name` | `"Casanova"` |
| `(*p).student_id` | `tmp.student_id` | `910017` |
| `*p->last_name + 1` | `(*(p->last_name)) + 1` | `'D'` (68) |
| `*(p->last_name + 2)` | `(p->last_name)[2]` | `'s'` |

넷째 줄을 단계별로 풀어 볼게요.
1. `->`가 가장 강하니 `p->last_name`부터 묶어요. 문자열 "Casanova"의 시작 주소예요.
2. 단항 `*`가 다음이에요. 첫 글자 `'C'`를 꺼내요.
3. `+ 1`이 마지막이에요. `'C'`(67)에 1을 더해 68, 즉 `'D'`예요.

다섯째 줄은 주소에 2를 먼저 더해서 세 번째 글자 `'s'`를 가리키고, 그걸 꺼내요. `[2]`와 같은 뜻이에요.

**`++`가 섞이면.** [A p14]
- `*ptr++`: 후위 `++`가 더 높으니 `*(ptr++)`
- `++*ptr`: 전위 `++`와 `*`는 같은 우선순위라 결합 방향(우→좌)을 따라 `++(*ptr)`

**함정 세 가지.** [A p11]
- `*p->last_name += 1`은 `*(p->last_name) += 1`이에요. 그런데 last_name이 `const char *`라 그 문자열을 고칠 수 없어서 컴파일 오류가 나요.
- `=+`로 쓰면 `= +1`로 읽혀요. `+=`가 아니에요.
- const 위치에 따라 뜻이 달라요. `const char *p`는 p로 쓰기 불가·p 변경 가능, `char *const p`는 p 고정·문자열 변경 가능, `const char *const p`는 둘 다 고정이에요.

이제 이 양식을 함수에 넘기면 무슨 일이 생길까요?

## 6. 함수에 구조체 넘기기: 복사본이냐 원본 주소냐

구조체를 함수에 넘기면 값에 의한 호출(call-by-value)이에요. 함수 안에 지역 사본이 만들어지고, 배열 멤버까지 모든 멤버가 memcpy처럼 바이트 단위로 복사돼요(얕은 복사, shallow copy). 양식 전체를 복사기에 넣는 셈이라 큰 구조체일수록 비효율적이에요. [A p15]

> 보충: 얕은 복사라서 포인터 멤버는 주소값만 복사돼요. 사본과 원본이 같은 대상을 가리켜요.

민수의 직원 기록 `employee_data`에는 `char name[25]`, `struct dept department`(구조체 멤버), `struct home_address *a_ptr`(포인터 멤버), `double salary` 등이 있어요. [A p15] 부서 번호를 바꾸는 방법은 두 가지예요. [A p16]

| 방식 | 함수 안 | 호출 |
|---|---|---|
| 값 전달 | `r.department.dept_no = n; return r;` | `e = update(e);` |
| 포인터 전달 | `p->department.dept_no = n;` | `update(&e);` |

1. 값 전달은 사본을 고치므로, 고친 사본을 반환받아 `e`에 다시 대입해야 해요.
2. 포인터 전달은 원본 주소를 넘기니 반환이 필요 없고 복사 비용도 없어요.
3. `.`과 `->`는 같은 우선순위에 좌→우라서 `r.department.dept_no`는 `(r.department).dept_no`, `p->department.dept_no`는 `(p->department).dept_no`예요.

양식을 만들 때부터 칸을 미리 채워 둘 수는 없을까요?

## 7. 초기화: 만들면서 채우기

중괄호 안에 멤버 순서대로 값을 적어요. [A p17]
- `card c = {13, 'h'};` 하트 킹이에요. `struct fruit frt = {"plum", 150};`도 같은 방식이에요.
- 정의와 동시에: `struct home_address { ... } address = {"87 West Street", "Aspen, Colorado", 80526};`
- 값이 모자라면 나머지는 0이에요. `Complex a[3][3]`에 두 줄만 주면 `a[2][]`는 0으로 채워져요.
- `= {0};`이면 모든 멤버가 0 또는 NULL이고, C23의 `= {};`도 결과가 같아요.

양식 안에 또 다른 양식을 넣을 수도 있을까요?

## 8. 중첩 구조체: 양식 안의 양식

참가자 양식에 생일 칸을 넣고 싶다면, 날짜 양식 `struct date`를 통째로 멤버로 넣으면 돼요. 이렇게 하면 복잡한 데이터 계층을 그대로 표현할 수 있어요. [A p18]

```c
struct student { const char *name; struct date birthdate; };
s.birthdate.day = 15;
```

`.`을 두 번 따라 들어가면 안쪽 칸에 닿아요. 그런데 이 양식들은 메모리에 실제로 얼마나 자리를 차지할까요?

## 9. 패딩과 메모리 정렬

**왜 생기나.** 대부분의 현대 CPU는 정해진 바이트 경계에서 읽고 쓸 때 빨라요. 4바이트 `int`는 4의 배수 주소, 8바이트 `double`은 8의 배수 주소에 있는 게 이상적이에요. [A p20] 그래서 컴파일러는 각 멤버가 최적 정렬 경계에서 시작하도록 멤버 사이에 빈 바이트, 즉 패딩 바이트(padding)를 넣어요. 양식 칸이 눈금선에 딱 맞춰 시작하도록 여백을 두는 것과 같아요. [A p19]

**예제: 크기 계산** [A p19]. 4바이트 int 기준이에요.

```c
struct example { char a; int b; };
```

1. `a`는 offset 0에서 1바이트를 써요.
2. `b`가 offset 1에서 시작하면 두 워드에 걸쳐서 두 번 읽어야 해요.
3. 그래서 컴파일러가 3바이트 패딩을 넣어 `b`를 offset 4로 옮겨요. 정렬된 한 번 읽기면 돼요.
4. 합계는 1 + 3 + 4 = 8바이트예요. 5가 아니에요.

**언제 못 믿나.** 패딩과 정렬은 구현 의존이라 컴파일러와 CPU 구조에 따라 크기와 배치가 달라질 수 있어요. 실제 크기는 항상 `sizeof()`로 확인해요. [A p19]

**정렬이 깨지면.** [A p20]
- CPU가 추가 사이클을 써서 느려져요.
- 일부 아키텍처(일부 임베디드 CPU 등)는 크래시나 하드웨어 예외가 나요.
- C 언어에서 비정렬 객체 접근은 하드웨어와 상관없이 정의되지 않은 동작(undefined behavior)이에요.
- 일반 변수는 컴파일러가 알아서 정렬해요. 문제는 강제 포인터 캐스트예요. `buf`가 char 배열일 때 `int *p = (int *)(buf + 1);`이면 p가 4로 나누어떨어지지 않아요.

바이트 단위도 아깝다면, 비트 단위로 칸을 쪼갤 수 있을까요?

## 10. 비트 필드: 칸을 비트로 쪼개기

"보이는가?", "켜져 있는가?" 같은 예/아니오 칸에 4바이트를 쓰는 건 낭비예요. 비트 필드(bit field)는 멤버마다 몇 비트를 쓸지 정확히 지정해서, 메모리 배치를 비트 수준으로 제어해요. 플래그, 설정값, 임베디드 시스템에서 유용하고 메모리를 아낄 수 있어요. [A p21]

```c
unsigned int is_visible : 1;   /* 1 bit */
unsigned int reserved   : 6;   /* 6 bits */
```

`unsigned int`는 비트 필드의 기반형이고, `: 1`은 기본 크기를 덮어써서 "이 칸은 1비트면 된다"고 컴파일러에 알려요. 다만 비트 필드는 구현 정의 방식으로 저장돼요. GCC, Clang, MSVC마다 패킹과 정렬이 달라 배치와 이식성을 장담할 수 없어요. [A p21]

마지막으로, 게임 상태처럼 "정해진 몇 가지 값 중 하나"는 어떻게 담을까요?

## 11. 열거형: 번호에 이름표 붙이기

**왜 필요한가.** 게임 상태를 0, 1, 2로 적으면 코드만 봐서는 뜻을 알 수 없는 매직 넘버가 돼요. 열거형(enum)은 이름 붙은 정수 상수의 집합이고, C 표준에서 이 상수들은 `int`형이에요. 요일·상태·성적 같은 기호 값을 표현해서 가독성과 유지보수성을 높여요. [A p22] 양식으로 치면 "보기 중 하나에 체크하세요" 칸이에요.

**값 매기기.** [A p22]
- 기본은 0부터 1씩: `enum day { MON, TUE, WED, THU, FRI, SAT, SUN };` → MON = 0, …, SUN = 6
- 직접 지정: `enum grade { A = 4, B = 3, C = 2, D = 1, F = 0 };`
- 음수도 돼요: `enum status { ok=0, error=1, unknown=-1 };` [A p23]

**기반형.** enum의 실제 저장형은 컴파일러 의존이에요(GCC는 unsigned int, MSVC는 int). 음수 열거자가 있으면 GCC도 int를 써요. C23에서는 `enum color : unsigned char { RED, GREEN, BLUE };`처럼 직접 고정할 수 있어요. [A p22, p23]

**새 형이 생긴다.** enum도 새 사용자 정의형이고, 그 형의 변수는 상수 중 하나를 가져요. `enum color myColor = green;`이 그 예예요. 디버거가 1 대신 green을 보여 줘서 디버깅이 쉽고, 관련 상수가 한 형 이름 아래 모여요. [A p23]

**세 가지 활용.**
1. 구조체 안에: 계정 상태처럼 범주형 데이터를 명확하게 표현하고 매직 넘버를 막아요. [A p24]
   ```c
   enum status account_status;      /* struct user의 멤버 */
   u1.account_status = ACTIVE;
   ```
2. typedef와 함께: `typedef enum { RED, GREEN, BLUE } Color; Color c = GREEN;`처럼 `enum`을 반복해서 쓰지 않아도 돼서 간결해요. [A p25]
3. switch와 함께: case 이름이 곧 뜻이라 제어 논리가 분명해지고 실수가 줄어요. [A p26]
   ```c
   switch (cmd) { case START: ... break; case STOP: ... break; case PAUSE: ... break; default: break; }
   ```

이제 민수의 대회 프로그램은 카드, 명단, 주소, 상태를 모두 제자리에 담을 수 있어요.

## 한눈에 이어 보기
- 배열은 같은 형만 → **struct**(틀, 태그) → 변수 선언 3가지 → `.`·대입·구조체 배열 → 이름 공간
- 태그 없음 → 재사용 불가 → 정의마다 새 형 → **typedef**(한 형, 태그 생략) / C23 typeof
- 포인터 → `(*p).m` = `p->m` → 우선순위·결합 방향으로 식 해석 → const·`=+` 함정
- 함수 전달 = 값 복사(얕은 복사, 비효율) → 포인터 전달 → 초기화 `{}`·`{0}` → 중첩 구조체
- 메모리 배치: 정렬 경계 → 패딩(`sizeof`로 확인) → 비정렬은 UB → 비트 필드(구현 정의)
- **enum**(이름 붙은 int 상수, 새 형) → 구조체 멤버 · typedef · switch
