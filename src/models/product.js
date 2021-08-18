const Datastore = require('nedb-promises')
const path = require('path');
const Yup = require('yup');


const name = 'prodcuts';

const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    price: Yup.number().positive().required(),
    image: Yup.string(),
    favorite: Yup.bool().default(false),
    active: Yup.bool().default(true),
});


/**
 * 
 * @param {string} databasePath 
 */
module.exports = async function setupProductModel(databasePath) {
    const db = Datastore.create({
        filename: path.join(databasePath, 'database' ,`${name}.db`),
        timestampData: true
    });
    await db.ensureIndex({fieldName: 'favorite'});
    await db.ensureIndex({fieldName: 'active'});
    db.validationSchema = validationSchema;
    await db.load();
    return db;
}