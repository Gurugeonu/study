# Ch15 C에서 C++로 정리 노트

> 범위: A p2–64 (구간 표지 p3·10·18·36·48·58 제외) · 출처 약어: A = chap15. Moving from C to C++.pdf

## Part 1. 객체지향 개념

- **패러다임 두 갈래** [A p4]
  - 명령형(imperative): 상태 변경 → 절차적 → 객체지향
  - 선언형(declarative): 상태 변경 없음 → 함수형·논리형(OCaml, Prolog, SQL)
  - 현대 언어는 패러다임 혼합(C++, Python, OCaml)

| 구분 | 절차적(procedural) | 객체지향(OOP) |
|---|---|---|
| 시기 | 80년대 중반 이전 | 80년대 후반 주류 |
| 문제를 나누는 단위 | 함수의 집합 | 클래스의 집합 |
| 데이터와 함수 | 분리 | 클래스 안에 캡슐화 |
| 언어 | Fortran, Cobol, PL/1, Pascal, C(1972, Bell Lab) | Simula(1967, 최초), Smalltalk(1972–80, Xerox PARC), C with Classes(1979)→C++(1983, C 호환), Python(1991), Java·Ruby(1995) |

- **절차적 프로그래밍**: 작업별 프로시저(함수)로 구성된 구조적 명령형(if/for/while·함수, goto 아님) [A p5]
  - 특징: 함수가 인자로 받은 데이터에 작용 / 아무 함수나 공유 데이터 수정 가능 / 함수·소스·헤더 파일로 분리
  - 한계: 자료구조 하나를 바꾸면 그것을 쓰는 모든 함수가 깨질 수 있음
- **객체지향 프로그래밍**: 대개 명령형 기반(객체 상태를 메서드가 변경), 객체(클래스의 인스턴스) 중심 [A p6]
  - 객체: 데이터(데이터 속성) + 프로시저(메서드, 멤버 함수)를 캡슐화한 개체
- **캡슐화(encapsulation)**: 데이터와 코드를 한 객체로 결합. private와 함께 인터페이스·구현 분리 [A p6]
- **정보 은닉(information hiding)**: 구현을 숨겨 사용 코드를 깨지 않고 구현 변경 가능, 인터페이스만 공개 [A p6]
- **추상 자료형(ADT)**: 값의 집합 + 연산의 집합으로 논리적 동작이 정의되는 타입. 데이터·연산 결합, 구현 숨김·인터페이스(연산)만 노출, 데이터 추상화·캡슐화 촉진 [A p7]
  - 예: 내장형 `int`, `double` / 사용자 정의 `class Stack`, `std::string`, C의 `FILE*`
- 클래스의 기본 아이디어 = 데이터 추상화 + 캡슐화 → 그런 클래스는 ADT를 정의. 설계자는 구현을, 사용자는 하는 일만 생각 [A p8]
  - Stack: 공개 `push()` `pop()` `size()` / 숨김 `data[100]` `top` `grow()` [A p8–9]

| 구분 | 데이터 추상화(data abstraction) | 캡슐화 |
|---|---|---|
| 성격 | 설계 원칙 | 분리를 강제하는 메커니즘 |
| 내용 | 무엇을 하는지만 보이고 어떻게는 숨김 → 인터페이스·구현 분리로 복잡도 관리 | 데이터+함수를 클래스로 묶고 접근 제한 → 인터페이스로만 데이터 변경 |

- C++에서 인터페이스 = public 멤버(사용자가 호출할 함수), 구현 = private 멤버(내부 데이터·헬퍼 함수). 결과: 모듈화·안전·유지보수 용이 [A p9]

## Part 2. struct에서 class로

| [A p11–12] | C의 struct | C++의 struct / class |
|---|---|---|
| 담는 것 | 데이터만 | 데이터 + 멤버 함수·생성자·소멸자·접근 지정자 |
| 함수 | 밖에서 struct 포인터를 받음 `setValues(&pt, 3, 4)` | 안에서 데이터에 직접 작용 `pt.set(7, 14)` |
| 데이터 보호 | 누구나 x, y 직접 변경 | private로 막음 |

- **C++ struct에 추가된 것** [A p13]
  - 멤버 함수: 데이터에 작용하는 동작
  - 생성자(constructor): 데이터를 통제된 방식으로 초기화. 초기화 리스트 `: x(initX), y(initY)`
  - 소멸자(destructor): 스코프를 벗어나거나 delete될 때 자동 호출, 자원 해제
  - 접근 지정자(access specifier): 멤버 가시성 제어
