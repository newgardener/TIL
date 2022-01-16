### Transpiler

- `compiler`: 코드를 바이트 코드로 변환
- `transpiler`: 코드를 다른 레밸의 코드로 변환 

그럼 **babel**은?

👉🏻 **babel**은 **JS 코드를 JS 코드로 변환하는 transpiler**이다.



### Babel

**Babel**은 **ES6 코드를 ES5로 변환하는 transpiler**이다. 

Babel을 이용해 ES5로 변환된 코드를 사용하면 모던 브라우저 대부분에서 ES6 문범을 문제없이 사용할 수 있게 된다. 하지만 IE8에서 동작하게 하려면 조금 더 설정이 필요하다.



### Babel의 하위 지원 설정 - Polyfill

```js
if (typeof Array.prototype.indexOf === 'undefined') {
Array.prototype.indexOf = function() {};
}
```

브라우저에 Array라는 native 객체에 indexOf 메서드가 없을 경우 Polyfill을 쓰게 된다. Babel과 Polyfill은 별개로 Polyfill만 사용해서 ES5의 기능을 IE8에서 쓸 수 있다.

Babel은 공식적으로 core-js를 Polyfill 옵션으로 제공하고 있다. 때문에 babel-polyfill 패키지를 설치하고 코드에 포함시키는 것으로 요구사항을 만족시킬 수 있다.



### Babel의 하위 지원 설정 - Plugin

```js
// ORIGINAL
class UserList {
constructor() {
this.users = new Set();
}
delete(name) {
return this.users.delete(name);
}
}

// TRANSPILED
function _classCallCheck(instance, Constructor) {/ 생략 /}
var UserList = function () {
function UserList() {
_classCallCheck(this, UserList);
this.users = new Set();
}
UserList.prototype.delete = function _delete(name) { // ERROR
return this.users.delete(name); // ERROR
};
return UserList;
}();
```

코드 상에서 users의 프로퍼티를 ES6의 콜렉션인 Set로 변경하였다. 그리고 `delete` 메서드를 통해 user를 제거할 수 있도록 했고 이를 babel을 통해 transpile했다. 이 코드를 IE8에서 실행하면 `Expected identifier` 요류가 발생한다. 이는 `delete` 라는 키워드를 접근자로 사용했기 때문이다. 

물론 이 코드는 ES5 지원 브라우저에서 유효하다. 그러나 지원하지 않는 브라우저에서는 transpile 중 접근자가 키워드일 때 `obj['delete']()` 형태로 바뀌어야 한다. 이 문제를 Plugin을 통해 해결할 수 있다. member-expression-literals, property-literals, 플러그인은 transpile 중 이런 member literal 표기를 콤마로 감싸준다. 그래서 `obj['delete']();` 로 변환한다. 이제 IE8에서도 ES6문법을 사용할 수 있게 되었다!



### 정리

- **babel transpiler**는 ES6코드를 ES5에서 동작할 수 있게 한다.
- IE8은 ES5 스펙 전체를 지원하지 않으므로 부족한 부분은 **Polyfill** 한다.
- 이전 버전에서 키워드를 접근자로 사용할 경우 나타나는 오류를 방지하기 위해 **Plugin**으로 키워드를 문자로 감싸준다.



### 참고 

https://meetup.toast.com/posts/85