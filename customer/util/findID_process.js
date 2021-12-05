const request = require('request')
const findID_process = (schema, name, key, findVal, callback) => {
    let temp_body = {
        "schema": schema,
        "from": "Customer",
        "flag": "ID",
        "name": name,
        "key": key
    };
    (key == "phone") ? temp_body["phone"] = findVal : temp_body["email"] = findVal;
    console.log("body : ", temp_body);
    const obj = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/find',
        method: 'POST',
        body: temp_body,
        json: true,
    };
    console.log("findID process : " + obj.body);
    request(obj, (error, { body }) => {
        const findID = body;
        console.log(findID);
        callback(error, findID)
    })
}
module.exports = findID_process;