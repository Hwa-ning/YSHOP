// category select handler

function categorySelectHandler(select, value) {
    var category1 = document.getElementById("category1");
    var category2 = document.getElementById("category2");
    var category3 = document.getElementById("category3");

    if (select.id == "category1") {
        category2.value = "중분류";
        category3.value = "소분류";
        category3.removeAttribute('role');
        category3.disabled = true;

        if (category1.value == "대분류") {
            category2.removeAttribute('role');
            category2.disabled = true;

            value.value = "0";
        }
        else {
            var parent = category1.options[category1.selectedIndex].dataset.pk;

            for (let i = 1; i < category2.options.length; i++) {
                if (category2.options[i].dataset.parent == parent) {
                    category2.options[i].hidden = false;
                }
                else {
                    category2.options[i].hidden = true;
                }
            }

            category2.setAttribute('role', "button");
            category2.disabled = false;

            value.value = category1.options[category1.selectedIndex].dataset.pk;
        }
    }
    else if (select.id == "category2") {
        category3.value = "소분류";

        if (category2.value == "중분류") {
            category3.removeAttribute('role');
            category3.disabled = true;

            value.value = category1.options[category1.selectedIndex].dataset.pk;
        }
        else {
            var parent = category2.options[category2.selectedIndex].dataset.pk;

            for (let i = 1; i < category3.options.length; i++) {
                if (category3.options[i].dataset.parent == parent) {
                    category3.options[i].hidden = false;
                }
                else {
                    category3.options[i].hidden = true;
                }
            }

            category3.setAttribute('role', "button");
            category3.disabled = false;

            value.value = category2.options[category2.selectedIndex].dataset.pk;
        }
    }
    else {
        if (category3.value == "소분류") {
            value.value = category2.options[category2.selectedIndex].dataset.pk;
        }
        else {
            value.value = category3.options[category3.selectedIndex].dataset.pk;
        }
    }
}

// create option list

function createOptionList() {
    var optionNameCount = document.getElementById("option-name-count").value;

    var optionValueTmp = document.getElementsByName("optionValue");

    var optionValue = [];

    for (let i = 0; i < optionNameCount; i++) {
        optionValue.push(optionValueTmp[i].value.split(','));
    }

    var tbody = document.getElementById("option-list").getElementsByTagName('tbody')[0];

    if (optionNameCount == 1) {
        for (let i = 0; i < optionValue[0].length; i++) {
            tbody.innerHTML += '<tr>' +
                '<td><input type="text" name="optionValue1" value="' + optionValue[0][i] + '" readonly>' + '</td>' +
                '<td></td>' +
                '<td></td>' +
                '<td><input type="text" name="optionPrice" value="0"></td>' +
                '<td><input type="text" name="optionStock" value="0"></td>' +
                '<td>판매중</td>' +
                '</tr>' +
                '<input type="hidden" name="optionListItem">';
        }
    }
    else if (optionNameCount == 2) {
        for (let i = 0; i < optionValue[0].length; i++) {
            for (let j = 0; j < optionValue[1].length; j++) {
                tbody.innerHTML += '<tr>' +
                    '<td><input type="text" name="optionValue1" value="' + optionValue[0][i] + '" readonly>' + '</td>' +
                    '<td><input type="text" name="optionValue2" value="' + optionValue[1][j] + '" readonly>' + '</td>' +
                    '<td></td>' +
                    '<td><input type="text" name="optionPrice" value="0"></td>' +
                    '<td><input type="text" name="optionStock" value="0"></td>' +
                    '<td>판매중</td>' +
                    '</tr>' +
                    '<input type="hidden" name="optionListItem">';
            }
        }
    }
    else {
        for (let i = 0; i < optionValue[0].length; i++) {
            for (let j = 0; j < optionValue[1].length; j++) {
                for (let k = 0; k < optionValue[2].length; k++) {
                    tbody.innerHTML += '<tr>' +
                        '<td><input type="text" name="optionValue1" value="' + optionValue[0][i] + '" readonly>' + '</td>' +
                        '<td><input type="text" name="optionValue2" value="' + optionValue[1][j] + '" readonly>' + '</td>' +
                        '<td><input type="text" name="optionValue3" value="' + optionValue[2][k] + '" readonly>' + '</td>' +
                        '<td><input type="text" name="optionPrice" value="0"></td>' +
                        '<td><input type="text" name="optionStock" value="0"></td>' +
                        '<td>판매중</td>' +
                        '</tr>' +
                        '<input type="hidden" name="optionListItem">';
                }
            }
        }
    }
}