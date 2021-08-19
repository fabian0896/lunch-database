const Datastore = require('nedb-promises');

const setupUserModel = require('./src/models/user');
const setupOrderModel = require('./src/models/order');
const setupCompanyModel = require('./src/models/company');
const setupProductModel = require('./src/models/product');
const setupSerialModel = require('./src/models/serial');

const setupUser = require('./src/lib/user');
const setupCompany = require('./src/lib/company');
const setupOrder = require('./src/lib/order');
const setupProduct = require('./src/lib/product');


Datastore.prototype.create = async function(values) {
    try{
        values = await this.validationSchema.validate(values, { stripUnknown: true });
    } catch (err) {
        throw new Error(err.message);
    }   
    const result = await this.insert(values);
    return result;
}


 module.exports = async function db(config) {
    const UserModel = await setupUserModel(config.path, config.filename);
    const CompanyModel = await setupCompanyModel(config.path, config.filename)
    const ProductModel = await setupProductModel(config.path, config.filename);
    const OrderModel = await setupOrderModel(config.path, config.filename);
    const SerialModel = await setupSerialModel(config.path, config.filename);

    const models = {
        UserModel,
        OrderModel, 
        CompanyModel, 
        ProductModel,
        SerialModel  
    };

    const User = setupUser(models);
    const Company = setupCompany(models);
    const Product = setupProduct(models);
    const Order = setupOrder(models);

    return {
        User,
        Company,
        Product,
        Order
    }
}