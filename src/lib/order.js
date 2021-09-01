
function setupOrder({ UserModel, OrderModel, ProductModel, SerialModel, CompanyModel }) {

    async function create(user, productList) {
        if (typeof user === 'object') {
            user = user._id;
        }

        user = await UserModel.findOne({ _id: user });

        if (!user) throw new Error('El usuario no existe en el sistema');
        if (!user.active) throw new Error('El usuario no esta activo');

        if (!productList.length) throw new Error('Los pedidos deben tener por lo menos un producto');

        const consecutive = await SerialModel.getConsecutive('orders');


        const order = await OrderModel.create({
            consecutive,
            user: user._id,
            products: productList
        });

        return order;
    }


    async function addAllValues(orders) {
        //reviso a que usuarios pertenecen esas ordenes
        let users = orders.reduce((usersId, order) => {
            if (usersId.indexOf(order.user) !== -1) {
                return usersId;
            }
            return [...usersId, order.user]
        }, []);
        // traigo los usuarios de la base de datos
        users = await UserModel.find({ _id: { $in: users } });

        //me traigo las compañias de los usuarios
        let companies = users.map((u) => u.company);
        companies = await CompanyModel.find({ _id: { $in: companies } })
        // Me traigo todos los productos
        const products = await ProductModel.find({});

        // Modifico las ordenes para incluir todos los valores
        const resultOrders = orders.map((order) => {
            //Agrego el usuario
            const user = users.find(u => u._id === order.user);
            
            //Agrego la company
            const company = companies.find(c => c._id === user.company);
            
            //Introduzco la información actual de los productos
            const listProducts = order.products.map(product => ({
                ...products.find((p) => p._id === product._id),
                uniqueId: product.cartId || product._id,
                details: product.details
            }));
            return {
                ...order,
                id: order._id,
                products: listProducts,
                user:{
                    ...user,
                    company,
                }
            };
        });
        return resultOrders;
    }


    async function getAll(limit=5, user, dateRange) {
        const query = {};
        let count = limit;

        if (user) {
            if (typeof user === 'object') {
                user = user._id;
            }
            query.user = user
        }

        if (dateRange) {
            const [startDate, endDate] = dateRange.map(date => {
                if (typeof date !== 'object') {
                    return new Date(date);
                }
                return date;
            });
            query.createdAt = {$gte: startDate, $lte: endDate};
        }

        // obtengo todas las ordenes
        let orders = await OrderModel.find(query).sort({ createdAt: -1 }).limit(limit).exec();

        orders = await addAllValues(orders);

        async function nextFunc () {
            let orders = await OrderModel
                                    .find(query)
                                    .sort({ createdAt: -1 })
                                    .skip(count)
                                    .limit(limit)
                                    .exec();
            count += limit;
            orders = await addAllValues(orders);
            if(orders.length < limit) {
                return {data: orders, next: null }
            }
            return {data: orders, next: nextFunc};
        }

        return { data: orders, next: nextFunc};
    }


    async function destroy(order) {
        if (typeof order === 'object'){
            order = order._id;
        }
        const res = await OrderModel.remove({ _id: order });
        return res;
    }


    async function getAllByDateRange(dateRange, user) {
        const query = {}
        if (user) {
            if (typeof user === 'object') {
                user = user._id;
            }
            query.user = user;
        }
        const [startDate, endDate] = dateRange.map(date => {
            if (typeof date !== 'object') {
                return new Date(date);
            }
            return date;
        });
        let orders = await OrderModel.find({ createdAt: {$gte: startDate, $lte: endDate}, ...query });
        orders = await addAllValues(orders);
        return orders;
    }

    return {
        create,
        getAll,
        destroy,
        getAllByDateRange
    }
}


module.exports = setupOrder;