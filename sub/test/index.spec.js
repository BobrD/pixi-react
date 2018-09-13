import * as index from '../src/index'

describe('index', () => {
  test('export modules', () => {
    expect(index).toMatchSnapshot()
  })
})
