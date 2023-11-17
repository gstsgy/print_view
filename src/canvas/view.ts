import {ImageElement, LineElement, TextElement} from "./model";

const createDiv = (x,y)=>{
    const div = document.createElement("div");
    div.setAttribute('style', `background-color: pink;
				position: absolute;
				top:${y}px;
				left:${x}px;
				/*max-width:400px;*/
				min-width: 120px;
				z-index:1000;
				min-height: 67px;
				max-height: 225px;
				border-radius: 5%;
				overflow: hidden;
 				white-space: nowrap;
				text-overflow: ellipsis;
                                        `);
    document.body.appendChild(div);
    return div;
}
const createText = (div: HTMLDivElement, text: TextElement) => {
    let para = document.createElement("p");
    let node = document.createTextNode("类型 ：文本");
    para.setAttribute('style', `margin: 8px;
				text-align: left;
				font-size: 12px;
				color: grey;
				font-family: "微软雅黑" 微软雅黑;
				height: 12px;`);
    para.appendChild(node);
    div.appendChild(para)
    para = document.createElement("p");
    node = document.createTextNode(`开始坐标：x=${text.startX},y=${text.startY}`);
    para.setAttribute('style', `margin: 8px;
				text-align: left;
				font-size: 12px;
				color: grey;
				font-family: "微软雅黑" 微软雅黑;
				height: 12px;`);
    para.appendChild(node);
    div.appendChild(para)



    para = document.createElement("p");
    node = document.createTextNode(`文本值：${text.value}`);
    para.setAttribute('style', `margin: 8px;
				text-align: left;
				font-size: 12px;
				color: grey;
				font-family: "微软雅黑" 微软雅黑;
				height: 12px;`);
    para.appendChild(node);
    div.appendChild(para)
}
const createImg = (div: HTMLDivElement, img: ImageElement) => {
    let para = document.createElement("p");
    let node = document.createTextNode("类型 ：图片");
    para.setAttribute('style', `margin: 8px;
				text-align: left;
				font-size: 12px;
				color: grey;
				font-family: "微软雅黑" 微软雅黑;
				height: 12px;`);
    para.appendChild(node);
    div.appendChild(para)
    para = document.createElement("p");
    node = document.createTextNode(`开始坐标：x=${img.startX},y=${img.startY}`);
    para.setAttribute('style', `margin: 8px;
				text-align: left;
				font-size: 12px;
				color: grey;
				font-family: "微软雅黑" 微软雅黑;
				height: 12px;`);
    para.appendChild(node);
    div.appendChild(para)

    para = document.createElement("p");
    node = document.createTextNode(`宽度：${img.width},高度${img.height}`);
    para.setAttribute('style', `margin: 8px;
				text-align: left;
				font-size: 12px;
				color: grey;
				font-family: "微软雅黑" 微软雅黑;
				height: 12px;`);
    para.appendChild(node);
    div.appendChild(para)

    para = document.createElement("p");
    node = document.createTextNode(`图片路径：${img.path}`);
    para.setAttribute('style', `margin: 8px;
				text-align: left;
				font-size: 12px;
				color: grey;
				font-family: "微软雅黑" 微软雅黑;
				height: 12px;`);
    para.appendChild(node);
    div.appendChild(para)
}
const createLine = (div: HTMLDivElement, line: LineElement) => {
    let para = document.createElement("p");
    let node = document.createTextNode("类型" + " : " + "线段");
    para.setAttribute('style', `margin: 8px;
				text-align: left;
				font-size: 12px;
				color: grey;
				font-family: "微软雅黑" 微软雅黑;
				height: 12px;`);
    para.appendChild(node);
    div.appendChild(para)
    para = document.createElement("p");
    node = document.createTextNode(`开始坐标：x=${line.startX},y=${line.startY}`);
    para.setAttribute('style', `margin: 8px;
				text-align: left;
				font-size: 12px;
				color: grey;
				font-family: "微软雅黑" 微软雅黑;
				height: 12px;`);
    para.appendChild(node);
    div.appendChild(para)

    para = document.createElement("p");
    node = document.createTextNode(`结束坐标：x=${line.endX},y=${line.endY}`);
    para.setAttribute('style', `margin: 8px;
				text-align: left;
				font-size: 12px;
				color: grey;
				font-family: "微软雅黑" 微软雅黑;
				height: 12px;`);
    para.appendChild(node);
    div.appendChild(para)
}

export {createText, createImg, createLine,createDiv}
