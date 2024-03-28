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