- 이점: 캡슐화, 추상화(인터페이스만 보임), 유지보수성(관련 기능을 한곳에) [A p13]
- **접근 수준** [A p14]

| 지정자 | 클래스 내부 | 파생 클래스 | 외부 |
|---|---|---|---|
| public | O | O | O |
| protected | O | O | X |
| private | O | X | X |

- protected는 상속용 [A p14]
- **struct vs class 기본 접근**: struct → public, class → private. 둘의 주된 차이 [A p13, 16–17]
- private 멤버는 클래스 밖 접근 불가, public 멤버 함수로만 접근. 원칙: 데이터는 private, public 함수가 인터페이스 [A p17]
- `std::cout`: 화면 출력(printf 대응), `<<`로 값을 차례로 보냄, `std::endl`로 줄바꿈 [A p12]

## Part 3. C++ 개요와 핵심 기능

- **역사** [A p19]
  - 1979 C with Classes: Bjarne Stroustrup, AT&T Bell Labs. C에 클래스·상속·인라인·기본 인자 추가
  - 1983 C++로 개명: 가상 함수, 함수·연산자 오버로딩, 참조, const, new/delete 추가
  - 1985 첫 상용 출시: Cfront로 C++를 C로 번역
  - 1990 "The Annotated C++ Reference Manual": ISO 표준 전까지 비공식 표준
  - Stroustrup 인용: C는 발등 찍기 쉬움, C++는 어렵지만 찍으면 다리 전체가 날아감
- **ISO 표준** [A p20]

| 표준 | 주요 내용 |
|---|---|
| C++98 | ISO/IEC 14882:1998, 최초 공식 표준 |
| C++03 | ISO/IEC 14882:2003, C++98 결함 수정 |
| C++11 | auto, 람다, 스마트 포인터, 동시성 |
| C++14 | 버그 수정·소규모 개선 |
| C++17 | std::optional, std::filesystem |
| C++20 | concept, range, module |
| C++23 | 현 표준, std::generator (C++26 예정) |

- 추세: 타입 안전·성능·생산성 향상 + 하위 호환 유지 [A p20]
- **핵심 기능**: 클래스, 오버로딩, RAII, 템플릿, STL, 상속·다형성, 예외, 네임스페이스, 유틸리티(inline, string, `<fstream>`), 스마트 포인터(C++11~) [A p21–22]
- **클래스(class)**: 객체의 데이터 속성과 메서드를 정하는 코드 / **객체(인스턴스)**: 클래스로 만든 구체적 항목, 한 클래스에서 여러 개 [A p23]
- **함수 오버로딩(function overloading)**: 같은 스코프에서 같은 이름, 매개변수의 개수·타입·순서가 다른 함수들. 예 `print(int)` `print(double)` `print(const std::string&)` [A p24]
- **연산자 오버로딩(operator overloading)**: 사용자 정의 타입에 연산자 재정의 → 기본형처럼 직관적 사용, 문법 편의·도메인 로직. 형태 `Complex operator+(const Complex& operand) const` [A p25]
- **RAII(Resource Acquisition Is Initialization)**: 자원 수명 = 객체 수명. 생성자에서 획득, 소멸자에서 해제 [A p21, 26]
  - 자원: 메모리, 열린 파일, 네트워크 연결
  - 의의: 수동 delete/close 불필요 → 누수 없음 / 예외 안전(스택 되감기 중에도 소멸자 실행)
  - RAII 기반: `vector`(원소 해제), `fstream`(파일 닫기), `unique_ptr`(메모리 삭제)
- **템플릿(template)**: 타입에 독립적인 함수·클래스 → 재사용·타입 안전 [A p21, 28]
  - 함수 템플릿: `template <typename T> T add(T a, T b)` → `add<int>(2, 3)`
  - 이점: 매크로·void 포인터(타입 검사 없음)보다 안전, 컴파일 시간 타입 검사, 여러 오버로드·클래스 변형 불필요
  - 클래스 템플릿: 사용할 때 타입을 채우는 클래스 설계도. `Box<int>`와 `Box<std::string>`은 다른 클래스 [A p29]
- **STL(Standard Template Library)**: 템플릿으로 만든 범용 라이브러리 [A p30]
  - 컨테이너(저장: `vector`, `list`, `map`) / 알고리즘(처리: `sort`, `search`, `find`) / 반복자(순회: `begin()`/`end()`)
- **컨테이너 분류** [A p32]

