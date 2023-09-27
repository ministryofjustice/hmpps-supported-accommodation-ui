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
    'health-needs': {
      'substance-misuse': {
        usesIllegalSubstances: { question: 'Do they take any illegal substances?', answers: { yes: 'Yes', no: 'No' } },
        substanceMisuseHistory: { question: 'What substances do they take?' },
        substanceMisuseDetail: {
          question: 'How often do they take these substances, by what method, and how much?',
        },
        engagedWithDrugAndAlcoholService: {
          question: 'Are they engaged with a drug and alcohol service?',
          answers: { yes: 'Yes', no: 'No' },
        },
        drugAndAlcoholServiceDetail: { question: 'Name the drug and alcohol service' },
        requiresSubstituteMedication: {
          question: 'Do they require any substitute medication for misused substances?',
          answers: { yes: 'Yes', no: 'No' },
        },
        substituteMedicationDetail: { question: 'What substitute medication do they take?' },
      },
      'physical-health': {
        hasPhyHealthNeeds: { question: 'Do they have any physical health needs?', answers: { yes: 'Yes', no: 'No' } },
        needsDetail: { question: 'Please describe their needs.' },
        isReceivingTreatment: {
          question: 'Are they currently receiving any medical treatment for their physical health needs?',
          answers: { yes: 'Yes', no: 'No' },
        },
        treatmentDetail: { question: 'Describe the treatment they receive for physical health needs' },
        hasPhyHealthMedication: {
          question: 'Are they currently receiving any medication for their physical health needs?',
          answers: { yes: 'Yes', no: 'No' },
        },
        medicationDetail: { question: 'Describe the medication they receive for physical health needs' },
        canLiveIndependently: { question: 'Can they live independently?', answers: { yes: 'Yes', no: 'No' } },
        indyLivingDetail: { question: 'Describe why they are unable to live independently' },
        requiresAdditionalSupport: {
          question: 'Do they require any additional support?',
          answers: { yes: 'Yes', no: 'No' },
        },
        addSupportDetail: { question: 'Please describe the types of support.' },
      },
      'mental-health': {
        hasMentalHealthNeeds: { question: 'Do they have any mental health needs?', answers: { yes: 'Yes', no: 'No' } },
        needsDetail: { question: 'Please describe their mental health needs.' },
        isEngagedWithCommunity: {
          question: 'Are they engaged with any community mental health services?',
          answers: { yes: 'Yes', no: 'No' },
        },
        servicesDetail: { question: 'Please state which services.' },
        hasPrescribedMedication: {
          question: 'Are they prescribed any medication for their mental health?',
          answers: { yes: 'Yes', no: 'No' },
        },
        isInPossessionOfMeds: {
          question: 'Are they in possession of their medication?',
          answers: { yes: 'Yes', no: 'No' },
        },
        medicationDetail: { question: 'Please list any medications.' },
        medicationIssues: { question: 'Please list any issues they have with taking their medication' },
      },
      'communication-and-language': {
        hasCommunicationNeeds: {
          question: 'Do they have any additional communication needs?',
          answers: { yes: 'Yes', no: 'No' },
        },
        communicationDetail: { question: 'Please describe their communication needs.' },
        requiresInterpreter: { question: 'Do they need an interpreter?', answers: { yes: 'Yes', no: 'No' } },
        interpretationDetail: { question: 'What language do they need an interpreter for?' },
        hasSupportNeeds: {
          question: 'Do they need any support to see, hear, speak, or understand?',
          answers: { yes: 'Yes', no: 'No' },
        },
        supportDetail: { question: 'Please describe their support needs.' },
      },
      'learning-difficulties': {
        hasLearningNeeds: {
          question: 'Do they have any additional needs relating to learning difficulties or neurodiversity?',
          answers: { yes: 'Yes', no: 'No' },
        },
        needsDetail: { question: 'Please describe their additional needs.' },
        isVulnerable: {
          question: 'Are they vulnerable as a result of this condition?',
          answers: { yes: 'Yes', no: 'No' },
        },
        vulnerabilityDetail: { question: 'Please describe their level of vulnerability.' },
        hasDifficultyInteracting: {
          question: 'Do they have difficulties interacting with other people as a result of this condition?',
          answers: { yes: 'Yes', no: 'No' },
        },
        interactionDetail: { question: 'Please describe these difficulties.' },
        requiresAdditionalSupport: { question: 'Is additional support required?', answers: { yes: 'Yes', no: 'No' } },
        addSupportDetail: { question: 'Please describe the type of support.' },
      },
      'brain-injury': {
        hasBrainInjury: {
          question: 'Do they have a brain injury?',
          answers: { yes: 'Yes', no: 'No' },
        },
        injuryDetail: { question: 'Please describe their brain injury and needs.' },
        isVulnerable: {
          question: 'Are they vulnerable as a result of this injury?',
          answers: { yes: 'Yes', no: 'No' },
        },
        vulnerabilityDetail: { question: 'Please describe their level of vulnerability.' },
        hasDifficultyInteracting: {
          question: 'Do they have difficulties interacting with other people as a result of this injury?',
          answers: { yes: 'Yes', no: 'No' },
        },
        interactionDetail: { question: 'Please describe these difficulties.' },
        requiresAdditionalSupport: { question: 'Is additional support required?', answers: { yes: 'Yes', no: 'No' } },
        addSupportDetail: { question: 'Please describe the type of support.' },
      },
      'other-health': {
        hasLongTermHealthCondition: {
          question: 'Are they managing any long term health conditions?',
          answers: { yes: 'Yes', no: 'No' },
        },
        healthConditionDetail: {
          question: 'Please describe the long term health conditions.',
        },
        hasHadStroke: { question: 'Have they experienced a stroke?', answers: { yes: 'Yes', no: 'No' } },
        hasSeizures: { question: 'Do they experience seizures?', answers: { yes: 'Yes', no: 'No' } },
        seizuresDetail: {
          question: 'Please describe the type and any treatment.',
        },
        beingTreatedForCancer: {
          question: 'Are they currently receiving regular treatment for cancer?',
          answers: { yes: 'Yes', no: 'No' },
        },
      },
    },
    'risk-to-self': {
      vulnerability: {
        vulnerabilityDetail: {
          question: `Describe ${name}'s current circumstances, issues and needs related to vulnerability`,
        },
        confirmation: { question: 'I confirm this information is relevant and up to date.' },
      },
      'current-risk': {
        currentRiskDetail: { question: `Describe ${name}'s current issues and needs related to self harm and suicide` },
        confirmation: { question: 'I confirm this information is relevant and up to date.' },
      },
      'historical-risk': {
        historicalRiskDetail: {
          question: `Describe ${name}'s historical issues and needs related to self harm and suicide`,
        },
        confirmation: { question: 'I confirm this information is relevant and up to date.' },
      },
      acct: {},
      'additional-information': {
        hasAdditionalInformation: 'yes',
        additionalInformationDetail: {
          question: `Is there anything else to include about ${name}'s risk to self?`,
        },
      },
    },
  }
}
