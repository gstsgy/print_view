import {ElNotification} from "element-plus";
import {LineElement} from "./model";

const createLineView=(line:LineElement)=>{
    ElNotification({
        title: '线段',
        dangerouslyUseHTMLString: true,
        message: '<strong>This is <i>HTML</i> string</strong>',
    })
}
