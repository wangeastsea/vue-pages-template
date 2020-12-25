import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

export default {
    /**
     *
     * 完整资料确认
     * @param {*}
     * @param {File} signImageBase64
     * @returns
     */
    getCaCertSn(certDn, certP10, signImageBase64) {
        return axios.post(`/user-account-server/api/get-ca-cert-sn/v1`, {
            signImageBase64,
            certDn,
            certP10
        })
    },
    /**
     *
     * 完整资料确认
     * @param {*}
     * @returns
     */
    finishInfoConfirm(params) {
        return axios.post(
            `/user-account-server/api/finish-info-confirm/v1`,
            params
        )
    },
    /**
     *
     * 获取资料确认status
     * @param {*}
     * @returns
     */
    getRiskDisclosure() {
        return axios.getForm(`/user-account-server/api/get-risk-disclosure/v1`)
    },
    /**
     *
     * 开始开户
     * @param {*}
     * @returns
     */
    customerStartOpenAccount() {
        return axios.get(
            `/user-account-server/api/customer-start-open-account/v1`
        )
    },
    /**
     *
     * 获取跳转步骤
     * @param {*}
     * @returns
     */
    getCustomerOpInfoEditStatus() {
        return axios.getForm(
            `/user-account-server/api/get-customer-op-info-edit-status/v1`
        )
    },
    /**
     *
     * 获取用户职业和联系信息
     * @param {*}
     * @returns
     */
    getUserJobAndContact() {
        return axios.get(
            `/user-account-server/api/get-customer-job-and-contact/v1`
        )
    },
    /**
     *
     * 获取身份证信息
     * @param {*}
     * @returns
     */
    getIdCard() {
        return axios.getForm(`/user-account-server/api/get-id-card/v1`)
    },
    /**
     *
     * 保存P10
     * @param {*} data = certP10
     * @returns
     */
    finishFourElement(certP10) {
        return axios.post(`/user-account-server/api/finish-four-element/v1`, {
            certP10
        })
    },
    /**
     *
     * CA PDF备案
     * @param {*} p1SignData
     * @returns
     */
    finishCaSign(certDn, certSn, fileId, p1SignData, bcanAddress, riskAddress) {
        return axios.post(`/user-account-server/api/finish-ca-sign/v1`, {
            certDn,
            certSn,
            fileId,
            p1SignData,
            bcanAddress,
            riskAddress
        })
    },
    /**
     *
     * 四要素后获取certDN
     * @param {*}
     * @returns
     */
    getCaCertdn() {
        return axios.get(`/user-account-server/api/get-ca-certdn/v1`)
    },
    /**
     *校验四要素
     *{
            cardNumber,
            chineseName,
            familyNameSpell,
            firstNameSpell,
            idAddress,
            identifyNumber,
            telephoneNumber
        }
     * @param {银行卡号} cardNumber
     * @param {中文姓名} chineseName
     * @param {姓 拼音} familyNameSpell
     * @param {名 拼音} firstNameSpell
     * @param {证件地址} idAddress
     * @param {证件号码} identifyNumber
     * @param {银行预留手机号} telephoneNumber
     * @returns
     */
    checkfourElement(params) {
        return axios.post(
            `/user-account-server/api/check-four-element-get-ca-certdn/v2`,
            params
        )
    },
    /**
     * 身份证识别
     * @param idCardPath 身份证照片 正反面
     * @returns
     *  "cardNumber": "",
		"chineseName": "",
		"familyNameSpell": "",
		"firstNameSpell": "",
		"idAddress": "",
		"idBackPath": "",
		"idFrontPath": "",
		"identifyNumber": "",
		"infoEditStatus": 0,
		"telephoneNumber": ""
     */
    ocrIdCard(idCardPath) {
        return axios.getForm(`/user-account-server/api/ocr-id-card/v1`, {
            idCardPath
        })
    },
    // 完成身份证图片上传接口
    finishedIdCardUpload() {
        return axios.post(`/user-account-server/api/finished-id-card-upload/v1`)
    },
    // 银行卡识别
    ocrBankCard(bankCardPath) {
        return axios.getForm(`/user-account-server/api/ocr-bank-card/v1`, {
            bankCardPath
        })
    },
    // 获取资产状况和投资目标
    getAssetInvest() {
        return axios.get(`/user-account-server/api/get-asset-invest/v1`)
    },
    // 设置资产状况和投资目标
    setAssetInvest(params) {
        return axios.put(
            `/user-account-server/api/set-customer-asset-invest/v1`,
            params
        )
    },
    // 风险披露完成
    finishRiskDisclosure(params) {
        return axios.post(
            `/user-account-server/api/finish-risk-disclosure/v1/`,
            params
        )
    },
    // 存量客户开通A股通接口
    openChinaTong(params) {
        return axios.post(`/user-account-server/api/open-china-tong/v1`, params)
    },
    // 获取开户状态
    getOpenAccountStatus() {
        return axios.get(`/user-account-server/api/get-open-account-status/v1`)
    },
    // 获取开户状态
    /**
     *
     *
     * @param {
        "companyName": "", // 公司名称
        "contactAddress": "", // 通讯地址
        "email": "", 邮箱
        "idAddress": "", 身份证地址
        "industry": "", 所属行业
        "infoEditStatus": 0, 开户资料填写
        "jobPosition": "", 职位
        "jobStatus": "" 职业状态
    } params
     * @returns
     */
    setUserJobAndContact(params) {
        return axios.put(
            `/user-account-server/api/set-customer-job-and-contact/v1`,
            params
        )
    },
    // 获取开户基本信息
    getOpenAccountBasicInfo() {
        return axios.getForm(
            `/user-account-server/api/get-open-account-basic-info/v1`
        )
    },
    /**
     *
     * 活体认证完成
     * @param {*} bizToken
     * @param {*} megliveData
     * @returns
     */
    getFaceIdVerifyResult(bizToken, megliveData) {
        return axios.postMul(
            `/user-account-server/api/get-face-id-verify-result/v1`,
            {
                bizToken,
                megliveData
            }
        )
    },
    /**
     *
     * 获取CA PDF签名信息
     * @param {File} signImageBase64
     * @param {certDn} certDn
     * @param {certSn} certSn
     * @returns
     */
    caPdfSign(certDn, certSn, signImageBase64) {
        return axios.post(`/user-account-server/api/get-pdf-hash/v1`, {
            signImageBase64,
            certDn,
            certSn
        })
    },
    /**
     *
     * 活体认证完成
     * @param {*} bizToken
     * @param {*} megliveData
     * @param {*} sign
     * @param {*} signVersion
     * @returns
     */
    getFaceIdVerifyResultV2(bizToken, megliveData, sign, signVersion) {
        return axios.post(
            `/user-account-server/api/get-face-id-verify-result/v2`,
            {
                bizToken,
                megliveData,
                sign,
                signVersion
            }
        )
    },

    /**
     *
     * 港版 16国 nfc开户， 活体认证完成
     * @param {*} bizToken
     * @param {*} megliveData
     * @param {*} sign
     * @param {*} signVersion
     * @returns
     */
    getFaceIdVerifyResultV4(params) {
        return axios.post(
            `/user-account-server/api/get-face-id-verify-result/v4`,
            params
        )
    },

    // 获取开户基本信息(通用接口)
    getCustOpenAccountInfo() {
        return axios.getForm(
            `/user-account-server/api/get-cust-open-account-info/v1`
        )
    },
    /**
     *
     * ca失败，改变用户开户方式
     * @param {Number} changeOpenAccountFlowType 1 大陆转港版  2 港版转大陆
     * @returns
     */
    changeAppOpenAccountFlow(changeOpenAccountFlowType) {
        return axios.post(
            `/user-account-server/api/change-app-open-account-flow/v1`,
            {
                changeOpenAccountFlowType
            }
        )
    },
    /**
     *
     * 活体失败，改变用户开户方式
     * @param {Number} changeOpenAccountFlowType 1 大陆转港版  2 港版转大陆
     * @returns
     */
    changeAppOpenAccountFlow2(changeOpenAccountFlowType) {
        return axios.post(
            `/user-account-server/api/change-app-open-account-flow/v2`,
            {
                changeOpenAccountFlowType
            }
        )
    },
    /**
     *
     * 集约客，改变用户开户方式
     * @param {Number} changeOpenAccountFlowType
     * 流程扭转类型:1.大陆开户转港版开户，2.港版开户转大陆开户，3.活体识别转港版，4.无效客户转港版
     * @returns
     */
    changeAppOpenAccountFlow3(changeOpenAccountFlowType) {
        return axios.post(
            `/user-account-server/api/change-app-open-account-flow/v3`,
            {
                changeOpenAccountFlowType
            }
        )
    },

    // 校验恒生是否清算中
    checkOpenChinaTong() {
        return axios.getForm(
            `/user-account-server/api/check-open-china-tong/v1`
        )
    },
    /**
     * 保存 nfc 识别出来的护照数据
     */
    savePassportNfcInfo(params) {
        return axios.post(
            `/user-account-server/api/save-passport-nfc-info/v1`,
            params
        )
    }
}

