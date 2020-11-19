import Axios from 'axios';
import CONFIG from './config'
import { message } from 'antd'


const Fetch = async params => {
    const { method, url, queryData, formData } = params
    try {
        const result = await Axios({
            url: CONFIG.DOMAIN+url,
            method,
            data: formData,
            params: queryData,
            headers: {
                'Content-Type':'application/json'
            }
        })
        return result
    } catch (error) {
        console.log(error)
        message.error('请求失败')
    }
}

export default Fetch;