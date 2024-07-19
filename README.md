# Test-a-Full-Stack-Application

This readme will help you test the *yoga-app* reservation application, covering front-end, back-end, and end-to-end tests. Here, you'll find the steps for writing and executing the tests.

## Prerequisites

Before you begin, make sure you have installed the following tools:

1. [Angular CLI](https://angular.io/cli)
2. [Node.js](https://nodejs.org/)
3. [Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
4. [MySQL Server and MySQL Workbench](https://dev.mysql.com/downloads/)
5. [Maven](https://maven.apache.org/)

Configure environment variables for Maven to use the `mvn` command.

## Database Configuration

1. Using MySQL Workbench, create a new schema named "yoga". Set it as the default schema.
2. Run this SQL script: [script.sql](https://github.com/romain-25/Testez-une-application-full-stack/tree/final/ressources/sql).

## Get the Source Code

Clone the GitHub repository:
```sh
git clone https://github.com/romain-25/Testez-une-application-full-stack.git
```

## Back-end Configuration and Execution

1. Open the application.properties file.
2. Insert your SQL Server login and password for the following lines:
```sh
spring.datasource.username=
spring.datasource.password=
```
3. Navigate to the back folder:
```sh
cd back
```
4. Run the project.
```sh
mvn spring-boot:run
```
5. Install the dependencies
```sh
npm install
```
6. Run the project
```sh
npm start
```

The application will be accessible at: http://localhost:4200

Log in with the following credentials:

- Email: yoga@studio.com
- Password: test!1234

Front-end Tests
To run the front-end tests:
```sh
npx jest --coverage
```
The coverage report is located at:
`/Testez-une-application-full-stack/front/coverage/jest/lcov-report/index.html`

![Alt Text](/images/jest-coverage.png)

## End-to-end Tests

To run the end-to-end tests
```sh
npm run e2e
```
Using the Cypress test runner, run the file named all-tests.cy.ts to get coverage for all end-to-end tests in the project.

To generate the coverage file (only if the e2e test is completed before):
```sh
npm run e2e:coverage
```

The coverage report is located at:
`/Testez-une-application-full-stack/front/coverage/lcov-report/index.html`

![Alt Text](/images/e2e-coverage.png)

## Back-end Tests

Navigate to the back folder of the project and run the back-end tests:
```sh
mvn clean test
```
The coverage report is located at:
`/Testez-une-application-full-stack/back/target/site/jacoco/index.html`

![Alt Text](/images/jacoco-coverage.png)

