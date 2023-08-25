import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig, AxiosRequestHeaders} from 'axios';
import {ElMessage,ElLoading, LoadingParentElement} from "element-plus";
import {ResponseBean} from "../api/interface";
import {ComponentOptionsBase, ComponentPublicInstance, reactive, Ref} from "vue";
import {getDataS} from "./storageUtils";

const service: AxiosInstance = axios.create({
    timeout: 5000
});
let loadingInstance: { close: any; setText?: (text: string) => void; removeElLoadingChild?: () => void; handleAfterLeave?: () => void; vm?: ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>>; $el?: HTMLElement; originalPosition?: Ref<string>; originalOverflow?: Ref<string>; visible?: Ref<boolean>; parent?: Ref<LoadingParentElement>; background?: Ref<string>; svg?: Ref<string>; svgViewBox?: Ref<string>; spinner?: Ref<string | boolean>; text?: Ref<string>; fullscreen?: Ref<boolean>; lock?: Ref<boolean>; customClass?: Ref<string>; target?: Ref<HTMLElement>; beforeClose?: Ref<(() => boolean) | undefined> | undefined; closed?: Ref<(() => void) | undefined> | undefined; } | null = null;
service.interceptors.request.use(

    (config: AxiosRequestConfig) => {
        // @ts-ignore
        config.baseURL =globlConfig.baseUrl;
        let token = getDataS("token")
        if(token!==null){
            if (config.headers) {
                config.headers.token = token
            }
        }
       // 过滤’’的参数
        // 将参数中的空属性过滤掉
        let params = config.params;
        let newparam = {};
        for (let i in params) {
            if (config.method == "get" && (params[i] == undefined || params[i] == null || (typeof params[i] == "string" && params[i].trim() == ""))) {
                continue;
            }
            // @ts-ignore
            newparam[i] = params[i]
        }
        config.params = newparam;
        //loadingInstance = ElLoading.service({ fullscreen: true })
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        // @ts-ignore
       // loadingInstance.close()
        if (response.status === 200) {
            const res = reactive<ResponseBean>(response.data);
            if (res.code !== 200) {
                // @ts-ignore
                ElMessage.error(res.message);
            }
            return res;
        } else {
            ElMessage.error(`请求后台报错：${response.status}`);
            //Promise.reject();
        }


    },
    (error: AxiosError) => {
        // @ts-ignore
        //loadingInstance.close()
        ElMessage.error(`请求后台报错：${error}`);
       // return Promise.reject();
    }
);

export default service;
