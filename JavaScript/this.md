## this

자바스크립트의 모든 함수는 실행될 때마다 함수 내부에 `this` 객체가 추가된다. 그렇기 때문에 자바스크립트에서의 `this` 는 함수가 호출된 상황에서 그 모습을 달리한다.

### 상황 1.  생성자 함수를 통해 객체를 생성할 때

`new` 연산자를 통해 함수를 생성자로 호출하게 되면 일단 빈 객체가 생성되고 this가 바인딩된다. 이 객체는 함수를 통해 생성된 객체이며 자신의 부모인 프로토타입 객체와 연결되어 있다. 그리고 return 문을 명시하지 않은 경우에는 this로 바인딩된 새로운 객체가 반환된다. 

```js
var Person = function(name) {
  console.log(this);
  this.name = name;
};

var foo = new Person("foo"); // Person
console.log(foo.name); // foo
```



### 상황 2.  apply, call, bind를 통한 함수 호출

자바스크립트에서는 `this` 를 코드로 주입 또는 설정할 수 있다.

- `bind` 메서드 사용

  ```js
  var value = 100;
  var myObj = {
    value: 1,
    func1: function() {
      console.log(`func1's this.value: ${this.value}`);
  
      var func2 = function(val1, val2) {
        console.log(`func2's this.value ${this.value} and ${val1} and ${val2}`);
      }.bind(this, `param1`, `param2`);
      func2();
    }
  };
  
  myObj.func1();
  // console> func1's this.value: 1
  // console> func2's this.value: 1 and param1 and param2
  ```

- `apply` 메서드 사용

  ```js
  var value = 100;
  var myObj = {
    value: 1,
    func1: function() {
      console.log(`func1's this.value: ${this.value}`);
  
      var func2 = function(val1, val2) {
        console.log(`func2's this.value ${this.value} and ${val1} and ${val2}`);
      };
      func2.apply(this, [`param1`, `param2`]);
    }
  };
  ```

- `call` 메서드 사용

  ```js
  var value = 100;
  var myObj = {
    value: 1,
    func1: function() {
      console.log(`func1's this.value: ${this.value}`);
  
      var func2 = function(val1, val2) {
        console.log(`func2's this.value ${this.value} and ${val1} and ${val2}`);
      };
      func2.call(this, `param1`, `param2`);
    }
  };
  
  myObj.func1();
  // console> func1's this.value: 1
  // console> func2's this.value: 1 and param1 and param2
  ```

`bind` vs `apply`, `call`

`bind` 는 함수를 선언할 때, `apply` 와  `call` 은 함수를 호출 할 때 `this` 파라미터를 지정해준다.

`apply` vs `bind`, `call`

`apply` 는 두번째 파라미터를 배열 형태로 전달해주어야 하지만 `bind`와 `call` 은 각각의 파라미터를 하나씩 넘겨주는 형태이다.



### 상황 3. 객체의 메서드를 호출할 때

함수를 실행할 때 this는 함수를 소유하고 있는 객체 (=메서드를 포함하고 있는 인스턴스)를 참조한다. 즉, 해당 메서드를 호출한 객체에 this가 바인딩된다. 

```js
var myObject = {
  name: "foo",
  sayName: function() {
    console.log(this);
  }
};
myObject.sayName();
// console> Object {name: "foo", sayName: sayName()}
```



### 상황 4. 함수를 호출할 때

특정 객체의 메서드가 아닌 그냥 함수를 호출하면 해당 함수 내부 코드에 사용된 this는 전역 객체에 바인딩된다.

```js
var value = 100;
var myObj = {
  value: 1,
  func1: function() {
    console.log(`func1's this.value: ${this.value}`);

    var func2 = function() {
      console.log(`func2's this.value ${this.value}`);
    };
    func2();
  }
};

myObj.func1();
// console> func1's this.value: 1
// console> func2's this.value: 100
```



### this 확정 규칙

1. `new`로 함수 호출을 했나? 👉🏻 맞으면 새로 생성된 객체가 **this**이다.

   ```js
   const bar = new foo();
   ```

2. `call`과 `apply`로 함수 호출을 했나? 👉🏻 맞으면 명시적으로 지정된 객체가 **this**이다.

   ```js
   const bar = foo.call(obj2);
   ```

3. 함수를 콘텍스트(암시적 바인딩) 즉, 객체를 소유 또는 포함하는 형태로 호출했나? 👉🏻 맞으면 콘텍스트 객체가 **this**이다.

   ```js
   const bar = obj1.foo();
   ```

4. 그 이외의 경우에는 **this**는 전역 객체에 바인딩된다

   ```js
   const bar = foo();
   ```



### 어휘적 this

일반함수에서 준수하는 4가지 **this 확정 규칙**에 대해서 알아봤다

ES6에서 등장한 `화살표 함수`은 앞선 규칙들을 따르지 않는다. `화살표 함수`는 Enclosing Scope({})를 보고 lexical scope에 따라 this를 바인딩 한다.

```js
function foo() {
  return (a) => {
    // 화살표 함수 안에서의 this는 어휘적으로 'foo()'에 상속된다
    console.log(a);
  }
}

const obj1 = {a:2};
const obj2 = {a:3};

const bar = foo.call(obj1);
bar.call(obj2); // 결과값이 3이 아닌 2이다!
```

ES6 이전에도 화살표 함수의 기능과 비슷하게 많이 쓰이던 패턴이 있었다.

```js
function foo() {
  const self = this;
  setTimeout(function(){
    console.log(self.a);
  }, 100);
}

const obj = {a:2};
foo.call(obj);                      
```

