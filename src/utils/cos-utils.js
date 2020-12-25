import COS from 'cos-js-sdk-v5'
import { getCostemp } from '@/service/config-manager.js'
import { appType } from '@/utils/html-utils'
let cos = new COS({
    // 必选参数
    getAuthorization: function(options, callback) {
        getCostemp().then(res => {
            let data = res
            callback({
                TmpSecretId: data.tmpSecretId,
                TmpSecretKey: data.tmpSecretKey,
                XCosSecurityToken: data.sessionToken,
                ExpiredTime: data.expiredTime // SDK 在 ExpiredTime 时间前，不会再次调用 getAuthorization
            })
        })
    }
})
export function getCosUrl(url, Sign = true) {
    if (!url) {
        return
    }
    // 展示的时候，图片展示，转换为香港
    if (appType.Hk && !/hongkong-(?=([1-9]{10}\.cos))/.test(url)) {
        url = url
            .replace(/(?=([1-9]{10}\.cos))/g, 'hongkong-')
            .replace(/guangzhou/, 'hongkong')
    }
    url = decodeURIComponent(url)
    return new Promise((resolve, reject) => {
        // let Bucket = url.match(/(?<=\/\/).*?(?=.cos)/)[0]
        // let Region = url.match(/(?<=cos.).*?(?=.myqcloud)/)[0]
        // let Key = url.match(/(?<=.myqcloud.com).*/)[0]
        try {
            let urlArray = url.split('.myqcloud.com')
            let Bucket = urlArray[0].split('.cos.')[0].split('//')[1]
            let Region = urlArray[0].split('.cos.')[1]
            let Key = urlArray[1]
            cos.getObjectUrl(
                {
                    Bucket,
                    Region,
                    Key,
                    Sign
                },
                function(err, data) {
                    if (!err) {
                        resolve(data.Url)
                    }
                    reject(err)
                }
            )
        } catch (e) {
            reject(e)
        }
    })
}
