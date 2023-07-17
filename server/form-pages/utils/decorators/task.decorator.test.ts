import TaskListPage from '../../taskListPage'
import Page from './page.decorator'
import Task from './task.decorator'

class PageBase implements TaskListPage {
  title: string

  body: Record<string, unknown>

  previous() {
    return ''
  }

  next() {
    return ''
  }

  errors() {
    return {}
  }

  response() {
    return {}
  }
}

describe('Task', () => {
  it('records metadata about a class', () => {
    @Page({ name: 'page-1', bodyProperties: [] })
    class Page1 extends PageBase {
      title = 'Page 1'
    }

    @Page({ name: 'page-2', bodyProperties: [] })
    class Page2 extends PageBase {
      title = 'Page 2'
    }

    @Page({ name: 'page-3', bodyProperties: [] })
    class Page3 extends PageBase {
      title = 'Page 2'
    }

    @Task({ name: 'My Task', slug: 'my-task', pages: [Page1, Page2, Page3] })
    class MyTask {}

    const slug = Reflect.getMetadata('task:slug', MyTask)
    const name = Reflect.getMetadata('task:name', MyTask)
    const pages = Reflect.getMetadata('task:pages', MyTask)

    expect(slug).toEqual('my-task')
    expect(name).toEqual('My Task')
    expect(pages).toEqual([Page1, Page2, Page3])

    expect(Reflect.getMetadata('page:task', Page1)).toEqual('my-task')
    expect(Reflect.getMetadata('page:task', Page2)).toEqual('my-task')
    expect(Reflect.getMetadata('page:task', Page3)).toEqual('my-task')
  })
})
