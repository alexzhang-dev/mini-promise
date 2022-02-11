import { _Promise } from '../src/promise'

test('reject 可以将传入的值作为 reject() 的参数', () => {
  _Promise.reject('error').catch(err => {
    expect(err).toBe('error')
  })
})
