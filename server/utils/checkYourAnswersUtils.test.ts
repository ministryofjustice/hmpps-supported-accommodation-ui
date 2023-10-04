import { applicationFactory, personFactory } from '../testutils/factories'
import { arrayAnswersAsString, embeddedSummaryListItem, summaryListItemForQuestion } from './checkYourAnswersUtils'
import { escape } from './formUtils'
import getQuestions from '../form-pages/utils/questions'
import { formatLines } from './viewUtils'

jest.mock('./formUtils')
jest.mock('./viewUtils')

describe('checkYourAnswersUtils', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  const questions = getQuestions(person.name)

  describe('arrayAnswersAsString', () => {
    it('returns an array of string answers as a comma separated string', () => {
      const application = applicationFactory.build({
        data: {
          'risk-of-serious-harm': {
            'risk-management-arrangements': {
              arrangements: ['mappa', 'marac', 'iom'],
              mappaDetails: 'mappa details',
              maracDetails: 'marac details',
              iomDetails: 'iom details',
            },
          },
        },
        person,
      })

      expect(
        arrayAnswersAsString(
          application,
          questions,
          'risk-of-serious-harm',
          'risk-management-arrangements',
          'arrangements',
        ),
      ).toEqual('MAPPA,MARAC,IOM')
    })
  })

  describe('summaryListItemForQuestion', () => {
    it('returns a summary list item for a given question', () => {
      ;(formatLines as jest.MockedFunction<typeof formatLines>).mockImplementation(text => text)

      const application = applicationFactory.build({
        data: {
          'confirm-eligibility': {
            'confirm-eligibility': {
              isEligible: 'yes',
            },
          },
        },
        person,
      })

      const expected = {
        key: { text: 'Is Roger Smith eligible for Short-Term Accommodation (CAS-2)?' },
        value: { html: 'Yes, I confirm Roger Smith is eligible' },
        actions: {
          items: [
            {
              href: `/applications/${application.id}/tasks/confirm-eligibility/pages/confirm-eligibility`,
              text: 'Change',
              visuallyHiddenText: 'Is Roger Smith eligible for Short-Term Accommodation (CAS-2)?',
            },
          ],
        },
      }

      expect(
        summaryListItemForQuestion(application, questions, 'confirm-eligibility', 'isEligible', 'confirm-eligibility'),
      ).toEqual(expected)
    })
  })

  describe('embeddedSummaryListItem', () => {
    it('returns a summary list for an array of records', () => {
      ;(escape as jest.Mock).mockImplementation((value: string) => `Escaped "${value}"`)

      const result = embeddedSummaryListItem([
        { foo: 'bar', bar: 'baz' },
        { foo: 'bar', bar: 'baz' },
      ]).replace(/\s+/g, ``)

      expect(escape).toHaveBeenCalledWith('foo')
      expect(escape).toHaveBeenCalledWith('bar')
      expect(escape).toHaveBeenCalledWith('baz')
      expect(result).toEqual(
        `
        <dl class="govuk-summary-list govuk-summary-list--embedded">
          <div class="govuk-summary-list__row govuk-summary-list__row--embedded">
            <dt class="govuk-summary-list__key govuk-summary-list__key--embedded">
              Escaped "foo"
            </dt>
            <dd class="govuk-summary-list__value govuk-summary-list__value--embedded">
              Escaped "bar"
            </dd>
          </div>
          <div class="govuk-summary-list__row govuk-summary-list__row--embedded">
            <dt class="govuk-summary-list__key govuk-summary-list__key--embedded">
              Escaped "bar"
            </dt>
            <dd class="govuk-summary-list__value govuk-summary-list__value--embedded">
              Escaped "baz"
            </dd>
          </div>
        </dl>
  
        <dl class="govuk-summary-list govuk-summary-list--embedded">
          <div class="govuk-summary-list__row govuk-summary-list__row--embedded">
            <dt class="govuk-summary-list__key govuk-summary-list__key--embedded">
              Escaped "foo"
            </dt>
            <dd class="govuk-summary-list__value govuk-summary-list__value--embedded">
              Escaped "bar"
            </dd>
          </div>
          <div class="govuk-summary-list__row govuk-summary-list__row--embedded">
            <dt class="govuk-summary-list__key govuk-summary-list__key--embedded">
              Escaped "bar"
            </dt>
            <dd class="govuk-summary-list__value govuk-summary-list__value--embedded">
              Escaped "baz"
            </dd>
          </div>
        </dl>`.replace(/\s+/g, ``),
      )
    })
  })
})
