describe('Register spec', () => {
  it('Register successfull', () => {
    cy.visit('/register')

    cy.intercept('POST', '/api/auth/register', {})

    cy.intercept(
      {
        method: 'GET',
        url: '/api/login',
      },
      []).as('login')
    cy.get('input[formControlName=firstName]').type("romain")
    cy.get('input[formControlName=lastName]').type("rouabah")
    cy.get('input[formControlName=email]').type("romain.rouabah@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    // cy.get('input[type=submit]').click()
    cy.url().should('include', '/login')
  })
});
