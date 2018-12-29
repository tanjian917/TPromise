# TPromise
JavaScript Promise类。由于使用了ES5/6等新特性,无法兼容不支持这些特性的宿主环境（浏览器、Node.js环境）。

## 安装:
```javascript
<script src="./TPromise.min.js"></script>
```

## 使用
### 方式一
```javascript
new TPromise((resolve,reject)=>{
  // 执行异步操作
}).then(result=>{
  // 异步成功返回结果
},err=>{
  // 异步失败返回结果
});

```
### 方式二
```javascript
new TPromise((resolve,reject)=>{
  // 执行异步操作
}).then(result=>{
  // 异步成功返回结果
}).catch(err=>{
  // 异步失败返回结果
});
```

## 其他接口
### 实例接口
```javascript
// 添加实例成功回调函数。返回值：resolve参数值
TPromise.prototype.then((result)=>{})


// 添加实例失败回调函数。返回值：reject参数值
TPromise.prototype.catch((error)=>{})


// 添加实例无论成功失败回调函数。返回值：无
TPromise.prototype.finally(()=>{}))
```
### 全局接口
```javascript
// 调用TPromise then 方法
TPromise.resolve()

// 调用TPromise catch 方法
TPromise.reject()

// 实例谁先改变状态,就使用那个异步返回值
TPromise.race([])

// 所有实例都执行完后,如果全部成功调用then,并返回值数组。有一个失败执行catch,并返回值数组
TPromise.all([])
```

