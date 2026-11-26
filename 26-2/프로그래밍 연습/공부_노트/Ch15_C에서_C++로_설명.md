# Ch15 C에서 C++로 설명

> 출처 약어: A = chap15. Moving from C to C++.pdf (p2–64)

## 이야기의 시작: C로 만든 그림판을 C++로 옮기기

민수는 C로 그림판을 만들었어요. 점 좌표를 저장하고, 도형을 그리고, 파일로 저장해요. 기능이 늘자 좌표 구조를 조금 바꿨더니 함수 여기저기가 망가졌고, 파일 닫기를 깜빡해 자료가 날아가기도 했어요. 그래서 그림판을 C++로 옮기기로 했어요.

이사는 여섯 걸음이에요 [A p2]. OOP 개념(Part 1), struct를 class로 키우기(Part 2), C++의 새 도구들(Part 3), 도형 가족의 상속과 다형성(Part 4), 예외·네임스페이스·유틸리티(Part 5), 스마트 포인터(Part 6)예요.

비유는 하나만 써요. **클래스는 자판기**예요. 안의 음료와 장치는 잠겨 있고, 손님은 버튼만 눌러요.

---

## Part 1. 객체지향 개념

### 1-1. 프로그래밍 패러다임: 절차적에서 객체지향으로

**왜 필요할까요?** 민수의 문제는 "코드를 어떤 단위로 나누느냐", 곧 패러다임(paradigm)에서 시작해요. 패러다임은 두 갈래예요 [A p4].

- **명령형(imperative)**: 상태(변수 값)를 바꿔 가며 일해요. 그 아래에 절차적, 다시 그 아래에 객체지향이 있어요.
- **선언형(declarative)**: 상태를 바꾸지 않아요. 함수형·논리형인 OCaml, Prolog, SQL이에요.

이 강의는 명령형 가지를 따라가요. 요즘 언어(C++, Python, OCaml)는 여러 패러다임을 섞어 써요.

**절차적 프로그래밍(procedural programming)**은 80년대 중반 이전의 주류로, 현실 문제를 **함수의 집합**으로 바꾸고 데이터와 함수를 따로 다뤄요. Fortran, Cobol, PL/1, Pascal, C(1972, Bell Lab)가 이 방식이에요 [A p4]. 작업별 프로시저(함수)로 짜는 **구조적** 명령형이라서, goto 대신 if / for / while 블록과 함수로 흐름을 짜요 [A p5]. 함수는 인자로 받은 데이터에 작용하고, 데이터와 함수가 떨어져 있어 **어떤 함수든** 공유 데이터를 바꿀 수 있으며, 코드를 함수와 소스·헤더 파일로 나눠요.

**한계가 바로 민수의 문제예요.** 자료구조 하나를 바꾸면 그것을 쓰는 모든 함수가 망가질 수 있어요 [A p5]. 그래서 데이터와 함수를 한 묶음으로 만들자는 생각이 나왔어요.

**객체지향 프로그래밍(OOP)**은 80년대 후반 주류가 됐어요. 현실 문제를 **클래스의 집합**으로 바꾸고, 데이터와 그 함수를 클래스 안에 **캡슐화**해요 [A p4]. 계보는 Simula(1967, 최초) → Smalltalk(1972–80, Xerox PARC, "객체지향"이라는 말을 퍼뜨림) → C with Classes(1979) → C++(1983, Bell Lab, C 호환) → Python(1991), Java·Ruby(1995)예요.

OOP는 보통 명령형 위에 서 있어요. 객체가 상태를 갖고 메서드가 그 상태를 바꾸니까요 [A p6]. 중심은 **객체**(클래스의 인스턴스)이고, 객체는 데이터와 프로시저를 함께 담은 개체예요. 데이터는 **데이터 속성(data attribute)**, 프로시저는 **메서드(method)** 또는 **멤버 함수(member function)**라 부르고, 멤버 함수가 데이터 속성에 작업해요. 자판기의 음료 재고가 데이터 속성, "음료 내보내기"가 메서드예요.

그런데 손님이 뒷문을 열고 재고를 마음대로 바꾸면 곤란하겠죠?

### 1-2. 캡슐화와 정보 은닉

- **캡슐화(encapsulation)**: 데이터와 코드를 한 객체로 묶는 것이에요. 여기에 접근 제어(private)를 더하면 **인터페이스와 구현을 분리**할 수 있어요 [A p6].
- **정보 은닉(information hiding)**: 세부 구현을 숨겨서, 클래스를 쓰는 코드를 깨뜨리지 않고도 구현을 바꿀 수 있게 해요. 객체와 소통하는 방법(인터페이스)만 드러내고 내부 사정은 감춰요 [A p6].

자판기 냉각 장치를 바꿔도 버튼(인터페이스)이 그대로라 손님(사용 코드)은 영향을 받지 않아요. 이 "버튼만 보고 쓰는 타입"을 일반화하면요?

### 1-3. 추상 자료형(ADT)

**추상 자료형(Abstract Data Type, ADT)**은 논리적 동작이 두 가지로 정해지는 타입이에요 [A p7].

- **값의 집합**: 담을 수 있는 데이터
- **연산의 집합**: 그 데이터와 상호작용하는 방법

데이터와 연산이 묶여 있고, 구현은 숨기고 인터페이스(연산)만 드러내요. 그래서 데이터 추상화와 캡슐화를 자연스럽게 이끌어요.

우리는 이미 ADT를 써 왔어요. `int`, `double`로 `+ - * /`를 할 때 하드웨어 사정을 몰라도 되잖아요. 사용자 정의 ADT는 구조체나 클래스로 만들어요. `class Stack`, `std::string`, C의 `FILE*`이 예예요.

클래스의 기본 아이디어는 **데이터 추상화와 캡슐화**이고, 이 둘을 쓴 클래스는 곧 ADT를 정의해요 [A p8]. 설계자는 "어떻게 구현할까"를, 사용자는 "무엇을 하나"만 생각해요. Stack 사용자는 `push()`, `pop()`, `size()` 버튼만 보고, 안쪽 `int data[100];`, `int top;`은 설계자만 알아요.

