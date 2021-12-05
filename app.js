var express = require('express');
var app = express();
const bodyParser = require('body-parser');

//session
var session = require('express-session');
var FileStore = require('session-file-store')(session);
const sessionkey = require("./session_key");

//s3_image_upload
const s3 = require('./s3.config');
const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

//customer_file
const GetStoreInfo = require('./customer/util/storeInfo');
const GetProductList = require('./customer/util/productList');
const GetProductInfo = require('./customer/util/productInfo');
const Login_process = require('./customer/util/login_process');
const Reg_process = require('./customer/util/reg_process');
const Customer_CheckID = require('./customer/util/customer_checkID');
const Customer_CheckPhone = require('./customer/util/customer_checkphone');
const Customer_CheckEmail = require('./customer/util/customer_checkEmail');
const Customer_searchProduct = require('./customer/util/searchProduct'); // 2021 10 31 정환 추가
const Customer_findID = require('./customer/util/findID_process'); // 2021 11 06 정환 추가
const Customer_findPW = require('./customer/util/findPW_process');  // 2021 11 06 정환 추가
const Customer_resetPW = require('./customer/util/resetPW_process.js');   // 2021 11 07 정환 추가
const buyProduct = require('./customer/util/buyProduct.js');  // 2021 11 07 정환 추가
const putCart = require('./customer/util/putCart.js'); // 2021 11 07 정환
const Customer_MyPage = require('./customer/util/customer_myPage.js'); // 2021 11 07 정환
const Customer_Notice = require('./customer/util/customer_Notice'); // 2021 11 14 정환
const Customer_CheckReview = require('./customer/util/customer_checkReview.js'); // 2021 11 14 정환
const Customer_WriteQnA = require('./customer/util/customer_writeQnA.js'); // 2021 11 14 정환
const Customer_WriteReview = require('./customer/util/customer_writeReview.js'); // 2021 11 14 정환
const removeCart = require('./customer/util/removeCart'); // 2021 11 14 정환
//seller_file
const join = require('./sellers/dist/js/join');
const login = require('./sellers/dist/js/login');
const getProductList = require('./sellers/dist/js/getProductList');
const registerProduct = require('./sellers/dist/js/registerProduct');
const deleteProduct = require('./sellers/dist/js/deleteProduct');
const getCategory = require('./sellers/dist/js/getCategory');
const registerCategory = require('./sellers/dist/js/registerCategory');
const deleteCategory = require('./sellers/dist/js/deleteCategory');
const getBenefitList = require('./sellers/dist/js/getBenefitList');
const registerBenefit = require('./sellers/dist/js/registerBenefit');
const deleteBenefit = require('./sellers/dist/js/deleteBenefit');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + 'customer/public'));             //customer_static
app.use(express.static(__dirname + '/sellers/dist'));  //seller_static

app.use(session({
    secret: sessionkey,
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    rolling: true
}))


//Routing_customer

app.get('/customer/:shopURL/logout_process', function (req, res) {
    req.session.destroy();
    return res.redirect('/customer/' + req.params.shopURL);
})

app.get('/customer/:shopURL', function (req, res) {
    // 메인 페이지
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        console.log(storeinfo);
        GetProductList(req.params.shopURL, (error, { productlist }) => {
            if (error)
                return res.send({ error });

            var idxURL = (req.params.shopURL).toString();
            return res.render('./customer/index.ejs', {
                indexCategory: "전체 상품",
                categoryInfo: category,
                storeInfo: storeinfo,
                productList: productlist,
                indexURL: idxURL,
                loginInfo: req.session.userID
            });
        })
    });
});

// 상품검색 (키워드 검색) 211031 정환 추가
app.get('/customer/:shopURL/search/', function (req, res) {
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        Customer_searchProduct(req.params.shopURL, req.query.name, (error, { productlist }) => {
            if (error)
                return res.send({ error });

            let idxURL = (req.params.shopURL).toString();
            console.log(idxURL);
            return res.render('./customer/index.ejs', {
                indexCategory: "검색 결과",
                categoryInfo: category,
                storeInfo: storeinfo,
                productList: productlist,
                indexURL: idxURL,
                loginInfo: req.session.userID
            });
        })
    });
});

