const Datastore = require('nedb-promises')
const path = require('path');
const Yup = require('yup');


const name = 'orders';

const validationSchema = Yup.object().shape({
    userId: Yup.string().required(),
    products: Yup.array().min(1),
});


/**
 * 
 * @param {string} databasePath 
 */
module.exports = async function setupOrderModel(databasePath) {   
    const db = Datastore.create({
        filename: path.join(databasePath, 'database' ,`${name}.db`),
        timestampData: true
    });
    db.validationSchema = validationSchema;
    await db.load();
    return db;
}