### 1-4. 데이터 추상화 vs 캡슐화

둘은 비슷해 보이지만 층위가 달라요 [A p9].

- **데이터 추상화(data abstraction)**는 **설계 원칙**이에요. 객체가 무엇을 하는지는 보여 주고 어떻게 하는지는 숨겨요. 인터페이스와 구현을 나눠 복잡도를 관리해요.
- **캡슐화**는 그 분리를 **강제하는 장치**예요. 데이터와 함수를 클래스 하나로 묶고, 접근을 막아서 데이터가 인터페이스를 통해서만 바뀌게 해요.

C++에서는 인터페이스 = **public 멤버**(사용자가 부를 함수), 구현 = **private 멤버**(내부 데이터와 `grow()` 같은 도우미 함수)예요. public이 유일한 입구이고 private는 봉인돼 있어서, 코드가 모듈화되고 안전하며 유지보수가 쉬워져요.

이제 민수의 실제 C 코드를 바꿔 볼까요?

---

## Part 2. struct에서 class로

### 2-1. C의 struct: 데이터만 담는 상자

민수의 C 그림판에는 점이 이렇게 있었어요 [A p11].

```c
struct Point { int x; int y; };
void setValues(struct Point *p, int newX, int newY);  // 함수는 밖에
setValues(&pt, 3, 4);  // 데이터를 넘겨줌
```

C의 struct는 데이터를 묶을 뿐, 멤버 함수도 접근 지정자(private, protected, public)도 없어요. 그래서 모든 함수가 struct 포인터를 받고, 아무 코드나 `x`, `y`를 바꿀 수 있어요. 문 없는 진열대예요.

### 2-2. C++의 struct: 함수를 안으로

C++의 struct는 더 다재다능해서 함수, 생성자, 접근 지정자를 품을 수 있어요. 멤버 함수는 struct 안의 데이터에 바로 작용해요 [A p12].

```cpp
struct Point {
    int x, y;
    void setValues(int newX, int newY) { x = newX; y = newY; }
    void print() { std::cout << "(" << x << ", " << y << ")" << std::endl; }
};
```

포인터를 넘길 필요 없이 `x`만 써도 "이 점의 x"예요. 처음 나온 `std::cout`은 화면 출력 도구(printf 역할)로, `<<`가 값을 차례로 보내고 `std::endl`이 줄을 끝내요(Part 5에서 다시 봐요).

C++ struct에 더해진 것이에요 [A p13].

- **멤버 함수**: 데이터에 작용하는 동작을 정의해요.
- **생성자(constructor)**: 데이터를 통제된 방식으로 초기화하는 특수 멤버 함수예요.
- **소멸자(destructor)**: 객체가 스코프를 벗어나거나 delete될 때 **자동으로** 불려서 자원을 해제하는 특수 멤버 함수예요.
- **접근 지정자(access specifier)**: 멤버가 어디서 보이는지 정해요.

이점은 캡슐화, 추상화(무엇을 하는지만 보임), 유지보수성(관련 기능이 한곳에)이에요.

진열대에 함수라는 버튼을 달았어요. 이제 문을 잠가 볼까요?

### 2-3. 접근 지정자: public, protected, private

접근 지정자는 멤버(속성과 메서드)의 접근 수준을 정해요 [A p14].

| 지정자 | 클래스 내부 | 파생 클래스 | 외부 |
|---|---|---|---|
| public | O | O | O |
| protected | O | O | X |
| private | O | X | X |

protected는 상속에서 쓰여서 Part 4에서 다시 나와요. 원본 예에서는 `private:` 아래의 `privateData`를 밖에서 건드리면 막혀요.

```cpp
ExampleStruct() : privateData(0) {}  // 생성자: 초기화 리스트로 0을 넣음
e.publicData = 1;   // OK
e.privateData = 1;  // error!
```

`: privateData(0)`처럼 생성자 이름 뒤 콜론에 쓰는 부분이 **초기화 리스트**예요. 객체가 태어날 때 멤버를 바로 채워요.

**예제: 충전금 계좌** [A p15]. 민수는 그림판에 유료 브러시를 사는 충전금 기능을 넣기로 했어요. 잔액이 아무렇게나 바뀌면 안 되겠죠.

```cpp
void deposit(int amount) { if (isPositive(amount)) balance += amount; }
private:
    int balance;
    bool isPositive(int x) const { return x > 0; }
```

단계별로 따라가요.
1. `Account acc("Kim", 100);` 잔액 100으로 시작해요.
2. `acc.deposit(50);` 50은 양수라서 통과, 잔액 150이에요.
3. `acc.deposit(-30);` `isPositive`가 false를 돌려줘서 거부돼요. 잔액은 그대로 150이에요.
4. 출력은 `Kim`, `Balance: 150`이에요.
5. `acc.balance = 999;`와 `acc.isPositive(5);`는 둘 다 private라서 컴파일 오류예요.

잔액이 `deposit()`이라는 버튼으로만 바뀌니까 음수 입금 같은 사고를 막을 수 있어요. 안쪽에서는 private 멤버를 자유롭게 쓰고, 바깥에서는 못 쓰는 차이를 눈여겨보세요.

### 2-4. struct와 class의 차이

**class와 struct의 주된 차이는 기본 접근 수준 하나예요.** struct 멤버는 기본이 public, class 멤버는 기본이 private예요 [A p13, p16].

```cpp
class PointClass {
    int x, y;  // 아무것도 안 써도 private
public:
    PointClass(int initX, int initY) : x(initX), y(initY) {}
    void set(int newX, int newY);
    void print() const;
};
```

사용할 때는 이래요 [A p17].
1. `PointClass pt(5, 10);` 생성자가 x=5, y=10으로 초기화해요.
2. `pt.x = 5;` x가 private라서 오류예요.
3. `pt.set(7, 14); pt.print();` public 함수로는 돼요. 출력은 `(7, 14)`예요.

