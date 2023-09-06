import {Element, LineElement, TextElement, ImageElement, BarcodeElement, ElementType, Model} from './model';
import {drag, mousewheel, moveEvent} from './event'


class CanvasImpl {
    mul: number;
    transX: number;
    transY: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    elements: Element[];
    model: Model |null;
    activationElement: Element | null;
    private textArr: any[] | undefined;

    constructor(mul = 1,) {
        this.mul = mul;// 缩放率 默认为1
        this.transX = 0;
        this.transY = 0;
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.model = null;
        this.elements = []
        this.init();
        this.activationElement = null;
    }

    init() {
        this.canvas.setAttribute('style', `
    						background-color:#e6e6e6;
    						cursor:url(shou.ico),auto;
                                        `);
        this.canvas.setAttribute("width", "600");
        this.canvas.setAttribute("height", "400");
        //屏蔽官方的右键菜单
        this.canvas.oncontextmenu = function () {
            return false;
        }
        this.canvas.onmousedown = (event) => {
            drag.call(this, event, this);
        }
        this.canvas.onmousemove = (event) => {
            moveEvent.call(this, event, this);
        }
        if (this.canvas.addEventListener) {
            this.canvas.addEventListener('DOMMouseScroll', (event) => {
                mousewheel.call(this, event, this);
            }, false);
            this.canvas.addEventListener('mousewheel', (event) => {
                mousewheel.call(this, event, this);
            }, false);
        }
        this.draw();
    }

    showModel(model: Model, elements: Element[]) {
        this.elements = elements
        this.model = model
        this.draw()
    }

    draw() {
        this.ctx.strokeStyle = "#000000"
        this.ctx.lineWidth = 1
        //this.textArr = [];
        // @ts-ignore
        this.ctx.clearRect(0, 0, 600, 400);
        if(!this.model){
           return
        }
        // 画轮廓

        this.ctx.beginPath();
        this.ctx.setLineDash([5, 4]);
        this.ctx.moveTo(this.transX, this.transY);
        this.ctx.lineTo(this.model.width * this.mul + this.transX, this.transY);
        this.ctx.lineTo(this.model.width * this.mul + this.transX, this.model.height * this.mul + this.transY);
        this.ctx.lineTo(this.transX, this.model.height * this.mul + this.transY);
        this.ctx.closePath();
        this.ctx.stroke();

        // 画
        this.ctx.setLineDash([]);
        for (let ele of this.elements) {
            if (ele.type === 1) {
                const line = ele as LineElement;
                this.ctx.beginPath();
                this.ctx.moveTo(line.startX * this.mul + this.transX, line.startY * this.mul + this.transY);
                this.ctx.lineTo(line.endX * this.mul + this.transX, line.endY * this.mul + this.transY);
                this.ctx.closePath();
                this.ctx.stroke();
            } else if (ele.type === 2) {
                const text = ele as TextElement;
                this.ctx.fillText(text.value, text.startX * this.mul + this.transX, text.startY * this.mul + this.transY);
            } else if (ele.type === 3 || ele.type === 4) {
                const img = ele as ImageElement;
                this.ctx.strokeRect(img.startX * this.mul + this.transX, img.startY * this.mul + this.transY, img.width * this.mul, img.height * this.mul)
            }
        }

        if (this.activationElement) {
            this.ctx.strokeStyle = "#08aa50"
            this.ctx.lineWidth = 5
            if (this.activationElement.type === 1) {
                const line = this.activationElement as LineElement;
                this.ctx.beginPath();
                this.ctx.moveTo(line.startX * this.mul + this.transX, line.startY * this.mul + this.transY);
                this.ctx.lineTo(line.endX * this.mul + this.transX, line.endY * this.mul + this.transY);
                this.ctx.closePath();
                this.ctx.stroke();
            } else if (this.activationElement.type === 2) {
                const text = this.activationElement as TextElement;
                this.ctx.fillText(text.value, text.startX * this.mul + this.transX, text.startY * this.mul + this.transY);
            } else if (this.activationElement.type === 3 || this.activationElement.type === 4) {
                const img = this.activationElement as ImageElement;
                this.ctx.strokeRect(img.startX * this.mul + this.transX, img.startY * this.mul + this.transY, img.width * this.mul, img.height * this.mul)
            }
        }


    }


}


export {CanvasImpl}
