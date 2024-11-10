import JSEncrypt from 'jsencrypt';

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
INSERT PUBLIC KEY HERE
-----END PUBLIC KEY-----`;

export const encryptData = (data) => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(PUBLIC_KEY);
    return encrypt.encrypt(data);
};