private 멤버는 밖에서 접근할 수 없고 public 멤버 함수로만 다뤄요. 그래서 원칙은 "데이터는 private, public 함수가 인터페이스"예요. 문제에서는 `struct`인지 `class`인지부터 보세요. 지정자 없는 멤버의 접근 수준이 거기서 갈려요.

자판기 한 대가 완성됐어요. C++는 무엇을 더 줄까요?

---

## Part 3. C++ 개요와 핵심 기능

### 3-1. C++의 역사

- **1979**: Bjarne Stroustrup(비아르네 스트로우스트럽)이 AT&T Bell Labs에서 "C with Classes"를 만들어요. C에 클래스, 상속, 인라인, 기본 인자를 더하려는 것이었어요 [A p19].
- **1983**: C++로 개명하고 가상 함수, 함수·연산자 오버로딩, 참조, const, new/delete를 더해요.
- **1985**: 첫 상용 출시. Cfront라는 도구가 C++를 C로 번역했어요.
- **1990**: "The Annotated C++ Reference Manual"이 ISO 표준 전까지 비공식 표준이 돼요.

Stroustrup은 "C는 발등을 찍기 쉽고, C++는 어렵지만 한번 찍으면 다리 전체가 날아간다"고 농담했어요.

ISO 표준은 C++98(ISO/IEC 14882:1998, 첫 공식 표준) → C++03(결함 수정) → C++11(auto, 람다, 스마트 포인터, 동시성: 큰 변화) → C++14(작은 개선) → C++17(std::optional, std::filesystem) → C++20(concept, range, module) → C++23(현재 표준, std::generator; 다음은 C++26)으로 이어져요 [A p20]. 매번 타입 안전, 성능, 생산성을 높이면서 **하위 호환**을 지켜요.

C++가 더한 핵심 기능(클래스, 오버로딩, RAII, 템플릿, STL, 상속·다형성, 예외, 네임스페이스, inline·string·`<fstream>`, C++11의 스마트 포인터)이 곧 이 단원의 나머지 지도예요 [A p21–22].

### 3-2. 클래스와 객체

**클래스(class)**는 객체가 가질 데이터 속성과 메서드를 정하는 코드, **객체(object, 인스턴스)**는 클래스로 만든 구체적인 하나예요 [A p23]. 원본은 집 설계도와 집, 쿠키 틀과 쿠키에 빗대요. 우리 비유로는 자판기 설계도와 거리의 자판기 여러 대예요. 한 클래스에서 인스턴스를 여러 개 만들 수 있어요.

### 3-3. 함수 오버로딩

**왜 필요할까요?** C에서는 정수·실수·문자열 출력 함수에 이름을 따로 지어야 했어요.

**함수 오버로딩(function overloading)**은 같은 스코프에서 이름은 같고 매개변수가 다른 함수 여러 개를 허용해요. 매개변수의 **개수, 타입, 순서**로 구별해요 [A p24].

**예제** [A p24]. 민수의 로그 출력기예요.

```cpp
void print(int i);
void print(double f);
void print(const std::string& s);
```

1. `p.print(5);` 인자가 int라서 첫 번째가 불려 `[log] int: 5`
2. `p.print(3.14);` double이라서 두 번째, `[log] double: 3.14`
3. `p.print("hi");` 문자열이라서 세 번째, `[log] string: hi`

**쓸 수 없는 경우**: 반환 타입만 다른 두 함수는 오버로딩이 안 돼요. 호출하는 쪽 `print(5)`만 보고는 어느 반환 타입을 원하는지 알 수 없으니까요.

함수 이름을 재사용할 수 있다면, `+` 같은 연산자도 재사용할 수 있을까요?

### 3-4. 연산자 오버로딩

**연산자 오버로딩(operator overloading)**은 연산자를 다시 정의해 클래스 같은 사용자 정의 타입에도 쓰게 해요 [A p25]. 읽기 쉬워지고, 복잡한 타입을 기본형처럼 다루며, 문법 편의와 분야별 로직을 얻어요.

```cpp
Complex operator+(const Complex& operand) const {
    return Complex(real + operand.real, imag + operand.imag);
}
```

`Complex c3 = c1 + c2;`는 `c1.operator+(c2)`로 읽혀서, 실수부끼리·허수부끼리 더한 새 Complex를 `c3`에 넣어요.

> 보충: `c1(5.0, 4.0)`, `c2(2.0, 3.5)`이니 c3는 (7.0, 7.5)예요. 원본에는 출력이 없어 직접 계산했어요.

이제 그림판이 파일을 열고 메모리를 빌리는 장면이에요. 닫는 걸 잊으면 어떡하죠?

### 3-5. RAII: 자원 수명을 객체 수명에 묶기

**왜 필요할까요?** 민수가 겪은 "파일 닫기를 깜빡함"이 이 문제예요. 중간에 오류로 함수를 빠져나가면 정리 코드에 닿지도 못해요.

**RAII(Resource Acquisition Is Initialization)**는 자원(메모리, 열린 파일, 네트워크 연결)의 수명을 객체의 수명에 묶어요. 생성자에서 얻고 소멸자에서 놓아서 자동 정리를 보장해요 [A p21, p26].

1. `{ FileWrapper f("a.txt");` 생성자가 자원을 획득해요(파일 열기).
2. `f.write(...);` 자원을 써요.
3. `}` 스코프가 끝나면 소멸자가 해제해요(파일 닫기). 2단계에서 예외가 터져도 소멸자는 **자동으로** 실행돼요.

자판기를 설치하면 전기가 연결되고 철거하면 저절로 끊기는 셈이에요. 그래서 손으로 delete / close할 필요가 없어 누수가 없고, 스택이 되감기는(stack unwinding) 동안에도 소멸자가 돌아서 **예외 안전(exception-safe)**해요.

원본의 두 클래스예요 [A p27].

```cpp
MemoryBlock(size_t size) { data = new int[size]; }  // 획득
~MemoryBlock() { delete[] data; }                  // 해제
FileWrapper(const std::string& filename) { file.open(filename); }
~FileWrapper() { file.close(); }
```

