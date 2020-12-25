import { Toast } from 'vant'
import jsBridge from '@/utils/js-bridge.js'
import LS from '@/utils/local-storage.js'
import { appVersion, isYouxinAndroid } from '@/utils/html-utils'
import dayjs from 'dayjs'
//英文选择框，月份，JAN1需要有数字，不然van-datetime-picker会导致页面崩溃
const MONTHMAP = {
    '01': 'JAN1',
    '02': 'FEB2',
    '03': 'MAR3',
    '04': 'APR4',
    '05': 'MAY5',
    '06': 'JUN6',
    '07': 'JUL7',
    '08': 'AUG8',
    '09': 'SEP9',
    '10': 'OCT10',
    '11': 'NOV11',
    '12': 'DEC12'
}
const camelizeRE = /-(\w)/g
export function camelize(str) {
    return str.replace(camelizeRE, (_, c) => c.toUpperCase())
}

export function isDef(value) {
    return value !== undefined && value !== null
}

export function isObj(x) {
    const type = typeof x
    return x !== null && (type === 'object' || type === 'function')
}

export function guid() {
    var d = Date.now()
    if (
        typeof performance !== 'undefined' &&
        typeof performance.now === 'function'
    ) {
        d += performance.now() //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
}
// 生成图形验证码的key
export const getVerifyCodeKey = moduleName =>
    moduleName + Date.now() + Math.ceil(Math.random() * 100)

// 获取hash中或者search中携带参数
export function getParameter(name) {
    let RegExpObject = new RegExp(
        '[?&]' + encodeURIComponent(name) + '=([^&]*)'
    )
    if ((name = RegExpObject.exec(window.location.search)))
        return decodeURIComponent(name[1])
}

export function goPdfPreview(url) {
    LS.put('pdfUrl', url)
    if (url) {
        const path = `${location.origin}/webapp/open-account-hk/apply.html#/pdf-preview`
        jsBridge.gotoNewWebview(path)
    } else {
        Toast('URL is null')
    }
}
export const debounce = (fn, delay) => {
    // 定时器，用来 setTimeout
    var timer = null
    // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
    return function() {
        // 保存函数调用时的上下文和参数，传递给 fn
        var context = this
        var args = arguments
        // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
        clearTimeout(timer)

        // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
        // 再过 delay 毫秒就执行 fn
        timer = setTimeout(function() {
            fn.apply(context, args)
        }, delay)
    }
}

// 根据图片生成base64
export function getBase64Image(img) {
    const canvas = document.createElement('canvas')
    const width = img.naturalWidth || img.width
    const height = img.naturalHeight || img.height
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, width, height)

    const ext = img.src.match(/[^.]*$/)[0]
    const mimetypeMap = {
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        ico: 'image/x-icon',
        gif: 'image/gif',
        bmp: 'image/bmp'
    }
    const mimetype = mimetypeMap[ext] || 'image/png'

    return canvas.toDataURL(mimetype)
}

// 之前代码有问题，重新写了 兼容之前的引用
export function throttle(fn, delay) {
    let timer = null
    return function() {
        let context = this,
            args = arguments
        if (!timer) {
            fn.apply(context, args)
            timer = setTimeout(() => {
                clearTimeout(timer) //总是干掉事件回调
                timer = null
            }, delay)
        }
    }
}
// 简单版节流
export function throttleSim(fn, delay) {
    let timer = null
    return function() {
        let context = this,
            args = arguments
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(context, args)
                clearTimeout(timer) //总是干掉事件回调
                timer = null
            }, delay)
        }
    }
}

/**
 * 比较版本号
 * @param v1 版本号，例：1.0.0
 * @param v2 版本号，例：1.0.0
 * @returns number 0：v1=v2，1：v1>v2，-1：v1<v2
 */
