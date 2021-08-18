
function setupCompany ({UserModel, OrderModel, ProductModel, CompanyModel}) {
   
    function create (values){
        return {}
    }

    function update (companyId, updateData) {
        return {}
    }

    
    function destroy (companyId) {
        return {}
    }

    
    async function getListWithUsers () {
        
        return {};
    }

    
    function getList (raw = false) {
        return {};
    }

    
    function getById (companyId) {
        return {};
    }

    return {
        create,
        getListWithUsers,
        getList,
        destroy,
        update,
        getById
    }
}


module.exports = setupCompany