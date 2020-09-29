const config = {
    dev: {
        DOMAIN: "http://192.168.50.80:3000"
    },
    pro: {
        DOMAIN: ""
    },
    test: {
        DOMAIN: ""
    }
}



const url_list = {
    getMenusSider: '/menus',
    uploadImg: '/uploadFile',
    createPrizes: '/exhibition/prize',
    getPrizeList: '/exhibition/prizeList',
    deletePrizeById: '/exhibition/prize',
    getPrizeInfoById: '/exhibition/prize'
}

export default {
    ...config.dev,
    url_list
}