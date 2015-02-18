# dummy

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![David deps][david-image]][david-url]
  [![npm download][download-image]][download-url]

Peaks similarity - calculate a similarity between 0 and 1  of 2 arrays of [x,y] points.

## Description

The idea is to calculate a similarity value between 0 and 1 between two arrays of peaks ([x,y] points).

```javascript
var peaks1=[[1,1],[2,2]];
var peaks2=[[1,2],[2,1]];

var Comparator = require('..');
var comparator=new Comparator({bottomWidth: 4, topWidth: 2});
var result=comparator.getSimilarity(peaks1, peaks2);

console.log(result);
```


## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/cheminfo-dummy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/cheminfo-dummy
[travis-image]: https://img.shields.io/travis/cheminfo-js/dummy/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/cheminfo-js/dummy
[david-image]: https://img.shields.io/david/cheminfo-js/dummy.svg?style=flat-square
[david-url]: https://david-dm.org/cheminfo-js/dummy
[download-image]: https://img.shields.io/npm/dm/cheminfo-dummy.svg?style=flat-square
[download-url]: https://npmjs.org/package/cheminfo-dummy
