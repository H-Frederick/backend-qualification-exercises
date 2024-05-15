import { Mutex } from "async-mutex";

const mutex = new Mutex();

export class ExecutionCache<TInputs extends Array<unknown>, TOutput> {
    constructor(private readonly handler: (...args: TInputs) => Promise<TOutput>) { }
    private cache = new Map<string, TOutput>()

    async fire(key: string, ...args: TInputs): Promise<TOutput> {
        const release = await mutex.acquire();
        try {
            let cacheKey = JSON.stringify(key + args as string);
            let keyExists = this.cache.has(cacheKey);

            if (keyExists) {
                return this.cache.get(cacheKey)!;
            }

            let result = await this.handler(...args);
            this.cache.set(cacheKey, result);
            return result;

        } finally {
            release();
        }
    }
}
