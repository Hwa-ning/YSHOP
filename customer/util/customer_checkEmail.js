const request = require('request')

const Customer_CheckEmail = (schema, email, callback) => {
    const obj = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/registration/check',
        method: 'POST',
        body: {
            "from": "customer",
            "schema": schema,
            "key": "email",
            "email": email
        },
        json: true
    };
    request(obj, (error, { body }) => {
        const chkemail = body;
        callback(undefined, {
            chkemail
        })
    })
}
module.exports = Customer_CheckEmail;