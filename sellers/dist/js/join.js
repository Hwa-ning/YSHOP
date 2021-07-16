const req = require('request');

const join = (info, callback) => {
    console.log(info);

    const data = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/registration',
        method: 'POST',
        body: {
            "from": "seller",
            "ID": info.id,
            "PW": info.pw,
            "name": info.name,
            "phone": info.tel,
            "email": info.email,
            "shopName": info.shopName,
            "URL": info.shopUrl,
            "businessNo": info.bizRegNum,
            "shopAddress": info.shopAddress,
            "shopPhone": info.shopTel,
            "shopEmail": info.shopEmail
        },
        json: true
    };

    req.post(data, (error, result) => {
        console.log(result.body);
        callback(undefined, result);
    });
}

module.exports = join;