## Promise 声明
```javascript
class Promise{
	constructor(executor){
		let resolve = () => {};

		let reject = () => {}

		executor(resolve,reject)
	}

}


```
### 解决基本状态
1. Promis存在三个状态 (state) pending fulfilled  rejected
2. pending(等待状态) 为初始态，并且可以转为fulfilled和 reject
3. 成功时，不可以转为其他状态，且必须有一个不可改变的值（value）
4. new Promise(() => {resolve(value)}) resolve成功，接受参数value，状态不可改变为fulfilled，不可再次改变
5. new Promisw((resolve,reject)=> {reject(reason)}) reject为失败，接受参数reason，状态不可再次该百年
6. 若executor函数报错，直接执行reject()

```javascript
class Promise{
	constructor(executor) {
		this.state = 'pending';
		this.value = undefined;
		this.reason = undefined;
		let resolve = value => {
			if(this.state === 'pending'){
				this.state = 'fulfilled';
				this.value = value
			}
		};
		let reject = reason => {
			if(this.state === 'pending'){
				this.state = 'reject';
				this.reason = reason
			}
		};
		try {
				executor(resolve,reject)
			}catch (e) {
				reject(e)
			}
	}
}
```
### then方法
then方法里面有两个参数：onFulfilled, onRejected
1. 当状态state为fulfilled，则执行onFulfilled,传入this.value。当状态为rejected，则只从onRejected,传入this.value
2. 如果onFulfilled和onRejected是函数，则在fulfilled,rejected后被调用

```javascript

```