| 분류 | 특징 | 종류 |
|---|---|---|
| 순차(sequence) | 위치 순서 | vector(동적 배열, 인덱스 O(1)), array(고정 크기, C++11), list/forward_list(연결 리스트), deque(양방향 큐) |
| 연관(associative) | 키로 정렬, 균형 트리, O(log n) | map(키→값), set(정렬된 유일 값), multimap/multiset(중복 허용) |
| 비정렬(unordered, C++11) | 해시 테이블, 평균 O(1), 순서 없음 | unordered_map, unordered_set, unordered_multimap/set |
| 어댑터(adapter) | 다른 컨테이너 위 제한된 인터페이스 | stack(LIFO), queue(FIFO), priority_queue(최대가 위, 힙) |

- 경험칙: 기본은 vector, 키→값 조회는 map 또는 unordered_map [A p32]
- **반복자(iterator)**: 컨테이너 원소를 순회하는 객체 [A p33]
  - 특징: 여러 컨테이너에 같은 방식(추상화), `begin()`·`end()`로 유효 범위 명확, 대부분 앞뒤 이동 가능
  - 포인터 대비 장점: STL 알고리즘과 호환, 포인터 산술 오류 감소, 의도 명확
- **auto**: 컴파일러가 타입 추론(`std::vector<int>::iterator` 생략) [A p34–35]
- 범위 기반 for `for (int n : numbers)`: 각 원소 방문 / `push_back(x)`: 끝에 추가 / `{1, 2, 3}` 중괄호 초기화(C++11) [A p31]
- `rbegin()`/`rend()`: 뒤에서부터 읽는 반복자 → 이 범위를 오름차순 정렬하면 결과는 내림차순. 람다 `[](int a, int b){ return a > b; }` 전달로도 같은 결과 [A p31]
- vector는 임의 접근 → `vec[i]` 가능 / list는 임의 접근 불가 → 반복자 필수 [A p34–35]
- `std::find` 결과가 `end()`가 아니면 찾은 것, `insert(std::next(it), x)`는 그 다음 자리에 삽입 [A p35]

## Part 4. 상속과 다형성

- **상속(inheritance)**: `class Derived : public Base { };` 파생 클래스가 기반 클래스의 속성·동작을 물려받음. 공통 속성·메서드를 공유하는 클래스 계층(Shape → Circle, Square, Triangle) [A p37]
- 상속으로 하는 일: 새 함수 추가(Triangle의 FlipVertical, FlipHorizontal) / 기존 동작 변경(draw, erase 오버라이딩) [A p40]
- **오버라이딩(overriding)**: 파생 클래스가 상속받은 메서드를 새 구현으로 교체 [A p38, 40]
  - Java, Python: 모든 메서드가 동적 바인딩 → 재정의 = 오버라이딩
  - C++: 기본이 정적 바인딩 → virtual 함수만 오버라이딩, 비가상 재정의는 은닉(hiding)
- **정적 바인딩(static binding)**: 참조·포인터의 타입이 메서드 결정. 비가상 함수의 기본, 빠름 [A p39]
- **동적 바인딩(dynamic binding)**: 실제 객체 타입이 메서드 결정. 조건: 기반의 virtual 함수 + 기반 포인터·참조로 호출. 약간 느림 [A p42]
- **오버라이딩 vs 은닉** [A p43]

| | 기반에 virtual 있음 | 기반에 virtual 없음 |
|---|---|---|
| 용어 | 오버라이딩 | 은닉 |
| 바인딩 | 동적(실행 시간) | 정적(컴파일 시간) |
| `Shape& s = circle; s.draw();` | "Drawing a Circle" | "Drawing a Shape" |
| 다형성 | O | X |

- 많은 교과서는 둘 다 "오버라이딩"이라 부르지만 C++ 표준은 virtual인 경우만 오버라이딩 [A p43]
- `override`(파생 클래스에 씀): 맞는 virtual 기반 함수가 없으면 컴파일 오류. 필수는 아님 [A p43, 46]
- **다형성(polymorphism)** 종류: 유연하고 교체 가능한 인터페이스 [A p41]
  - 컴파일 시간(정적): 함수 오버로딩, 연산자 오버로딩
  - 실행 시간(동적): 가상 함수 → 기반 포인터·참조로 파생 클래스의 오버라이드 메서드 호출. 문법: 기반에 `virtual`, 파생에 `override`
