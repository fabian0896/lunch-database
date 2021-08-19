const Datastore = require('nedb-promises')
const path = require('path');
const Yup = require('yup');


const name = 'companies';

const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    active: Yup.bool().default(true),
});

/**
 * 
 * @param {string} databasePath 
 */
module.exports = async function setupCompanyModel(databasePath, filename) { 
    const db = Datastore.create({
        filename: path.join(databasePath, filename ,`${name}.db`),
        timestampData: true
    });
    await db.load();
    await db.ensureIndex({fieldName: 'active'});
    db.validationSchema = validationSchema;
    return db;
}