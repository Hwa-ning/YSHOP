const request = require('request')

const Customer_CheckPhone = (schema, phoneNo, callback) => {
    const obj = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/registration/check',
        method: 'POST',
        body: {
            "from": "customer",
            "schema": schema,
            "key": "phone",
            "phone": phoneNo
        },
        json: true
    };
    request(obj, (error, { body }) => {
        const chkphone = body;
        callback(undefined, {
            chkphone
        })
    })
}
module.exports = Customer_CheckPhone;