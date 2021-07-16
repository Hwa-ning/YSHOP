const req = require('request');

const registerCategory = (store, categoryForm, callback) => {
    var category = categoryForm.selectCategory;

    var parent, depth;

    if (category == '대분류') {
        parent = 0;
        depth = 1;
    }
    else {
        for (let i = 1; i < 3; i++) {
            if (category[i] == '중분류' || category[i] == '소분류') {
                parent = category[i - 1];
                depth = i + 1;
                break;
            }
        }
    }

    const data = {
        uri: 'https://it2ni120k8.execute-api.ap-northeast-2.amazonaws.com/2020-05-24-test/seller/addcategory',
        method: 'POST',
        body: {
            "schema": store,
            "parent": parent,
            "depth": depth,
            "groupName": categoryForm.name
        },
        json: true
    };

    console.log(data);

    req.post(data, (error, result) => {
        callback(undefined, result);
    });
}

module.exports = registerCategory;