// 해당 카테고리 목록 상품리스트 출력  211031 정환 추가
app.get('/customer/:shopURL/group/:groupPK', function (req, res) {
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        Customer_searchProduct(req.params.shopURL, req.params.groupPK, (error, { productlist }) => {
            if (error)
                return res.send({ error });

            let idxURL = (req.params.shopURL).toString();
            console.log(idxURL);
            return res.render('./customer/index.ejs', {
                indexCategory: "카테고리",
                categoryInfo: category,
                storeInfo: storeinfo,
                productList: productlist,
                indexURL: idxURL,
                loginInfo: req.session.userID
            });
        })
    });
});

app.get('/customer/:shopURL/product/:productPK', function (req, res) {
    // 상품 상세보기
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        GetProductInfo(req.params.shopURL, req.params.productPK, (error, { product, image, option, reviewList, QnAList }) => {
            if (error)
                return res.send({ error });

            var idxURL = (req.params.shopURL).toString();
            console.log(category);
            return res.render('./customer/product.ejs', {
                categoryInfo: category,
                storeInfo: storeinfo,
                productInfo: product,
                imageInfo: image,
                optionInfo: option,
                indexURL: idxURL,
                loginInfo: req.session.userID,
                reviewList: reviewList,
                QnAList: QnAList
            });
        })
    });
});
// 아이디 찾기 라우팅 211101 오정환추가
app.get('/customer/:shopURL/findID', function (req, res) {
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        if (error)
            return res.send({ error });
        let idxURL = (req.params.shopURL).toString();

        return res.render('./customer/findID.ejs', {
            storeInfo: storeinfo,
            categoryInfo: category,
            indexURL: idxURL,
            loginInfo: undefined
        });
    })
})

// 아이디 찾기 진행 211101 오정환추가
app.post('/customer/:shopURL/findID_process', function (req, res) {
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        Customer_findID(req.params.shopURL, req.body.name, req.body.key, req.body.findVal, (error, result) => {
            if (error)
                return res.send({ error });
            let idxURL = (req.params.shopURL).toString();
            console.log("result : ", result);
            if (!result.length) {
                console.log("정보 없음");
                return res.send(`<script>alert("존재하지 않는 정보입니다."); history.back();</script>`);
            }
            else {
                console.log("ID찾음!");
                return res.send(`<script>alert("ID : ${result[0].ID}"); window.location.href = "/customer/${req.params.shopURL}/login";</script>`);
            }
        })
    })
})
// 비밀번호 찾기 라우팅 211101 오정환추가
app.get('/customer/:shopURL/findPW', function (req, res) {
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        if (error)
            return res.send({ error });
        let idxURL = (req.params.shopURL).toString();

        return res.render('./customer/findPW.ejs', {
            storeInfo: storeinfo,
            categoryInfo: category,
            indexURL: idxURL,
            loginInfo: undefined
        });
    })
})

// 비밀번호 찾기 진행 211101 오정환추가
app.post('/customer/:shopURL/findPW_process', function (req, res) {
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        Customer_findPW(req.params.shopURL, req.body.ID, req.body.key, req.body.findVal, (error, result) => {
            if (error)
                return res.send({ error });
            let idxURL = (req.params.shopURL).toString();
            console.log("result : ", result);
            if (!result[0].cnt) {
                console.log("정보 없음");
                return res.send(`<script>alert("존재하지 않는 정보입니다."); history.back();</script>`);
            }
            else {
                console.log("정보 존재!");
                return res.render('./customer/resetPW.ejs', {
                    storeInfo: storeinfo,
                    categoryInfo: category,
                    indexURL: idxURL,
                    loginInfo: undefined,
                    ID: req.body.ID
                });
            }
        })
    })
})
// 비밀번호 재설정  211101 오정환추가
app.post('/customer/:shopURL/resetPW_process', function (req, res) {
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        Customer_resetPW(req.params.shopURL, req.body.ID, req.body.PW, (error, result) => {
            console.log("req body : ", req.body);
            if (error)
                return res.send({ error });
            let idxURL = (req.params.shopURL).toString();
            console.log("result : ", result);
            if (result === "Success") {
                console.log("비밀번호 재설정 성공");
                return res.send(`<script>alert("비밀번호 재설정 완료"); window.location.href = "/customer/${req.params.shopURL}/login";</script>`);
            }
            else {
                return res.send(`<script>alert("비밀번호 재설정 실패"); history.back();<script>`);
                // console.log("정보 존재!");
                // return res.render('./customer/resetPW.ejs', {
                //     storeInfo: storeinfo,
                //     categoryInfo: category,
                //     indexURL: idxURL,
                //     loginInfo: undefined
                // });
            }
        })
    })
})

