
interface UserLogin {
    code: string | null;
    passwd: string | null;
}


interface ResponseBean {
    code: number;
    message: string | null;
    data: object | null | any;
}


interface BaseTable {
    insertYmd: string | null;//
    insertId: string | null;//
    updateYmd: string | null;//
    updateId: string | null;//
    remark: string | null;//
    remark1: string | null;//
    remark2: string | null;//
    remark3: string | null;//
    remark4: string | null;//
    remark5: string | null;//
    effective: number;//
    updateFlag: number;//
}

interface UserInfo extends BaseTable {
    id: string | null;

    nickName: string | null;

    avatarImg: string | null;

    passwd: string | null;

    email: string | null;

    birthday: string | null;

    gender: number | null;

    position: string | null;

    deptId: string | null;

    code: string | null;

    passwdUpdateYmd: string | null;
}

interface QueryParam {
    pageNum: number;
    pageSize: number;
}

enum FormType {
    datePicker, dateTimePicker, input, inputNumber, radio, select, switch
}

interface Option {
    value:number|string|any,
    label:string|null
}

interface FormField {
    type: FormType;
    label: string;
    vmodel: string ;
    option: Option[]|any;
    readonly: boolean | null;
}

interface MenuModel {
    icon?: string | any,
    index: string | any,
    title: string | any,
    subs?: MenuModel[]
}

interface TableColumn {
    prop: string,
    label: string | null,
    formatter?: string | Function,
    isshow: boolean,
    type?: undefined|TableColumnType,
    btnfn?: Function
}
enum TableColumnType {
    text, btn
}
export type {QueryParam, TableColumn, MenuModel, FormField, UserLogin, UserInfo, ResponseBean,Option}
export {FormType,TableColumnType}