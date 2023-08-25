interface Element {
    id: string;
    readonly modelId: string;
    readonly name?: string | null;
    startX: number;
    startY: number;
    readonly type: ElementType;
}

interface LineElement extends Element {
    endX: number;
    endY: number;
}

interface TextElement extends Element {
    value: string;
    fontName?: string | null;
    fontStyle?: number;
    size?: number;
}

interface ImageElement extends Element {
    path: string;
    width: number;
    height: number;
}

interface BarcodeElement extends Element {
    value:string;
    width: number;
    height: number;
}
enum ElementType{
    LINE= 1,
    TEXT=2,
    IMG= 3,
    BARCODE= 4
}

/**
 * 定义一个三维点
 */
class Point{
    x:number;
    y:number;
    z:number;
    constructor(x,y) {
        this.x =x;
        this.y = y;
        this.z = 0;
    }
    // 变换
    zoom(mul) {
        if(mul > 0) {
            this.x /= mul;
            this.y /= mul;
        } else {
            let tmpmul = Math.abs(mul - 1);
            this.x *= tmpmul;
            this.y *= tmpmul;
        }
    }
    compute(x, y) {
        this.x -= x;
        this.y -= y;
    }
    rotate(angle) {
        const tmp = this.x;
        this.x = tmp * Math.cos(angle) + this.y * Math.sin(angle);
        this.y = -tmp * Math.sin(angle) + this.y * Math.cos(angle);
    }
    getDis(z) {
        return Math.sqrt((z.x - this.x) * (z.x - this.x) + (z.y - this.y) * (z.y - this.y));
    }
    cos(z) {
        if(this.getDis(z) === 0) {
            return 0;
        }
        return(z.x - this.x) / this.getDis(z);
    }
    sin(z) {
        if(this.getDis(z) === 0) {
            return 0;
        }
        return(z.y - this.y) / this.getDis(z);
    }
    round(){
        this.x = Math.round(this.x*100)/100;
        this.y = Math.round(this.y*100)/100;
        this.z = Math.round(this.z*100)/100;
    }
}
class Vect {
    hor:number; //
    ver:number;
    zor:number;
    nor:number;// 向量模
    constructor(z1:Point, z2:Point) {
        this.hor = z2.x - z1.x;
        this.ver = z2.y - z1.y;
        this.zor = z2.z - z1.z;
        //向量的模（平面）
        this.nor = Math.sqrt(this.hor * this.hor + this.ver * this.ver);
    }
    //两个向量的点积
    vdm(v) {
        return this.hor * v.hor + this.ver * v.ver;
    }
    //两个向量的叉积
    vcp(v) {
        return this.hor * v.ver - this.ver * v.hor;
    }
}
export type {Element, LineElement, TextElement, ImageElement, BarcodeElement}
export {ElementType,Point,Vect}