클래스가 스스로를 관리해서, 스코프를 벗어나면 파일이 닫히고 메모리가 정리돼요. `delete[]`를 손으로 쓸 일이 없어요. **주의**: 이런 클래스는 복사·이동도 따로 처리해야 해요(Rule of 3/5) [A p27].

앞으로 나올 라이브러리 클래스도 RAII로 만들어졌어요. `vector`는 원소를, `fstream`은 파일을, `unique_ptr`는 메모리를 스스로 치워요 [A p26].

자원 걱정은 덜었어요. 그런데 Point는 int용, 실수 좌표는 double용으로 클래스를 두 번 써야 할까요?

### 3-6. 템플릿

**템플릿(template)**은 어떤 데이터 타입에도 동작하는 함수와 클래스를 만들게 해요. 타입에 독립적인 코드로 **재사용성과 타입 안전**을 높여요. 이것을 범용 프로그래밍(generic programming)이라고 해요 [A p21, p28].

**함수 템플릿**:

```cpp
template <typename T>
T add(T a, T b) { return a + b; }
add<int>(2, 3);        // T = int
add<double>(2.5, 3.5); // T = double
```

`T`는 빈칸이에요. 호출할 때 `<int>`를 넣으면 컴파일러가 int용 add를 찍어 내요. 자판기 설계도에 "음료 종류: ___"라는 빈칸을 두고 설치할 때 채우는 셈이에요.

이점은 이래요 [A p28]. 타입 검사가 없는 매크로·void 포인터보다 안전하고, 타입을 컴파일 시간에 검사·결정하며, 오버로드나 클래스 변형을 여러 벌 쓸 필요가 없어요. 그래서 효율적이고 유지보수하기 쉬운 C++의 초석이에요.

**클래스 템플릿**은 클래스의 설계도예요. 쓸 때 타입을 채워요 [A p29].

```cpp
template <typename T>
class Box { T content; /* setContent, getContent */ };
Box<int> intBox;          intBox.setContent(42);
Box<std::string> strBox;  strBox.setContent("Hello!");
```

`intBox.getContent()`는 42, `strBox.getContent()`는 "Hello!"를 돌려줘요. 여기서 `Box<int>`와 `Box<std::string>`은 **정의 하나에서 나온 서로 다른 두 클래스**예요.

템플릿으로 만든 거대한 공구 상자가 이미 있다면요?

### 3-7. STL: 컨테이너, 알고리즘, 반복자

**STL(Standard Template Library)**은 템플릿으로 만든 범용 라이브러리예요. 세 부품으로 이뤄져요 [A p30].

- **컨테이너(container)**: 객체와 데이터 모음을 저장해요. `std::vector`, `std::list`, `std::map`
- **알고리즘(algorithm)**: 컨테이너 안 데이터에 작업해요. `std::sort`, `std::search`, `std::find`
- **반복자(iterator)**: 컨테이너 데이터를 순회하는 수단이에요. `std::vector<int>::iterator`를 `begin()` / `end()`로 얻어요.

**예제: vector와 sort** [A p31]. 민수가 레이어 번호를 관리해요.

```cpp
std::vector<int> numbers {1, 2, 3, 4, 5};   // C++11 중괄호 초기화
for (int n : numbers) std::cout << n << ' ';
numbers.push_back(6);
std::sort(numbers.rbegin(), numbers.rend());
```

1. 중괄호로 1~5를 채워요(C++11 리스트 초기화).
2. `for (int n : numbers)`는 **범위 기반 for**예요. 원소를 하나씩 방문해서 `1 2 3 4 5`를 찍어요.
3. `push_back(6)`이 끝에 6을 붙여요.
4. `rbegin()`/`rend()`는 뒤에서부터 읽는 반복자예요. 뒤에서 본 순서를 오름차순으로 정렬하면, 앞에서 보면 내림차순이에요. 결과는 `6 5 4 3 2 1`이에요.
5. 같은 결과를 정렬 규칙을 람다로 넘겨서도 얻을 수 있어요: `std::sort(numbers.begin(), numbers.end(), [](int a, int b) { return a > b; });`

**컨테이너 고르기** [A p32]. 네 가족이 있어요.
- **순차**(위치 순서): vector(동적 배열, 인덱스 O(1)), array(고정 크기, C++11), list/forward_list(연결 리스트), deque(양쪽 끝 큐)
- **연관**(키로 정렬된 균형 트리, O(log n)): map(키→값), set(정렬된 유일 값), multimap/multiset(중복 허용)
- **비정렬**(C++11, 해시 테이블, 평균 O(1), 순서 없음): unordered_map, unordered_set, unordered_multimap/set
- **어댑터**(다른 컨테이너에 제한된 인터페이스): stack(LIFO), queue(FIFO), priority_queue(가장 큰 값이 위, 힙)

경험칙은 "일단 vector, 키로 값을 찾을 땐 map이나 unordered_map"이에요.

### 3-8. 반복자와 auto

**반복자(iterator)**는 컨테이너 원소를 차례로 훑는 객체예요 [A p33]. 특징은 세 가지예요.
- **추상화**: vector든 list든 같은 방식으로 다뤄요.
- **명확한 범위**: 모든 컨테이너가 `begin()`과 `end()`로 유효 범위를 표시해요.
- **유연성**: 대부분 컨테이너에서 앞뒤로 움직일 수 있어요.

포인터보다 나은 점은 STL 알고리즘과 매끄럽게 맞물리고(호환성), 포인터 산술 실수를 줄이며(안전성), 의도가 잘 드러나는(표현력) 점이에요.

**주의**: 반복자는 경계 검사를 안 해요. `*v.end()`처럼 `end()`를 역참조하면 정의되지 않은 동작이에요.

vector를 도는 방법은 두 가지예요 [A p34].

```cpp
for (auto it = vec.begin(); it != vec.end(); ++it) std::cout << *it << ' ';
for (size_t i = 0; i < vec.size(); ++i) std::cout << vec[i] << ' ';
```

