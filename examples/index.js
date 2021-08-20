const db = require('../index');

(async () => {
    const { Order } = await db({ 
        path: '/Users/imac/Library/Application Support/Electron', 
        filename: 'lunchdb' 
    });

    const { data } = await Order.getAll(5);
    console.log(data);
})();