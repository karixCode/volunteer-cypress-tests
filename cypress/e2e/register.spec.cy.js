describe('Регистрация пользователя', () => {
    let testData;

    before(() => {
        cy.fixture('registerData.json').then((data) => {
            testData = data;
        });
    });

    beforeEach(() => {
        cy.log('Открываем страницу регистрации');
        cy.visit('https://яхочупомочь.рф/auth/register');
    });

    it('Успешная регистрация', () => {
        const timestamp = Date.now();
        const email = `testuser+${timestamp}@example.com`; // Уникальный email

        cy.log('Заполнение полей')
        cy.get('input').eq(0).type(testData.validUser.username);
        cy.get('input').eq(1).type(email);
        cy.get('input').eq(2).type(testData.validUser.password);
        cy.get('input').eq(3).type(testData.validUser.passwordConfirm);
        cy.get('.form__button').click();

        cy.url().should('include', '/email-confirm');
        cy.log('Редирект на страницу подтверждения email подтверждён');
    });

    describe('Валидация формы', () => {
        it('Показывает ошибку при пустом имени пользователя', () => {
            cy.log('Проверка валидации пустого имени пользователя');

            cy.get('input').eq(0).type('asd').clear();
            cy.contains(testData.invalidUsers.emptyUsername.error).should('be.visible');
        });

        it('Показывает ошибку при имени из пробелов', () => {
            cy.log('Проверка валидации имени из пробелов');

            cy.get('input').eq(0).type(testData.invalidUsers.spacesOnlyUsername.username).blur();
            cy.contains(testData.invalidUsers.spacesOnlyUsername.error).should('be.visible');
        });

        it('Показывает ошибку при некорректном email', () => {
            cy.log('Проверка валидации email');

            cy.get('input').eq(1).type(testData.invalidUsers.invalidEmail.email).blur();
            cy.contains(testData.invalidUsers.invalidEmail.error).should('be.visible');
        });

        it('Показывает ошибку при несовпадении паролей', () => {
            cy.log('Проверка валидации совпадения паролей');

            cy.get('input').eq(2).type(testData.invalidUsers.passwordMismatch.password);
            cy.get('input').eq(3).type(testData.invalidUsers.passwordMismatch.passwordConfirm).blur();

            cy.contains(testData.invalidUsers.passwordMismatch.error).should('be.visible');
        });
    });
});