## Scope

김춘수 시인의 시 "꽃"을 보면 다음과 같은 구절이 나온다.

> 내가 그의 이름을 불러 주었을 때
>
> 그는 나에게로 와서
>
> 꽃이 됐다

프로그래밍에서도 마찬가지로 변수나 함수에 이름을 붙여 의미를 갖도록 한다. 만약 이름이 없다면 변수나 함수는 다만 메모리 주소에 지나치지 않는다. 그래서 프로그램은 "이름:값" 대응표를 만들어 사용한다. 이 대응표의 이름을 가지고 코드를 보다 쉽게 이해하고, 또 이름을 통해 값을 저장하고, 다시 가져와서 수정한다.

초기 프로그래밍 언어에서는 이 대응표를 프로그램 전체에서 하나로 관리했었는데 이렇게 하니 이름 충돌의 문제가 발생했었다. 그래서 충돌을 피하기 위해 각 언어마다 스코프 규칙을 만들어 정의하였고 **스코프 규칙**은 **언어의 명세(Specification)**이 되었다.



### 스코프 레벨

자바스크립트에서는 함수 레벨 스코프를 지원해왔었고 가장 최신 명세인 ES6부터 블록 레벨 스코프를 지원하기 시작했다.

#### 함수 레벨 스코프

```js
function foo() {
    if (true) {
        var color = 'blue';
    }
    console.log(color); // blue
}
foo();

```

var로 선언된 변수, 함수 선언식으로 만들어진 함수는 함수 레벨 스코프를 갖는다. 따라서 함수 내부 전체에서 유효한 식별자가 된다.

#### 블록 레벨 스코프

```js
function foo() {
    if(true) {
        let color = 'blue';
        console.log(color); // blue
    }
    console.log(color); // ReferenceError: color is not defined
}
foo();
```

`let`, `const` 키워드는 블록 레벨 스코프를 만들어 준다.



### 렉시컬 스코프

렉시컬 스코프 (Lexical Scope)는 보통 동적 스코프 (Dynamic Scope)와 많이 비교된다.

- 동적 스코프

  >The name resolution depends upon the program state when the name is encountered which is determined by the execution context or calling context.

- 렉시컬 스코프

  >The name resolution depends on the location in the source code and the lexical context, which is defined by where the named variable or function is defined.

동적 스코프는 프로그램 런타임 도중의 실행 컨텍스트나 호출 컨텍스트에 의해 결정되고 렉시컬 스코프에서는 소스 코드가 작성된 문맥에서 결정된다. 현대 프로그래밍의 대부분의 언어들은 렉시컬 스코프를 따른다.



### 중첩 스코프

자바스크립트의 스코프는 ECMAScript 언어 명세에서 렉시컬 환경 (`Lexical Environment`)과 환경 레코드 (`Environment Record`) 라는 개념으로 정의되어 있다.

>6.2.5 The Lexical Environment and Environment Record Specification Types
>
>The Lexical Environment and Environment Record types are used to explain the behaviour of name resolution in nested functions and blocks. These types and the operations upon them are defined in 8.1.

![image-20220118191725658](https://github.com/newgardener/TIL/blob/main/JavaScript/images/LexicalScope.png)

환경 레코드는 "이름:값 대응표"와 같다고 볼 수 있고, 렉시컬 환경은 이 환경 레코드와 상위 렉시컬 환경 (Outer Environment) 에 대한 참조로 이루어진다.

현재 렉시컬 환경의 대응표(환경 레코드)에서 변수를 찾아보고 없다면 바깥 렉시컬 환경을 참조하는 식으로 중첩 스코프를 탐색한다. 이 탐색은 해당 이름을 찾거나 바깥 렉시컬 환경 참조가 `null`이 될 때 멈춘다.



### 참고

https://meetup.toast.com/posts/86