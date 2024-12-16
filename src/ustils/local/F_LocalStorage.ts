enum KEY_LOCAL {
    TOKEN = "TOKEN"
}


const saveToLocalStorage = <T>(key: string, value: T): void => {
    try {
        const data = JSON.stringify(value);
        localStorage.setItem(key, data);
    } catch (error) {
        console.error('Lỗi khi lưu vào local:', error);
    }
};


const getFromLocalStorage = <T>(key: string): T | null => {
    try {
        const data = localStorage.getItem(key);
        if (data === null) return null;
        return JSON.parse(data) as T;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu local: ', error);
        return null;
    }
};

const removeFromLocalStorage = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Lỗi khi xóa dữ liệu local: ', error);
    }
};

export {
    saveToLocalStorage,
    getFromLocalStorage,
    removeFromLocalStorage,
    KEY_LOCAL
}