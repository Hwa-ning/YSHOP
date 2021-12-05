const request = require('request');

const findPW_process = (schema, ID, key, findVal, callback) => {
    let temp_body = {
        "schema": String(schema),
        "from": "Customer",
        "flag": "PW",
        "key": key,
        "ID": String(ID)
    }
    console.log(temp_body, key);
    (key == "phone") ? temp_body["phone"] = findVal : temp_body["email"] = findVal;
    console.log(temp_body);
    const obj = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/find',
        method: 'POST',
        body: temp_body,
        json: true,
    };
    console.log("findPW process : " + obj.body);
    request(obj, (error, { body }) => {
        const findPW = body;
        console.log(findPW);
        callback(error, findPW)
    })
}
module.exports = findPW_process;