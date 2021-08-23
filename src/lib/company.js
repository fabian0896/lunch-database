
function setupCompany ({UserModel, CompanyModel, OrderModel}) {
   
    async function create (values){
        const result = await CompanyModel.create(values);
        result.id = result._id;
        return result;
    }

    async function update (companyId, updateData) {
        const result = await CompanyModel.update({ _id: companyId }, { $set: updateData }, {});
        return result;
    }

    
    async function destroy (company) {
        if(typeof company === 'object'){
            company = company._id;
        }
        const result = await CompanyModel.remove({ _id: company });
        return result;
    }

    
    async function getListWithUsers () {
        const companies = await CompanyModel.find({ active: true }).sort({ createdAt: -1 }).exec();
        const results = [];
        for(company of companies){
            const users = await UserModel.find({ company: company._id });
            results.push({
                ...company,
                id: company._id,
                users
            });
        }
        return results;
    }

    
    async function getList () {
        const companies = await CompanyModel.find({ active: true }).sort({ createdAt: -1 }).exec();
        return companies.map((company) => ({
            ...company,
            id: company._id
        }))
    }

    
    async function getById (companyId) {
        const company = await CompanyModel.findOne({ _id: companyId });
        company.id = company._id;
        return company;
    }

    async function getReportData(dateRange) {
        const [startDate, endDate] = dateRange.map(date => {
            if (typeof date !== 'object') {
                return new Date(date);
            }
            return date;
        });

        const companies = await getListWithUsers();
        
        let result = [];
        for(let company of companies){
            const formatUsers = [];
            for(let user of company.users){
                const orders = await OrderModel.find({ user: user._id, createdAt: {$gte: startDate, $lte: endDate} });
                
                const totalPrice = orders.reduce((sum, order) => {
                    const totalOrderPrice = order.products.reduce((s, product) => {
                        return s + (product.details.price * product.details.quantity);
                    }, 0);
                    return sum + totalOrderPrice;
                }, 0);

                formatUsers.push({
                    ...user,
                    orders,
                    totalPrice,
                    totalOrders: orders.length
                });
            }
            result.push({
                ...company,
                users: formatUsers,
            });
        }

        result = result.map((company) => {
            const [totalPrice, totalOrders] = company.users.reduce((sum, user) => {
                const [price, orders] = sum;
                return [price + user.totalPrice, orders + user.totalOrders];
            }, [0, 0]);
            return {
                ...company,
                totalPrice,
                totalOrders
            }
        })

        return result;
    }

    return {
        create,
        getListWithUsers,
        getList,
        destroy,
        update,
        getById,
        getReportData
    }
}


module.exports = setupCompany