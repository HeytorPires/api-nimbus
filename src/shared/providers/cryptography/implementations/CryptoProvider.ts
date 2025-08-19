import crypto from 'crypto';
import { ICryptographyProvider } from '../models/ICryptographyProvider';

export default class BcryptHashProvider implements ICryptographyProvider {
    private algorithm = "aes-256-cbc";
    private secretKey = crypto.randomBytes(32);

    public async encrypt(payload: string): Promise<{ iv: string; content: string }> {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
        const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
        return { iv: iv.toString("hex"), content: encrypted.toString("hex") };
    }

    public async decrypt(payload: { iv: string; content: string }): Promise<string> {
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.secretKey,
            Buffer.from(payload.iv, "hex")
        );
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(payload.content, "hex")),
            decipher.final()
        ]);
        return decrypted.toString("utf8");
    }
}
