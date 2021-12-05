const request = require('request')

const resetPW_process = (schema, ID, PW, callback) => {

    let temp_body = {
        "schema": schema,
        "from": "Customer",
        "ID": ID,
        "PW": PW,
    }
    let obj = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/modifypw',
        method: 'POST',
        body: temp_body,
        json: true
    };
    console.log(schema);
    console.log(ID);
    console.log(PW);
    console.log("reset_PW : " + temp_body);
    request(obj, (error, body) => {
        const resetPW = body;
        console.log(resetPW.body);
        callback(error, resetPW.body)
    });
}
module.exports = resetPW_process;