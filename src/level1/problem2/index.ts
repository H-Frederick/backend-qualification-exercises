import * as crypto from 'crypto';

let count: number = 0;
let randomByte: Buffer | null = null;

export class ObjectId {
    private data: Buffer;

    constructor(type: number, timestamp: number) {
        // create type
        const typeByte = Buffer.alloc(1);
        typeByte.writeUInt8(type);

        // create random
        if (!randomByte) {
            randomByte = crypto.randomBytes(4);
        }

        // create timestamp
        const timestampByte = Buffer.alloc(6);
        for (let i = 5; i >= 0; i--) {
            timestampByte.writeUInt8((timestamp >> (i * 8)) & 0xFF, i);
        }

        // create counter
        const counterByte = Buffer.alloc(3);
        for (let i = 2; i >= 0; i--) {
            counterByte.writeUInt8((count >> (i * 8)) & 0xFF, i);
        }
        count += 1;

        this.data = Buffer.concat([typeByte, timestampByte, randomByte, counterByte]);
    }

    static generate(type?: number): ObjectId {
        return new ObjectId(type ?? 0, Date.now());
    }

    toString(encoding?: 'hex' | 'base64'): string {
        return this.data.toString(encoding ?? 'hex');
    }
}