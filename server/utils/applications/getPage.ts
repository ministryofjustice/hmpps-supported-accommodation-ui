import { JourneyType } from '../../@types/ui'
import { TaskListPageInterface } from '../../form-pages/taskListPage'
import { UnknownPageError } from '../errors'
import { journeyPages } from './utils'

export const getPage = (taskName: string, pageName: string, journeyType: JourneyType): TaskListPageInterface => {
  const pageList = journeyPages(journeyType)[taskName]
  const Page = pageList[pageName]

  if (!Page) {
    throw new UnknownPageError(pageName)
  }

  return Page as TaskListPageInterface
}
