## 웹팩 이란?

웹팩은 최신 FE 프레임워크에서 가장 많이 사용되는 모듈 번들러이다. 모듈 번들러는 웹 애플리케이션을 구성하는 자원들을 모두 각각의 모듈로 보고 이를 병합된 하나의 결과물로 만드는 도구이다.

### 모듈

**모듈** 👉🏻 특정 기능을 갖는 작은 코드의 단위, 웹 애플리케이션의 자원 (HTML, CSS, JavaScripts, images, Font 등)

### 모듈 번들링

웹 애플리케이션을 구성하는 몇십, 몇백개의 자원들을 하나의 파일로 병합 및 압축해주는 동작을 **모듈 번들링**이라 한다.

> 빌드, 번들링, 변환은 모두 같은 의미이다.



## 웹팩이 필요한 이유

### 파일 단위의 자바스크립트 모듈 관리의 필요성

자바스크립트의 변수 유효 범위는 기본적은 전역 범위를 갖는다. 그러나 이 점이 복잡한 웹 애플리케이션을 개발할 때는 문제점이 될 수 있다.

```html
<!-- index.html -->
<html>
  <head>
    <!-- ... -->
  </head>
  <body>
    <!-- ... -->
    <script src="./app.js"></script>
    <script src="./main.js"></script>
    <script>getNum(); // 20</script>
  </body>
</html>
```

```js
// app.js
var num = 10;
function getNum() {
  console.log(num);
}
```

```js
// main.js
var num = 20;
function getNum() {
  console.log(num);
}
```

`getNum()` 을 실행했을 main.js에서 선언한 `getNum()` 에 의해 20이 출력된다. 이런 식으로 변수의 이름을 모두 기억하지 않는 이상 변수를 중복 선언하거나 의도치 않은 값을 할당할 수도 있다.

따라서 파일 단위로 변수를 관리해야 할 필요성이 대두되었다.

### 웹 개발 작업 자동화 도구

FE 개발에서 가장 많이 반복했던 작업은 코드를 수정하고 브라우저에서 새로고침을 누르는 것이었다.

그 외에도 

- HTML, CSS, JS 압축
- 이미지 압축
- CSS 전처리기 변환

등 여러 작업들을 해야 했다. 이런 일들을 자동화 해주는 도구들이 필요해졌다.

### 웹 애플리케이션의 빠른 로딩 속도와 높은 성능 

웹 페이지의 로딩 속도를 줄이기 위해 많은 노력들이 있었다. 서버로 요청하는 파일 숫자를 줄이기 위해 웹 테스크 매니저를 이용해 파일들을 압축하고 병합하는 작업을 했다.

또한 초기 로딩 속도를 높이기 위해 나중에 필요한 자원들은 나중에 요청하는 **Lazy Loading** 이 등장했다.

웹팩은 기본적으로 필요한 자원은 미리 로딩하지 않고 필요할 때 로딩하자는 철학을 가지고 있다. 



## 웹팩으로 해결하려는 문제들

### 자바스크립트 변수 유효 범위 문제

✅ 웹팩 모듈 번들링 + ES6의 Modules 문법으로 해결 

### 브라우저별 HTTP 요청 숫자의 제약

✅ 웹팩을 이용해 여러 개의 파일들을 하나로 합쳐 브라우저별 HTTP 요청 숫자 제약을 해결

### Dynamic Loading & Lazy Loading 미지원

✅ 웹팩의 **Code Splitting** 기능을 이용해 원하는 모듈을 원하는 타이밍에 로딩할 수 있게 되었다. 



## Node.js & NPM

웹팩을 사용하기 위해서는 컴퓨터에 Node.js와 NPM이 설치되어 있어야 한다.

### Node.js

Node.js는 브라우저 밖에서도 자바스크립트를 실행할 수 있는 환경 

### NPM

NPM(Node Package Manager)는 명령어로 자바스크립트 라이브러리를 설치하고 관리할 수 있는 패키지 매니저이다.

NPM 설치를 할 때 중요한 점 ⭐️

👉🏻 **개발용 라이브러리와 배포용 라이브러리 구분하기**

개발용 라이브러리들은 웹 애플리케이션을 빌드하고 배포할 때 코드에서 빠지게 된다. 따라서 최종 애플리케이션에 포함되어야 하는 라이브러리는 `-D` 로 설치하면 안된다. 개발용으로 빠져도 되는 라이브러리들은 다음과 같다.

- `webpack` : 빌드 도구
- `eslint` : 코드 문법 검사 도구
- `Imagemin` : 이미지 압축 도구 



## 웹팩 주요 개념들

### Entry

`entry` 속성은 웹팩에서 웹 자원을 변환하기 위한 최초 진입점이자 자바스크립트 파일 경로이다.

```js
// webpack.config.js
module.exports = {
  entry: './src/index.js'
}
```

Entry 파일에는 웹 애플리케이션의 전반적인 구조와 내용이 담겨져 있어야 한다.

예를 들어 블로그 서비스를 웹팩으로 빌드한다고 했을 때 아래와 같을 수 있다.