- **순수 가상 함수(pure virtual function)** `virtual void draw() const = 0;` → Shape는 추상 기반 클래스(abstract base class), 직접 인스턴스화 불가 [A p44]
- **가상 소멸자** `virtual ~Shape() = default;`: 기반 포인터로 파생 객체를 delete할 때 올바른 정리 보장 [A p42, 44]
- **업캐스팅(upcasting)**: 파생 객체를 기반 객체처럼 다룸 [A p45]
  - C++에서 안전·암시적 변환, 파생 객체를 기반 포인터·참조에 대입 가능, 기반 부분으로 자동 취급
  - Shape가 필요한 곳 어디서나 파생 객체 사용 가능 (`doStuff(Shape& s)`에 Circle·Triangle·Square 전달)
- **이른 바인딩 vs 늦은 바인딩** [A p47]

| | early binding (= 정적) | late binding (= 동적) |
|---|---|---|
| 결정 시점 | 컴파일 시간 | 실행 시간 |
| 기준 | 선언된 타입 | 실제 객체 타입 |
| 동작 | 컴파일러가 특정 함수 호출 생성 → 링커가 코드의 절대 주소로 해결 | 실행 전까지 호출할 코드 미정 |
| 예 | `circle.draw();` (비가상) | `Shape* s = new Circle(); s->draw();` (가상) |

## Part 5. 예외·네임스페이스·유틸리티

- **예외 처리(exception handling)**: 런타임 오류 시 예외 처리기(exception handler)로 제어 이동 [A p49]
  - `try`: 예외가 날 수 있는 블록 / `throw`: 이상·오류 신호 / `catch`: 예외 처리 블록
  - `std::exception`: 모든 표준 예외의 기반 클래스. `std::runtime_error`는 `<stdexcept>` [A p50]
  - 이점: 오류 처리 코드와 일반 코드 분리, 크래시를 막아 견고함, 호출 스택 위로 오류 전파
  - 잡히면 오류 메시지 출력(`e.what()`, `std::cerr`) 후 프로그램 계속 실행 [A p50]
- **0으로 나누기** [A p50]

| | 실수 `10.0 / 0.0` | 정수 `10 / 0` |
|---|---|---|
| 결과 | inf 반환, 오류 없음 | 정의되지 않은 동작, 대개 크래시 |
| 문제 | 잘못된 값이 번짐(inf−inf → NaN), 나중에 드러남 | try/catch로 못 잡음 |

- Java·Python은 정수 ÷0에 예외를 던지지만 C++은 안 던짐 → 먼저 검사하고 throw [A p50]
- **네임스페이스(namespace)**: 관련 식별자를 묶어 이름 충돌·전역 스코프 오염 방지("이름 고갈" 해결) [A p51–52]
  - 다른 네임스페이스의 같은 이름은 충돌 없음. `namespace` 키워드, `geometry::Shape`처럼 한정
  - 표준 라이브러리 구성 요소는 모두 `std`
- **using 형태 비교** [A p51–53]

| 형태 | 효과 | 권장 |
|---|---|---|
| `std::cout` (한정 이름) | 매번 접두어 | 우선 사용 |
| `using std::cout;` / `using math_operations::add;` (using 선언) | 그 이름만 현재 스코프로, 다른 이름은 안 새어 나옴 | 필요할 때 선택적으로 |
| `using namespace std;` (using 지시문) | 작성한 파일 전체에서 네임스페이스의 모든 이름 사용 | 주의, 헤더에서는 금지 |

- 헤더: 옛 방식 `<iostream.h>`, 현대 방식 `<iostream>` [A p52]
- **새 I/O 라이브러리** `<iostream>` [A p54]
  - `cout`: 표준 출력 스트림, `<<` = 삽입 연산자("put to")
  - `cin`: 표준 입력 스트림, `>>` = 추출 연산자("get from")
  - 둘 다 자동 타입 변환, 한 스트림에 연속 사용 가능
- **inline 함수**: 호출 위치에 본문을 붙여 넣으라는 요청 → 호출 오버헤드 생략. 힌트일 뿐 컴파일러가 결정. 헤더에 정의해도 중복 정의 오류 없음 [A p55]
- `while (std::cin >> r)`: 입력이 성공하는 동안 반복 [A p55]
- **std::string** (`<string>`): C 문자 배열의 복잡성을 숨김. 동적 메모리 관리, `+`·`+=` 연결, 안전한 대입·비교 [A p56]
- **파일 입출력** `<fstream>` [A p57]
  - `std::ifstream` 읽기, `std::ofstream` 쓰기
  - `std::ios::in` = C의 `"r"` / `std::ios::out | std::ios::trunc` = C의 `"w"`(내용 비우고 쓰기)
  - `std::getline(in, s)`: 한 줄 읽고 `"\n"` 제거

