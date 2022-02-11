const STATUS_PENDING = 'pending'
const STATUS_FULFILLED = 'fulfilled'
const STATUS_REJECTED = 'rejected'

function executeFnWithCatchError(fn, param, resolve, reject) {
  try {
    const result = fn(param)
    resolve(result)
  } catch (error) {
    reject(error)
  }
}

export class _Promise {
  constructor(executor = () => {}) {
    this.status = STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    this.resolveQueue = []
    this.rejectQueue = []
    const resolve = value => {
      if (this.status === STATUS_PENDING) {
        this.status = STATUS_FULFILLED
        this.value = value
        if (this.resolveQueue.length)
          this.resolveQueue.forEach(item => item(this.value))
      }
    }
    const reject = reason => {
      if (this.status === STATUS_PENDING) {
        this.status = STATUS_REJECTED
        this.reason = reason
        if (this.rejectQueue.length)
          this.rejectQueue.forEach(item => item(this.reason))
      }
    }
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  then(onFulfilled, onRejected) {
    // 针对这一情况，可以给两个参数写一个默认值
    onFulfilled = onFulfilled
      ? onFulfilled
      : value => {
          return value
        }
    onRejected = onRejected
      ? onRejected
      : reason => {
          throw new Error(reason)
        }
    return new Promise((resolve, reject) => {
      // 判断就可以删除掉了，因为传入的两个参数是必定有值的
      if (this.status === STATUS_FULFILLED) {
        executeFnWithCatchError(onFulfilled, this.value, resolve, reject)
      }
      if (this.status === STATUS_REJECTED) {
        executeFnWithCatchError(onRejected, this.reason, resolve, reject)
      }
      if (this.status === STATUS_PENDING) {
        this.resolveQueue.push(param => {
          executeFnWithCatchError(onFulfilled, param, resolve, reject)
        })
        this.resolveQueue.push(param => {
          executeFnWithCatchError(onRejected, param, resolve, reject)
        })
      }
    })
  }
  catch(onRejected) {
    this.then(undefined, onRejected)
  }
  finally(onFinally) {
    this.then(
      () => {
        onFinally()
      },
      () => {
        onFinally()
      }
    )
  }
  static resolve(data) {
    return new _Promise(resolve => resolve(data))
  }
  static reject(data) {
    return new _Promise((resolve, reject) => reject(data))
  }
  static all(promiseQueue) {
    return new _Promise((resolve, reject) => {
      const result = []
      promiseQueue.forEach(promise => {
        promise
          .then(res => {
            result.push(res)
          })
          .catch(err => {
            reject(err)
          })
      })
      resolve(result)
    })
  }
  static allSettled(promiseQueue) {
    return new _Promise(resolve => {
      const result = []
      promiseQueue.forEach(promise => {
        promise
          .then(res => {
            result.push({
              status: STATUS_FULFILLED,
              value: res,
            })
          })
          .catch(err => {
            result.push({
              status: STATUS_REJECTED,
              reason: err,
            })
          })
      })
      resolve(result)
    })
  }
  static race(promiseQueue) {
    return new _Promise((resolve, reject) => {
      promiseQueue.forEach(promise => {
        promise
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    })
  }
  static any(promiseQueue) {
    return new _Promise((resolve, reject) => {
      const reasons = []
      promiseQueue.forEach(promise => {
        promise
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reasons.push(err)
          })
      })
      if (reasons.length === promiseQueue.length) {
        throw new AggregateError()
      }
    })
  }
}
