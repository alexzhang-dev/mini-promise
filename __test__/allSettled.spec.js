import { _Promise } from '../src/promise'

test('allSettled 无论 promise 队列是 fulfilled 还是 rejected，都会保存起来，并且只会是 fulfilled', () => {
  function genPromise(index) {
    return new _Promise(resolve => {
      resolve('success' + index)
    })
  }
  const promiseQueue = [genPromise(0), genPromise(1), genPromise(2)]
  _Promise.allSettled(promiseQueue).then(res => {
    expect(res).toEqual([
      { status: 'fulfilled', value: 'success0' },
      { status: 'fulfilled', value: 'success1' },
      { status: 'fulfilled', value: 'success2' },
    ])
  })
  const promiseQueue2 = [
    ...promiseQueue,
    new _Promise((resolve, reject) => reject('error')),
  ]
  _Promise.allSettled(promiseQueue2).catch(err => {
    expect(err).toEqual([
      { status: 'fulfilled', value: 'success0' },
      { status: 'fulfilled', value: 'success1' },
      { status: 'fulfilled', value: 'success2' },
      { status: 'rejected', reason: 'error' },
    ])
  })
})