// buy Product 211107 정환
app.post('/customer/:shopURL/buyProduct', function (req, res) {
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        if (req.session.userID == undefined) {
            return res.send(`<script>alert("올바르지 않은 접근입니다. 로그인을 확인해주세요."); window.location.href = "/customer/${req.params.shopURL}/login";</script>`);
        }
        let idxURL = (req.params.shopURL).toString();
        console.log(req.body);
        return res.render('./customer/buyProduct.ejs', {
            storeInfo: storeinfo,
            categoryInfo: category,
            indexURL: idxURL,
            productTitle: req.body.productTitle,
            loginInfo: req.session.userID,
            thumbnail: req.body.thumbnail,
            products: req.body.products
        });
    })
});

// buyProduct 진행 ++
app.post('/customer/:shopURL/buyProduct_process', function (req, res) {
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        if (req.session.userID == undefined) {
            return res.send(`<script>alert("올바르지 않은 접근입니다. 로그인을 확인해주세요."); window.location.href = "/customer/${req.params.shopURL}/login";</script>`);
        }
        console.log("reqBody : ", req.body);
        console.log("==============================");
        buyProduct(req.params.shopURL, req.session.userID, req.body.buyProductList, req.body.address, (error, result) => {
            return res.send(`<script>alert("구매가 완료됐습니다."); window.location.href = "/customer/${req.params.shopURL}";</script>`);
        });
    })
});

// 장바구니담기
app.post('/customer/:shopURL/putCart', function (req, res) {
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        if (req.session.userID == undefined) {
            return res.send(`<script>alert("올바르지 않은 접근입니다. 로그인을 확인해주세요."); window.location.href = "/customer/${req.params.shopURL}/login";</script>`);
        }
        console.log("==============================");
        putCart(req.params.shopURL, req.session.userID, req.body.products, (error, result) => {
            return res.send(`<script>alert("장바구니 담기가 완료됐습니다."); window.location.href = "/customer/${req.params.shopURL}";</script>`);
        });
    })
})

app.post('/customer/:shopURL/removeCart', function (req, res) {
    if (req.session.userID == undefined)
        return res.send(`<script>alert("올바르지 않은 접근입니다. 로그인을 확인해주세요."); window.location.href = "/customer/${req.params.shopURL}/login";</script>`);
    removeCart(req.params.shopURL, req.session.userID, req.body.stockPK, (error, result) => {
        if (error) {
            return res.send(error);
        }
        return res.send(`<script>alert("장바구니가 삭제되었습니다."); window.location.href = "/customer/${req.params.shopURL}/myPage";</script>`)
    })
})
// 구매자 마이페이지
app.get('/customer/:shopURL/myPage', function (req, res) {
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        if (req.session.userID == undefined) {
            return res.send(`<script>alert("올바르지 않은 접근입니다. 로그인을 확인해주세요."); window.location.href = "/customer/${req.params.shopURL}/login";</script>`);
        }
        let idxURL = (req.params.shopURL).toString();
        Customer_MyPage(req.params.shopURL, req.session.userID, (error, result) => {
            console.log("result : ", result);
            console.log(result.cartList.length);
            return res.render('./customer/myPage.ejs', {
                storeInfo: storeinfo,
                categoryInfo: category,
                indexURL: idxURL,
                loginInfo: req.session.userID,
                cartList: result.cartList,
                purchaseList: result.purchaseList
            });
        })
    })
})
// 구매자 공지사항 조회
app.get('/customer/:shopURL/notice', function (req, res) {
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        if (req.session.userID == undefined) {
            return res.send(`<script>alert("올바르지 않은 접근입니다. 로그인을 확인해주세요."); window.location.href = "/customer/${req.params.shopURL}/login";</script>`);
        }
        let idxURL = (req.params.shopURL).toString();
        Customer_Notice(req.params.shopURL, (error, result) => {
            console.log("result : ", result);
            return res.render('./customer/notice.ejs', {
                storeInfo: storeinfo,
                categoryInfo: category,
                indexURL: idxURL,
                loginInfo: req.session.userID,
                noticeList: result
            });
        })
    })
})

