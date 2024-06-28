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

    cy.intercept('GET', '/api/teacher', {
      body: [
        { id: 1, firstName: 'Romain', lastName: 'Rouabah' },
        { id: 2, firstName: 'Arnaud', lastName: 'Dupont' }
      ],
    }).as('getTeachers')

    cy.intercept('POST', '/api/update/1', {
      body: {
        id: 3,
        name: 'New Morning yoga',
        description: 'Start your day with more energy',
        date: '2024-08-22',
        teacher_id: 1,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }).as('createSession')
    cy.visit('/login')
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.url().should('include', '/sessions')
  })


  it('Displays session form and selects a teacher', () => {
    cy.wait('@getSessions')
    cy.get('button#create').click()
    cy.wait('@getTeachers')

    cy.get('input[formControlName="name"]').should('exist')
    cy.get('input[formControlName="date"]').should('exist')

    cy.get('textarea[formControlName="description"]').should('exist')

    cy.get('input[formControlName="name"]').type("New Morning yoga")
    cy.get('input[formControlName="date"]').type("2024-08-22")
    cy.get('mat-select[formControlName="teacher_id"]').click()
    cy.get('mat-option').contains('Romain Rouabah').click()
    cy.get('textarea[formControlName="description"]').type("More energy")

    cy.get('button[type="submit"]').click()

    cy.wait('@createSession')
    cy.url().should('include', '/sessions')
  })
})
