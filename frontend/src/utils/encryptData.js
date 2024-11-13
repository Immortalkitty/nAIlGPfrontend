import JSEncrypt from 'jsencrypt';

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwaDPO7UO0RVMgwean7eY
XleJAdtldvHq54zNxT3UDmO3L77Zc5W6ubOHSeUwtRZBLBGRLFtsLRmFSFja1kC3
31IRqK+6kaCXL1m06fa6hWACH4VTWH7I+u+ZbBqQz5glPy6EHIGDhVLg9r2wMnll
HrDAh0RhX3lU7hpeHmnRF5Sz2uRtl8SUuqokryzze+nGtWjMRl/q55WDANgXp1pu
t/5V7Mb1Uo+Rjirz2C9KOSZC7JHi0TdhRrf2AxKIX16zd/k0KyxG+zfaAVuOWBB8
F0FrOW/fTsvO2fJf8pbntA8n9dJs9pEknogqFuZ1RoT3K/r+t24U7/UvVpPsjeqa
YwIDAQAB
-----END PUBLIC KEY-----`;

export const encryptData = (data) => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(PUBLIC_KEY);
    return encrypt.encrypt(data);
};
