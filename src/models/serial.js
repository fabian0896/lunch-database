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
        let data = await db.findOne({ type });
        if (!data) {
            data = await db.insert({ type, consecutive: 1 });
            return data.consecutive;
        }
        await db.update({ type }, {$inc: { consecutive: 1 }});
        return data.consecutive + 1;
    }
    return db;
}