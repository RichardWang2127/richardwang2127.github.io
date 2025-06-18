const FONT_VERSION = '250617';
const FONT_CHI = `assets/fonts/subset${FONT_VERSION}chi.woff2`;
const FONT_ENG = `assets/fonts/subset${FONT_VERSION}eng.woff2`;

const DB_NAME = 'font-db-v2';
const STORE_NAME = 'fonts';

const KEYS = {
    chiFont: 'font-chi',
    engFont: 'font-eng',
    version: 'font-version'
};

async function safeFetchFont(url) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const blob = new Blob([new Uint8Array(buffer)], { type: 'font/woff2' }); // 显式设置 MIME
    return blob;
}

(async function loadFonts() {
    const db = await openDB();

    const currentVersion = await getFromStore(db, KEYS.version);
    const chiBlob = await getFromStore(db, KEYS.chiFont);
    const engBlob = await getFromStore(db, KEYS.engFont);

    // 是否需要更新字体
    const needsUpdate = currentVersion !== FONT_VERSION || !chiBlob || !engBlob;

    let finalChiBlob = await safeFetchFont(FONT_CHI);
    let finalEngBlob = await safeFetchFont(FONT_ENG);

    if (needsUpdate) {
    console.log("字体更新中...");
    finalChiBlob = await fetch(FONT_CHI).then(r => r.blob());
    finalEngBlob = await fetch(FONT_ENG).then(r => r.blob());

    await putToStore(db, KEYS.chiFont, finalChiBlob);
    await putToStore(db, KEYS.engFont, finalEngBlob);
    await putToStore(db, KEYS.version, FONT_VERSION);
    } else {
    console.log("使用缓存字体");
    }

    // 应用字体
    const chiUrl = URL.createObjectURL(finalChiBlob);
    const engUrl = URL.createObjectURL(finalEngBlob);

    const chiFont = new FontFace('MyChineseFont', `url(${chiUrl})`);
    const engFont = new FontFace('MyEnglishFont', `url(${engUrl})`);

    await chiFont.load();
    await engFont.load();

    document.fonts.add(chiFont);
    document.fonts.add(engFont);

    // 中文字体放前面，英文字体做 fallback
    document.querySelector('body').style.fontFamily = `'MyChineseFont', 'MyEnglishFont', sans-serif`;
})();

// 打开数据库
function openDB() {
    return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
        }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    });
}

// 存储内容
function putToStore(db, key, value) {
    return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(value, key);
    tx.oncomplete = () => resolve();
    });
}

// 读取内容
function getFromStore(db, key) {
    return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
    });
}