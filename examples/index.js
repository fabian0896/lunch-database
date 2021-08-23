const db = require('../index');
const { startOfDay, endOfDay } = require('date-fns');


(async () => {
    const { Order, User, Company } = await db({ 
        path: '/Users/imac/Library/Application Support/Electron', 
        filename: 'lunchdb' 
    });

    const now = new Date();
    const range = [startOfDay(now).getTime(), endOfDay(now).getTime()];
    console.log(range);
    console.time('get-orders');
    const orders = await Company.getReportData(range);
    console.timeEnd('get-orders')
    console.log(JSON.stringify(orders, null, 2));
})();