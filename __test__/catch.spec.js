import { _Promise } from '../src/promise'

test('catch 应该捕获上一个 Promise 实例的 reject ', () => {
  new _Promise((resolve, reject) => {
    reject('error')
  }).catch(err => {
    expect(err).toBe('error')
  })
  new _Promise((resolve, reject) => {
    resolve('success')
  })
    .then(() => {
      throw new Error('error')
    })
    .catch(err => {
      expect(err).toEqual(new Error('error'))
    })
})

test('catch 可以捕获最开始的 reject ', () => {
  new Promise((resolve, reject) => {
    reject('error')
  })
    .then(res => {
      return res
    })
    .then(res => {
      return res
    })
    .catch(err => {
      expect(err).toBe('error')
    })
})