## Part 6. 스마트 포인터

- **스마트 포인터(smart pointer)**: 원시 포인터를 감싸 동적 할당 객체 수명 관리, 필요 없으면 해제. `<memory>` [A p59]
  - 이점: 자동 자원 관리, 예외 안전, 메모리 관리 단순화, 누수·댕글링 포인터 방지

| 종류 [A p59–60] | 소유 방식 | 해제 시점 |
|---|---|---|
| `std::unique_ptr` | 독점 소유. 복사 불가, `std::move(p)`로 이동만 | 스코프를 벗어날 때 |
| `std::shared_ptr` | 참조 카운팅 공유 소유 | 카운트 0(마지막 shared_ptr 소멸) |
| `std::weak_ptr` | 비소유 참조(shared_ptr 보완) | 카운트에 영향 없음 |

- **핵심 연산** [A p61]

| | unique_ptr | shared_ptr | weak_ptr |
|---|---|---|---|
| 생성 | `make_unique<T>(args)` | `make_shared<T>(args)` | `weak_ptr<T> w = sp;` |
| 접근 | `*p` `p->` `p.get()` | `*p` `p->` `p.get()` | `w.lock()` → shared_ptr 반환 |
| 소유 포기 | `p.reset()` `p.release()` `std::move(p)`(이전) | `p.reset()` | `w.reset()` |
| 상태 확인 | `if (p)` null 아님? | `p.use_count()` | `w.expired()` |

- `wp.lock()`: wp로 shared_ptr 생성 시도 → 원래 shared_ptr가 살아 있으면 유효, 파괴됐으면 nullptr [A p62]
- **weak_ptr가 필요한 이유**: 두 shared_ptr가 서로 참조(순환 의존)하면 카운트가 0이 안 됨 → 누수. weak_ptr는 카운트에 안 들어가 순환을 끊음 [A p62–63]
- 경험칙: 소유자 → shared_ptr, 역포인터·관찰자 → weak_ptr. 용도: 부모↔자식 링크, 옵저버, 캐시 [A p63]

## 문제 유형별 접근

- 가상 함수 출력 예측: 기반에 virtual? → 기반 포인터·참조로 호출? → 둘 다 예면 실제 객체 타입, 아니면 선언 타입의 함수
- 접근 오류 판정: 기본 접근(struct/class) → 해당 지정자 영역 → 호출 위치(내부·파생·외부)를 표와 대조
- 오버로딩 가능 여부: 매개변수 개수·타입·순서 중 하나라도 다른가
- 컨테이너 고르기: 기본 vector → 키→값 map/unordered_map → LIFO·FIFO·최댓값은 어댑터
- 0 나누기 방어: 분모 검사 → `throw std::runtime_error` → `catch (const std::runtime_error& e)` → `e.what()` [A p50]
- 파일 복사: 열기 → `if (!in || !out)` → `getline`으로 읽고 `"\n"` 붙여 쓰기 [A p57]
- 스마트 포인터 고르기: 소유자 하나 unique_ptr / 여럿 shared_ptr / 관찰·역참조 weak_ptr

## 실수 포인트

- 반환 타입만 다른 함수는 오버로딩 안 됨 [A p24]
- RAII 클래스는 복사·이동도 처리해야 함(Rule of 3/5) [A p27]
- 반복자는 경계 검사 없음: `*v.end()`는 정의되지 않은 동작 [A p33]
- C++에서 virtual 없는 재정의는 오버라이딩이 아니라 은닉 → 기반 참조로 부르면 기반 함수 실행 [A p38–39, 43]
- 기반 포인터로 delete할 계획이면 소멸자를 virtual로 [A p44]
- 정수 ÷0은 try/catch로 못 잡음 → 미리 검사 [A p50]
- 내 `count`와 `std::count`: `using namespace std;` 아래서 모호한 이름 컴파일 오류 [A p52]
- `getline()`은 `"\n"`을 지우므로 쓸 때 다시 붙임 / 파일 열림 여부 항상 확인 [A p57]
- `reset()`: unique_ptr는 객체 삭제, shared_ptr는 카운트 1 감소 [A p61]
- `release()`: 삭제 없이 원시 포인터 반환 → 직접 delete해야 함 [A p61]
- `get()`: 원시 포인터를 빌려줄 뿐, 소유권은 스마트 포인터에 그대로 [A p61]
- `expired()`는 확인만, 실제 접근은 `lock()` [A p63]
