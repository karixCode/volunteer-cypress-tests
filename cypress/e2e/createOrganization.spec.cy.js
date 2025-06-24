describe('Создание организации', () => {
    let testData;

    before(() => {
        cy.fixture('organizationData.json').then((data) => {
            testData = data;
        });
    });

    beforeEach(() => {
        cy.log('Авторизация');
        cy.visit('https://яхочупомочь.рф/auth');

        cy.get('input').first().type(testData.user.email);
        cy.get('input').eq(1).type(testData.user.password);
        cy.get('.form__button').click()
        cy.wait(1000);

        cy.log('Открываем страницу создания организации');
        cy.visit('https://яхочупомочь.рф/organizations/create');
    });

    it('Успешное создание организации с выбором категории', () => {
        const timestamp = Date.now();
        const orgName = `TestOrg_${timestamp}`;

        cy.log('Заполнение полей')
        // Работа с кастомным селектом
        cy.get('.custom-select').click();
        cy.get('.custom-select__options li').first().click();
        cy.get('.custom-select').should('not.contain', 'Выберите сферу');
        cy.get('.organization-create__form-wrapper').click()

        cy.get('input[placeholder="Название организации"]').type(orgName);
        cy.get('input[placeholder="Номер телефона"]').type(testData.validOrganization.phone);
        cy.get('input[placeholder="Email"]').type(`org_${timestamp}@example.com`);
        cy.get('input[placeholder="Адрес"]').type(testData.validOrganization.address);
        cy.get('textarea[placeholder="Описание организации"]').type(testData.validOrganization.description);
        cy.get('input[placeholder="Web-сайт или соц.сеть"]').first().type('https://vk.com/testorg');

        cy.get('.organization-create__submit').click();

        cy.url().should('include', '/applications');
        cy.contains('Заявка отправлена').should('be.visible');
    });

    describe('Валидация формы', () => {
        it('Показывает ошибку при пустом названии организации', () => {
            cy.log('Проверка валидации пустого названия организации');

            cy.get('input[placeholder="Название организации"]').type('Test').clear();
            cy.contains(testData.validationErrors.emptyName).should('be.visible');
        });

        it('Показывает ошибку при неверном формате email', () => {
            cy.log('Проверка валидации email');

            cy.get('input[placeholder="Email"]').type('invalid-email').blur();
            cy.contains(testData.validationErrors.invalidEmail).should('be.visible');
        });

        it('Показывает ошибку при отсутствии соцсетей', () => {
            cy.log('Проверка валидации обязательных соцсетей');

            cy.get('.organization-create__submit').click();
            cy.contains(testData.validationErrors.noSocials).should('be.visible');
        });

        it('Показывает ошибку при неверном формате соцсети', () => {
            cy.log('Проверка валидации формата соцсетей');

            cy.get('input[placeholder="Web-сайт или соц.сеть"]').type('invalid-url').blur();
            cy.contains(testData.validationErrors.invalidSocial).should('be.visible');
        });

        it('Показывает ошибку при отсутствии категории', () => {
            cy.log('Проверка валидации обязательной категории');

            cy.get('.organization-create__submit').click();
            cy.contains(testData.validationErrors.noCategory).should('be.visible');
        });
    });
});