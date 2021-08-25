const Datastore = require('nedb-promises')
const path = require('path');
const Yup = require('yup');

const name = 'users';

const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    identification: Yup.string(),
    cardId: Yup.string().required(),
    active: Yup.bool().default(true),
    company: Yup.string(),
    avatar: Yup.string().default(null)
});

/**
 * 
 * @param {string} databasePath 
 */
module.exports = async function setupUserModel(databasePath, filename) {
    const db = Datastore.create({
        filename: path.join(databasePath, filename ,`${name}.db`),
        timestampData: true
    });
    db.validationSchema = validationSchema;
    await db.load();
    await db.ensureIndex({fieldName: 'company'});
    await db.ensureIndex({fieldName: 'cardId', unique: true});
    await db.ensureIndex({fieldName: 'active'});
    return db;
}