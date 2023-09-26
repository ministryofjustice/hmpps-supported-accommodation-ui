export default function generateQuestions(name: string): Record<string, unknown> {
  return {
    'confirm-eligibility': {
      'confirm-eligibility': {
        isEligible: {
          question: `Is ${name} eligible for Short-Term Accommodation (CAS-2)?`,
          answers: {
            yes: `Yes, I confirm ${name} is eligible`,
            no: `No, ${name} is not eligible`,
          },
        },
      },
    },
    'funding-information': {
      'funding-source': {
        fundingSource: {
          question: `How will ${name} pay for their accommodation and service charge?`,
          answers: {
            personalSavings: 'Personal money or savings',
            benefits: 'Benefits',
          },
        },
      },
    },
    'equality-and-diversity-monitoring': {
      'will-answer-equality-questions': {
        willAnswer: {
          question: `Does ${name} want to answer the equality questions?`,
          answers: {
            yes: 'Yes, answer the equality questions (takes 2 minutes)',
            no: 'No, skip the equality questions',
          },
        },
      },
      disability: {
        hasDisability: {
          question: `Does ${name} have a disability?`,
          answers: {
            yes: 'Yes',
            no: 'No',
            preferNotToSay: 'Prefer not to say',
          },
        },
      },
      'sex-and-gender': {
        sex: {
          question: `What is ${name}'s sex?`,
          answers: {
            female: 'Female',
            male: 'Male',
            preferNotToSay: 'Prefer not to say',
          },
        },
        gender: {
          question: `Is the gender ${name} identifies with the same as the sex registered at birth?`,
          answers: {
            yes: 'Yes',
            no: 'No',
            preferNotToSay: 'Prefer not to say',
          },
        },
      },
      'sexual-orientation': {
        orientation: {
          question: `Which of the following best describes ${name}'s sexual orientation?`,
          answers: {
            heterosexual: 'Heterosexual or straight',
            gay: 'Gay',
            lesbian: 'Lesbian',
            bisexual: 'Bisexual',
            other: 'Other',
            preferNotToSay: 'Prefer not to say',
          },
        },
      },
      'ethnic-group': {
        ethnicGroup: {
          question: `What is ${name}'s ethnic group?`,
          answers: {
            white: 'White',
            mixed: 'Mixed or multiple ethnic groups',
            asian: 'Asian or Asian British',
            black: 'Black, African, Caribbean or Black British',
            other: 'Other ethnic group',
            preferNotToSay: 'Prefer not to say',
          },
        },
      },
      'white-background': {
        whiteBackground: {
          question: `Which of the following best describes ${name}'s White background?`,
          answers: {
            english: 'English, Welsh, Scottish, Northern Irish or British',
            irish: 'Irish',
            gypsy: 'Gypsy or Irish Traveller',
            other: 'Any other White background',
            preferNotToSay: 'Prefer not to say',
          },
        },
      },
      religion: {
        religion: {
          question: `What is ${name}'s religion?`,
          answers: {
            noReligion: 'No religion',
            atheist: 'Atheist or Humanist',
            agnostic: 'Agnostic',
            christian: 'Christian',
            buddhist: 'Buddhist',
            hindu: 'Hindu',
            jewish: 'Jewish',
            muslim: 'Muslim',
            sikh: 'Sikh',
            other: 'Any other religion',
            preferNotToSay: 'Prefer not to say',
          },
        },
      },
      'military-veteran': {
        isVeteran: {
          question: `Is ${name} a military veteran?`,
          answers: { yes: 'Yes', no: 'No', dontKnow: `I don't know` },
        },
      },
      'care-leaver': {
        isCareLeaver: {
          question: `Is ${name} a care leaver?`,
          answers: { yes: 'Yes', no: 'No', dontKnow: `I don't know` },
        },
      },
      'parental-carer-responsibilities': {
        hasParentalOrCarerResponsibilities: {
          question: `Does ${name} have parental or carer responsibilities?`,
          answers: { yes: 'Yes', no: 'No', dontKnow: `I don't know` },
        },
      },
      'marital-status': {
        maritalStatus: {
          question: `What is ${name}'s legal marital or registered civil partnership status?`,
          answers: {
            neverMarried: 'Never married and never registered in a civil partnership',
            married: 'Married',
            inCivilPartnership: 'In a registered civil partnership',
            marriedButSeparated: 'Separated, but still legally married',
            inCivilPartnershipButSeparated: 'Separated, but still legally in a civil partnership',
            divorced: 'Divorced',
            formerlyInCivilPartnershipNowDissolved: 'Formerly in a civil partnership which is now legally dissolved',
            widowed: 'Widowed',
            survivingPartnerFromCivilPartnership: 'Surviving partner from a registered civil partnership',
            preferNotToSay: 'Prefer not to say',
          },
        },
      },
    },
  }
}
