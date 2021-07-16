const req = require('request');

const deleteCategory = (store, categoryForm, callback) => {
    var category = categoryForm.category;

    for (let i = 1; i < 3; i++) {
        if (category[i] == '' || category[i] == '') {
            category.length = i;
            break;
        }
    }

    const data = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/seller/removecategory',
        method: 'POST',
        body: {
            "schema": store,
            "groupPK": category[category.length - 1]
        },
        json: true
    };

    req.post(data, (error, result) => {
        callback(undefined, result);
    });
}

module.exports = deleteCategory;