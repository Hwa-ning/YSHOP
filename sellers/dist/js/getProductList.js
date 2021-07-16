const req = require('request');

const getProductList = (store, callback) => {
    const url = 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/seller/productlist';

    var params = '?';

    params += 'schema=' + store;

    const fullUrl = url + params;

    req(fullUrl, (error, { body }) => {
        const productList = JSON.parse(body);

        for (let i = 0; i < productList.length; i++) {
            var option = '';

            if (productList[i].option1 != null) {
                option += productList[i].option1;
                if (productList[i].option2 != null) {
                    option += ',';
                    option += productList[i].option2;
                    if (productList[i].option3 != null) {
                        option += ',';
                        option += productList[i].option3;
                    }
                }
            }

            productList[i].option = option;
        }

        callback(undefined, productList);
    });
}

module.exports = getProductList;