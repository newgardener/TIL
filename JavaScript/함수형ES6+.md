## 함수형 ES6+

### JS에서의 객체

Array, Map, WeakMap, Set, WeakSet, Promise 등은 모두 `object`의 하위 타입이다

```js
log(typeof {}); // "object"
log(typeof []); // "object"
log(typeof new Map); // "object"
log(typeof new Set); // "object"
log(typeof new Promise(a => a)); // "object"
```

### Iterable, Iterator

ES6에는 Iterable/Iterator에 대한 프로토콜이 있다. JS에서 Iterable, Iterator, Symbol.iterator, Generator 등은 JS의 `for...of`문이나 전개 연산자 등과 사용된다. 이것들은 ES6에서 함수형 프로그래밍을 하는 것에 있어서 아주 중요한 역할을 한다.

### Symbol.iterator

JS에서 `for...of `나 전개 연산자 (`...`)와 잘 동작하려면 `Symbol.iterator `를 잘 알아야 한다.

1. iterable은 `iterable[Symbol.iterator]()` 메서드를 가져야 하고 결과는 iterator이어야 한다.
2. iterator는 `iterator.next()` 메서드를 가져야 하고 결과는 `{ value: something, done: true/false }` 이어야 한다.

```js
log(String.prototype[Symbol.iterator]);
// ƒ [Symbol.iterator]() { [native code] }
log(Array.prototype[Symbol.iterator]);
// ƒ values() { [native code] }

const iterable1 = [1, 2];
const iterator1 = iterable1[Symbol.iterator]();

log(iterator1.next()); // {value: 1, done: false}
log(iterator1.next()); // {value: 2, done: false}
log(iterator1.next()); // {value: undefined, done: true}
log(iterator1.next()); // {value: undefined, done: true}

for (const val of iterable1) console.log(val);
// 1
// 2

function reverseIterator(list) {
  var cur = list.length;
  return {
    next: () => cur-- > 0 ?
      { value: list[cur], done: false } :
      { value: undefined, done: true }
  }
}

const iterator2 = reverseIterator([1, 2]);

log(iterator2.next()); // {value: 2, done: false}
log(iterator2.next()); // {value: 1, done: false}
log(iterator2.next()); // {value: undefined, done: true}

for (const val of reverseIterator([1, 2])) log(val);
// Uncaught TypeError: reverseIterator(...) is not a function or its return value is not iterable
```

### `iterator[Symbol.iterator]() === iterator`, 그리고 Generator

1. iterator도 `iterator[Symbol.iterator]()`를 갖도록 하고 `iterator[Symbol.iterator]()=== iterator`라면 더욱 잘 만들어진 iterator라고 할 수 있다.
2. JS의 내장 iterables의 iterator를 리턴하는 메서드를 실행해서 얻은 iterator는 모두 `iterator[Symbol.iterator]()=== iterator` 를 따른다.
3. Generator를 통해 만든 iterator도 `iterator[Symbol.iterator]()=== iterator` 를 따른다.

```js
function reverseIterator(list) {
  var cur = list.length;
  return {
    [Symbol.iterator]: function() { return this; },
    next: () => cur-- > 0 ?
      { value: list[cur], done: false } :
      { value: undefined, done: true }
  }
}

for (const val of reverseIterator([1, 2])) log(val);
// 2
// 1

// Generator
function *reverseIterator(list) {
  var cur = list.length;
  while (cur--) yield list[cur];
}

for (const val of reverseIterator([1, 2])) log(val);
// 2
// 1
```

- `reverseIterator`에 [Symbol.iterator]를 구현하여 `for...of` 에서 정상 동작 할 수 있게 되었다.

### Promise

Promise는 비동기적으로 대기, 성공, 실패를 다루는 값이다. ES6+에서는 Promise와 관련해 `new Promise, then, catch, race, Promise.all, Promise.resolve, Promise.reject` 등을 지원한다.



---



## 컬렉션 중심의 프로그래밍

**컬렉션** = 열거 가능한 값들

1. JSON 데이터 타입 내의 object
2. Array, Map, Set
3. 그 외 `[Symbol.iterator]()` 가 구현된 모든 iterable, iterator
4. Generator를 실행한 결과값 

> 함수형 프로그래밍에서는 함수의 조합으로 문제를 해결한다. 작은 문제를 해결하고 해결책의 조합으로 더 복잡한 문제들을 해결해간다.



### pipe, go

함수형 프로그래밍에서는 함수도 값으로 다룬다. 

```js
const { pipe } = Functional;

var f1 = pipe(
  _ => 1,
  a => a + 10,
  a => a + 100,
  a => a + 1000,
  console.log);
//1111

f1();
```

첫번째 함수의 결과는 두번째 함수의 인자로 전달된다. 이런 식으로 반복되어 마지막 `console.log`에 전달된다.

👉🏻  함수를 원소로 가진 컬렉션을 만들어서 `pipe`를 통해 함수를 합성하였다.

```js
const { go } = Functional;

go(2,
  a => a + 20,
  a => a + 200,
  a => a + 2000,
  console.log);
// 2222
```

`go`의 첫번째 인자는 두번째 인자인 함수를 적용할 인자이다. 두번째 함수의 결과는 세번재 함수의 인자로 전달된다. 반복되어 마지막 `console.log`에 전달된다.

👉🏻 `go`와 `pipe` 함수들은 함수를 값으로 다루면서 원하는 시점에 함수를 실행하여 원하는 결과를 만들어 가는 함수이다. 이와 같이 함수를 값으로 다루는 함수를 고차함수라고 한다. 



### 함수를 값으로 다루면서 원하는 시점에 평가하기

순수 함수는 언제 평가해도 동일한 결과를 만듭니다. 이러한 법칙을 이용하여 함수형 프로그래밍에서는 비동기/동시성/병렬성/지연성 등을 훌륭하게 다룹니다. 고차 함수를 이용하여 함수 평가를 원하는 만큼 미루거나, 동시적으로 평가를 하거나, 원하는 순서대로 평가를 하면서 정확한 로직을 구현해갑니다.

함수형 프로그래밍에서는 추상화의 단위로 함수를 사용하며 작은 문제를 해결한 함수들을 조합하여 복잡한 문제들을 해결해간다. 이 때 함수 평가 시점을 최적화하여 우아함과 성능이라는 두마리의 토끼를 잡을 수 있다.



## 비동기, 동시성, 병렬성 프로그래밍

ES6+는 Promise, async/await를 통해 비동기 프로그래밍을 더욱 잘 다룰 수 있도록 발전하였다. 



### Promise는 콜백 지옥을 해결한 것인가?

Promise는 콜백 지옥을 해결한 것이 아니라 콜백 지옥을 해결할 기반이다. Promise는 **"결과값이 만들어지도록 약속된 값"**이자 **일급 객체**이다.

Promise가 컨텍스트가 아니라 값이라는 것은 인자와 리턴값으로 소통할 수 있다는 중요한 차이점을 지닌다.

이제부터 Promise를 인자와 리턴값으로 다루면서 비동기/동시성/병렬성 문제를 해결해볼 것이다.

