// 리뷰 작성전 구매내역 존재여부 파악.
app.post('/customer/:shopURL/checkReview', function (req, res) {
    if (req.session.userID == undefined) {
        return res.send(`<script>alert("로그인 후 리뷰를 작성해주세요."); window.location.href = "/customer/${req.params.shopURL}/login";</script>`);
    }
    console.log(req.body);
    Customer_CheckReview(req.params.shopURL, req.session.userID, req.body.productPK, (error, result) => {
        if (result == undefined || result == []) {
            return res.send(
                `<script>alert("해당 상품의 구매내역이 존재하지 않습니다.");
                history.back()";</script>`);
        } else {
            console.log("result : ", result);
            return res.send(`<script>window.location.href = \"/customer/${req.params.shopURL}/product/${req.body.productPK}/review/${result[0].purchasePK} \"</script>`);
        }
    })
})
//리뷰 작성 실행
app.post('/customer/:shopURL/writeReivew', function (req, res) {
    Customer_WriteReview(req.params.shopURL, req.body.purchasePK, req.body.title, req.body.context, null, req.body.star, (error, result) => {
        return res.send(
            `<script>alert("리뷰 작성이 완료됐습니다.");
            window.location.href = \"/customer/${req.params.shopURL}\";</script>`);
    })
})

// 리뷰 작성 이동
app.get('/customer/:shopURL/product/:productPK/review/:purchasePK', function (req, res) {
    if (req.session.userID == undefined) {
        return res.send(`<script>alert("로그인 후 리뷰를 작성해주세요."); window.location.href = "/customer/${req.params.shopURL}/login";</>`);
    }
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        if (error)
            return res.send({ error });
        let idxURL = (req.params.shopURL).toString();
        return res.render('./customer/writeReview.ejs', {
            storeInfo: storeinfo,
            categoryInfo: category,
            indexURL: idxURL,
            loginInfo: req.session.userID,
            purchasePK: req.params.purchasePK
        });
    })
})


// 리뷰 작성
app.post('/customer/:shopURL/writeReview', function (req, res) {
    if (req.session.userID == undefined) {
        return res.send(`<script>alert("로그인 후 리뷰를 작성해주세요."); window.location.href = "/customer/${req.params.shopURL}/login";</script>`);
    }
    Customer_WriteReview(req.params.shopURL, req.body.purchasePK, req.body.title, req.body.context, req.body.image, req.body.star, (error, result) => {
        console.log(result);

        return res.send(`<script>alert("리뷰 작성이 완료되었습니다.");
        window.location.href = "/customer/${req.params.shopURL}";</script>`);
    })
})

// 문의 작성 실행
app.post('/customer/:shopURL/writeQnA-process', function (req, res) {
    if (req.session.userID == undefined) {
        return res.send(`<script>alert("로그인 후 문의를 작성해주세요."); window.location.href = "/customer/${req.params.shopURL}/login";</script>`);
    }
    Customer_WriteQnA(req.params.shopURL, req.session.userID, req.body.productPK, req.body.title, req.body.context, (error, result) => {
        console.log(result);
        return res.send(`<script>alert("문의 작성이 완료되었습니다.");
        window.location.href = "/customer/${req.params.shopURL}";</script>`);
    })
})

// 문의 작성 페이지 이동
app.post('/customer/:shopURL/writeQnA', function (req, res) {
    if (req.session.userID == undefined) {
        return res.send(`<script>alert("로그인 후 문의를 작성해주세요."); window.location.href = "/customer/${req.params.shopURL}/login";</>`);
    }
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        if (error)
            return res.send({ error });
        let idxURL = (req.params.shopURL).toString();
        return res.render('./customer/writeQnA.ejs', {
            storeInfo: storeinfo,
            categoryInfo: category,
            indexURL: idxURL,
            loginInfo: req.session.userID,
            productPK: req.body.productPK
        });
    })
})

// ================================================================
app.get('/customer/:shopURL/login', function (req, res) {
    // 로그인 페이지
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        if (error)
            return res.send({ error });
        let idxURL = (req.params.shopURL).toString();

        return res.render('./customer/login.ejs', {
            storeInfo: storeinfo,
            categoryInfo: category,
            indexURL: idxURL,
            loginInfo: undefined
        });
    })
});

app.get('/customer/:shopURL/registration', function (req, res) {
    // 회원가입페이지
    GetStoreInfo(req.params.shopURL, req.params.shopURL, (error, { storeinfo, category }) => {
        if (error)
            return res.send({ error });
        let idxURL = (req.params.shopURL).toString();

        return res.render('./customer/registration.ejs', {
            storeInfo: storeinfo,
            categoryInfo: category,
            indexURL: idxURL,
            loginInfo: undefined
        });
    })
});

