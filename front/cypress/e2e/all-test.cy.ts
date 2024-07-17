describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Login successful', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    }).as('login');

    cy.intercept('GET', '/api/session', []).as('session');

    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

    cy.url().should('include', '/sessions');
  });

  it('Login unsuccessful with invalid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('loginError');

    cy.get('input[formControlName=email]').type("invalid@studio.com");
    cy.get('input[formControlName=password]').type(`${"wrongpassword"}{enter}{enter}`);

    cy.wait('@loginError');
    cy.get('.error').should('be.visible').and('contain.text', 'An error occurred');
  });
});
describe('Login spec', () => {
  it('Login successfull', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

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
    cy.intercept('GET', '/api/user/1', {
      body: {
        id: 1,
        email: "romain@studio.com",
        lastName: "romain",
        firstName: "rouabah",
        admin: true,
        password: "pass!1234",
        createdAt: new Date(),
        updatedAt: null
      }
    })
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.url().should('include', '/sessions')
    cy.wait('@getSessions')
    // cy.visit('/me')
    cy.get('span').contains('Account').click()
    it('Displays User information', () => {
      cy.get('p').should('contain.text', 'Name')
      cy.get('p').should('contain.text', 'Email')
    })
  })
});
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

    cy.visit('/login')
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.url().should('include', '/sessions')
  })

  it('Displays a list of sessions and session details', () => {
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

    cy.get('.items .item').first().within(() => {
      cy.get('button#detail').click()
    })

    cy.wait('@getSessionDetail')
    cy.wait('@getTeacherDetail')

    cy.get('h1').should('contain.text', 'Morning Yoga')
    cy.get('mat-card-subtitle').should('contain.text', 'Romain R')
    cy.get('.picture').should('have.attr', 'src', 'assets/sessions.png')
    cy.get('.description').should('contain.text', 'Start your day with energy')
    cy.get('.created').should('contain.text', 'Create at')
    cy.get('.updated').should('contain.text', 'Last update')

    cy.get('button').contains('Delete').should('exist')
    cy.get('button').contains('Participate').should('not.exist')
    cy.get('button').contains('Do not participate').should('not.exist')
  })
})
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

    cy.intercept('POST', '/api/session', {
      body: {
        id: 1,
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
    cy.intercept('PUT', '/api/session/1', {
      body: {
        id: 1,
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
    cy.get('.items .item').first().within(() => {
      cy.get('button').contains('Edit').click()
    })
    cy.wait('@getSessionDetail')
    // cy.wait('@getTeacherDetail')
    cy.get('input[formControlName="name"]').should('exist')
    cy.get('input[formControlName="date"]').should('exist')

    cy.get('textarea[formControlName="description"]').should('exist')

    cy.get('input[formControlName="name"]').type("Update")
    cy.get('input[formControlName="date"]').type("2024-08-25")
    cy.get('mat-select[formControlName="teacher_id"]').click()
    cy.get('mat-option').contains('Romain Rouabah').click()
    cy.get('textarea[formControlName="description"]').type("Update")

    cy.get('button[type="submit"]').click()
    cy.wait('@createSession')
    cy.url().should('include', '/sessions')
  })
})
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
