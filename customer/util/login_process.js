const request = require('request')

const Login_process = (schema, ID, PW, callback) => {
    const obj = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/login',
        method: 'POST',
        body: {
            "from": "customer",
            "schema": schema,
            "ID": ID,
            "PW": PW
        },
        json: true
    };
    console.log("login_proces : " + obj);
    request(obj, (error, { body }) => {
        const id = body;
        callback(undefined, {
            id
        })
    })
}
module.exports = Login_process;