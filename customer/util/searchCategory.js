const request = require('request')

const searchCategory = (schema, gpk, callback) => {
    const url = 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/customer/searchcategory';
    console.log(schema, gpk);
    let Params = '?schema=' + schema + "&groupPK=" + gpk;
    const fullurl = url + Params;
    console.log("searchCategory : " + fullurl);
    request(fullurl, (error, { body }) => {
        const ProductList = JSON.parse(body);

        let productlist = [];
        for (let i = 0; i < ProductList.length; i++)
            productlist.push(ProductList[i]);

        callback(undefined, { productlist })
    })
}
module.exports = searchCategory;