import CryptoJS from 'crypto-js';

const secretkey = import.meta.env.VITE_SECRETKEY

export const encrypt = (data) => {
    try {
        const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);
        const encrypted = CryptoJS.AES.encrypt(dataString, secretkey);
        return encrypted.toString();
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
};

export const decrypt = (encryptedString) => {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedString, secretkey);
        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        try {
            return JSON.parse(decryptedString);
        } catch {
            return decryptedString;
        }
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
};