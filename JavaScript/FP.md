## 함수형 프로그래밍을 위한 기초

### 일급 함수

자바스크립트에서 함수는 일급 객체이자 일급 함수이다.

`일급 객체` 

- 변수에 담을 수 있다
- 함수나 메서드의 인자로 넘길 수 있다
- 함수나 메서드에서 리턴할 수 있다

`일급 함수`

- 아무 때나 (런타임에도) 선언할 수 있다
- 익명으로 선언할 수 있다
- 익명으로 선언한 함수도 함수나 메서드의 인자로 넘길 수 있다



### 클로저

> 클로저는 자신이 생성될 때의 스코프에서 알 수 있었던 변수 중 언젠가 자신이 실행될 때 사용할 변수들만 기억하여 유지시키는 함수이다. 
>
> 클로저가 기억하는 변수의 값은 언제든지 남이나 자신에 의해 변경될 수 있다.

```js
function f9() {
  var a = 10;
  var f10 = function(c) {
    return a + b + c;
  }
  var b = 20;
 	return f10;
}
var f11 = f9();
f11(30);
```

원래대로 라면 f9의 실행이 끝나면 지역변수인 a, b는 사라져야 하지만 f10이 a, b를 기억하는 클로저가 되었기 때문에 사라지지 않는다. f10이 f11에 담겨 f11이 실행될 때마다 새로운 변수인 c와 함께 사용되어 결과값을 만든다. 

#### 흔한 클로저의 실수

함수형 프로그래밍에서는 서로 다른 실행 컨텍스트에 영향을 줄 수 있을 만한 상태 공유나 상태 변화를 만들지 않는 것을 목표로 두고 있다.

```js
var users = [
  {id: 1, name: "HA", age: 25},
  {id: 2, name: "PJ", age: 26},
  {id: 3, name: "JE", age: 27},
]

// 흔한 클로저 실수 - 어떤 버튼을 눌러도 JE가 출력
var buttons = [];
for (var i = 0; i < users.length; i++) {
  var user = users[i];
  buttons.push($('<button>')).text(user.name).click(function() {
    console.log(user.name);
  })
}
$('.user-list').append(buttons);

// 절차지향적 해결 방식 - 다른 함수의 도움을 받음
var buttons = [];
for (var i = 0; i < users.length; i++) {
  (function(user) {
    buttons.push($('<button>')).text(user.name).click(function() {
    console.log(user.name);
  	})
  })(users[i]);
}
$('.user-list').append(buttons);

// 함수적 해결 방식 - 훨씬 깔끔해진 코드
$(.user-list).append(
	_map(users, function(user) {
    return $('<button>').text(user.name).click(function() {
    	console.log(user.name);
  	});
  });
)

```



### 고차함수

> 고차함수란 함수를 다루는 함수를 의미한다.

함수를 다룬다는 것은 무슨 의미일까?

1. 함수를 인자로 받아 대신 실행하는 함수
2. 함수를 리턴하는 함수
3. 함수를 인자로 받아서 또 다른 함수를 리턴하는 함수

```js
// 함수를 리턴하는 함수
function constant(val) {
  return function() {
    return val;
  }
}
var always10 = constant(10);
always10(); // 10

// 함수를 대신 실행하는 함수를 리턴하는 함수
function callWith(val1) {
  return function(val2, func) {
    return func(val1, val2);
  }
}
var callWith10 = callWith(10);
callWith10(20, add);

var callWith5 = callWith(5);
callWith5(5, sub);
```



### 호이스팅

> 호이스팅이란 변수나 함수가 어디에 선언되든지 해당 스코프의 최상단에 위치하게 되어 동일 스코프 어디서든 참조할 수 있는 것을 말한다. 

✅ 에러가 나는 상황이지만 호이스팅이 적용된 경우

```js
add1(10, 5); // 15

add2(10, 5); // Uncaught TypeError: add2 is not a function(...)

function add1(a, b) {
  return a + b;
}
var add2 = function(a, b) {
  return a + b;
}
```

- 변수는 선언과 초기화 단계가 구분되어 있어 호이스팅에 의해 참조만 가능하고 아직 값이 담겨 있지 않을 경우에는 실행이 불가능하다
- 함수는 선언과 초기화가 동시에 이루어지기 때문에 참조뿐만 아니라 실행도 가능하다.
- `add1` 은 함수 선언식으로 표현되었기 때문에 참조 + 실행이 모두 가능하지만 `add2` 는 변수 선언식으로 표현되었기 때문에 참조만 가능한 상황이다.



### 화살표 함수

- 간결한 함수 표현
- 화살표 함수 내부의 this, arguments는 부모 함수(화살표 함수를 기준으로 타고 올라가다 처음 만나는 일반 함수)의 this, arguments이다. 

```js
(function() {
  console.log(this, arguments); // {hi: 1} [1, 2, 3]
  (() => {
    console.log(this, arguments); // {hi: 1} [1, 2, 3]
    (() => {
      console.log(this, arguments); // {hi: 1} [1, 2, 3]
    })();
  })();
})().call({hi: 1}, 1, 2, 3);
```

- 화살표 함수는 고차 함수랑 쓰일 때 특히나 매력적이다.

```js
[1,2,3].map(v => v * 2);
[1,2,3,4,5].filter(v => v > 3);
[1,2,3].reduce((a, b) => a + b);
```

- 화살표 함수로 재귀함수를 구현할 수 있다.

```js
const log = console.log;

((a, b) => (f => f(f)))(f => log(a) || a++ == b || f(f))(1, 5);
// 1 2 3 4 5 
```

```js
const start = f => f(f);
const logger = (a, b) => start(f => log(a) || a++ == b || f(f));
logger(6, 10); // 6 7 8 9 10

((a) => start(f => log(a) || --a && f(f)))(5);
// 5 4 3 2 1
```