app.post('/customer/:shopURL/reg_process', function (req, res) {
    // 회원가입 요청
    let rb = req.body;
    Reg_process(req.params.shopURL, rb.id, rb.pw, rb.uname, rb.phone, rb.email, rb.birthdate, rb.gender, rb.address, (error, { user }) => {
        if (error) {
            return res.send({ error });
        }

        if (user == "Fail")
            console.log("회원가입실패");
        else
            console.log(rb.id + "회원가입");
        return res.send(`<script>alert("${rb.id}님 가입을 환영합니다."); window.location.href = "/customer/${req.params.shopURL}/login"</>`);
    })
});

app.post('/customer/:shopURL/login_process', function (req, res) {
    // 로그인 요청
    Login_process(req.params.shopURL, req.body.id, req.body.pw, (error, { id }) => {
        console.log(id[0]);
        if (id[0] == undefined) {
            console.log("로그인 정보 불일치");
            return res.send(`<script>alert("로그인 정보가 일치하지 않습니다.");window.location.href = "/customer/${req.params.shopURL}/login";</script>`);
        }
        else if (error) {
            return res.send({ error });
        }
        req.session.userID = id[0].ID;
        console.log(req.session + "로그인");
        req.session.save(function () {
            return res.redirect('/customer/' + req.params.shopURL);
        });
    })
});

app.post('/customer/:shopURL/idcheck', function (req, res) {
    // ID 중복 확인
    Customer_CheckID(req.params.shopURL, req.body.test, (error, { chkid }) => {
        console.log(chkid);
        if (error)
            console.log("ERROR : ", error);
        if (chkid[0].cnt == 1) {
            console.log("사용 불가능한 ID입니다.");
            res.send({ checkID: false });
        }
        else {
            console.log("사용 가능한 ID입니다.");
            res.send({ checkID: true });
        }
    })
});

app.post('/customer/:shopURL/phonecheck', function (req, res) {
    // 전화번호 중복 확인
    Customer_CheckPhone(req.params.shopURL, req.body.test, (error, { chkphone }) => {
        console.log(chkphone);
        if (error)
            console.log("ERROR : ", error);
        if (chkphone[0].cnt == 1) {
            res.send({ checkPhone: false });
        }
        else {
            res.send({ checkPhone: true });
        }
    })
});

app.post('/customer/:shopURL/emailcheck', function (req, res) {
    // 이메일 중복 확인
    Customer_CheckEmail(req.params.shopURL, req.body.test, (error, { chkemail }) => {
        console.log(chkemail);
        if (error)
            console.log("ERROR : ", error);
        if (chkemail[0].cnt == 1) {
            res.send({ checkEmail: false });
        }
        else {
            res.send({ checkEmail: true });
        }
    })
});


//Routing_sellers

// home.ejs
app.get('/sellers/home', (req, res) => {
    res.render('./sellers/home');
});

// signup.ejs
app.get('/sellers/signup1', (req, res) => {
    res.render('./sellers/signup1');
});

app.post('/sellers/signup2', (req, res) => {
    res.render('./sellers/signup2', { signup1: req.body });
});

app.post('/sellers/join', (req, res) => {
    join(req.body, (error, result) => {
        res.redirect('/sellers/home');
    });
});

// login.ejs
app.get('/sellers/login', (req, res) => {
    res.render('./sellers/login');
});

app.post('/sellers/login_process', (req, res) => {
    login(req.body, (error, result) => {
        var loginInfo = result.body[0];

        if (loginInfo == undefined) {
            res.redirect('/sellers/login');
        }
        else {
            req.session.url = loginInfo.URL;
            req.session.seller = loginInfo.ID;
            req.session.storeImg = loginInfo.image;
            req.session.shop = loginInfo.shopName;
            req.session.save(() => {
                return res.redirect('/sellers/' + req.session.url + '/dashboard');
            });
        }
    });
});

// logout
app.get('/sellers/logout', (req, res) => {
    req.session.destroy();

    res.redirect('/sellers/home');
});

// dashboard/dashboard.ejs
app.get('/sellers/:store/dashboard', (req, res) => {
    var store = req.params.store;

    var session = req.session;

    res.render('./sellers/dashboard/dashboard', { store: store, url: session.url, id: session.seller, storeImg: session.storeImg, shop: session.shop });
});

