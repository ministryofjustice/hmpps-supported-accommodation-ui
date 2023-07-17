import BaseForm from '../../baseForm'

import Section from './section.decorator'
import Form from './form.decorator'
import Task from './task.decorator'

describe('Task', () => {
  it('records metadata about a class', () => {
    @Task({ name: 'Task 1', slug: 'task-1', pages: [] })
    class Task1 {}

    @Task({ name: 'Task 2', slug: 'task-2', pages: [] })
    class Task2 {}

    @Task({ name: 'Task 3', slug: 'task-3', pages: [] })
    class Task3 {}

    @Section({ title: 'Section 1', tasks: [Task1] })
    class Section1 {}

    @Section({ title: 'Section 2', tasks: [Task2, Task3] })
    class Section2 {}

    @Section({ title: 'Section 3', tasks: [] })
    class Section3 {}

    @Form({ sections: [Section1, Section2, Section3] })
    class MyForm extends BaseForm {}

    expect(MyForm.pages).toEqual({ 'task-1': {}, 'task-2': {}, 'task-3': {} })
    expect(MyForm.sections).toEqual([
      {
        title: 'Section 1',
        name: 'Section1',
        tasks: [{ id: 'task-1', title: 'Task 1', pages: {} }],
      },
      {
        title: 'Section 2',
        name: 'Section2',
        tasks: [
          { id: 'task-2', title: 'Task 2', pages: {} },
          { id: 'task-3', title: 'Task 3', pages: {} },
        ],
      },
      {
        title: 'Section 3',
        name: 'Section3',
        tasks: [],
      },
    ])
  })
})
