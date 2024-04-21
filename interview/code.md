# 手写代码


## 切分一个字符串

```javascript
const text = `aaaa  "dd"  f   g;fd分
              1    "2dd"    113   512
              q   'w'   er,-/    g`
```


将以上文本切割为以下格式

```javascript
[
  ["aaaa",""dd"","f","g;fd分"],
  ["1",""2dd"","113","512"],
  ["q","'w'","er,-/","g"]
]
```


## 手写一个Promise


```javascript
class SimplePromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = null;
    this.callbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.callbacks.forEach(callback => callback(value));
      }
    };

    const reject = (error) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.value = error;
        this.callbacks.forEach(callback => callback(error));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new SimplePromise((resolve, reject) => {
      const handleCallback = (callback) => {
        try {
          const result = callback(this.value);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === 'fulfilled') {
        handleCallback(onFulfilled);
      } else if (this.state === 'rejected') {
        handleCallback(onRejected);
      } else {
        this.callbacks.push(onFulfilled);
      }
    });
  }
}


// 创建一个成功的 Promise
const promise = new SimplePromise((resolve, reject) => {
  resolve('成功!');
});

// 添加一个成功处理函数
promise.then(value => {
  console.log(value); // 应该输出 '成功!'
});

// 创建一个失败的 Promise
const failedPromise = new SimplePromise((resolve, reject) => {
  reject('失败!');
});

// 添加一个失败处理函数
failedPromise.then(null, reason => {
  console.error(reason); // 应该输出 '失败!'
});

```

## 手写一个防抖函数



## 手写一个节流函数




## 实现一个useDebounceValue


```javascript
import "./styles.css";
import { useState, useEffect, useRef } from "react";

function useDebounceValue(value, delay) {
  let timer = useRef(null);

  const [newValue, setNewValue] = useState("");

  if (timer.current) {
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setNewValue(value);
    }, delay);
  } else {
    timer.current = setTimeout(() => {
      setNewValue(value);
    }, delay);
  }

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return newValue;
}

export default function App() {
  const [value, setValue] = useState(0);
  const debouncedValue = useDebounceValue(value, 500);

  return (
    <div className="App">
      <div>
        debouncedValue: {debouncedValue} | value: {value}{" "}
      </div>
      <button
        onClick={() => {
          setValue((pre) => pre + 1);
        }}
      >
        increment
      </button>
    </div>
  );
}

```


## 如何将千分位符号 1231313.9 转换为1,231,313.9

```javascript
var number = 1231313.9;
var formattedNumber = number.toLocaleString('en-US'); // 使用美国英语的格式规则
console.log(formattedNumber); // 输出: 1,231,313.9
```



要通过JavaScript正则表达式将数字如`1231313.9`转换为千分位符号形式，即`1,231,313.9`，你可以使用`String.prototype.replace`方法配合一个适当的正则表达式。这个过程涉及匹配每三位数字并在它们前面添加逗号，但需特别注意不要改变小数点后面的部分。

下面是一个如何实现的示例：

```javascript
function formatNumberWithCommas(number) {
    let parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+\b)/g, ",");
    return parts.join(".");
}

const number = 123456789.45234234;
const newNumber = formatNumberWithCommas(number);
console.log("========>", newNumber); // 应该正确输出 "123,456,789.45234234"
```

这段代码定义了一个`formatNumberWithCommas`函数，其目的是将一个数字格式化为一个字符串，其中整数部分的每三位数字之间用逗号（,）分隔，同时保留小数部分。这在显示大数字时特别有用，因为逗号分隔的数字更容易阅读。

代码分析如下：

1. **将数字转换为字符串**：首先，输入的数字`number`被转换成一个字符串，以便能够使用字符串操作函数。

2. **分割整数和小数部分**：使用`split(".")`方法，基于小数点将数字分割成整数部分和小数部分（如果有的话），这两部分存储在`parts`数组中。

