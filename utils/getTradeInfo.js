const crypto = require("crypto")
const HashKey = process.env.HASH_KEY
const HashIV = process.env.HASH_IV
const MerchantID = process.env.MERCHANT_ID

const BaseURL = process.env.BASE_URL
const PayGateWay = 'https://ccore.spgateway.com/MPG/mpg_gateway'
const ReturnURL = BaseURL + '/spgateway/callback?from=ReturnURL'
const NotifyURL = BaseURL + '/spgateway/callback?from=NotifyURL'
const ClientBackURL = BaseURL + '/orders'

function genDataChain(TradeInfo) {
  let results = []
  for (let kv of Object.entries(TradeInfo)) {
      results.push(`${kv[0]}=${kv[1]}`)
  }
  return results.join("&")
}

function create_mpg_aes_encrypt(TradeInfo) {
  let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV)
  let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex")
  return enc + encrypt.final("hex")
}

function create_mpg_sha_encrypt(TradeInfo) {

  let sha = crypto.createHash("sha256")
  let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`

  return sha.update(plainText).digest("hex").toUpperCase()
}

module.exports = function getTradeInfo (Amt, Desc, email, sn) {

  console.log('===== getTradeInfo =====')
  console.log(Amt, Desc, email, sn)
  console.log('==========')

  data = {
      'MerchantID': MerchantID, // 商店代號
      'RespondType': 'JSON', // 回傳格式
      'TimeStamp': Date.now(), // 時間戳記
      'Version': 1.5, // 串接程式版本
      'MerchantOrderNo': sn, // 商店訂單編號
      'LoginType': 0, // 智付通會員
      'OrderComment': 'OrderComment', // 商店備註
      'Amt': Amt, // 訂單金額
      'ItemDesc': Desc, // 產品敘述
      'Email': email, // 付款人電子信箱
      'ReturnURL': ReturnURL, // 支付完成返回商店網址
      'NotifyURL': NotifyURL, // 支付通知網址/每期授權結果通知
      'ClientBackURL': ClientBackURL, // 支付取消返回商店網址
  }

  console.log('===== getTradeInfo: data =====')
  console.log(data)


  mpg_aes_encrypt = create_mpg_aes_encrypt(data)
  mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt)

  console.log('===== getTradeInfo: mpg_aes_encrypt, mpg_sha_encrypt =====')
  console.log(mpg_aes_encrypt)
  console.log(mpg_sha_encrypt)

  tradeInfo = {
      'MerchantID': MerchantID, // 商店代號
      'TradeInfo': mpg_aes_encrypt, // 加密後參數
      'TradeSha': mpg_sha_encrypt,
      'Version': 1.5, // 串接程式版本
      'PayGateWay': PayGateWay,
      'MerchantOrderNo': data.MerchantOrderNo,
  }

  console.log('===== getTradeInfo: tradeInfo =====')
  console.log(tradeInfo)

  return tradeInfo
}