// h5获取faceidToken
export function getH5FaceIdToken() {
    return axios.getForm('/user-account-server/api/get-h5-face-id-token/v1')
}

// 申请客户专业投资者认证
export function investmentCerificationApply(params) {
    return axios.post(
        '/user-account-server/api/investment-cerification-apply/v1',
        params
    )
}

// 获取客户专业投资者认证结果
export function getInvestmentCerificationResult() {
    return axios.get(
        '/user-account-server/api/get-investment-cerification-result/v1'
    )
}
// 进行ca校验之前，判断同一个用户 用同一个身份证是否已经开户
export const verifyIdCodeStatus = () => {
    return axios.post(`/user-account-server/api/verify-id-code-status/v1`)
}

// 获取用户所有证件信息
export const getCustomerAllIdInfo = () => {
    return axios.getForm(`/user-account-server/api/get-customer-all-id-info/v1`)
}

// 获取客户开户证件资料
export const extGetCustomerOpenAccountIdInfo = () => {
    return axios.getForm(
        `/user-account-server/api/ext-get-customer-open-account-id-info/v1`
    )
}

// 获取w8ben文档
export const getNewestW8benDoc = () => {
    return axios.getForm('/user-account-server/api/get-newest-w8ben-doc/v1')
}

// 获取用户正在生效的资金账户
export const getMarketValidFundAccount = params => {
    return axios.getForm(
        `/user-account-server/api/get-market-valid-fund-account/v1`,
        params
    )
}

//是不是允许当前用户申请专业投资者
export function allowInvestmentCerificationApply() {
    return axios.post(
        '/user-account-server/api/allow-investment-cerification-apply/v1'
        // 新增港版开户银行账户资料
    )
}

export const addHkBankAccountInfo = params => {
    return axios.post(
        `/user-account-server/api/add-hk-bank-account-info/v1`,
        params
    )
}

// 获取港版开户银行账户资料
export const getHkBankAccountInfo = params => {
    return axios.getForm(
        `/user-account-server/api/get-hk-bank-account-info/v1`,
        params
    )
}

// 获取 Jumio API 证书,进行识别
export const getJumioApiCredentials = () => {
    return axios.post('/user-account-server/api/get-jumio-api-credentials/v1')
}

// 获取 Jumio 活体识别结果和信息
export const getJumioCustVerificationInfo = params => {
    return axios.post(
        '/user-account-server/api/get-jumio-cust-verification-info/v1',
        params,
        { timeout: 60000 }
    )
}
// Jumio 活体识别次数
export const recordingCustJumioRequest = () => {
    return axios.post(
        '/user-account-server/api/recording-cust-jumio-request/v1'
    )
}