3. **使用正则表达式处理整数部分**：`parts[0].replace(/\B(?=(\d{3})+\b)/g, ",")`是代码中最关键的部分，主要通过正则表达式来格式化整数部分的字符串。

   - `\B`：匹配一个非单词边界。在这里，它确保匹配发生在数字中间，而不是在数字的开头。
   - `(?=(\d{3})+\b)`：这是一个正向前瞻断言（lookahead assertion），它查找任何位置，使得该位置后面紧接着是三个数字为一组（`\d{3}`），直到单词边界`\b`（通常是数字序列的结尾或小数点）。这个表达式确保了逗号将被插入在每三位数字之间，但不会影响到小数点之后的数字。
   - `g`：全局标志，意味着替换将在整个字符串中查找匹配项，而不是仅仅在找到第一个匹配后停止。

4. **将处理后的整数部分和小数部分重新组合**：最后，使用`join(".")`方法将经过逗号处理的整数部分和小数部分（如果存在）重新组合成一个完整的字符串。

因此，这个函数对于输入`123456789.45234234`，会首先将其转换成字符串`"123456789.45234234"`，然后分割成`["123456789", "45234234"]`。接着，它会在整数部分的每三位数字间添加逗号，变为`"123,456,789"`，最后将整数部分和小数部分再次组合，得到最终结果`"123,456,789.45234234"`。


## 如何实现解析模板字符串 "l am {{ name}}"

```javascript
function parseTemplate(template, context) {
  return template.replace(/\{\{\s*(.*?)\s*\}\}/g, (match) => {
    // 移除两边的大括号和空白字符
    const path = match.replace(/\{\{|\}\}/g, '').trim();
    
    // 通过path访问context中的值
    return context[path] || '';
  });
}



// 使用例子
const template = "I am {{ name }}";
const context = { name: 'Alice' };

const result = parseTemplate(template, context);
console.log(result); // 输出: I am Alice
```

## 渲染字符串到模版

```javascript
const template = "I am {{ name }}";
const context = { name: "Alice" };

function renderTemplate(template, context) {
  // 遍历context对象的每一个键值对
  for (const key in context) {
    if (context.hasOwnProperty(key)) {
      // 使用正则表达式创建一个新的替换模式，全局匹配模板中的占位符
      const replacePattern = new RegExp('{{\\s*' + key + '\\s*}}', 'g');
      // 替换模板中的占位符为context中相应的值
      template = template.replace(replacePattern, context[key]);
    }
  }
  return template;
}

console.log(renderTemplate(template, context));
```




## 如何实现一个Promise race


在JavaScript中，`Promise.race` 是一个内置函数，它接受一个Promise对象的数组作为输入，并返回一个新的Promise对象。这个新的Promise会解析或拒绝为最先解析或拒绝的输入Promise的结果。

如果你想要手动实现一个 `Promise.race` 函数，你可以按照以下步骤进行：

1. 创建一个函数，它接受一个Promise数组作为参数。
2. 返回一个新的Promise。
3. 遍历这个Promise数组。
4. 对于每一个Promise，一旦它解析或拒绝，就解析或拒绝外部的Promise。

下面是一个简单的实现：

```javascript
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    // 确保传入的是一个可遍历的数组
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument is not iterable'));
    }

    // 遍历所有的Promise
    promises.forEach((promise) => {
      // 为每个Promise指定一个then回调
      Promise.resolve(promise) // 包装以确保兼容非Promise值
        .then(
          (value) => resolve(value), // 一旦有一个Promise解析，就解析外部Promise
          (reason) => reject(reason) // 一旦有一个Promise拒绝，就拒绝外部Promise
        );
    });
  });
}

// 使用示例
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

promiseRace([promise1, promise2]).then((value) => {
  console.log(value); // "two" - promise2更快解析
});
```

在这个实现中，我们首先检查传入的参数是否是一个数组，然后为每个Promise添加`.then`方法。`.then`方法接受两个回调函数，一个用于解析(resolve)的情况，一个用于拒绝(reject)的情况。无论哪个Promise最先改变状态，`resolve`或`reject`函数都会被调用，并且它的结果或错误会被传递给外部的Promise。这样就模拟了`Promise.race`的行为。

