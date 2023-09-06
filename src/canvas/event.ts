import {CanvasImpl} from "./canvas";
import {ImageElement, LineElement, TextElement, Point, Vect} from "./model";

const drag = (event_1, cav: CanvasImpl) => {
    event_1 = window.event || event_1;
    if(event_1.button===2){
        // 鼠标右键
        if(cav.activationElement){
            console.log(cav.activationElement)
        }
    }
    if (event_1.button === 0) {
        // // 鼠标左键
        let lx = event_1.clientX;
        let ly = event_1.clientY;
        let la = cav.transX;
        let lb = cav.transY;
        cav.canvas.onmousemove = null;
        let sourceEle = cav.activationElement === null ? null : JSON.parse(JSON.stringify(cav.activationElement));
        cav.canvas.onmousemove = (event_2) => {
            let fx = event_2.clientX;
            let fy = event_2.clientY;
            if (cav.activationElement === null) {
                cav.transX = la - (lx - fx);
                cav.transY = lb - (ly - fy);
            } else {
                if (cav.activationElement.type === 1) {
                    const line = cav.activationElement as LineElement;
                    const sourceLine = sourceEle as LineElement;
                    line.startX = sourceLine.startX - (lx - fx)
                    line.startY = sourceLine.startY - (ly - fy)
                    line.endX = sourceLine.endX - (lx - fx)
                    line.endY = sourceLine.endY - (ly - fy)
                } else if (cav.activationElement.type === 2) {
                    const text = cav.activationElement as TextElement;
                    text.startX = sourceEle.startX - (lx - fx)
                    text.startY = sourceEle.startY - (ly - fy)
                } else if (cav.activationElement.type === 3 || cav.activationElement.type === 4) {
                    const text = cav.activationElement as TextElement;
                    text.startX = sourceEle.startX - (lx - fx)
                    text.startY = sourceEle.startY - (ly - fy)
                }
            }

            cav.draw();
        };

        cav.canvas.onmouseup = () => {
            cav.canvas.onmousemove = null;
            cav.canvas.onmouseup = null;
            cav.canvas.onmousemove = (event) => {
                moveEvent.call(cav, event, cav);
            }
        }
    }

}
const mousewheel = (event, cav: CanvasImpl) => {
    event = event || window.event;
    let lm = cav.mul;
    let li = event.clientX;
    let lj = event.clientY;
    if (event.wheelDelta < 0 || event.detail > 0) {
        cav.mul = cav.mul - 0.05;
        if (cav.mul > 20) {
            cav.mul = 20;
            return;
        }
    } else {
        cav.mul = cav.mul + 0.05;
        if (cav.mul < -20) {
            cav.mul = -20;
            return;
        }
    }
    // if(cav.mul > 0) {
    //     if(lm > 0) {
    //         cav.transX = ((cav.transX + li) * lm / cav.mul) - li;
    //         cav.transY = ((cav.transY + lj) * lm / cav.mul) - lj;
    //     }
    // } else {
    //     let tmpmul = Math.abs(cav.mul - 1);
    //     if(lm <= 0) {
    //         let tmp = Math.abs(lm - 1);
    //         cav.transX = (((cav.transX + li) / tmp) * tmpmul) - li;
    //         cav.transY = (((cav.transY + lj) / tmp) * tmpmul) - lj;
    //     }
    // }
    cav.draw();
}
const moveEvent = (event_1, cav: CanvasImpl) => {
    event_1 = window.event || event_1;
    let i = event_1.offsetX;
    let j = event_1.offsetY;
    i = (i - cav.transX) / cav.mul
    j = (j - cav.transY) / cav.mul
    let isFind = false;
    // 先找图片文字
    cav.data.forEach(ele => {
        if (ele.type === 2) {
            const text = ele as TextElement;

            let width = cav.ctx.measureText(text.value).width;
            let height = parseInt(cav.ctx.font) * 1.1;

            if (i > text.startX && i < text.startX + width && j > text.startY - height && j < text.startY) {
                isFind = true;
                cav.activationElement = text
                return
            }

        } else if (ele.type === 3 || ele.type === 4) {
            const img = ele as ImageElement;
            if (i > img.startX && i < img.startX + img.width && j > img.startY && j < img.startY + img.height) {
                isFind = true;
                cav.activationElement = img
                return
            }
        }
    })
    if (!isFind) {
        // 如果没找到再找线段
        cav.data.forEach(ele => {
            if (ele.type === 1) {
                const line = ele as LineElement;
                const A = new Point(line.startX, line.startY)
                const B = new Point(line.endX, line.endY)
                const P = new Point(i, j)
                const dis = getDis(A, B, P)
                if (dis < 5) {
                    isFind = true;
                    cav.activationElement = line;
                    return
                }
            }
        })
    }
    if (!isFind) {
        if (cav.activationElement === null) {
            return
        }
        cav.activationElement = null
    }

    cav.draw()
    //console.log(cav.activationElement)
}


//点到线段最近的距离 P 到 A，B的距离
// A B 为线段两个端点
// p为点
function getDis(A, B, P) {
    let vAB = new Vect(A, B);
    let vAP = new Vect(A, P);
    let vBP = new Vect(B, P);
    let pj = vAB.vdm(vAP) / vAB.nor;
    if (pj < 0) {
        return vAP.nor;
    } else if (pj > vAB.nor) {
        return vBP.nor;
    } else {
        return Math.sqrt(vAP.nor * vAP.nor - pj * pj);
    }
}


export {drag, mousewheel, moveEvent}
