const request = require('request')
const customer_writeReview = (schema, purchasePK, title, context, image, star, callback) => {
    let temp_body = {
        "schema": schema,
        "flag": "Review",
        "purchasePK": purchasePK,
        "title": title,
        "context": context,
        "image": image,
        "star": star,
    };
    console.log("body : ", temp_body);
    const obj = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/customer/addcommunity',
        method: 'POST',
        body: temp_body,
        json: true,
    };
    console.log("writeReview : " + obj.body);
    request(obj, (error, { body }) => {
        const writeReview = body;
        console.log(writeReview);
        callback(undefined, writeReview)
    })
}
module.exports = customer_writeReview;