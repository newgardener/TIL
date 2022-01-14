## `textContent` vs `innerText` 의 차이점

- 노드의 `textContent`를 설정하면 노드의 모든 자식을 주어진 문자열로 이루어진 하나의 텍스트 노드로 대치한다.

|`textContent`|`innerText`|
|:----:|:-----:|
|노드의 모든 요소들을 반환|"사람이 읽을 수 있는" 요소만 처리 (스타일링 고려)|

- `innerText`는 CSS를 고려하여 `innerText`로 값을 읽을 경우 최신 계산 값을 반영하기 위해 리플로우가 발생한다.
  - 리플로우는 계산이 비싸기 때문에 최대한 피해야 한다!

### `textContent`와 `innerHTML`의 차이점
- `innerHTML`은 말그대로 HTML을 반환한다.
- 반면, `textContent`는 HTML로 분석할 필요가 없다는 점에서 `innerHTML`보다 성능이 좋다.

``` js
<div id="divA">This is <span>some</span> text!</div>

let text = document.getElementById('divA').textContent;
// The text variable is now: 'This is some text!'

document.getElementById('divA').textContent = 'This text is different!';
// The HTML for divA is now:
// <div id="divA">This text is different!</div>
```

### 참고자료
- https://developer.mozilla.org/ko/docs/Web/API/Node/textContent