```js
// index.js
import LoginView from './LoginView.js';
import HomeView from './HomeView.js';
import PostView from './PostView.js';

function initApp() {
  LoginView.init();
  HomeView.init();
  PostView.init();
}

initApp();
```

해당 서비스는 싱글 페이지 애플리케이션을 가정한 것이다. 웹팩을 실행하는 Entry 파일인 `index.js` 를 해석하게 되는데 이 파일에서 웹 서비스에 필요한 모든 화면들을 불러오고 있다. 웹팩은 해당 파일들의 내용까지 해석하며 파일을 빌드해줄 것이다. 

### Output

`output ` 속성은 웹팩을 실행하고 파일을 빌드한 결과물의 파일 경로를 의미한다.

```js
// webpack.config.js
var path = require('path');

module.exports = {
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  }
}
```

### Loader

`Loader` 은 웹팩이 웹 애플리케이션을 해석할 때 자바스크립트 파일이 아닌 웹 자원들(HTML, CSS, Images, Font 등)을 변환할 수 있도록 도와주는 속성이다. 

```js
// webpack.config.js
module.exports = {
  module: {
    rules: []
  }
}
```

`entry` 나 `output` 속성과는 다르게 `module` 이라는 이름을 사용한다.

예를 들어 CSS 파일을 빌드하기 위해서는 CSS 로더를 설치하고 관련된 웹팩 설정을 해주어야 한다.

```js
// webpack.config.js
module.exports = {
  entry: './app.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-loader']
      }
    ]
  }
}
```

`module`에 `rules` 배열에 객체 한 쌍을 추가한다. 그리고 그 객체에는 2개의 속성이 있다.

- `test`: 로더를 적용할 파일 유형
- `use`: 해당 파일에 적용할 로더의 이름 

로더의 적용 순서는 **오른쪽에서 왼쪽 순**으로 적용된다.

```js
module: {
  rules: [
    {
      test: /\.scss$/,
      use: ['css-loader', 'sass-loader']
    }
  ]
}
```

위 코드는 scss 파이레 대해 scss-loader로 전처리를 한 다음 웹팩에서 CSS 파일을 인식할 수 있게 CSS 로더를 적용하는 코드이다. 

자주 사용되는 로더 종류로는 Babel Loader, Sass Loader, File Loader, TS Loader 등이 있다.

### Plugin

`plugin`은 웹팩의 기본적인 동작에 추가적인 기능을 제공하는 속성이다. `loader` 는 파일을 해석하고 변환하는 과정에 참여하는 반면 `plugin` 은 해당 결과물의 형태를 바꾸는 역할을 하는 것이다. 

플러그인은 다음과 같이 선언한다.

```js
// webpack.config.js
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```

- `HtmlWebpackPlugin`: 웹팩으로 빌드한 결과물로 HTML 파일을 생성해주는 플러그인 



## 유용한 웹팩 툴

### Webpack Dev Server

`Webpack Dev Server`는 웹 애플리케이션을 개발하는 과정에서 유용하게 쓰인다. 웹팩의 빌드 대상 파일이 변경되면 매번 웹팩 명령어를 실행하지 않아도 자동으로 웹팩으로 빌드 후 브라우저를 새로고침 해준다.

매번 웹팩 빌드 명령어를 치는 시간 + 웹팩 빌드 시간 + 브라우저를 새로고침하는 시간을 줄요주기 때문에 웹팩 기반의 웹 어플리케이션 개발에서 필수로 사용된다.

**Webpack Dev Server의 중요한 특징**

👀 웹팩 데브 서버로 빌드한 결과물은 메모리에만 저장되고 파일로는 생성되지 않는다.

따라서, 웹팩 데브 서버는 개발할 때마나 사용하다가 개발이 완료되면 웹팩 명령어를 이용해 결과물을 파일로 생성해야 한다.

> 컴퓨토 구조 관점에서 파일 입출력보다 메모리 입출력이 더 빠르고 컴퓨터 자원이 덜 소모된다.



### Hot Module Replacement

`HMR`은 브라우저를 새로고침하지 않더라도 웹팩으로 빌드한 결과물이 실시간으로 웹 애플리케이션에 반영될 수 있도록 도와주는 설정이다.

```js
module.exports = {
  devServer: {
    hot: true
  }
}
```

데브 서버 설정에 `hot:true` 을 추가해주면 된다. 



### Source Map

`Soure Map`은 배포용으로 빌드한 파일과 원본 파일을 서로 연결해주는 기능이다. 보통 서버에 배포를 할 때는 성능 최적화를 위해 HTML, CSS, JS와 같은 웹 애플리케이션 자원들을 압축한다. 그 런데 압축하여 배포한 파일에서 에러가 발생한다면 디버깅을 어떻게 할 수 있을까요?

이런 경우 `Soure Map` 이 배포용 파일의 특정 부분이 원본 소스의 어떤 부분인지를 확인해준다. 

```js
// webpack.config.js
module.exports = {
  devtool: 'cheap-eval-source-map'
}
```

소스맵을 설정하기 위해서는 `devtool` 속성을 추가하고 소스맵 옵션 중 하나를 선택해주면 된다. 



### 참고

https://joshua1988.github.io/webpack-guide/guide.html