## 객체 생성 모델

- 브라우저가 페이지를 렌더링하려면 DOM 및 CSSOM 트리를 생성해야 한다

- HTML 마크업은 DOM(Document Object Model)으로 변환되고, CSS 마크업은 CSSOM(CSS Object Model)으로 변환된다

  

### DOM

![image-20220114150802383](https://github.com/newgardener/TIL/blob/main/Web/images/DOM.png)

1. 변환: 브라우저가 HTML의 원시 바이트를 읽어와서 문자로 변환됨
2. 토큰화: 브라우저가 문자열을 W3C HTML5 표준에 지정된 고유 토큰으로 변환됨
3. 렉싱: 토큰이 해당 속성 및 규칙을 정의하는 노드 객체로 변환됨
4. DOM 생성: HTML 마크업이 여러 태그 간의 관계를 정의하기 때문에 트리 데이터 구조 내에 연결됨



### CSSOM

![Screen Shot 2022-01-14 at 3.40.02 PM](https://github.com/newgardener/TIL/blob/main/Web/images/CSSOM.png)

HTML과 마찬가지로 CSS도 브라우저가 이해하고 처리할 수 있는 형식으로 변환되어야 한다. CSS 바이트가 문자로 변환된후 차례로 토큰, 노드로 변환되고 마지막으로는 CSSOM이라는 트리구조에 링크된다.

CSSOM이 트리구조를 갖는 이유는?

 > 페이지에 있는 객체의 최종 스타일을 계산할 때 브라우저는 해당 노드에 적용 가능한 가장 일반적인 규칙에서부터 더욱 구체적인 규칙을 적용하는 방식 즉, '하향식'으로 규칙을 적용하기 위해 CSSOM은 트리구조를 갖는다. 



## 렌더링 트리 생성, 레이아웃 및 페인트

1. DOM 및 CSSOM 트리를 결합하여 **렌더링 트리** 형성한다.
   - 렌더링 트리는 페이지 렌더링에 필요한 모든 DOM 컨텐츠와 각 노드에 대한 모든 CSSOM 스타일 정보를 캡처한다.
2. 뷰포트 내에서 노드의 정확한 위치와 크기를 계산하는 **레이아웃**을 진행한다.
3. 렌더링 트리의 각 노드를 화면의 픽셀로 변환하는 **페인팅**을 진행한다.



### 참고 자료

https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=ko
