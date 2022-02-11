import { _Promise } from '../src/promise'

test('resolve 可以将一个传入的值作为 resolve() 的参数', () => {
  const data = { name: 'alex' }
  _Promise.resolve(data).then(res => {
    expect(res).toEqual(data)
  })
})