둘 다 `1 2 3 4 5`를 찍어요. `auto`는 컴파일러가 타입을 추론하게 해서 `std::vector<int>::iterator`를 길게 쓰지 않아도 돼요. 두 번째 방법은 vector가 **임의 접근**을 지원해서 `vec[i]`가 되기 때문에 가능해요.

**list는 임의 접근이 안 돼서** 반복자가 꼭 필요해요 [A p35].

1. `std::list<int> numbers {7, 5, 16, 8};`
2. `numbers.push_back(25);` → 7 5 16 8 25
3. `auto it = std::find(numbers.begin(), numbers.end(), 16);` 16을 가리키는 반복자를 얻어요. 못 찾으면 `end()`가 와요. 원래 타입은 `std::list<int>::iterator`이고 `auto`가 추론해 줘요.
4. `if (it != numbers.end())`로 찾았는지 확인해요.
5. `numbers.insert(std::next(it), 42);` 16 다음 자리에 42를 넣어요.
6. 반복자로 출력하면 `7 5 16 42 8 25`예요.

이제 그림판의 주인공, 도형들 차례예요. 원·사각형·삼각형이 공통 기능을 어떻게 나눠 가질까요?

---

## Part 4. 상속과 다형성

### 4-1. 상속

**왜 필요할까요?** 원, 사각형, 삼각형 모두 지우기, 옮기기, 색 정하기가 필요해요. 세 번 복사하면 Part 1의 문제가 다시 생겨요.

**상속(inheritance)**은 새 클래스(파생 클래스, derived class)가 다른 클래스(기반 클래스, base class)의 속성과 동작을 물려받게 해요. 공통 속성과 메서드를 나눠 갖는 클래스 계층을 만들 때 써요 [A p37].

```cpp
class Derived : public Base { /*...*/ };
```

"기본 자판기" 설계도를 물려받아 "커피 자판기"를 만드는 셈이에요. 원본의 Shape는 protected `color`와 `draw()`, `erase()`, `move()`, `getColor()`, `setColor()`를 갖고, Circle·Square·Triangle이 `: public Shape`로 물려받아 각자 `draw()`를 다시 써요 [A p38]. protected인 `color`는 클래스 내부와 파생 클래스에서만 쓸 수 있어요(2-3의 표).

상속으로 할 수 있는 일은 두 가지예요 [A p40].
- **새 함수 추가**: Triangle만 `FlipVertical()`, `FlipHorizontal()`을 더 가질 수 있어요.
- **기존 동작 변경**: 세 도형이 `draw()`, `erase()`를 자기 방식으로 바꿔요. 이것이 오버라이딩이에요.

### 4-2. 오버라이딩과 정적 바인딩

**오버라이딩(overriding)**은 파생 클래스가 물려받은 메서드를 새 구현으로 바꾸는 것이에요 [A p38, p40]. 여기서 C++만의 함정이 있어요.

- Java, Python: 모든 메서드가 동적 바인딩이라 다시 정의하면 곧 오버라이딩이에요.
- C++: 기본이 **정적 바인딩**이라 **virtual 함수만** 오버라이딩돼요.

위 Shape의 `draw()`는 virtual이 아니라서, Circle의 재정의는 오버라이딩이 아니라 **은닉(hiding)**이에요. 따라가 봐요 [A p39].

```cpp
Circle circle;
circle.draw();      // Circle::draw()
Shape& s = circle;  // draw()는 virtual 아님
s.draw();           // Shape::draw()
```

1. `circle.draw()`: 변수 타입이 Circle이라서 Circle의 draw가 불려요.
2. `Shape& s = circle;`: 같은 원을 Shape 참조로 가리켜요.
3. `s.draw()`: 객체는 원인데 "Drawing a Shape"가 나와요.

이것이 **정적 바인딩(static binding)**이에요. 실제 객체가 아니라 **참조나 포인터의 타입**이 메서드를 골라요. 컴파일 시간에 정해져 빠르고, virtual이 아닌 함수의 기본이에요. 커피 자판기에 "기본 자판기" 안내판을 붙였더니 손님이 기본 음료만 받는 꼴이에요. 진짜 기계를 따르게 하려면요?

### 4-3. 다형성과 동적 바인딩

**다형성(polymorphism)**은 유연하고 서로 바꿔 끼울 수 있는 인터페이스를 만들어요. 종류는 두 가지예요 [A p41].

- **컴파일 시간(정적) 다형성**: 함수 오버로딩, 연산자 오버로딩(3-3, 3-4)
- **실행 시간(동적) 다형성**: 가상 함수 덕분에 기반 클래스의 포인터·참조로 파생 클래스가 오버라이드한 메서드를 불러요. 문법은 기반 클래스에 `virtual`, 파생 클래스에 `override`예요.

기반 클래스를 이렇게 바꿔요 [A p42].

```cpp
class Shape {
public:
    virtual void draw() const { std::cout << "Drawing a Shape\n"; }
    virtual ~Shape() {};
};
```

이제 `Shape& s = circle; s.draw();`는 "Drawing a Circle"을 찍어요. 이것이 **동적 바인딩(dynamic binding)**이에요.
- 메서드 호출이 **실행 시간**에 결정돼요(실행 시간 다형성).
- **실제 객체의 타입**이 어느 메서드를 실행할지 정해요.
- 조건은 두 가지예요. 기반 함수가 virtual이고, **기반 포인터나 참조로** 불러야 해요. 그때만 파생 클래스가 진짜로 오버라이드해요.
- 실행 중에 찾아야 하니 정적 바인딩보다 약간 느려요.

**오버라이딩과 은닉을 한 장에 비교하면** [A p43]:

| | 기반에 virtual 있음 | 기반에 virtual 없음 |
|---|---|---|
| 이름 | 오버라이딩 | 은닉 |
| 바인딩 | 동적(실행 시간) | 정적(컴파일 시간) |
| `s.draw()` 결과 | "Drawing a Circle" | "Drawing a Shape" |
| 다형성 | 있음 | 없음 |

