import Apply from '../../form-pages/apply'
import { UnknownPageError } from '../errors'
import { getPage } from './getPage'

const FirstApplyPage = jest.fn()
const SecondApplyPage = jest.fn()

const applySection1Task1 = {
  id: 'first-apply-section-task-1',
  title: 'First Apply section, task 1',
  actionText: '',
  pages: {
    first: FirstApplyPage,
    second: SecondApplyPage,
  },
}
const applySection1Task2 = {
  id: 'first-apply-section-task-2',
  title: 'First Apply section, task 2',
  actionText: '',
  pages: {},
}

const applySection2Task1 = {
  id: 'second-apply-section-task-1',
  title: 'Second Apply section, task 1',
  actionText: '',
  pages: {},
}

const applySection2Task2 = {
  id: 'second-apply-section-task-2',
  title: 'Second Apply section, task 2',
  actionText: '',
  pages: {},
}

const applySection1 = {
  name: 'first-apply-section',
  title: 'First Apply section',
  tasks: [applySection1Task1, applySection1Task2],
}

const applySection2 = {
  name: 'second-apply-section',
  title: 'Second Apply section',
  tasks: [applySection2Task1, applySection2Task2],
}

Apply.sections = [applySection1, applySection2]

Apply.pages['first-apply-section-task-1'] = {
  first: FirstApplyPage,
  second: SecondApplyPage,
}

describe('getPage', () => {
  it('should return a page from Apply if it exists', () => {
    expect(getPage('first-apply-section-task-1', 'first', 'applications')).toEqual(FirstApplyPage)
    expect(getPage('first-apply-section-task-1', 'second', 'applications')).toEqual(SecondApplyPage)
  })

  it('should raise an error if the page is not found', async () => {
    expect(() => {
      getPage('area-and-funding', 'bar', 'applications')
    }).toThrow(UnknownPageError)
  })
})
