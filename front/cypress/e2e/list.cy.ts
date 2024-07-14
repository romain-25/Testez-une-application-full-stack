describe('Sessions List spec', () => {
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

    cy.visit('/login')
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.url().should('include', '/sessions')
  })

  it('Displays a list of sessions', () => {
    cy.wait('@getSessions')

    cy.get('.items .item').should('have.length', 2)

    cy.get('.items .item').first().within(() => {
      cy.get('mat-card-title').should('contain.text', 'Morning Yoga')
      cy.get('mat-card-subtitle').should('contain.text', 'Session on')
      cy.get('p').should('contain.text', 'Start your day with energy')
      cy.get('button#detail').should('exist')
      cy.get('button').contains('Edit').should('exist')
    })

    cy.get('.items .item').eq(1).within(() => {
      cy.get('mat-card-title').should('contain.text', 'Evening Yoga')
      cy.get('mat-card-subtitle').should('contain.text', 'Session on')
      cy.get('p').should('contain.text', 'Relax and unwind')
      cy.get('button#detail').should('exist')
      cy.get('button').contains('Edit').should('exist')
    })
  })
  it('Displays create button for admin', () => {
    cy.wait('@getSessions')
    cy.get('button#create').should('exist');
  });
  it('Does not display create button for regular user', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 2,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false
      },
    }).as('loginRegular');

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

    cy.visit('/login')
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.wait('@getSessions')
    cy.url().should('include', '/sessions');
    cy.get('button#create').should('not.exist');
  });

})
