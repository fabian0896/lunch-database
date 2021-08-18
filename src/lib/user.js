
function setupUser ({UserModel, OrderModel, ProductModel, CompanyModel}) {
   
    async function create (userData) {
        if(typeof userData.company !== 'string'){
            userData.company = userData.company._id
        }
        const result = await UserModel.create(userData);
        return result;
    }


    async function update(userId, updateData){
        return {};
    }

    function destroy (userId) {
        return {}
    }


    async function getById(userId) {
        return {};
    }

   
    function getByCardId(cardId, raw=false) {
        return {};
    }

 
    function getByIdentification (identification) {
        return {};
    }

   
    async function getAll () {
        UserModel.create();
        const result = await UserModel.find({});
        return result
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