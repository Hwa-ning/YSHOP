const request = require('request');

const customer_Notice = (schema, callback) => {
    console.log(schema);
    let params = "?schema=" + schema;
    let noticeListURL = 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/noticelist' + params;
    request(noticeListURL, (error, { body }) => {
        if (error)
            callback(error, undefined);
        const noticeList = JSON.parse(body);
        console.log(noticeList);
        callback(undefined, noticeList);
    })
}
module.exports = customer_Notice;