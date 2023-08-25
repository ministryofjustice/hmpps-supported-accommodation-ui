import { createMock } from '@golevelup/ts-jest'
import type { DataServices } from '@approved-premises/ui'
import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory, oasysSectionsFactory } from '../../../../testutils/factories/index'
import RiskToSelfGuidance from './riskToSelfGuidance'
import PersonService from '../../../../services/personService'

describe('RiskToSelfGuidance', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })
  const oasysSections = oasysSectionsFactory.build()

  const dataServices = createMock<DataServices>({ personService: createMock<PersonService>({}) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new RiskToSelfGuidance({}, application, oasysSections, '')

      expect(page.title).toEqual("Import Roger Smith's risk to self data from OASys")
    })
  })

  describe('initialize', () => {
    describe('when oasys sections are returned', () => {
      it('instantiates the class with the task data in the correct format', async () => {
        oasysSections.riskToSelf = [
          {
            label: 'Current concerns about self-harm or suicide',
            questionNumber: 'R8.1.1',
            answer: 'self harm answer',
          },
          {
            label: 'Current concerns about Coping in Custody or Hostel',
            questionNumber: 'R8.2.1',
            answer: 'coping in custody answer',
          },
          {
            label: 'Current concerns about Vulnerability',
            questionNumber: 'R8.3.1',
            answer: 'vulnerability answer',
          },
        ]

        const taskData = {
          'risk-to-self': {
            currentRisk: { currentRiskDetail: 'self harm answer' },
            vulnerability: { vulnerabilityDetail: 'vulnerability answer' },
          },
        }

        ;(dataServices.personService.getOasysSections as jest.Mock).mockResolvedValue(oasysSections)

        const page = await RiskToSelfGuidance.initialize({}, application, 'some-token', dataServices)

        expect(page.taskData).toBe(JSON.stringify(taskData))
        expect(page.hasOasysRecord).toBe(true)
      })
    })

    describe('when oasys sections are not returned', () => {
      it('sets hasOasysRecord to false when a 404 is returned', async () => {
        ;(dataServices.personService.getOasysSections as jest.Mock).mockRejectedValue({ status: 404 })

        const page = await RiskToSelfGuidance.initialize({}, application, 'some-token', dataServices)

        expect(page.hasOasysRecord).toBe(false)
      })

      it('throws error when an unexpected error is returned', async () => {
        const error = new Error()
        ;(dataServices.personService.getOasysSections as jest.Mock).mockImplementation(() => {
          throw error
        })

        expect(RiskToSelfGuidance.initialize({}, application, 'some-token', dataServices)).rejects.toThrow(error)
      })
    })
  })

  itShouldHaveNextValue(new RiskToSelfGuidance({}, application, oasysSections, ''), 'vulnerability')
  itShouldHavePreviousValue(new RiskToSelfGuidance({}, application, oasysSections, ''), 'taskList')

  describe('errors', () => {
    it('returns empty object', () => {
      const page = new RiskToSelfGuidance({}, application, oasysSections, '')

      expect(page.errors()).toEqual({})
    })
  })

  describe('response', () => {
    it('returns empty object', () => {
      const page = new RiskToSelfGuidance({}, application, oasysSections, '')

      expect(page.response()).toEqual({})
    })
  })
})