// dashboard/products/list.ejs
app.get('/sellers/:store/products/list', (req, res) => {
    var store = req.params.store;

    var session = req.session;

    getProductList(store, (error, productList) => {
        var all = productList.length, sale = 0, outofstock = 0, suspension = 0;

        for (let i = 0; i < productList.length; i++) {
            if (productList[i].stock == 0) {
                outofstock++;
            }
            else if (productList[i].status == '1') {
                sale++;
            }
            else {
                suspension++;
            }
        }

        const status = {
            all: all,
            sale: sale,
            outofstock: outofstock,
            suspension: suspension
        };

        getCategory(store, (error, category) => {
            res.render('./sellers/dashboard/products/list', { store: store, status: status, category: category, productList: productList, url: session.url, id: session.seller, storeImg: session.storeImg, shop: session.shop });
        });
    });
});

app.get('/sellers/:store/products/list_delete', (req, res) => {
    var store = req.params.store;

    var product = req.query.product;

    deleteProduct(store, product, (error, result) => {
        req.session.save(() => {
            res.redirect('/sellers/' + store + '/products/list');
        });
    });
});

// dashboard/products/register.ejs
app.get('/sellers/:store/products/register', (req, res) => {
    var store = req.params.store;

    var session = req.session;

    getCategory(store, (error, category) => {
        res.render('./sellers/dashboard/products/register', { store: store, category: category, url: session.url, id: session.seller, storeImg: session.storeImg, shop: session.shop });
    });
});

app.post('/sellers/:store/products/register_process', upload.array('image'), (req, res) => {
    const s3Client = s3.s3Client;

    var params = [];

    var images = [];

    var store = req.params.store;

    for (let i = 0; i < req.files.length; i++) {
        params.push(s3.uploadParams);
        params[i].Key = store + '/' + (new Date()).getTime() + '_' + req.files[i].originalname;
        params[i].Body = req.files[i].buffer;

        s3Client.upload(params[i], (err, data) => {
            images.push(data.Location);

            if (i == req.files.length - 1) {
                registerProduct(store, req.body, images, (error, result) => {
                    req.session.save(() => {
                        res.redirect('/sellers/' + store + '/products/register');
                    });
                });
            }
        });
    }
});

// dashboard/products/category.ejs
app.get('/sellers/:store/products/category', (req, res) => {
    var store = req.params.store;

    var session = req.session;

    getCategory(store, (error, category, tmp) => {
        res.render('./sellers/dashboard/products/category', { store: store, category: category, tmp: tmp, url: session.url, id: session.seller, storeImg: session.storeImg, shop: session.shop });
    });
});

app.post('/sellers/:store/products/category_register', (req, res) => {
    var store = req.params.store;

    registerCategory(store, req.body, (error, result) => {
        req.session.save(() => {
            res.redirect('/sellers/' + store + '/products/category');
        });
    });
});

app.post('/sellers/:store/products/category_delete', (req, res) => {
    var store = req.params.store;

    deleteCategory(store, req.body, (error, result) => {
        req.session.save(() => {
            res.redirect('/sellers/' + store + '/products/category');
        });
    });
});

// dashboard/benefits/list.ejs
app.get('/sellers/:store/benefits/list', (req, res) => {
    var store = req.params.store;

    var session = req.session;

    getBenefitList(store, (error, benefitList) => {
        res.render('./sellers/dashboard/benefits/list', { store: store, benefitList: benefitList, url: session.url, id: session.seller, storeImg: session.storeImg, shop: session.shop });
    });
});

app.get('/sellers/:store/benefits/list_delete', (req, res) => {
    var store = req.params.store;

    var benefit = req.query.benefit;

    deleteBenefit(store, benefit, (error, result) => {
        req.session.save(() => {
            res.redirect('/sellers/' + store + '/benefits/list');
        });
    });
});

// dashboard/benefits/register.ejs
app.get('/sellers/:store/benefits/register', (req, res) => {
    var store = req.params.store;
    var session = req.session;
    getCategory(store, (error, category) => {
        getProductList(store, (error, productList) => {
            res.render('./sellers/dashboard/benefits/register', { store: store, category: category, productList: productList, url: session.url, id: session.seller, storeImg: session.storeImg, shop: session.shop });
        });
    });
});

app.post('/sellers/:store/benefits/register_process', (req, res) => {
    var store = req.params.store;

    registerBenefit(store, req.body, (error, result) => {
        req.session.save(() => {
            res.redirect('/sellers/' + store + '/benefits/register');
        });
    });
});


var server = app.listen(3000, function () {
    console.log("Express server has started on port 3000")
});