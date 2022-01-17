### JS = Single-Threaded Application

자바스크립트 엔진은 `Single-Threaded` 로 하나의 호출 스택을 가지고 있다. 스레드가 하나라는 말은 동시에 하나의 작업만 처리할 수 있다는 것을 의미한다. 그런데 "**어떻게 자바스크립트는 동시성(Concurrency)를 지원하는걸까?**"

답은 이벤트 루프이다. 자바스크립트는 이벤트 루프 기반의 비동기 방식으로 Non-Blocing IO를 지원한다.

#### 1. 자바스크립트 엔진의 구성 요소

![image-20220117205644880](/Users/jeongwon/Library/Application Support/typora-user-images/image-20220117205644880.png)

V8과 같은 자바스크립트 엔진은 `Heap`과 단일 호출 스택(`Call Stack`)으로 구성되어 있다.

자바스크립트 엔진은 요청이 들어올 때마다 해당 요청을 순차적으로 `Call Stack` 에 담아 처리하는 것 뿐이다. 

- `Heap` 👉🏻 memory allocation (메모리 할당이 일어나는 영역)
- `Call Stack` 👉🏻 function execution (코드 실행에 따라 호출 스택이 쌓이는 영역)

#### 2. 런타임 환경

![image-20220117205923519](/Users/jeongwon/Library/Application Support/typora-user-images/image-20220117205923519.png)

비동기 요청은 자바스크립트 엔진을 구동하는 런타임 환경 (브라우저나 Node.js) 가 담당한다.

런타임 환경에 구현되어 있는 것들

- `Web APIs`
  - setTimeout, XMLHttpRequest와 같은 함수들
- `Event Loop`
- `Task Queue` 



#### 3. 단일 호출 스택과 Run-to-Completion

자바스크립트 함수가 실행되는 방식을 보통 "Run to Completition"이라고 한다. 하나의 함수가 실행되면 이 함수의 실행이 끝날 때까지는 다른 어떤 작업도 중간에 끼어들지 못한다는 의미이다. 다음 예시를 보자.

```js
function delay() {
    for (var i = 0; i < 100000; i++);
}
function foo() {
    delay();
    bar();
    console.log('foo!'); // (3)
}
function bar() {
    delay();
    console.log('bar!'); // (2)
}
function baz() {
    console.log('baz!'); // (4)
}

setTimeout(baz, 10); // (1)
foo();
```

delay 함수가 10ms보다 더 오래 걸리다고 할지라도 콘솔 창에 bar! -> foo! -> baz! 순으로 찍히는 것을 볼 수 있다. 

코드를 실행할 때 각 시점에서의 호출 스택을 그림으로 그리면 다음과 같다.

![image-20220117210856112](/Users/jeongwon/Library/Application Support/typora-user-images/image-20220117210856112.png)

`setTimeout` 함수는 브라우저에게 타이머 이벤트를 요청한 후에 바로 스택에서 제거된다. 그 후에 `foo` 함수가 스택에 추가되고 `foo` 함수가 내부적으로 실행하는 함수들이 스택으로 추가되었다고 제거된다. `foo` 함수의 실행이 끝나면 콜 스택이 비워지고 그 이후에 `baz` 함수가 콜 스택에 추가되어 콘솔에 baz! 가 찍히게 된다.



#### 4. 태스크 큐와 이벤트 루프

위의 예시에서 생기는 의문점은 어떻게 `foo` 함수의 실행이 끝나자마자 `baz` 함수가 실행될 수 있는지이다. 누가 콜 스택이 비워질 때까지 대기 하고 있다가 큐에서 콜백 함수를 꺼내와서 실행시킬까?

그 역할을 하는 것이 **Task Queue**와 **Event Loop**이다.

**Event Loop**

이벤트 루프의 역할을 표현한 간단한 수도 코드이다.

```js
while(queue.waitForMessage()){
  queue.processNextMessage();
}
```

`waitForMessage()` 메서드는 현재 실행 중인 태스크가 없을 때 다음 태스크가 큐에 추가될 때까지 대기하는 역할을 한다.

이벤트 루프는 반복적으로 "**현재 실행 중인 태스크가 없는지**"와 "**태스크 큐에 태스크가 있는지**"를 확인한다.

- 모든 비동기 API들의 작업이 완료되면 콜백 함수를 **Task Queue**에 추가한다.
- "현재 실행 중인 태스크가 없을 때" **Task Queue**의 첫번째 태스크를 꺼내와 실행한다.

**Task Queue**

태스크 큐는 콜백 함수들이 대기하는 FIFO 형태의 배열이라고 할 수 있다. 이벤트 루프는 콜 스택이 비워질 때마다 테스크 큐에서 콜백 함수를 꺼내와서 실행하는 역할을 한다. 



#### 5. MicroTask Queue

ES6에 들어오면서 새로운 컨셉인 **MicroTask Queue** 가 도입되었다. **MicroTask Queue**는 **Task Queue**와 동일한 계층에 존재하고 프로미스의 비동기 호출 시 **MicroStack Queue**에 쌓이게 된다. 

MicroTask Queue는 일반 Task Queue보다 우선 순위가 더 높아서 MicroTask Queue에 쌓인 콜백 함수들이 먼저 실행된다. 

```js
setTimeout(function() { // (A)
    console.log('A');
}, 0);
Promise.resolve().then(function() { // (B)
    console.log('B');
}).then(function() { // (C)
    console.log('C');
});
```

`setTimeout()` 은 콜백 함수를 Task Queue에 추가하고 프라미스의 `then()` 메서드는 콜백 B를 MicroTask Queue에 추가한다. 콜 스택이 비워지면 이벤트 루프는 Task Queue 대신 MicroTask Queue를 먼저 확인하고 콜백 B를 실행한다. 그리고 두번째 `then()` 메서드가 콜백 C를 MicroTask Queue에 추가한다. 이벤트 루프는 다시 MicroTask Queue를 확인하고 콜백 C를 실행한다. 이후 MicroTask Queue에 비었음을 확인한 후 Task Queue에서 콜백 A를 꺼내와 실행한다.



### 참고 자료

https://meetup.toast.com/posts/89

https://vimeo.com/96425312





