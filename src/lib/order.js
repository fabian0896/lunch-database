function setupOrder ({UserModel, OrderModel, ProductModel, CompanyModel}) {
   
    async function create (user ,productList) {
        if (typeof user === 'object'){
            user = user._id;
        }

        user = UserModel.findOne({ _id: user });

        if (!user) throw new Error('The user doesnt exit');
        if (!user.active) throw new Error('The user isnt active');

        if (!productList.length) throw new Error('You cant create an order without any product');
        
        await OrderModel.create({
            user: user._id,
        });

        return {}
    }

    
    function getAll () {
        return {}
    }

    
    return {
        create,
        getAll
    }
}


module.exports = setupOrder;