const Datastore = require('nedb-promises')
const path = require('path');


const name = 'serials';

/**
 * 
 * @param {string} databasePath 
 */
module.exports = async function setupSerialModel(databasePath, filename) { 
    const db = Datastore.create({
        filename: path.join(databasePath, filename ,`${name}.db`),
        timestampData: true
    });
    await db.load();
    await db.ensureIndex({fieldName: 'consecutive'});
    await db.ensureIndex({fieldName: 'type', unique: true});
    db.getConsecutive = async (type) => {
        const data = await db.update({ type }, { $inc: { consecutive: 1 }}, {upsert: true, returnUpdatedDocs: true});
        return data.consecutive;
    }
    return db;
}