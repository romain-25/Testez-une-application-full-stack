describe('Session Detail spec', () => {
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

    // Intercept the session detail request
    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Morning Yoga',
        description: 'Start your day with energy',
        date: new Date(),
        teacher_id: 1,
        users: [1, 2, 3],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }).as('getSessionDetail')

    // Intercept the teacher detail request
    cy.intercept('GET', '/api/teacher/1', {
      body: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
      },
    }).as('getTeacherDetail')

    // Visit the login page and perform login
    cy.visit('/login')
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.url().should('include', '/sessions')

    // Navigate to session detail page
    cy.visit('/sessions/1')
  })

  it('Displays session details', () => {
    // Wait for the session detail and teacher detail to load
    cy.wait('@getSessionDetail')
    cy.wait('@getTeacherDetail')

    // Check if the session details are displayed
    cy.get('h1').should('contain.text', 'Morning Yoga')
    cy.get('mat-card-subtitle').should('contain.text', 'John DOE')
    cy.get('.picture').should('have.attr', 'src', 'assets/sessions.png')
    cy.get('.description').should('contain.text', 'Start your day with energy')
    cy.get('.created').should('contain.text', 'Create at')
    cy.get('.updated').should('contain.text', 'Last update')

    // Check if participation and deletion buttons are available for admin
    cy.get('button').contains('Delete').should('exist')
    cy.get('button').contains('Participate').should('not.exist')
    cy.get('button').contains('Do not participate').should('not.exist')
  })
})
