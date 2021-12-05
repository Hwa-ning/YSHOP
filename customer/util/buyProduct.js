const request = require('request');

const buyProduct = (schema, ID, buyList, address, callback) => {
    console.log(JSON.parse(buyList));
    let temp = JSON.parse(buyList);
    let result = "";
    for (const property in temp) {
        console.log(temp[property]);
        let ps = temp[property].split(',');
        console.log(ps);
        let obj = {
            uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/customer/purchaseproduct',
            method: 'POST',
            body: {
                "schema": schema,
                "ID": ID,
                "stockPK": property,
                "count": ps[0],
                "point": 0,
                "payMoney": ps[1],
                "address": address
            },
            json: true,
        }
        request(obj, (error, { body }) => {
            if (error) {
                result += error;
            }
            console.log("구매 : ", body);
            result += body;
        })
    }
    callback(undefined, result);
}
module.exports = buyProduct;