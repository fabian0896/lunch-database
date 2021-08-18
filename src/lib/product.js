
function setProduct ({ ProductModel }) {
   
    function create (values) {
        return {};
    }

    function setfavorite (productId, favorite) {
        return {};
    }


    async function toggleFavorite (productId) {
        
        return {};
    }

   
    function destroy (productId) {
        return {};
    }
    
    function update (productId, values) {
        return {};
    }

   
    function getAll (raw=false) {
        return {};
    }

   
    function getFavorites (raw=false) {
        return {};
    }

   
    function getById (productId) {
        return {};
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