export function compareVersion(v1, v2) {
    const v1_arr = v1.split('.').map(i => parseInt(i))
    const v2_arr = v2.split('.').map(i => parseInt(i))
    const maxLength =
        v1_arr.length > v2_arr.length ? v1_arr.length : v2_arr.length
    for (let i = 0; i < maxLength; i++) {
        if (v1_arr[i] === undefined) {
            return -1
        }
        if (v2_arr[i] === undefined) {
            return 1
        }
        if (v1_arr[i] > v2_arr[i]) {
            return 1
        }
        if (v1_arr[i] < v2_arr[i]) {
            return -1
        }
    }
    return 0
}

/**
 * 和当前版本比较
 * @param divisionVersion 将要分割的起始版本号，例：1.0.0
 * @returns
 *  boolean ： 当前app的版本大于等于传入的指定版本返回true，否则返回false
 */
export function compareCurrentVersion(divisionVersion) {
    return compareVersion(appVersion, divisionVersion) > -1
}

/**
 * @describe 跳转
 * @params ${jump_type:跳转方式,jump_url:跳转链接}
 */
export function jumpUrl(jump_type, jump_url) {
    console.log(jump_url)
    if (jump_type != 5) {
        if (jsBridge.isYouxinApp) {
            jsBridge.gotoNewWebview(jump_url)
        } else {
            location.href = jump_url
        }
    } else {
        jsBridge.gotoNativeModule(jump_url)
    }
}

/**
 * desc 千分符 对钱进行处理，支持 小数四舍五入 或者 小数纯截取位数
 * @param {String} num 需要处理的数字
 * @param {Boolean} isRound 是否要使用 四舍五入 策略
 * @param {Number} digit 要截取的小数位数
 */
export function thousandConvert(num = '0', isRound = true, digit = 2) {
    if (isRound) {
        // 四舍五入保留小数点后面的位数
        num = (num - 0).toFixed(digit).toString()
    } else {
        // 纯截取小数点后面的位数，所以这里啥也不做
        num = num.toString()
    }
    let numArr = num.split('.')
    let prevNum = numArr[0]
        .toString()
        .replace(/\d{1,3}(?=(\d{3})+$)/g, match => {
            return match + ','
        })

    if (numArr[1]) {
        if (isRound) {
            return prevNum + '.' + numArr[1]
        }
        return (
            prevNum + (digit === 0 ? '' : '.' + numArr[1].substring(0, digit))
        )
    }
    return prevNum
}

export function parseThousands(priceVal, n = 2) {
    if (priceVal) {
        priceVal = priceVal + ''
        if (priceVal.indexOf('.') > -1) {
            let numberInt = priceVal.substr(0, priceVal.indexOf('.'))
            numberInt = numberInt.replace(
                /(\d{1,3})(?=(\d{3})+(?:$|\.))/g,
                '$1,'
            )
            numberInt = numberInt + priceVal.substr(priceVal.indexOf('.'))
            return numberInt
        } else {
            priceVal = Number(priceVal).toFixed(n)
            return priceVal.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
        }
    } else if (priceVal + '' === '0') {
        return '0.00'
    } else {
        return ''
    }
}
export function thousandsFormat(priceVal, n = 2) {
    if (priceVal) {
        priceVal = Number(priceVal).toFixed(n)
        priceVal = priceVal + ''
        return priceVal.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
    } else if (priceVal + '' === '0') {
        if (n) {
            return '0.' + '0'.repeat(n)
        } else {
            return '0'
        }
    } else {
        return ''
    }
}
export const getUrlParams = field => {
    let url = decodeURIComponent(window.location.href),
        param = {},
        splitArray = url.split('?'),
        searchLocation =
            splitArray.length <= 1 ? '' : splitArray[1].split('#')[0],
        searchParams = searchLocation.split('&'),
        value,
        key
    for (var i = 0, leni = searchParams.length; i < leni; i++) {
        key = searchParams[i].split('=')[0]
        value = searchParams[i].split('=')[1]
        if (!key) {
            continue
        }
        param[key] = value
    }
    return field ? param[field] : param
}
// 截取小数，默认保留两位，不足补0
export function justFixed(n, l = 2) {
    const sliceDeci = (s, l) => {
        let deci = s.split('.')[1].slice(0, l)
        return s.split('.')[0] + (l > 0 ? '.' : '') + deci
    }

    n = +n
    let s = n + ''
    // 整数 直接补0
    if (s.indexOf('.') === -1) {
        if (l > 0) {
            s += '.'
        }
        for (let i = 0; i < l; i++) {
            s += '0'
        }
        return s
    }

    let deci = s.split('.')[1]
    if (deci.length < l) {
        for (let i = 0; i < l - deci.length; i++) {
            s += '0'
        }
    }

    return sliceDeci(s, l)
}

