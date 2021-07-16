const req = require('request');

const login = (info, callback) => {
    const data = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/login',
        method: 'POST',
        body: {
            "from": 'seller',
            "ID": info.id,
            "PW": info.pw
        },
        json: true
    };

    req.post(data, (error, result) => {
        callback(undefined, result);
    });
}

module.exports = login;