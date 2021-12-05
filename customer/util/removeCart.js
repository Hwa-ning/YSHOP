const request = require('request');

const putCart = (schema, ID, stockPK, callback) => {
    let obj = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/customer/removecart',
        method: 'POST',
        body: {
            "schema": schema,
            "ID": ID,
            "stockPK": stockPK,
        },
        json: true,
    }
    request(obj, (error, { body }) => {
        console.log("장바구니 삭제 : ", body);
        callback(undefined, { body });
    })
}
module.exports = putCart;