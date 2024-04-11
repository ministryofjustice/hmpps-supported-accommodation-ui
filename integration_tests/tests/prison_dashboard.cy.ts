//  Feature: user views prison dashboard
//    So that I can see recent submitted applications
//    for my Prison
//    So that I can manage applications

//  Scenario: viewing the prison dashboard as a referrer
//      Given I am logged in as a referrer
//      When I visit the prison dashboard
//      Then I can see a web page

context('PrisonDashboard', () => {
  //  Scenario: viewing the prison dashboard as a referrer
  //  TODO: this will be fleshed out when we add a table of applications
  it('shows a web page', () => {
    // Given I am logged in as a referrer
    cy.task('stubSignIn', ['ROLE_POM'])
    cy.task('stubAuthUser')
    cy.signIn()

    //      When I visit the prison dashboard
  })
})
