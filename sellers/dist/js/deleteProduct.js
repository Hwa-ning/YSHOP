const req = require('request');

const deleteProduct = (store, product, callback) => {
    const data = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/seller/removeproduct',
        method: 'POST',
        body: {
            "schema": store,
            "productPK": product
        },
        json: true
    };

    req.post(data, (error, result) => {
        callback(undefined, result);
    });
}

module.exports = deleteProduct;