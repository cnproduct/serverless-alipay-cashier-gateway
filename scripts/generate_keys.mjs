import crypto from 'crypto';

console.log('🔐 Generating RSA 2048-bit Key Pair for Alipay Gateway & Licensing...');

const keypair = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

console.log('--- RSA PRIVATE KEY (PKCS#8) ---');
console.log(keypair.privateKey);

console.log('--- RSA PUBLIC KEY (SPKI) ---');
console.log(keypair.publicKey);
