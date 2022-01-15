### [[Prototype]]

- **[[Prototype]]** 체계는 다른 객체를 참조하는 객체 내부에 있는 링크이다. 

  ```js
  const anotherObject = {a:2};
  const myObject = Object.create(anotherObject);
  myObject.a; // 2
  ```

  - `Object.create()` 의 기능은 **특정 객체의 [[Prototype]] 링크를 가진 객체를 생성하는 것**이다.

    ```js
    // Object.create()의 polyfill 코드
    if (!Object.create) {
      Object.create = function(o) {
        function F(){};
        F.prototype = o;
        return new F();
      }
    }
    ```

    - polyfill 코드에서는 F.prototype 프로퍼티가 링크하려는 객체를 가리키도록 override한다. 그런 다음 new F()로 원하는 연결이 수립된 새로운 객체를 반환한다. 

- 객체의 프로퍼티나 메서드를 참조하려고 하는데 해당 객체에 존재하지 않을 경우 **[[Prototype]]**에 연결된 객체들을 하나씩 찾아본다. 이 과정을 **Prototype Chaining** 이라 한다.
  - **[[Prototype]] 연쇄과정**은 최상위 객체인 **Object.prototype**에서 끝난다



### 클래스

> 어떤 객체를 굳이 다른 객체에 연결해야 하는 이유가 무엇일까?

클래스가 없고 객체만 있는 자바스크립트에서 어떻게 클래스를 흉내낼 수 있는 것인가?

그 물음에는 모든 함수가 기본적으로 **prototype**이라는 프로퍼티를 가진다는 특성으로 설명할 수 있다.

```js
function Foo(){}

const a = new Foo();

Object.getPrototypeOf(a) === Foo.prototype; // true
```

- `new Foo()`로 만들어진 모든 객체는 **Foo.prototype** 객체와 **[[Prototype]]** 링크로 연결된다

- 클래스의 인스턴스화는 **"클래스 작동 계획을 실제 객체에 복사하는 것"**으로 인스턴스마다 복사가 발생한다.
- 반면 자바스크립트에서는 어떠한 복사도 일어나지 않고 **공용 객체에서 [[Prototype]]으로 연결된 다수의 객체를 생성하는 방식**이다. 즉, 객체들은 서로 떨어져서 분리되어 있는 방식이 아니라 **끈끈하게 연결되어 있는 방식**이다. 



### 프로토타입 상속

> 상속은 기본적으로 복사를 수반하지만 자바스크립트는 객체의 프로퍼티를 복사하지 않는다.
>
> 대신 두 객체에 링크를 걸어두고 한쪽이 다른 쪽의 프로퍼티/함수에 접근할 수 있게 위임한다.



아래 코드는 위임 링크를 생성하는 전형적인 "프로토타입 스타일" 코드이다.

```js
function Foo(name) {
  this.name = name;
}
Foo.prototype.myName = function() {
  return this.name;
}

function Bar(name, label) {
  Foo.call(this, name);
  this.label = label;
}
Bar.prototype = Object.create(Foo.prototype);
Bar.prototype.myLabel = function() {
  return this.label;
}

const a = new Bar("a", "obj a");
a.myName(); // "a"
a.myLabel(); // "obj a"
```

- Bar.prototype과 Foo.prototype을 연결하는 테크닉은 ES6이후로 `Object.setPrototypeOf(Bar.prototype, Foo.prototype);`으로 변경되었다.

- 추가적인 [[Prototype]] 관련 메서드들

  ```js
  // c의 [[Prototype]] 연쇄 안에 b가 존재하는가?
  b.isPrototypeOf(c)
  
  // a의 [[Prototype]]을 바로 조회하는 방법
  Object.getPrototypeOf(a);
  
  // 브라우저 내에서 [[Prototype]]을 들여다 볼 수 있는 방법 
  a.__proto__ === Foo.prototype;
  ```



### 정리

- 자바스크립트 체계가 전통적인 클래스 지향 언어의 "클래스 인스턴스화 및 클래스 상속"과 유사한 것 처럼 보이지만 결정적인 차이는 **객체 간의 복사가 일어나지 않는다**는 점이다.
- 객체는 다른 객체와 **내부 [[Prototype]] 연쇄를 통해 연결**된다.
- 객체 간의 관계는 복사되는 것이 아니라 **다른 객체의 프로퍼티나 함수를 사용할 수 있도록 위임 연결이 맺어진 것**이다.

