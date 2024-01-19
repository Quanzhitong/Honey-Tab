export function extractDomain(url: string | undefined): string | undefined {
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

export function orderBy<T>(
    array: T[],
    callback: (e: T) => number | string | undefined,
    reverse = false,
): T[] {
    const arrayCopy = [...array];

    return arrayCopy.sort((a, b) => {
        const aValue = callback(a);
        const bValue = callback(b);
        if (aValue === undefined && bValue === undefined) {
            return 0; // 相等
        }
        if (aValue === undefined) {
            return reverse ? 1 : -1; // b在前面
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return reverse ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return reverse ? bValue - aValue : aValue - bValue;
        }
        // 处理其他类型的比较（暂时不支持其他类型）
        throw new Error('Unsupported type for sorting.');
    });
}
