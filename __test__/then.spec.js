import { _Promise } from '../src/promise'

test('then 方法可以接收两个参数，可以处理 resolve 和 reject', () => {
  new _Promise(resolve => {
    resolve('success')
  }).then(res => {
    expect(res).toBe('success')
  })
  new _Promise((resolve, reject) => {
    reject('error')
  }).then(undefined, err => {
    expect(err).toBe('error')
  })
})

test('executor 可以是一个异步函数', () => {
  new _Promise(resolve => {
    setTimeout(() => {
      resolve('success')
    }, 300)
  }).then(res => {
    expect(res).toBe('success')
  })
  new _Promise((resolve, reject) => {
    setTimeout(() => {
      reject('error')
    }, 300)
  }).then(undefined, err => {
    expect(err).toBe('error')
  })
})

test('如果构造函数抛出了一个错误，then 的第二个参数也可以捕获到', () => {
  new _Promise(() => {
    throw new Error('error!')
  }).then(undefined, err => {
    expect(err).toEqual(new Error('error!'))
  })
})

test('链式调用', () => {
  new _Promise(resolve => {
    resolve('success1')
  })
    .then(res => {
      expect(res).toBe('success1')
      return res + ' success2'
    })
    .then(res => {
      expect(res).toBe('success1 success2')
    })
  new _Promise((resolve, reject) => {
    reject('error1')
  })
    .then(undefined, err => {
      expect(err).toBe('error1')
      return err + ' error2'
    })
    .then(res => {
      expect(res).toBe('error1 error2')
    })
})

test('在链式调用的过程中出现任何错误，将由下面的 then 第二个参数处理', () => {
  new _Promise((resolve, reject) => {
    resolve('success')
  })
    .then(res => {
      expect(res).toBe('success')
      throw new Error('error!')
    })
    .then(undefined, err => {
      expect(err).toEqual(new Error('error!'))
    })
})
