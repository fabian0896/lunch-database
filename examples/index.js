const db = require('../index');

(async () => {
    const { Order, User } = await db({ 
        path: '/Users/imac/Library/Application Support/Electron', 
        filename: 'lunchdb' 
    });
    console.time('user-reading');
    const users = await User.getAll(10);
    console.timeEnd('user-reading');
    console.log(users);
})();