const req = require('request');

const getBenefitList = (store, callback) => {
    const url = 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/seller/benefitslist';

    var params = '?';

    params += 'schema=' + store;

    const fullUrl = url + params;

    req(fullUrl, (error, { body }) => {

        console.log(body)

        const benefitList = JSON.parse(body);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!");


        console.log(benefitList);


        callback(undefined, benefitList);
    });
}

module.exports = getBenefitList;