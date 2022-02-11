import { _Promise } from '../src/promise'

test('应该立刻执行构造函数传入的代码', () => {
  let timer = 0
  new _Promise(() => {
    timer++
  })
  expect(timer).toBe(1)
})

test('promise 有 3 种状态', () => {
  const p1 = new _Promise()
  expect(p1.status).toBe('pending')
  const p2 = new _Promise(resolve => resolve())
  expect(p2.status).toBe('fulfilled')
  const p3 = new _Promise((resolve, reject) => reject())
  expect(p3.status).toBe('rejected')
})

test('执行 resolve、reject 后状态固化 ', () => {
  const p1 = new _Promise((resolve, reject) => {
    resolve()
    reject()
  })
  expect(p1.status).toBe('fulfilled')
  const p2 = new _Promise((resolve, reject) => {
    reject()
    resolve()
  })
  expect(p2.status).toBe('rejected')
})