파생 클래스에는 `override`를 붙이는 게 좋아요.

```cpp
void draw() const override { std::cout << "Drawing a Circle\n"; }
```

맞는 virtual 기반 함수가 없으면 컴파일러가 오류를 내줘요. 필수는 아니에요 [A p46]. 많은 교과서가 두 경우를 모두 "오버라이딩"이라 부르지만, C++ 표준은 virtual인 경우만 그렇게 불러요.

**출력 예측 문제를 푸는 순서**: (1) 기반 함수에 virtual이 있나? (2) 기반 포인터·참조로 부르나? 둘 다 예면 실제 객체 타입의 함수, 하나라도 아니면 선언 타입의 함수예요.

그런데 "그냥 도형"을 그리라는 건 말이 될까요?

### 4-4. 추상 기반 클래스와 가상 소멸자

"그냥 도형"은 그릴 방법이 없어요. 그럴 땐 draw를 비워 둬요 [A p44].

```cpp
class Shape {
public:
    virtual void draw() const = 0;   // 순수 가상 함수
    virtual ~Shape() = default;      // 가상 소멸자
};
```

- **순수 가상 함수(pure virtual function)** `= 0`은 Shape를 **추상 클래스**로 만들어요. Shape는 직접 인스턴스로 만들 수 없다는 신호예요. "자판기"라는 개념만 있고 실물은 커피 자판기, 음료 자판기만 있는 것과 같아요.
- **가상 소멸자(virtual destructor)**는 기반 포인터로 파생 객체를 delete할 때 파생 부분까지 제대로 정리되게 보장해요. 기반 포인터로 지울 계획이면 꼭 붙여요.

### 4-5. 업캐스팅

**업캐스팅(upcasting)**은 파생 객체를 기반 객체처럼 다루는 것이에요 [A p45]. C++에서 안전하고 **암시적**인 변환이라, 파생 객체를 기반 포인터·참조에 대입하면 자동으로 그 안의 기반 부분으로 취급돼요.

```cpp
void doStuff(Shape& s) { s.erase(); s.draw(); }
doStuff(c); doStuff(t); doStuff(sq);   // Circle, Triangle, Square
```

Circle이 Shape로 암시적으로 바뀌어서, Shape가 필요한 곳 어디서나 파생 객체를 쓸 수 있어요.

**예제: renderShape** [A p46]. 민수의 그림판 화면 갱신 함수예요.

```cpp
void renderShape(const Shape& shape) { shape.draw(); }
renderShape(circle); renderShape(square); renderShape(triangle);
```

1. 세 객체가 각각 `const Shape&`로 업캐스팅돼요.
2. `draw()`가 virtual이고 기반 참조로 불러서 동적 바인딩이 일어나요.
3. 실행 중 실제 객체를 보고 "Drawing a Circle", "Drawing a Square", "Drawing a Triangle"을 차례로 찍어요. 참조된 객체 타입에 따라 출력이 달라지는 것, 이것이 동적 다형성이에요.

### 4-6. 이른 바인딩 vs 늦은 바인딩

같은 이야기를 다른 이름으로도 불러요 [A p47].

- **이른 바인딩(early binding)** = 정적 바인딩. 메서드 호출이 컴파일 시간에 결정되고, **선언된 타입**을 써요. 컴파일러가 특정 함수 이름으로 호출을 만들고, 링커가 그 호출을 실행할 코드의 **절대 주소**로 연결해요. 예: `Circle circle; circle.draw();`(비가상)
- **늦은 바인딩(late binding)** = 동적 바인딩. 실행 시간에 결정되고 **실제 객체 타입**을 써요. 어떤 코드를 부를지 실행 전까지 정해지지 않아요. 예: `Shape* s = new Circle(); s->draw(); delete s;`(가상)

마지막 예에서 `delete s`가 Shape 포인터로 Circle을 지우죠. 4-4의 가상 소멸자가 필요한 바로 그 상황이에요.

도형 가족이 완성됐어요. 이제 사고 대비를 할 차례예요. 사용자가 확대 비율에 0을 넣으면 어떻게 될까요?

---

## Part 5. 예외·네임스페이스·유틸리티

### 5-1. 예외 처리

**예외 처리(exception handling)**는 실행 중 오류가 나면 **예외 처리기(exception handler)**라는 특별한 코드로 제어를 넘기는 장치예요 [A p49].

- `try`: 예외가 날 수 있는 코드 블록
- `throw`: 이상이나 오류(예외)가 생겼다고 알리는 명령
- `catch`: 예외를 처리하는 블록
- `std::exception`: 모든 표준 예외가 상속하는 표준 예외 클래스

오류 처리 코드를 일반 코드와 떼어 놓고, 프로그램을 죽였을 예외를 잡아 견고하게 하며, 오류를 호출 스택 위로 전파할 수 있어요. 동전이 걸린 자판기가 멈추지 않고 "관리자 호출" 램프로 넘기는 셈이에요.

**예제: 안전한 나눗셈** [A p50].

```cpp
if (denominator == 0) throw std::runtime_error("Error: Attempted to divide by zero.");
try { double result = safeDivide(a, b); ... }
catch (const std::runtime_error& e) { std::cerr << "Exception caught: " << e.what() << std::endl; }
```

1. `a = 10.0, b = 0.0`으로 `safeDivide`를 불러요.
2. 분모가 0이라 `std::runtime_error`(`<stdexcept>`)를 던져요. 나눗셈 줄에는 닿지 않아요.
3. 제어가 `try`를 빠져나와 맞는 `catch`로 가요.
4. `e.what()`의 메시지를 `std::cerr`로 찍어요. 기본값 지정·로그 기록도 여기서 해요.
5. 그 뒤 프로그램은 **계속 실행**돼요.

**왜 직접 검사해야 할까요?** 검사가 없으면 이래요.
- 실수 `10.0 / 0.0`: 오류 없이 inf를 돌려줘요. 잘못된 값이 퍼져서(inf − inf → NaN) 한참 뒤에야 드러나요.
- 정수 `10 / 0`: 정의되지 않은 동작이라 대개 프로그램이 죽어요. **try/catch로도 못 잡아요.**

