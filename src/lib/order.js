function setupOrder ({UserModel, OrderModel, ProductModel, CompanyModel}) {
   
    async function create (user ,productList) {
        if (typeof user === 'object'){
            user = user._id;
        }

        user = await UserModel.findOne({ _id: user });

        if (!user) throw new Error('El usuario no existe en el sistema');
        if (!user.active) throw new Error('El usuario no esta activo');

        if (!productList.length) throw new Error('Los pedidos deben tener por lo menos un producto');
        

        const order = await OrderModel.create({
            user: user._id,
            products: productList
        });

        return order;
    }

    
    async function getAll(user) {
        const query = {};

        if(user) {
            if (typeof user === 'object') {
                user = user._id;
            }
            query.user = user
        }

        // obtengo todas las ordenes
        let orders = await OrderModel.find(query).sort({ createdAt: -1 }).exec();

        //reviso que a que usuarios pertenecen esas ordenes
        let users = orders.reduce((usersId, order) => {
            if (usersId.indexOf(order.user) !== -1) {
                return usersId;
            }
            return [...usersId, order.user]
        }, []);
        // traigo los usuarios de la base de datos
        users = await UserModel.find({ _id: { $in: users } });

        // Me traigo todos los productos
        const products = await ProductModel.find({ active: true });

        // Modifico las ordenes para incluir todos los valores
        orders = orders.map((order) => {
            order.id = order._id;
            order.user = users.find(u => u._id === order.user);
            order.products = order.products.map(product => ({
                ...products.find((p) => p._id === product._id),
                details: product.details
            }));
            return order;
        })

        return orders;
    }

    
    return {
        create,
        getAll
    }
}


module.exports = setupOrder;