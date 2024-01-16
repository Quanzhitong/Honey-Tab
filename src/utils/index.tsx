export function extractDomain(url: string | undefined) {
    if (!url) return;
    const urlObject = new URL(url);
    return urlObject.hostname;
}

export function groupBy<T, K>(
    array: T[],
    callback: ((e: T, i: number) => K) | keyof T,
): Map<K, T[]> {
    return array.reduce((newMap, e, i) => {
        const keyData = typeof callback === 'function' ? callback(e, i) : e[callback];
        const key = keyData as K;
        const value = newMap.get(key);

        if (value === undefined) {
            newMap.set(key, [e]);
        } else {
            value.push(e);
        }
        return newMap;
    }, new Map<K, T[]>());
}
