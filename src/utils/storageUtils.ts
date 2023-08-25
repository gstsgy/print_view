// localStorage 操作


export const saveData = (key: string | null, value: string | null) => {
    if (key !== null && value !== null) {
        localStorage.setItem(key, value);
    }
}

export const getData = (key: string) => {
    return localStorage.getItem(key);
}

export const saveDataS = (key: string | null, value: string | null) => {
    if (key !== null && value !== null) {
        sessionStorage.setItem(key, value);
    }
}

export const getDataS = (key: string) => {
    return sessionStorage.getItem(key);
}
export const clear = () => {
     sessionStorage.clear();
}