import { _Promise } from '../src/promise'

test('any 方法接收一个 Promise 队列，只要一个是 fulfilled 状态，就改变返回的实例状态，如果所有都是 rejected，也要等待所有执行完毕后，抛出一个错误', () => {
  function genPromise(delay, message, type = 'fulfilled') {
    if (type === 'fulfilled') {
      return new _Promise(resolve => {
        setTimeout(() => {
          resolve(message)
        }, delay)
      })
    }
    return new _Promise((resolve, reject) => {
      setTimeout(() => {
        reject(message)
      }, delay)
    }, delay)
  }
  const promiseQueue = [
    genPromise(100, 'error1', 'rejected'),
    genPromise(200, 'success1'),
    genPromise(300, 'error2', 'rejected'),
  ]
  _Promise
    .any(promiseQueue)
    .then(res => {
      expect(res).toBe('success1')
    })
    .catch(() => {})
  const promiseQueue2 = [
    genPromise(100, 'error11', 'rejected'),
    genPromise(200, 'error22', 'rejected'),
    genPromise(300, 'error33', 'rejected'),
  ]
  try {
    _Promise.any(promiseQueue2).catch(err => {})
  } catch (error) {
    expect(error).toEqual(new AggregateError('All promises were rejected'))
  }
})
