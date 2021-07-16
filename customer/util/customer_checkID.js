const request = require('request')

const Customer_CheckID = (schema, UID, callback) => {
    const obj = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/registration/check',
        method: 'POST',
        body: {
            "from": "customer",
            "schema": schema,
            "key": "ID",
            "ID": UID
        },
        json: true
    };
    request(obj, (error, { body }) => {
        const chkid = body;
        callback(undefined, {
            chkid
        })
    })
}
module.exports = Customer_CheckID;