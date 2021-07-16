const req = require('request');

const getCategory = (store, callback) => {
    const url = 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/seller/categorylist';

    var params = '?';

    params += 'schema=' + store;

    const fullUrl = url + params;

    req(fullUrl, (error, { body }) => {
        const tmp = JSON.parse(body);

        const category = {};

        category['대분류'] = [];

        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].groupPK2 == null) {
                category['대분류'].push({ name: tmp[i].groupName1, pk: tmp[i].groupPK1 });
                category[tmp[i].groupName1] = {};
                category[tmp[i].groupName1]['중분류'] = [];
            }
            else if (tmp[i].groupPK3 == null) {
                category[tmp[i].groupName1]['중분류'].push({ name: tmp[i].groupName2, pk: tmp[i].groupPK2 });
                category[tmp[i].groupName1][tmp[i].groupName2] = {};
                category[tmp[i].groupName1][tmp[i].groupName2]['소분류'] = [];
            }
            else {
                category[tmp[i].groupName1][tmp[i].groupName2]['소분류'].push({ name: tmp[i].groupName3, pk: tmp[i].groupPK3 });
            }
        }

        callback(undefined, category, tmp);
    });
}

module.exports = getCategory;