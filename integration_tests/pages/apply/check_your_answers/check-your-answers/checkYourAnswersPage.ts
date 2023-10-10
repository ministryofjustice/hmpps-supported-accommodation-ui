import { Cas2Application as Application } from '../../../../../server/@types/shared/models/Cas2Application'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import { getQuestions } from '../../../../../server/form-pages/utils/questions'

export default class CheckYourAnswersPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super('Check your answers', application, 'check-your-answers', 'check-your-answers')
  }

  shouldShowConfirmEligibilityAnswers(): void {
    this.shouldShowCheckYourAnswersTitle('confirm-eligibility', 'Check eligibility for CAS-2')
    this.shouldShowQuestionsAndAnswers('confirm-eligibility')
  }

  shouldShowFundingInformationAnswers(): void {
    this.shouldShowCheckYourAnswersTitle('funding-information', 'Add funding information')
    this.shouldShowQuestionsAndAnswers('funding-information')
  }

  shouldShowEqualityAndDiversityAnswers(): void {
    this.shouldShowCheckYourAnswersTitle(
      'equality-and-diversity-monitoring',
      'Complete equality and diversity monitoring',
    )
    this.shouldShowQuestionsAndAnswers('equality-and-diversity-monitoring')
  }

  shouldShowHealthNeedsAnswers(): void {
    this.shouldShowCheckYourAnswersTitle('health-needs', 'Add health needs')
    this.shouldShowQuestionsAndAnswers('health-needs')
  }

  shouldShowRiskToSelfAnswers(): void {
    this.shouldShowCheckYourAnswersTitle('risk-to-self', 'Review risk to self information')
    this.shouldShowQuestionsAndAnswers('risk-to-self')
  }

  shouldShowCheckYourAnswersTitle(taskName: string, taskTitle: string) {
    cy.get(`[data-cy-check-your-answers-section="${taskName}"]`).within(() => {
      cy.get('.box-title').should('contain', taskTitle)
    })
  }

  shouldShowQuestionsAndAnswers(task: string) {
    const pageKeys = Object.keys(this.application.data[task])
    pageKeys.forEach(pageKey => {
      const questionKeys = Object.keys(this.application.data[task][pageKey])
      const questions = getQuestions(nameOrPlaceholderCopy(this.application.person))[task][pageKey]
      cy.get(`[data-cy-check-your-answers-section="${task}"]`).within(() => {
        questionKeys.forEach(questionKey => {
          if (questionKey === '0') {
            // handle
          } else if (questionKey !== 'oasysImportDate') {
            cy.get('dt')
              .contains(questions[questionKey].question)
              .parent()
              .within(() => {
                if (questions[questionKey].answers) {
                  cy.get('dd').contains(
                    questions[questionKey].answers[this.application.data[task][pageKey][questionKey]],
                  )
                } else {
                  cy.get('.govuk-summary-list__value')
                    .invoke('text')
                    .then(text => {
                      const trimmed = text.trim()
                      expect(trimmed).to.equal(this.application.data[task][pageKey][questionKey])
                    })
                }
              })
          }
        })
      })
    })
  }
}
