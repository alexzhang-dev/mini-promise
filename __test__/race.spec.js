import { _Promise } from '../src/promise'

test('队列中哪个最先完成，那么 race 返回的实例就是什么状态', () => {
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
    genPromise(200, 'success1'),
    genPromise(100, 'success2'),
    genPromise(300, 'success3'),
  ]
  _Promise.race(promiseQueue).then(res => {
    expect(res).toBe('success2')
  })
  const promiseQueue2 = [...promiseQueue, genPromise(50, 'error', 'rejected')]
  _Promise.race(promiseQueue2).catch(err => {
    expect(err).toBe('error')
  })
})
