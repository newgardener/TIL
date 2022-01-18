### 버블링 (Bubbling)

한 요소에 이벤트가 발생하면 그 요소에 할당된 핸들러가 동작하고 이어서 부모 요소의 핸들러가 동작한다. 이 과정을 가장 최상단의 조상 요소(`document`)를 만날 때까지 반복하면서 요소 각각에 할당된 핸들러가 동작한다.

3개의 요소 FORM > DIV > P가 중첩된 구조를 한번 살펴보자.

```html
<form onclick="alert('form')">FORM
  <div onclick="alert('div')">DIV
    <p onclick="alert('p')">P</p>
  </div>
</form>
```

가장 안쪽의 `<p>` 를 클릭하면 

1. `<p>` 에 할당된 핸들러 동작
2. 바깥의 `<div>`에 할당된 핸들러 동작
3. 그 바깥의 `<form>`에 할당된 핸들러 동작
4. `document` 객체를 만날 때까지, 각 요소에 할당된 `onclick` 핸들러 동작

![image-20220118161620304](https://github.com/newgardener/TIL/blob/main/FE/images/bubbling.png)

#### event.target

부모 요소의 핸들러는 이벤트가 정확히 어디에서 발생했는지에 대한 정보를 얻을 수 있다.

- `event.target` 👉🏻 실제 이벤트가 시작된 타겟 요소 (버블링이 진행되어도 변하지 않는다)
- `this (event.currentTarget)` 👉🏻 현재 요소로 현재 실행 중인 핸들러가 할당된 요소
- `event.eventPhase` 👉🏻 현재 이벤트 흐름 단계 (캡처링=1, 타겟=2, 버블링=3)



#### 버블링 중단하기

`event.stopPropagation()` 을 통해 핸들러에서 이벤트를 완전히 처리하고 난 후 버블링을 중단하도록 명령할 수 있다.

```html
<body onclick="alert(`버블링은 여기까지 도달하지 못합니다.`)">
  <button onclick="event.stopPropagation()">클릭해 주세요.</button>
</body>
```

`<button>` 을 클릭해도 `body.onclick` 이 동작하지 않는 모습을 볼 수 있다.

`event.stopPropagation()`의 단점은 한 요소에 핸들러가 여러개 있는 상황에서 핸들러 중 하나가 버블링을 멈추더라도 나머지 핸들러는 여전히 동작하게 된다. 버블링을 멈추고 요소에 할당된 다른 핸들러의 동작도 막으려면 `event.stopImmediatePropagation()`을 사용해야 한다.

🚨 그러나 꼭 필요한 상황이 아닌 이상 `event.stopPropagation()` 은 하지 않는게 좋다.



### 캡처링 (Capturing)

표준 DOM 이벤트에서 정의한 이벤트 흐름엔 3가지 단계가 있다.

1. **캡처링 단계** - 이벤트가 하위 요소로 전파되는 단계
2. **타킷 단계** - 이벤트가 실제 타깃 요소에 전달되는 단계
3. **버블링 단계** - 이벤트가 상위 요소로 전파되는 단계

![image-20220118163516803](https://github.com/newgardener/TIL/blob/main/FE/images/capturing.png)

캡처링 단계에서 이벤트를 잡아내려면 `addEventListener` 의 `capture` 옵션을 `true` 로 설정해주어야 한다.

```js
elem.addEventListener(..., {capture: true})
// 아니면, 아래 같이 {capture: true} 대신, true를 써줘도 됩니다.
elem.addEventListener(..., true)
```

`capture` 옵션이

- `false` (default 값)이면 핸들러는 버블링 단계에서 동작
- `true`이면 핸들러는 캡처링 단계에서 동작

```html
<style>
  body * {
    margin: 10px;
    border: 1px solid blue;
  }
</style>

<form>FORM
  <div>DIV
    <p>P</p>
  </div>
</form>

<script>
  for(let elem of document.querySelectorAll('*')) {
    elem.addEventListener("click", e => alert(`캡쳐링: ${elem.tagName}`), true);
    elem.addEventListener("click", e => alert(`버블링: ${elem.tagName}`));
  }
</script>
```

`<p>` 를 클릭하면 다음과 같은 순서로 이벤트가 전달된다.

1. `HTML` -> `BODY` -> `FORM` -> `DIV` (캡처링 단계, 첫번째 리스너)
2. `p` (타깃 단계, 캡처링과 버블링 둘 다에서 리스너를 지정하였기 때문에 두번 호출된다)
3. `DIV` -> `FORM` -> `BODY` -> `HTML` (버블링 단계, 두번째 리스너)



### 이벤트 위임 (Event Delegation)

버블링과 캡처링은 이벤트 위임의 토대가 된다.

이벤트 위임을 사용하면 요소마다 핸들러를 할당하지 않고 요소의 공통 조상에 이벤트 핸들러를 하나만 할당하여도 여러 요소를 한꺼번에 다룰 수 있다.

공통 조상에 할당한 핸들러에서 `event.target` 을 통해 실제 어디에서 이벤트가 발생했는지 확인할 수 있다.

원하는 요소에서 이벤트가 발생되었다고 확인되면 이벤트를 핸들링해준다.

#### 이벤트 위임의 장점

- 많은 핸들러를 할당하지 않아도 되기 때문에 초기화가 단순해지고 메모리가 절약된다
- 요소를 추가하거나 제거할 때 해당 요소에 할당된 핸들러를 추가하거나 제거할 필요가 없기 때문에 코드가 짧아진다

#### 이벤트 위임의 단점

- 이벤트 위임을 사용하려면 이벤트가 반드시 버블링되어야 한다. 하지만 몇몇 이벤트는 버블링되지 않는다.
- 컨테이너 수준에 할당된 핸들러가 응답할 필요가 있는 이벤트이든 아니든 상관없이 모든 하위 컨테이너에서 발생하는 이벤트게 응답해야 하므로 CPU 작업 부하가 일어날 수 있다. 그러나 이 부하는 무시할만한 수준이므로 잘 고려하지 않는다.



### 참조

https://ko.javascript.info/event-delegation

https://ko.javascript.info/bubbling-and-capturing

https://ui.toast.com/weekly-pick/ko_20160826



