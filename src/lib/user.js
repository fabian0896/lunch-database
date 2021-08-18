
function setupUser ({UserModel, OrderModel, ProductModel, CompanyModel}) {
   
    async function create (userData) {
        if(typeof userData.company !== 'string'){
            userData.company = userData.company._id
        }
        const result = await UserModel.create(userData);
        // retrocompativilidad
        result.id = result._id;
        return result;
    }


    async function update(userId, updateData){
        const result = await UserModel.update({_id: userId}, {$set: updateData}, {})
        return result;
    }

    function destroy (userId) {
        return UserModel.remove({_id: userId});
    }


    async function getById(userId) {
        //get the user with the orders and the company
        const user = await UserModel.findOne({_id: userId});
        if (!user) return null;
        const company = await CompanyModel.findOne({ _id: user.company });
        user.id = user._id;
        user.company = company;
        return user;
    }

   
    function getByCardId(cardId) {
        // get the user with caompnay info
        const user = await UserModel.findOne({ cardId });
        if (!user) return null; 
        const company = await CompanyModel.findOne({ _id: user.company });
        user.id = user._id;
        user.company = company;
        return user;
    }

 
    function getByIdentification (identification) {
        const user = await UserModel.findOne({ identification });
        if (!user) return null; 
        const company = await CompanyModel.findOne({ _id: user.company });
        user.id = user._id;
        user.company = company;
        return user;
    }

   
    async function getAll () {
        let users = await UserModel.find({});
        const companieIds = users.reduce((companies, user) => {
            if(companies.indexOf(user.company) !== -1){
                return companies;
            }
            return [...companies, user.company];
        }, []);
        const promises = companieIds.map((_id) => CompanyModel.findOne({ _id }));
        const companies = await Promise.all(promises);
        users = users.map(user => ({
            ...users,
            company: companies.find(c => c?._id === user.company),
        }))
        return users
    }

    function addOrder (user, order) {
        return {}
    }

    
    async function searchByName(name) {     
        return {};
    }

    return {
        create,
        update,
        destroy,
        getById,
        getByCardId,
        getByIdentification,
        getAll,
        addOrder,
        searchByName
    }
}


module.exports = setupUser