请注意，这个实现不会取消其他还未解析的Promise。这些Promise仍然会继续执行，即使它们不再影响race的结果。这与原生的`Promise.race`行为是一致的。


## 如何判断当前用户的网络质量


要在Web应用程序中实现网络质量检测，你可以使用一些原生的Web API以及一些开源库。以下是一些示例代码和开源库的介绍：

### 1. 使用原生JavaScript和Web API检测网络类型和速度

```javascript
// 检测网络类型（如果浏览器支持）
if ('connection' in navigator) {
  console.log(navigator.connection.effectiveType);
}

// 检测下载和上传速度（使用Performance API）
window.onload = function () {
  var startTime = (new Date()).getTime();
  var download = new Image();
  download.onload = function () {
    var endTime = (new Date()).getTime();
    var duration = (endTime - startTime) / 1000; // 秒
    var bitsLoaded = downloadSize * 8;
    var speedBps = (bitsLoaded / duration).toFixed(2);
    var speedKbps = (speedBps / 1024).toFixed(2);
    var speedMbps = (speedKbps / 1024).toFixed(2);
    console.log("Your connection speed is:", speedMbps + " Mbps");
  }
  var downloadSize = 4995374; // bytes
  download.src = 'http://yourserver.com/file?n=' + startTime;
}
```

### 2. 使用开源库进行网络质量检测

```
- **speedtest-net** (适用于Node.js环境)
  这是一个非常流行的Node.js库，可以用来测试下载和上传速度。
  ```javascript
  const speedTest = require('speedtest-net');
  (async () => {
    try {
      const result = await speedTest();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  })();
  ```

- **network-info** (适用于浏览器环境)
  这个库可以帮助你获取关于当前网络连接的信息。
  ```javascript
  import { getNetworkInformation } from 'network-info';

  const networkInformation = getNetworkInformation();
  console.log(networkInformation);
  ```

- **boomerang** (适用于浏览器环境)
  Boomerang是一个JavaScript库，用于测量Web页面的性能，包括网络质量的相关指标。
  ```html
  <script src="boomerang.js" type="text/javascript"></script>
  ```

请注意，你可能需要根据库的更新和API的变化来调整这些代码示例。同时，上述代码和库仅作为示例和入门点，实际部署时你需要根据自己的需求和环境进行调整和测试。

在使用这些工具和库时，请确保你遵守了用户隐私和数据使用的最佳实践，特别是在生产环境中。


## 实现一个Promise any

在JavaScript中，`Promise.any`是一个接口，它接受一个Promise可迭代对象作为输入，并且返回一个单一的Promise。这个返回的Promise会尽快地解析为第一个fulfilled状态的Promise结果。如果传入的迭代对象中没有一个Promise变成fulfilled状态，而是都被拒绝了，则返回的Promise会被拒绝，并且拒绝的理由将是一个`AggregateError`，包含所有被拒绝的Promise的理由。

如果需要手动实现一个`Promise.any`的行为，可以按照以下步骤进行：

1. 创建一个新的Promise对象，`Promise.any`的实现将会在这个Promise的构造函数中执行。
2. 遍历所有传入的Promise对象。
3. 对每个Promise对象，当它fulfilled时，解析外部的Promise。
4. 如果一个Promise被拒绝，我们不立即拒绝外部的Promise，而是记录下来。只有当所有的Promise都被拒绝时，我们才拒绝外部的Promise，并且以一个`AggregateError`作为拒绝的理由。

以下是如何实现的一个示例代码：

```javascript
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    // 计数器，用于记录被拒绝的Promise数量
    let rejectCount = 0;
    // 存储所有被拒绝的理由
    const errors = [];

    if (promises.length === 0) {
      return reject(new AggregateError('No promises were provided.', 'AggregateError'));
    }

    promises.forEach((promise, index) => {
      // 将非Promise值通过Promise.resolve转换为Promise，确保统一处理
      Promise.resolve(promise).then(
        // 一旦有任何一个Promise解析，立即解析外部的Promise
        value => resolve(value),
        // 如果被拒绝，记录错误并检查是否所有的Promise都已经被拒绝
        reason => {
          errors[index] = reason;
          rejectCount++;
          if (rejectCount === promises.length) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        }
      );
    });
  });
}

