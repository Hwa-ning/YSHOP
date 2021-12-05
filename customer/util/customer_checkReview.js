const request = require('request')

const Customer_CheckPhone = (schema, ID, productPK, callback) => {
    let URL = 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/customer/checkreview';
    let params = `?schema=${schema}&ID=${ID}&productPK=${productPK}`;
    console.log(URL + params);

    request(URL + params, (error, res) => {
        const return_body = JSON.parse(res.body);
        console.log("body : ", return_body);
        callback(undefined, return_body);
    })
}
module.exports = Customer_CheckPhone;