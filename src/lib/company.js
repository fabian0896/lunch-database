
function setupCompany ({UserModel, CompanyModel}) {
   
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