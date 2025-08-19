export interface ICryptographyProvider {
    encrypt(payload: string): Promise<{ iv: string; content: string }>;
    decrypt(payload: { iv: string; content: string }): Promise<string>;
}