// 使用示例
const p1 = Promise.reject('p1');
const p2 = Promise.resolve('p2');
const p3 = Promise.reject('p3');

promiseAny([p1, p2, p3]).then(
  value => console.log(`Resolved: ${value}`), // 输出：Resolved: p2
  error => console.log(`Rejected: ${error.message}`)
);
```

这段代码创建了一个`promiseAny`函数，它模拟了`Promise.any`的行为，正确处理了多个Promise的解析和拒绝情况，并且在所有给定的Promise都失败时，通过抛出一个`AggregateError`来表示失败。这是手动实现`Promise.any`的一种方式。


## 有100个文件需要上传，每次最多传4个，请设计一个算法




## 函数柯里化

```javascript
//设计一个sum函数，使其满足以下要求

sum(1, 2).sumof(); //返回3
sum(1, 2)(3).sumof(); //返回 6
sum(1)(2, 3, 4).sumof(); //返回 10
sum(1, 2)(3, 4)(5).sumof(); //返回 15

function sum(...args) {
  let currentValue = args.reduce((acc, cur) => acc + cur, 0);

  function innerSum(...newArgs) {
    currentValue = newArgs.reduce((acc, cur) => acc + cur, currentValue);

    return innerSum;
  }

  innerSum.sumof = () => {
    return currentValue;
  };

  return innerSum;
}

console.log(sum(1, 2).sumof()); //返回3
console.log(sum(1, 2)(3).sumof()); //返回 6
console.log(sum(1)(2, 3, 4).sumof()); //返回 10
console.log(sum(1, 2)(3, 4)(5).sumof()); //返回 15

```


## 如何实现 Semver 对比版本号大小

```javascript
function compareSemver(v1, v2) {
    const parseVersion = (version) => version.split('.').map(Number);
    
    const versions1 = parseVersion(v1);
    const versions2 = parseVersion(v2);

    for (let i = 0; i < 3; i++) {
        if (versions1[i] > versions2[i]) {
            return 1;
        } else if (versions1[i] < versions2[i]) {
            return -1;
        }
    }

    return 0;
}

// 使用示例
console.log(compareSemver('1.2.3', '1.2.4')); // 返回 -1
console.log(compareSemver('1.2.3', '1.2.3')); // 返回 0
console.log(compareSemver('1.2.3', '1.3.0')); // 返回 -1
console.log(compareSemver('1.3.0', '1.2.3')); // 返回 1
```


### 算法题：如何实现链表从 1，-1， 2， -2 ... 依次进行排列


### 将扁平化数据转换为级联数据 listToTree

```javascript
function listToTree(arr) {
  const result = [];

  const idMapIndex = {};

  arr.forEach((value, index) => {
    idMapIndex[value.id] = index;
    value.children = [];
  });

  console.log("idMapIndex==", idMapIndex);

  arr.forEach((value, index) => {
    let parent = arr[idMapIndex[value["pid"]]];

    if (parent) {
      parent.children.push(value);
    } else {
      result.push(value);
    }
  });

  return result;
}

let arr = [
  { id: 10, name: "部门5", pid: 8 },
  { id: 2, name: "部门2", pid: 1 },
  { id: 8, name: "部门4", pid: 3 },
  { id: 12, name: "部门1", pid: 11 },
  { id: 1, name: "部门1", pid: 0 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 11, name: "部门1", pid: 0 },
];
const result = listToTree(arr);

console.log("==result==", JSON.stringify(result, null, 2));

```


## 数据引用

如果是修改则可以影响外部，如果是替换则不影响外部（指针变了）

```javascript
let nameList = ["Alan", "Tom"];

let helloJson = { name: "zhaoolee", age: 12 };

function changeName(nameList, helloJson) {
  //   nameList = [];

  //   helloJson = {};

  nameList.push("new name");

  helloJson.color = "red";
}

changeName(nameList, helloJson);
console.log("==", nameList, helloJson);

```