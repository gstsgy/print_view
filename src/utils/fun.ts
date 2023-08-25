import request from "./request";
import {Option} from "../api/interface";

export const showdict = (dicts: Option[], code: any) => {
    const targetEnum = dicts.find(it => it.value == code)
    if (targetEnum === undefined) {
        return code
    }
    return targetEnum.label
}

export const barcodeSearch = () => {
    request.get("https://bff.gds.org.cn/gds/searching-api/ProductService/ProductListByGTIN?PageSize=30&PageIndex=1&SearchItem=06922266445033")
    const header = {
        'Accept': ' application/json, text/plain, */*',
        'Accept-Encoding': ' gzip, deflate, br',
        'Accept-Language': ' zh-CN,zh;q=0.9,en;q=0.8',
        'Connection': ' keep-alive',
        'Host': ' bff.gds.org.cn',
        'Origin': ' https://www.gds.org.cn',
        'Referer': ' https://www.gds.org.cn/',
        'sec-ch-ua': ' "Chromium";v="112", "Microsoft Edge";v="112", "Not:A-Brand";v="99"',
        'sec-ch-ua-mobile': ' ?0',
        'sec-ch-ua-platform': ' "Linux"',
        'Sec-Fetch-Dest': ' empty',
        'Sec-Fetch-Mode': ' cors',
        'Sec-Fetch-Site': ' same-site',
        'User-Agent': ' Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.15'
    }
}
