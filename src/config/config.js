const config = {
    dev: {
        DOMAIN: "http://192.168.50.81:9001"
    },
    pro: {
        DOMAIN: "https://mp.langjie.com"
    },
    test: {
        DOMAIN: "http://192.168.31.194:9001"
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
    searchUserInfoByNameOrCompany: '/exhibition/searchUserInfo',
    updateLiveRoomWinnerInfo: '/exhibition/liveRoomWinnerInfo',

    
    getEasyAnswerTitleList: '/easyAnswer/titleList',
    updateEasyAnswerTitleInfo: '/easyAnswer/titleInfo',
    createEasyAnswerTitleInfo: '/easyAnswer/titleInfo',
    getEasyAnswerTitleById: '/easyAnswer/singleTitleInfo',
    getEasyAnswerTitleWithAnswerById: '/easyAnswer/singleTitleWithAnswerInfo',
    deleteEasyAnswerTitleById: '/easyAnswer/titleInfo',
    getEasyAnswerTitleByIdWithAnswerList: '/easyAnswer/easyAnswerTitleByIdWithAnswerList',
    exportAnswerInfoListToExcel: '/easyAnswer/exportExcel',
    updateTitleStatus: '/easyAnswer/titleStatus',
    sendMessage: '/easyAnswer/sendMessage',

    getQuizList: '/quiz/list',
    getQuizInfoWithAnswersById: '/quiz/infoWithAnswers',
    createQuizPlan: '/quiz/quizPlan',
    getQuizPlan: '/quiz/quizPlan',
    updateInitScore: '/quiz/initScore'

}

export default {
    ...config.dev,
    url_list,
    outer_url
}