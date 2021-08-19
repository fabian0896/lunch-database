const Datastore = require('nedb-promises')
const path = require('path');
const Yup = require('yup');


const name = 'orders';

const validationSchema = Yup.object().shape({
    user: Yup.string().required(),
    products: Yup.array().min(1),
});


/**
 * 
 * @param {string} databasePath 
 */
module.exports = async function setupOrderModel(databasePath, filename) {   
    const db = Datastore.create({
        filename: path.join(databasePath, filename ,`${name}.db`),
        timestampData: true
    });
    db.validationSchema = validationSchema;
    await db.load();
    return db;
}