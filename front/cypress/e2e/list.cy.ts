describe('Sessions List spec', () => {
  beforeEach(() => {
    // Intercept the login request
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    }).as('login')

    // Intercept the sessions request
    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Morning Yoga',
          description: 'Start your day with energy',
          date: new Date(),
          teacher_id: 1,
          users: [1, 2, 3],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Evening Yoga',
          description: 'Relax and unwind',
          date: new Date(),
          teacher_id: 2,
          users: [4, 5, 6],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    }).as('getSessions')

    // Visit the login page and perform login
    cy.visit('/login')
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.url().should('include', '/sessions')
  })

  it('Displays a list of sessions', () => {
    // Wait for the sessions to load
    cy.wait('@getSessions')

    // Check if the session items are displayed
    cy.get('.items .item').should('have.length', 2)

    // Check the content of the first session
    cy.get('.items .item').first().within(() => {
      cy.get('mat-card-title').should('contain.text', 'Morning Yoga')
      cy.get('mat-card-subtitle').should('contain.text', 'Session on')
      cy.get('p').should('contain.text', 'Start your day with energy')
      cy.get('button#detail').should('exist')
      cy.get('button[routerLink="update"]').should('exist')
    })

    // Check the content of the second session
    cy.get('.items .item').eq(1).within(() => {
      cy.get('mat-card-title').should('contain.text', 'Evening Yoga')
      cy.get('mat-card-subtitle').should('contain.text', 'Session on')
      cy.get('p').should('contain.text', 'Relax and unwind')
      cy.get('button#detail').should('exist')
      cy.get('button[routerLink="update"]').should('exist')
    })
  })
})
