import { createMock } from '@golevelup/ts-jest'
import { applicationFactory } from '../../testutils/factories'
import getTaskStatus from './getTaskStatus'
import TaskListPage from '../taskListPage'

describe('getTaskStatus', () => {
  const page1Instance = createMock<TaskListPage>()
  const page2Instance = createMock<TaskListPage>()
  const page3Instance = createMock<TaskListPage>()

  const Page1 = jest.fn(() => page1Instance)
  const Page2 = jest.fn(() => page2Instance)
  const Page3 = jest.fn(() => page3Instance)

  const task = {
    id: 'my-task',
    title: 'My Task',
    pages: {
      'page-1': Page1,
      'page-2': Page2,
      'page-3': Page3,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns not_started when there is no data for the first question in the task', () => {
    const application = applicationFactory.build({})

    expect(getTaskStatus(task, application)).toEqual('not_started')

    expect(Page1).not.toHaveBeenCalled()
    expect(Page2).not.toHaveBeenCalled()
    expect(Page3).not.toHaveBeenCalled()
  })

  it('returns in_progress when there is no data for the second question in the task', () => {
    const application = applicationFactory.build({ data: { 'my-task': { 'page-1': { foo: 'bar' } } } })

    page1Instance.errors.mockReturnValue({})
    page1Instance.next.mockReturnValue('page-2')

    expect(getTaskStatus(task, application)).toEqual('in_progress')

    expect(Page1).toHaveBeenCalled()
    expect(page1Instance.errors).toHaveBeenCalled()

    expect(Page2).not.toHaveBeenCalled()
    expect(Page3).not.toHaveBeenCalled()
  })

  it('returns in_progress when there are errors', () => {
    const application = applicationFactory.build({
      data: { 'my-task': { 'page-1': { foo: 'bar' }, 'page-2': { foo: 'bar' } } },
    })

    page1Instance.errors.mockReturnValue({ some: 'errors' })

    expect(getTaskStatus(task, application)).toEqual('in_progress')

    expect(Page1).toHaveBeenCalled()
    expect(page1Instance.errors).toHaveBeenCalled()
    expect(page1Instance.next).toHaveBeenCalled()
  })

  it('returns complete when the second page does not have a next page', () => {
    const application = applicationFactory.build({
      data: { 'my-task': { 'page-1': { foo: 'bar' }, 'page-2': { foo: 'bar' } } },
    })

    page1Instance.errors.mockReturnValue({})
    page1Instance.next.mockReturnValue('page-2')

    page2Instance.errors.mockReturnValue({})
    page2Instance.next.mockReturnValue('')

    expect(getTaskStatus(task, application)).toEqual('complete')

    expect(Page1).toHaveBeenCalled()
    expect(page1Instance.errors).toHaveBeenCalled()
    expect(page1Instance.next).toHaveBeenCalled()

    expect(Page2).toHaveBeenCalled()
    expect(page2Instance.errors).toHaveBeenCalled()
    expect(page2Instance.next).toHaveBeenCalled()

    expect(Page3).not.toHaveBeenCalled()
  })

  it('returns complete when the third page does not have a next page', () => {
    const application = applicationFactory.build({
      data: { 'my-task': { 'page-1': { foo: 'bar' }, 'page-2': { foo: 'bar' }, 'page-3': { foo: 'bar' } } },
    })

    page1Instance.errors.mockReturnValue({})
    page1Instance.next.mockReturnValue('page-2')

    page2Instance.errors.mockReturnValue({})
    page2Instance.next.mockReturnValue('page-3')

    page3Instance.errors.mockReturnValue({})
    page3Instance.next.mockReturnValue('')

    expect(getTaskStatus(task, application)).toEqual('complete')

    expect(Page1).toHaveBeenCalled()
    expect(page1Instance.errors).toHaveBeenCalled()
    expect(page1Instance.next).toHaveBeenCalled()

    expect(Page2).toHaveBeenCalled()
    expect(page2Instance.errors).toHaveBeenCalled()
    expect(page2Instance.next).toHaveBeenCalled()

    expect(Page3).toHaveBeenCalled()
    expect(page3Instance.errors).toHaveBeenCalled()
    expect(page3Instance.next).toHaveBeenCalled()
  })

  it('returns complete when the first page does not have data, but subsequent ones do', () => {
    const application = applicationFactory.build({
      data: { 'my-task': { 'page-2': { foo: 'bar' }, 'page-3': { foo: 'bar' } } },
    })

    page2Instance.errors.mockReturnValue({})
    page2Instance.next.mockReturnValue('page-3')

    page3Instance.errors.mockReturnValue({})
    page3Instance.next.mockReturnValue('')

    expect(getTaskStatus(task, application)).toEqual('complete')

    expect(Page1).not.toHaveBeenCalled()
    expect(page1Instance.errors).not.toHaveBeenCalled()
    expect(page1Instance.next).not.toHaveBeenCalled()

    expect(Page2).toHaveBeenCalled()
    expect(page2Instance.errors).toHaveBeenCalled()
    expect(page2Instance.next).toHaveBeenCalled()

    expect(Page3).toHaveBeenCalled()
    expect(page3Instance.errors).toHaveBeenCalled()
    expect(page3Instance.next).toHaveBeenCalled()
  })
})
