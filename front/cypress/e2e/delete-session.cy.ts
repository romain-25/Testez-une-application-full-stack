describe('Sessions List and Detail spec', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    }).as('login')

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

    cy.intercept('GET', '/api/teacher/1', {
      body: {
        id: 1,
        firstName: 'Romain',
        lastName: 'R',
      },
    }).as('getTeacherDetail')

    cy.intercept('DELETE', '/api/session/1', {
      statusCode: 200,
      body: {}
    }).as('deleteSession')

    cy.visit('/login')
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.url().should('include', '/sessions')
  })

  it('Displays a list of sessions and session details and delete session', () => {
    cy.wait('@getSessions')
    cy.get('.items .item').first().within(() => {
      cy.get('button#detail').click()
    })

    cy.wait('@getSessionDetail')
    cy.wait('@getTeacherDetail')

    cy.get('@deleteSession')
    cy.get('button').contains('Delete').click()
    cy.url().should('include', '/sessions')
  })
})