export function formatDaysToEn(day) {
    // 获取最后一位
    let lastNumber = day.slice(-1)
    if (lastNumber === '1') {
        return day + 'st'
    } else if (lastNumber === '2') {
        return day + 'nd'
    } else if (lastNumber === '3') {
        return day + 'rd'
    } else {
        return day + 'th'
    }
}
// 多语言-英文格式的展示，例如： 2019 JAN 01st
export function formatDateToEn(time, isReverse) {
    let date = dayjs(time).format('YYYY-MM-DD')
    date = date.split('-')
    // 格式化-月份，去掉后面的数字 将JAN1为JAN
    date[1] = MONTHMAP[date[1]].replace(/\d/g, '')
    // 格式化-日，添加英文后缀 12-> 12nd
    date[2] = formatDaysToEn(date[2])
    if (isReverse) {
        return date.reverse().join(' ')
    }
    return date.join(' ')
}

export const getUrlParam = name => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let loc = decodeURIComponent(window.location.search)
    let r = loc.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
}
/**
 * PDF 预览方法
 * @param url pfd链接
 */
export const jumpPdfHandle = url => {
    try {
        if (compareCurrentVersion('2.3.0') && isYouxinAndroid) {
            jsBridge.gotoNativeModule(
                'yxzq_goto://pdf?url=' + encodeURIComponent(url)
            )
        } else if (isYouxinAndroid) {
            // 安卓不能新开 webview，会跳出 webview下载pdf，导致新开的 webview 页面空白
            window.location.href = url
        } else {
            // ios 可以直接打开 pdf
            jsBridge.gotoNewWebview(url)
        }
    } catch (e) {
        console.log('pdf跳转报错', e)
    }
}

export function deepCopy(obj) {
    // 首先判断参数是否存在以及参数是否是一个对象
    if (!obj && typeof obj !== 'object') {
        throw new Error('error params')
    }
    // 判断参数是对组类型还是对象类型
    var deepObject = Array.isArray(obj) ? [] : {}
    for (var attr in obj) {
        // 判断属性是否为元素自身的
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(attr)) {
            // 判断属性值存在并且属性值还是为一个引用类型的值（数组或对象），则进行递归复制，直到复制到基本属性值为止
            if (obj[attr] && typeof obj[attr] === 'object') {
                deepObject[attr] = deepCopy(obj[attr]) //进行递归操作
            } else {
                // 非引用类型的值，直接进行赋值
                deepObject[attr] = obj[attr]
            }
        }
    }
    return deepObject
}

/**
 * 判断是否为移动端
 */
export const isMobile = function() {
    if (
        navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        )
    ) {
        return true
    }
    return false
}
/**
 *  跳转港版H5开户
 */
export const goH5HKOpenAccountAction = function(pageName = '') {
    let langType = getUrlParams('langType') || 1
    let appType = getUrlParams('appType') || 2
    window.location.replace(
        window.location.origin +
            `/webapp/open-account-hk/apply.html?langType=${langType}&appType=${appType}#/${pageName}`
    )
}

/**
 *  协议的跳转
 */
export const goProtocol = function(key) {
    if (jsBridge.isYouxinApp) {
        jsBridge.gotoNewWebview(
            window.location.origin + `/webapp/market/generator.html?key=${key}`
        )
    } else {
        window.location.href =
            window.location.origin + `/webapp/market/generator.html?key=${key}`
    }
}
