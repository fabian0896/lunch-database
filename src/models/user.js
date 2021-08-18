const Datastore = require('nedb-promises')
const path = require('path');
const Yup = require('yup');

const name = 'users';

const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    identification: Yup.string(),
    cardId: Yup.string().required(),
    active: Yup.bool().default(true),
    company: Yup.string()
});

/**
 * 
 * @param {string} databasePath 
 */
module.exports = async function setupUserModel(databasePath) {
    const db = Datastore.create({
        filename: path.join(databasePath, 'database' ,`${name}.db`),
        timestampData: true
    });
    db.validationSchema = validationSchema;
    await db.ensureIndex({fieldName: 'cardId', unique: true});
    await db.ensureIndex({fieldName: 'active'});
    await db.load();
    return db;
}