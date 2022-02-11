import { _Promise } from '../src/promise'

test('all 方法接收队列，所有 fulfilled 即 fulfilled，一个 rejected 则 rejected', () => {
  function genPromise(index) {
    return new _Promise(resolve => {
      resolve('success' + index)
    })
  }
  const promiseQueue = [
    genPromise(0),
    genPromise(1),
    genPromise(2),
    genPromise(3),
  ]
  _Promise.all(promiseQueue).then(res => {
    expect(res).toEqual(['success0', 'success1', 'success2', 'success3'])
  })
  const promiseQueue2 = [
    ...promiseQueue,
    new _Promise((resolve, reject) => reject('error')),
  ]
  _Promise.all(promiseQueue2).catch(err => {
    expect(err).toBe('error')
  })
})
