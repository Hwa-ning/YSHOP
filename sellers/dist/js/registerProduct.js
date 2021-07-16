const req = require('request');

const registerProduct = (store, product, images, callback) => {
    var category = product.selectCategory;

    if (product.btnradioCategory == 'false') {
        category = 0;
    }
    else {
        if (category[1] == '중분류') {
            category = category[0];
        }
        else if (category[2] == '소분류') {
            category = category[1];
        }
        else {
            category = category[2];
        }
    }

    var optionName;

    if (product.btnradioOption == 'true') {
        var optionNameCount = product.optionNameCount;

        optionName = product.optionName;

        optionName.length = optionNameCount;

        var optionList = [];

        var optionListItemCount = product.optionListItem.length;

        var optionValue1, optionValue2, optionValue3;

        var optionStock = product.optionStock;

        var optionPrice = product.optionPrice;

        if (optionNameCount == 1) {
            optionValue1 = product.optionValue1;

            for (let i = 0; i < optionListItemCount; i++) {
                optionList.push({ option: [optionValue1[i]], stock: optionStock[i], extraCharge: optionPrice[i] });
            }
        }
        else if (optionNameCount == 2) {
            optionValue1 = product.optionValue1;
            optionValue2 = product.optionValue2;

            for (let i = 0; i < optionListItemCount; i++) {
                optionList.push({ option: [optionValue1[i], optionValue2[i]], stock: optionStock[i], extraCharge: optionPrice[i] });
            }
        }
        else {
            optionValue1 = product.optionValue1;
            optionValue2 = product.optionValue2;
            optionValue3 = product.optionValue3;

            for (let i = 0; i < optionListItemCount; i++) {
                optionList.push({ option: [optionValue1[i], optionValue2[i], optionValue3[i]], stock: optionStock[i], extraCharge: optionPrice[i] });
            }
        }
    }
    else {
        optionName = [];
    }

    var representativeImage = images[0];

    var optionalImage = [];

    for (let i = 1; i < images.length; i++) {
        optionalImage.push(images[i]);
    }

    console.log(images);

    const data = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/seller/addproduct',
        method: 'POST',
        body: {
            "schema": store,
            "groupPK": category,
            "name": product.name,
            "price": product.price,
            "stock": product.stock,
            "option": optionName,
            "optionstock": optionList,
            "thumbnail": representativeImage,
            "image": optionalImage,
            "status": 1
        },
        json: true
    };

    console.log(data.body);

    req.post(data, (error, result) => {
        callback(undefined, result);
    });
}

module.exports = registerProduct;