
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
        const result = await UserModel.update({ _id: userId }, { $set: updateData }, {});
        return result;
    }

    function destroy (user) {
        if (typeof user === 'object') {
            user = user._id;
        }
        return UserModel.remove({_id: user});
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

   
    async function getByCardId(cardId) {
        // get the user with caompnay info
        const user = await UserModel.findOne({ cardId, active: true });
        if (!user) return null; 
        const company = await CompanyModel.findOne({ _id: user.company });
        user.id = user._id;
        user.company = company;
        return user;
    }

 
    async function getByIdentification (identification) {
        const user = await UserModel.findOne({ identification });
        if (!user) return null; 
        const company = await CompanyModel.findOne({ _id: user.company });
        user.id = user._id;
        user.company = company;
        return user;
    }

    async function addCompaniesToUsers(users) {
        const companieIds = users.reduce((companies, user) => {
            if(companies.indexOf(user.company) !== -1){
                return companies;
            }
            return [...companies, user.company];
        }, []);
        const companies = await CompanyModel.find({ _id: { $in: companieIds }});
        users = users.map(user => ({
            ...user,
            id: user._id,
            company: companies.find(c => c._id === user.company),
        }));
        return users;
    }

    async function getAll () {
        let users = await UserModel.find({active: true}).sort({ createdAt: -1 }).exec();
        users = await addCompaniesToUsers(users);
        return users
    }

    async function addOrder (user, order) {
        return {}
    }

    
    async function searchByName(name) {    
        let users = await UserModel.find({
            $or: [
                {
                    name: { $regex: RegExp(name, 'ig') }
                },
                {
                    identification: name
                }
            ],
            active: true
        }).sort({ createdAt: -1 }).exec();
        users = await addCompaniesToUsers(users);
        return users;
    }

    async function setActive(user, active) {
        if (typeof user === 'object') {
            user = user._id;
        }
        await UserModel.update({ _id: user }, { $set: { active } }, {})
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
        searchByName,
        setActive
    }
}


module.exports = setupUser