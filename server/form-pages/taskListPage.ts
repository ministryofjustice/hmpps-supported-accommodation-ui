/* istanbul ignore file */

import type { DataServices, FormArtifact, PageResponse, TaskListErrors } from '@approved-premises/ui'

export interface TaskListPageInterface {
  new (body: Record<string, unknown>, document?: FormArtifact, previousPage?: string): TaskListPage
  initialize?(
    body: Record<string, unknown>,
    document: FormArtifact,
    token: string,
    dataServices: DataServices,
  ): Promise<TaskListPage>
}

export default abstract class TaskListPage {
  abstract title: string

  abstract body: Record<string, unknown>

  abstract previous(): string

  abstract next(): string

  abstract errors(): TaskListErrors<this>

  abstract response(): PageResponse
}
