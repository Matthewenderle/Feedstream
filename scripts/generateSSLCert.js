import selfSigned from 'openssl-self-signed-certificate';
import path from 'path';
import fs from 'fs';

const certDir = path.resolve('./certs');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

fs.writeFileSync(path.join(certDir, 'key.pem'), selfSigned.key);
fs.writeFileSync(path.join(certDir, 'cert.pem'), selfSigned.cert);

console.log('SSL certificate generated successfully');
