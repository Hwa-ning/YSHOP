const request = require('request')

const GetStoreInfo = (URL, schema, callback) => {
    const url = 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/customer/storeinfo'
    var Params = '?'
    Params += 'schema=' + schema;
    Params += '&URL=' + URL;
    const fullurl = url + Params;
    console.log("GetStoreInfo : " + fullurl);

    request(fullurl, (error, { body }) => {
        const storeInfo = JSON.parse(body);
        let storeinfo = storeInfo.storeinfo[0];

        const tmp = storeInfo.categoryinfo;
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
        callback(undefined, { storeinfo, category })
    })
}
module.exports = GetStoreInfo;