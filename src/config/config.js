const config = {
    dev: {
        DOMAIN: "http://192.168.50.80:9001"
    },
    pro: {
        DOMAIN: "https://mp.langjie.com"
    },
    test: {
        DOMAIN: ""
    },
}

//const outer_url = 'http://192.168.50.80:9001'
const outer_url = 'https://mp.langjie.com'


const url_list = {
    getMenusSider: '/menus',
    uploadImg: '/uploadFile',
    createPrizes: '/exhibition/prize',
    getPrizeList: '/exhibition/prizeList',
    deletePrizeById: '/exhibition/prize',
    getPrizeInfoById: '/exhibition/prize',
    updatePrizeInfoById: '/exhibition/prize',
    getUserInfoList: '/exhibition/userInfoList',
    updateUserLotteryNumber: '/exhibition/userLotteryNumber',
    searchUserInfoByNameOrCompany: '/exhibition/searchUserInfo'
}

export default {
    ...config.pro,
    url_list,
    outer_url
}