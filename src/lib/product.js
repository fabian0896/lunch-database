
function setProduct ({ ProductModel }) {
   
    async function create (values) {
        const product = await ProductModel.create(values);
        product.id = product._id;
        return product;
    }

    async function setfavorite (product, favorite) {
        if (typeof product === 'object') {
            product = product._id;
        }
        const result = await ProductModel.update({ _id: product }, { $set: { favorite } }, {});
        return result;
    }


    async function toggleFavorite (product) {
        if (typeof product === 'object') {
            product === product._id;
        }
        product = await ProductModel.findOne({ _id: product });
        product.favorite = !product.favorite;
        product.id = product._id;
        await ProductModel.update({ _id: product._id }, { $set: { favorite: product.favorite }}, {});
        return product;
    }

   
    async function destroy (product) {
        if (typeof product === 'object'){
            product = product._id;
        }
        const result = await ProductModel.remove({ _id: product });
        return result;
    }
    
    async function update (productId, values) {
        const result = await ProductModel.update({ _id: productId }, { $set: values }, {});
        return result;
    }

   
    async function getAll () {
        const products = await ProductModel.find({ active: true });
        return products.map(product => ({...product, id: product._id}));
    }

   
    async function getFavorites () {
        const products = await ProductModel.find({ active: true, favorite: true });
        return products.map(product => ({...product, id: product._id}));
    }

   
    async function getById (productId) {
        const product = await ProductModel.findOne({ _id: productId });
        product.id = product._id;
        return product;
    }

    return {
        update,
        destroy,
        create,
        getAll,
        getById,
        getFavorites,
        setfavorite,
        toggleFavorite
    }
}


module.exports = setProduct;

