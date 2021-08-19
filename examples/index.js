const db = require('../index');

(async () => {
    const { User, Company } = await db({ path: __dirname });

    const company = await Company.create({ name: 'Fajas Internacionales' });

    const user = await User.create({
        name: 'Fabian David Dueñas Garcia',
        someOtherThing: 'blab bla bla',
        cardId: '123456789',
        company,
    });
    await User.update(user._id, {name: 'Fabian Modificado'});

    const result = await User.getAll();
    const companyResult = await Company.getListWithUsers();
    console.log('All users: ', result);
    console.log('All companies: ', companyResult);
})();