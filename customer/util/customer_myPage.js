const request = require('request');

const customer_myPage = (schema, ID, callback) => {
    console.log(schema, ID);
    let params = "?schema=" + schema + '&ID=' + ID;
    let purchaseListURL = 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/customer/showpurchaselist' + params;
    let cartListURL = 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/customer/cartlist' + params;
    let result = {};

    request(purchaseListURL, (error, { body }) => {
        if (error)
            callback(error, undefined);
        const purchaseList = JSON.parse(body);
        console.log("purchaseList : ", purchaseList);
        result["purchaseList"] = purchaseList;
        request(cartListURL, (error, { body }) => {
            if (error)
                callback(error, undefined);
            const cartList = JSON.parse(body);
            console.log("cartList : ", cartList);
            result["cartList"] = cartList;
            console.log(result);
            callback(undefined, result);
        })
    })
}
module.exports = customer_myPage;