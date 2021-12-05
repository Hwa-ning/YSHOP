const request = require('request');

const putCart = (schema, ID, cartList, callback) => {
    console.log(JSON.parse(cartList));
    let temp = JSON.parse(cartList);
    let result = "";
    for (const property in temp) {
        console.log("장바구니 담기 : ", property, temp[property]);
        let obj = {
            uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/customer/addcart',
            method: 'POST',
            body: {
                "schema": schema,
                "ID": ID,
                "stockPK": property,
                "count": temp[property]
            },
            json: true,
        }
        request(obj, (error, { body }) => {
            if (error) {
                result += error;
            }
            console.log("장바구니 담기 : ", body);
            result += body;
        })
    }
    callback(undefined, result);
}
module.exports = putCart;