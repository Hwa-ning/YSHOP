const req = require('request');

const registerBenefit = (store, discount, callback) => {
    var flag;
    var target1;
    var target2;

    switch (discount.targetType) {
        case 'all':
            flag = '1';
            target1 = '0';
            break;
        case 'category':
            flag = '1';
            target1 = discount.target;
            break;
        case 'product':
            flag = '2';
            target2 = discount.target;
            break;
    }

    const data = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/seller/addbenefits',
        method: 'POST',
        body: {
            "schema": store,
            "discountName": discount.name,
            "dcRate": discount.discountRate,
            "startDate": discount.startDate,
            "endDate": discount.endDate,
            "flag": flag,
            "target1": target1,
            "target2": target2
        },
        json: true
    };

    req.post(data, (error, result) => {
        callback(undefined, result);
    });
}

module.exports = registerBenefit;