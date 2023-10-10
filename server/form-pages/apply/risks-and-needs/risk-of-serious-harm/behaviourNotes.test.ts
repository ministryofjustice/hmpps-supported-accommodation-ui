import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import BehaviourNotes from './behaviourNotes'

describe('BehaviourNotes', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new BehaviourNotes({}, application)

      expect(page.title).toEqual(`Behaviour notes for Roger Smith`)
    })
  })

  itShouldHaveNextValue(new BehaviourNotes({}, application), 'additional-risk-information')
  itShouldHavePreviousValue(new BehaviourNotes({}, application), 'cell-share-information')

  describe('response', () => {
    it('not implemented', () => {
      const page = new BehaviourNotes({}, application)

      expect(page.response()).toEqual({})
    })
  })

  describe('errors', () => {
    it('not implemented', () => {
      const page = new BehaviourNotes({}, application)

      expect(page.errors()).toEqual({})
    })
  })

  describe('behaviourNotes', () => {
    it('adds a redirect link to the data', () => {
      const applicationWithNotes = applicationFactory.build({
        id: 'abc123',
        data: {
          'risk-of-serious-harm': {
            'behaviour-notes-data': [
              {
                behaviourDetail: 'some detail 1',
              },
              {
                behaviourDetail: 'some detail 2',
              },
            ],
          },
        },
      })

      const page = new BehaviourNotes({}, applicationWithNotes)

      expect(page.behaviourNotes).toEqual([
        {
          removeLink:
            '/applications/abc123/tasks/risk-of-serious-harm/pages/behaviour-notes-data/0/removeFromList?redirectPage=behaviour-notes',
          behaviourDetail: 'some detail 1',
        },
        {
          removeLink:
            '/applications/abc123/tasks/risk-of-serious-harm/pages/behaviour-notes-data/1/removeFromList?redirectPage=behaviour-notes',
          behaviourDetail: 'some detail 2',
        },
      ])
    })
  })
})