Java와 Python은 정수를 0으로 나누면 예외를 던지지만 C++는 던지지 않아요. 그래서 **먼저 검사하고, 그다음 throw**해요.

### 5-2. 네임스페이스

**왜 필요할까요?** 민수가 만든 `draw` 함수와 외부 라이브러리의 `draw`가 겹치면요? 프로그램이 커지면 함수와 식별자 이름이 "바닥날" 수 있어요 [A p51].

**네임스페이스(namespace)**는 관련 식별자를 묶어 이름 충돌을 막아요. 정의 묶음을 네임스페이스로 "감싸서" 전역 스코프가 어지러워지지 않게 하고, 다른 네임스페이스의 같은 이름끼리는 충돌하지 않아요. `namespace` 키워드로 선언해요.

```cpp
namespace geometry { class Shape { }; void draw(const Shape& shape) { } }
geometry::Shape myShape;
geometry::draw(myShape);
```

자판기로 치면 건물마다 번호를 붙여서 "A동 1번 자판기", "B동 1번 자판기"로 구분하는 것이에요.

C++ 표준 라이브러리는 전부 `std` 네임스페이스에 있어요 [A p52]. 그래서 `std::cout`이라고 썼던 거예요. 옛날(표준 이전)에는 `#include <iostream.h>`, 지금은 `#include <iostream>`을 써요.

이름을 불러오는 방법은 세 가지예요 [A p51–53].
1. **한정 이름**: `std::cout << "Hello";` 가장 권장해요.
2. **using 선언(using declaration)**: `using std::cout;`처럼 그 이름 **하나만** 현재 스코프로 가져와요. 원본 예는 `using math_operations::add;` 뒤에 `add(5, 3)`을 접두어 없이 불러 `The sum is 8`을 찍어요. 다른 이름은 새어 들어오지 않아서 안전해요.
3. **using 지시문(using directive)**: `using namespace std;` 작성한 파일 전체에서 그 네임스페이스를 쓸 수 있게 해요. 주의해서 써요.

**using namespace std;의 함정**: std의 모든 이름(cout, string, count, …)이 들어와서 `std::` 없이 쓸 수 있지만, 내가 만든 `count`가 `std::count`와 부딪혀 "모호한 이름" 컴파일 오류가 나요. 그래서 **헤더 파일에는 쓰지 않아요**.

### 5-3. 새 I/O 라이브러리

새 I/O 라이브러리의 헤더는 `<iostream>`이에요 [A p54].
- `cout`: 표준 출력 스트림. `<<`는 "put to", **삽입 연산자(insertion operator)**예요.
- `cin`: 표준 입력 스트림. `>>`는 "get from", **추출 연산자(extraction operator)**예요.
- 둘 다 **자동 타입 변환**을 하고, 한 스트림에 연속으로 쓸 수 있어요.

```cpp
std::cin >> x;
std::cout << "You entered: " << x << "\n";
```

### 5-4. inline 함수

민수의 그림판은 원 넓이와 둘레를 아주 자주 계산해요 [A p55].

```cpp
inline float area(float rad) { return pi * rad * rad; }
inline float circum(float rad) { return pi * 2 * rad; }
while (std::cin >> r) { ... area(r) ... circum(r) ... }
```

**inline 함수**는 호출 자리에 본문을 붙여 넣으라고 컴파일러에 **요청**해 호출 비용을 없애요. 힌트일 뿐 결정은 컴파일러가 하고, 헤더에 정의해도 중복 정의 오류가 나지 않아요. `while (std::cin >> r)`은 숫자 입력이 성공하는 동안 계속 반지름을 받아요.

### 5-5. std::string

**std::string**(`<string>`)은 C 문자 배열의 복잡함을 숨겨요 [A p56]. 메모리를 알아서 관리하고, `+`·`+=`로 이어 붙이며, 대입과 비교가 안전해요.

```cpp
s1 = s3 + " " + s4;   // "Hello, World." + " " + "I am"
s1 += " 8 ";
std::cout << s1 + s2 + "!";  // s2 = "Today"
```

출력은 `Hello, World. I am 8 Today!`예요.

### 5-6. 파일 입출력

그림을 파일로 저장할 차례예요. `<fstream>`을 써요 [A p57].
- `std::ifstream`: 입력(읽기)
- `std::ofstream`: 출력(쓰기)
- `std::ios::in`: 읽기 모드, C의 `"r"`
- `std::ios::out | std::ios::trunc`: 내용을 비우고 쓰는 모드, C의 `"w"`

**예제: 파일 복사**.
1. `std::ifstream in("Scopy.cpp", std::ios::in);`과 `std::ofstream out("Scopy2.cpp", std::ios::out | std::ios::trunc);`로 열어요.
2. `if (!in || !out)`로 둘 다 열렸는지 **꼭** 확인하고, 실패하면 오류를 찍고 끝내요.
3. `while (std::getline(in, s)) out << s << "\n";` 한 줄씩 읽어 써요. `getline()`은 줄 끝의 `"\n"`을 떼고 주기 때문에 쓸 때 다시 붙여야 해요.

fstream은 RAII 클래스라 스코프가 끝나면 파일이 저절로 닫혀요(3-5). 그런데 `new`로 직접 빌린 메모리는 누가 치워 줄까요?

---

## Part 6. 스마트 포인터

### 6-1. 스마트 포인터란

**왜 필요할까요?** `new`로 도형을 만들고 `delete`를 잊으면 누수, 두 번 지우거나 지운 뒤에 쓰면 댕글링 포인터 사고가 나요.

**스마트 포인터(smart pointer)**는 원시 포인터를 감싸서 동적 할당 객체의 수명을 관리해요. 더 필요 없어지면 메모리를 해제해 누수를 막아요 [A p59]. 헤더는 `<memory>`이고, 3-5의 RAII를 포인터에 적용한 것이에요. 자판기로 치면 "마지막 손님이 떠나면 저절로 전원이 꺼지는 자판기"예요.

