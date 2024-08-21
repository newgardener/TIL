const curry = function (fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
};

function sum(a, b, c) {
  return a + b + c;
}
const csum = curry(sum);
console.log(csum(1)(2, 3));
console.log(csum(1, 2)(3));
console.log(csum(1, 2, 3));
