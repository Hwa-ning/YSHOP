const request = require('request')

const searchProduct = (schema, name, callback) => {
    const url = 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/customer/searchproduct';
    console.log(schema, name);
    let Params = '?schema=' + schema + "&name=" + name;
    const fullurl = url + Params;
    console.log("searchProduct : " + fullurl);
    request(fullurl, (error, { body }) => {
        const ProductList = JSON.parse(body);

        let productlist = [];
        for (let i = 0; i < ProductList.length; i++)
            productlist.push(ProductList[i]);

        callback(undefined, { productlist })
    })
}
module.exports = searchProduct;