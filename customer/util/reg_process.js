const request = require('request')

const Reg_process = (schema, ID, PW, uname, phone, email, birthdate, gender, address, callback) => {
    var regObj = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/registration',
        method: 'POST',
        body: {
            "from": "customer",
            "schema": schema,
            "ID": ID,
            "PW": PW,
            "name": uname,
            "phone": phone,
            "email": email,
            "birthdate": birthdate,
            "gender": gender,
            "address": address,
        },
        json: true
    };
    console.log("reg_customer : " + regObj.body);
    request(regObj, (error, { body }) => {
        const user = body
        callback(undefined, {
            user
        })
    })
}
module.exports = Reg_process;