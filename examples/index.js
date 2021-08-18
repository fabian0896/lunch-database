const db = require('../index');

(async () => {
    const { User } = await db({ path: __dirname });
    const user = await User.create({
        name: 'Fabian David Dueñas Garcia',
        someOtherThing: 'blab bla bla',
        cardId: '123456789',
        company: {
            _id: 'kjjhaslhivkl'
        },
    });
    console.log(user);
})();