const request = require('request')

const GetProductInfo = (schema, productPK, callback) => {
    const url = 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/customer/productinfo'

    var Params = "?schema=" + schema + '&productPK=' + productPK;

    const fullurl = url + Params;

    console.log("GetProductInfo : " + fullurl);

    request(fullurl, (error, { body }) => {
        const ProductInfo = JSON.parse(body)

        let product = ProductInfo.Product_Info_View[0];

        let image = [];
        if (ProductInfo.Product_Info_View[0].image1 != null)
            image.push(ProductInfo.Product_Info_View[0].image1);
        if (ProductInfo.Product_Info_View[0].image2 != null)
            image.push(ProductInfo.Product_Info_View[0].image2);
        if (ProductInfo.Product_Info_View[0].image3 != null)
            image.push(ProductInfo.Product_Info_View[0].image3);

        let option = [];
        for (let i = 0; i < ProductInfo.Option.length; i++)
            option.push(ProductInfo.Option[i]);
        let reviewList = [];
        for (let i = 0; i < ProductInfo.Review.length; i++)
            reviewList.push(ProductInfo.Review[i]);
        console.log("reviewList :", reviewList)
        let QnAList = [];
        for (let i = 0; i < ProductInfo.QnA.length; i++)
            QnAList.push(ProductInfo.QnA[i]);
        console.log("QnAList :", QnAList)
        callback(undefined, { product, image, option, reviewList, QnAList })
    })
}
module.exports = GetProductInfo;