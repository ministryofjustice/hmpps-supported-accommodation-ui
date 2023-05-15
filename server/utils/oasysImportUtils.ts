import { OasysImportArrays } from '../@types/ui'
import { escape } from './formUtils'

// eslint-disable-next-line import/prefer-default-export
export const textareas = (questions: OasysImportArrays, key: 'roshAnswers' | 'offenceDetails') => {
  return questions
    .map((question: { questionNumber: any; label: any; answer: string }) => {
      return `<div class="govuk-form-group">
                <h3 class="govuk-label-wrapper">
                    <label class="govuk-label govuk-label--m" for=${key}[${question.questionNumber}]>
                        ${question.label}
                    </label>
                </h3>
                <textarea class="govuk-textarea" id=${key}[${question.questionNumber}] name=${key}[${
        question.questionNumber
      }] rows="8">${escape(question?.answer)}</textarea>
            </div>
            <hr>`
    })
    .join('')
}
