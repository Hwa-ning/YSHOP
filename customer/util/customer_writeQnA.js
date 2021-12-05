const request = require('request')
const customer_writeQnA = (schema, ID, productPK, title, context, callback) => {
    let temp_body = {
        "schema": schema,
        "flag": "QnA",
        "ID": ID,
        "productPK": productPK,
        "title": title,
        "context": context,
    };
    console.log("body : ", temp_body);
    const obj = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/customer/addcommunity',
        method: 'POST',
        body: temp_body,
        json: true,
    };
    console.log("writeQnA : " + obj.body);
    request(obj, (error, { body }) => {
        const writeQnA = body;
        console.log(writeQnA);
        callback(undefined, writeQnA)
    })
}
module.exports = customer_writeQnA;