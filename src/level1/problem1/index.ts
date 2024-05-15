export type Value = string | number | boolean | null | undefined |
    Date | Buffer | Map<unknown, unknown> | Set<unknown> |
    Array<Value> | { [key: string]: Value };

/**
 * Transforms JavaScript scalars and objects into JSON
 * compatible objects.
 */
export function serialize(value: Value): unknown {
    // check null
    if (value === null) {
        return null;
    } 
    
    // check object
    if (typeof value !== "object") {
        return value;
    }

    // check array
    if (Array.isArray(value)) {
        return value.map(serialize);
    } 
    
    // check date
    if (value instanceof Date) {
        return { __t: "Date", __v: value.getTime() };
    }
    
    // check buffer
    if (Buffer.isBuffer(value)) {
        return {
            __t: "Buffer",
            __v: Array.from(value),
        };
    }
    
    // check set type
    if (value instanceof Set) {
        return { __t: 'Set', __v: Array.from(value).map(serialize) };
    }
    
    // check map type
    if (value instanceof Map) {
        const serializedMap: any[] = [];
        value.forEach((val: Value, key: Value) => {
            serializedMap.push([serialize(key), serialize(val)]);
        });
        return {
            __t: "Map",
            __v: serializedMap
        };
    }
    
    // serialize last case
    const newObj: any = {};
    for (const key in value) {
        newObj[key] = serialize(value[key]);
    }
    return newObj;
}

/**
 * Transforms JSON compatible scalars and objects into JavaScript
 * scalar and objects.
 */
export function deserialize<T = unknown>(value: unknown): T {
    // check null or object
    if (value === null || typeof value !== 'object') {
        return value as T;
    } 
    
    // check array types
    if (Array.isArray(value)) {
        return value.map(deserialize) as T;
    }
    
    // default operation
    const keys = Object.keys(value);
    if (keys.length === 2 && '__t' in value && '__v' in value) {
        let v: any = null;
        switch (value["__t"]) {
            case "Buffer":
                return Buffer.from(value["__v"] as string) as T;
            case "Date":
                return new Date(value["__v"] as number) as T;
            case "Set":
                v = value["__v"] as any;
                return new Set(v.map(deserialize)) as T;
            case "Map":
                v = value['__v'] as any;
                const map = new Map();
                for (const [key, val] of v) {
                    map.set(deserialize(key), deserialize(val));
                }
                return map as T;
            default:
                break;
        }
    }

    // deserialize last case
    const newObj: any = {};
    for (const key in value) {
        newObj[key] = deserialize(value[key]);
    }
    return newObj;
}
