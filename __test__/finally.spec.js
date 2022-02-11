import { _Promise } from '../src/promise'

test('无论 Promise 状态是满足还是拒绝，finally 都应该执行', () => {
  let finallyTimer = 0
  new _Promise(resolve => {
    resolve('hello world')
  }).finally(() => {
    finallyTimer++
  })
  expect(finallyTimer).toBe(1)
  new _Promise((resolve, reject) => {
    reject('hello world')
  }).finally(() => {
    finallyTimer++
  })
  expect(finallyTimer).toBe(2)
})
