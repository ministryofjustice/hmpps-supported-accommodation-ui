import type TaskListPage from '../taskListPage'

const itShouldHaveNextValue = (target: TaskListPage, value: string) => {
  describe('next', () => {
    it(`should have a next value of ${value}`, () => {
      expect(target.next()).toEqual(value)
    })
  })
}

const itShouldHavePreviousValue = (target: TaskListPage, value: string) => {
  describe('previous', () => {
    it(`should have a previous value of ${value}`, () => {
      expect(target.previous()).toEqual(value)
    })
  })
}

export { itShouldHaveNextValue, itShouldHavePreviousValue }
