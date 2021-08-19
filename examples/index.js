const db = require('../index');

(async () => {
    const { User, Company, Product } = await db({ path: __dirname });

    const res = await User.getAll();
    console.log(res);
})();