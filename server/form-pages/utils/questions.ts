export const getQuestions = (name: string) => {
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
        typeOfDisability: {
          question: `What type of disability?`,
          hint: 'Select all that apply',
          answers: {
            sensoryImpairment: 'Sensory impairment',
            physicalImpairment: 'Physical impairment',
            learningDisability: 'Learning disability or difficulty',
            mentalHealth: 'Mental health condition',
            illness: 'Long-standing illness',
            other: 'Other',
          },
        },
        otherDisability: { question: 'What is the disability?' },
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
        optionalGenderIdentity: { question: 'What is their gender identity? (optional)' },
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
        otherOrientation: { question: 'How would they describe their sexual orientation? (optional)' },
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
      'asian-background': {
        asianBackground: {
          question: `Which of the following best describes ${name}'s Asian or Asian British background?`,
          answers: {
            indian: 'Indian',
            pakistani: 'Pakistani',
            chinese: 'Chinese',
            bangladeshi: 'Bangladeshi',
            other: 'Any other Asian background',
            preferNotToSay: 'Prefer not to say',
          },
        },
        optionalAsianBackground: { question: 'How would they describe their background? (optional)' },
      },
      'black-background': {
        blackBackground: {
          question: `Which of the following best describes ${name}'s Black, African, Caribbean or Black British background?`,
          answers: {
            african: 'African',
            caribbean: 'Caribbean',
            other: 'Any other Black, African or Caribbean background',
            preferNotToSay: 'Prefer not to say',
          },
        },
        optionalBlackBackground: { question: 'How would they describe their background? (optional)' },
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
        optionalWhiteBackground: { question: 'How would they describe their background? (optional)' },
      },
      'mixed-background': {
        mixedBackground: {
          question: `Which of the following best describes ${name}'s mixed or multiple ethnic groups background?`,
          answers: {
            whiteAndBlackCaribbean: 'White and Black Caribbean',
            whiteAndBlackAfrican: 'White and Black African',
            whiteAndAsian: 'White and Asian',
            other: 'Any other mixed or multiple ethnic background',
            preferNotToSay: 'Prefer not to say',
          },
        },
        optionalMixedBackground: { question: 'How would they describe their background? (optional)' },
      },
      'other-background': {
        otherBackground: {
          question: `Which of the following best describes ${name}'s background?`,
          answers: {
            arab: 'Arab',
            other: 'Any other ethnic group',
            preferNotToSay: 'Prefer not to say',
          },
        },
        optionalOtherBackground: { question: 'How would they describe their background? (optional)' },
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
        otherReligion: { question: 'What is their religion? (optional)' },
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
        canClimbStairs: {
          question: 'Can they climb stairs?',
        },
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
        medicationIssues: { question: 'Please list any issues they have with taking their medication (optional).' },
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
          hint: 'For example, diabetes, arthritis or high blood pressure.',
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
          hint: 'Include all current risk information and remove sensitive information, such as names and addresses.',
        },
        confirmation: {
          question: 'I confirm this information is relevant and up to date.',
          answers: { confirmed: 'Confirmed' },
        },
      },
      'current-risk': {
        currentRiskDetail: {
          question: `Describe ${name}'s current issues and needs related to self harm and suicide`,
          hint: 'Include all current risk information and remove sensitive information, such as names and addresses.',
        },
        confirmation: {
          question: 'I confirm this information is relevant and up to date.',
          answers: { confirmed: 'Confirmed' },
        },
      },
      'historical-risk': {
        historicalRiskDetail: {
          question: `Describe ${name}'s historical issues and needs related to self harm and suicide`,
          hint: 'Remove sensitive information, such as names and addresses.',
        },
        confirmation: {
          question: 'I confirm this information is relevant and up to date.',
          answers: { confirmed: 'Confirmed' },
        },
      },
      acct: {},
      'acct-data': {
        createdDate: {
          question: 'When was the ACCT created?',
          hint: 'For example, 22 4 2003',
        },
        isOngoing: {
          question: 'Is the ACCT ongoing?',
        },
        closedDate: {
          question: 'When was the ACCT closed?',
          hint: 'For example, 22 4 2003',
        },
        referringInstitution: {
          question: 'Referring institution',
          hint: 'Where the applicant was based at the time the ACCT was created',
        },
        acctDetail: {
          question: 'Details about the ACCT',
        },
      },
      'additional-information': {
        hasAdditionalInformation: {
          question: `Is there anything else to include about ${name}'s risk to self?`,
          hint: 'Record any additional information about their risk to self.',
          answers: { yes: 'Yes', no: 'No' },
        },
        additionalInformationDetail: { question: 'Additional information' },
      },
    },
    'risk-of-serious-harm': {
      summary: {
        status: 'retrieved',
        overallRisk: { question: 'Overall risk' },
        riskToChildren: { question: 'Risk to children' },
        riskToPublic: { question: 'Risk to the public' },
        riskToKnownAdult: { question: 'Risk to a known adult' },
        riskToStaff: { question: 'Risk to staff' },
        lastUpdated: { question: 'Last updated' },
        additionalComments: { question: 'Additional comments (optional)' },
      },
      'risk-to-others': {
        whoIsAtRisk: {
          question: 'Who is at risk?',
        },
        natureOfRisk: {
          question: 'What is the nature of the risk?',
        },
        confirmation: {
          question: 'I confirm this information is relevant and up to date.',
          answers: { confirmed: 'Confirmed' },
        },
      },
      'risk-factors': {
        circumstancesLikelyToIncreaseRisk: {
          question: 'What circumstances are likely to increase risk?',
        },
        whenIsRiskLikelyToBeGreatest: {
          question: 'When is the risk likely to be greatest?',
          hint: 'Consider the timescale and indicate whether risk is immediate or not.',
        },
        confirmation: {
          question: 'I confirm this information is relevant and up to date.',
          answers: { confirmed: 'Confirmed' },
        },
      },
      'reducing-risk': {
        factorsLikelyToReduceRisk: {
          question: 'What factors are likely to reduce risk?',
          hint: 'Describe factors, actions and events which might reduce or contain the level of risk now and in the future.',
        },
        confirmation: {
          question: 'I confirm this information is relevant and up to date.',
          answers: { confirmed: 'Confirmed' },
        },
      },
      'risk-management-arrangements': {
        arrangements: {
          question: `Is ${name} subject to any of these multi-agency risk management arrangements upon release?`,
          hint: 'Select all that apply',
          answers: {
            mappa: 'MAPPA',
            marac: 'MARAC',
            iom: 'IOM',
          },
        },
        mappaDetails: {
          question: 'Provide MAPPA details',
          hint: 'Specify whether the MAPPA is Category 2 or Category 3. Include lead contact details where possible.',
        },
        maracDetails: {
          question: 'Provide MARAC details',
          hint: 'Include lead contact details where possible.',
        },
        iomDetails: {
          question: 'Provide IOM details',
          hint: 'Include lead contact details where possible.',
        },
      },
      'cell-share-information': {
        hasCellShareComments: {
          question: 'Are there any comments to add about cell sharing?',
          answers: { yes: 'Yes', no: 'No' },
        },
        cellShareInformationDetail: { question: 'Cell sharing information' },
      },
      'behaviour-notes': {},
      'behaviour-notes-data': {
        behaviourDetail: {
          question: 'Describe the behaviour',
          hint: "If it's related to a specific incident, include when it happened.",
        },
      },
      'additional-risk-information': {
        hasAdditionalInformation: {
          question: `Is there any other risk information for ${name}?`,
          hint: 'Record any additional information about their risk to others.',
          answers: { yes: 'Yes', no: 'No' },
        },
        additionalInformationDetail: { question: 'Additional information' },
      },
    },
  }
}