```cpp
std::unique_ptr<int> ptr(new int(10));
```

이점은 자동 자원 관리, 예외 안전(오류가 나도 해제), 메모리 관리 단순화, 누수·댕글링 포인터 방지예요. 종류는 혼자 소유하는 **unique_ptr**, 여럿이 소유하는 **shared_ptr**, 소유하지 않는 **weak_ptr** 세 가지예요.

### 6-2. unique_ptr와 shared_ptr

```cpp
auto ptr = std::make_unique<int>(10);   // 주인은 ptr 하나
auto sp1 = std::make_shared<int>(20);
auto sp2 = sp1;                          // 공동 주인
```

- **unique_ptr** [A p59–60]: 주인이 정확히 하나예요. 복사는 안 되고 `std::move(p)`로 소유권을 옮기기만 해요. `ptr`이 스코프를 벗어나면 메모리가 자동 해제돼 delete가 필요 없어요.
- **shared_ptr**: **참조 카운팅(reference counting)**으로 여러 주인이 공유해요. `sp2 = sp1`으로 카운트가 2가 되고 `*sp1`, `*sp2` 모두 20이에요. `p.use_count()`로 카운트를 보고, 0이 되면(여기선 sp1·sp2가 모두 스코프를 벗어날 때) 객체가 지워져요.

**핵심 연산** [A p61]:

| | unique_ptr | shared_ptr | weak_ptr |
|---|---|---|---|
| 만들기 | `make_unique<T>(args)` | `make_shared<T>(args)` | `weak_ptr<T> w = sp;` |
| 접근 | `*p`, `p->`, `p.get()` | `*p`, `p->`, `p.get()` | `w.lock()` → shared_ptr |
| 소유 포기 | `p.reset()`, `p.release()`, `std::move(p)` | `p.reset()` | `w.reset()` |
| 상태 확인 | `if (p)` (null 아님?) | `p.use_count()` | `w.expired()` |

헷갈리기 쉬운 세 가지예요.
- `reset()`: 지금 객체를 놓아요. unique_ptr는 객체를 **삭제**하고, shared_ptr는 카운트를 **1 줄여요**.
- `release()`: 삭제하지 않고 원시 포인터를 돌려줘요. 이제 **직접 delete**해야 해요.
- `get()`: 원시 포인터를 잠깐 빌려줄 뿐이에요. 소유권은 스마트 포인터에 그대로 있어요.

shared_ptr만 있으면 다 될 것 같은데, weak_ptr는 왜 있을까요?

### 6-3. weak_ptr와 순환 참조

**문제**: 두 shared_ptr 객체가 **서로를** 가리키면(순환 의존) 카운트가 영원히 0이 되지 않아 메모리가 새요 [A p62]. **std::weak_ptr**는 소유하지 않는 참조라 카운트에 들어가지 않아서 이 고리를 끊어요. 객체를 쓸 때는 `lock()`을 거쳐요.

```cpp
std::weak_ptr<int> wp = sp;
if (auto locked = wp.lock()) { std::cout << *locked; } else { std::cout << "Object expired"; }
```

1. `wp.lock()`이 wp로부터 shared_ptr를 만들어 보려고 해요.
2. 원래 shared_ptr(sp)가 살아 있으면 `locked`가 유효해서 30을 찍어요.
3. sp가 이미 사라졌으면 `locked`는 nullptr이라 "Object expired"로 가요.

**예제: 양방향 노드** [A p63]. 민수의 그림판 실행 취소(undo) 목록이 앞뒤로 연결돼 있다고 해 봐요.

```cpp
struct Node { std::shared_ptr<Node> next; std::weak_ptr<Node> prev; };
n1->next = n2;  n2->prev = n1;
n1.reset();
if (n2->prev.expired()) std::cout << "Previous node expired";
```

1. `make_shared<Node>()`로 n1, n2를 만들어요. 각 use_count는 1이에요.
2. `n1->next = n2`: next는 shared_ptr이라 n1이 n2를 **소유**해요.
3. `n2->prev = n1`: prev는 weak_ptr이라 n2는 n1을 **관찰**만 해요. n1의 카운트는 그대로 1이에요.
4. `n1.reset()`: n1의 유일한 주인이 손을 놓아요. prev는 세지 않으니 카운트가 0이 되어 n1이 해제돼요.
5. `n2->prev.expired()`가 참이라 "Previous node expired"를 찍어요.

prev까지 shared_ptr였다면 4단계에서 n1의 카운트가 1로 남아 둘 다 영영 해제되지 않았을 거예요.

경험칙은 **주인**은 shared_ptr, **역포인터나 관찰자**는 weak_ptr예요. `expired()`는 **확인만** 하고, 실제로 쓰려면 `lock()`을 써요. 대표적 쓰임은 부모 ↔ 자식 연결, 옵저버, 캐시예요. 결국 주인이 하나면 unique_ptr, 여럿이면 shared_ptr, 지켜보기만 하면 weak_ptr예요.

---

## 한눈에 이어 보기

- 절차적(데이터·함수 분리, 수정이 번짐) → OOP(묶기) → 캡슐화·정보 은닉·데이터 추상화 → ADT
- C struct(데이터만) → C++ struct(멤버 함수·생성자·소멸자·접근 지정자) → class(기본 private)
- C++ 역사·표준 → 클래스·객체 → 오버로딩(함수·연산자) → RAII(생성자 획득·소멸자 해제) → 템플릿 → STL(컨테이너·알고리즘·반복자, auto)
- 상속 → 비가상 재정의 = 은닉·정적 바인딩 → virtual + 기반 참조 = 오버라이딩·동적 바인딩 → 순수 가상·가상 소멸자 → 업캐스팅으로 다형성
- 예외(try/throw/catch, 0 나누기는 먼저 검사) → 네임스페이스·using → iostream·inline·string·fstream
- RAII를 포인터에 적용 → unique_ptr(단독) → shared_ptr(카운트) → weak_ptr(비소유, 순환 끊기)
