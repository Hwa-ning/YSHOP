const req = require('request');

const deleteBenefit = (store, benefit, callback) => {
    const data = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/seller/removebenefits',
        method: 'POST',
        body: {
            "schema": store,
            "discountPK": benefit
        },
        json: true
    };

    req.post(data, (error, result) => {
        callback(undefined, result);
    });
}

module.exports = deleteBenefit;