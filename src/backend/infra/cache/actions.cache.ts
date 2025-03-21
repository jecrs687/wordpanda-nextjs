interface CacheItem {
    value: any;
    expiry: number;
}

// Global cache storage
const cacheStore: Map<string, CacheItem> = new Map();

/**
 * Generate a cache key from function name and arguments
 */
const generateCacheKey = (target: any, propertyKey: string, args: any[]): string => {
    return `${target.constructor.name}.${propertyKey}(${JSON.stringify(args)})`;
};

/**
 * Decorator factory for caching function results with TTL
 * @param ttl Time to live in milliseconds
 */
export function Cacheable(ttl: number = 60000) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const cacheKey = generateCacheKey(target, propertyKey, args);
            const currentTime = Date.now();

            // Check if we have a valid cache entry
            if (cacheStore.has(cacheKey)) {
                const cacheItem = cacheStore.get(cacheKey)!;
                if (currentTime < cacheItem.expiry) {
                    return cacheItem.value;
                }
                // Remove expired cache
                cacheStore.delete(cacheKey);
            }

            // Execute the original method
            const result = originalMethod.apply(this, args);

            // Handle promises
            if (result instanceof Promise) {
                return result.then((value) => {
                    cacheStore.set(cacheKey, {
                        value,
                        expiry: currentTime + ttl,
                    });
                    return value;
                });
            }

            // Cache the result
            cacheStore.set(cacheKey, {
                value: result,
                expiry: currentTime + ttl,
            });

            return result;
        };

        return descriptor;
    };
}

/**
 * Invalidate cache for a specific function and arguments
 * @param target Class instance or constructor
 * @param methodName Method name
 * @param args Arguments to match (optional)
 */
export function invalidateCache(
    target: any,
    methodName: string,
    args?: any[]
): void {
    const targetName = target.constructor?.name || target.name;

    if (args) {
        // Invalidate specific method call with these args
        const cacheKey = `${targetName}.${methodName}(${JSON.stringify(args)})`;
        cacheStore.delete(cacheKey);
    } else {
        // Invalidate all calls to this method
        const keyPattern = `${targetName}.${methodName}`;
        for (const key of cacheStore.keys()) {
            if (key.startsWith(keyPattern)) {
                cacheStore.delete(key);
            }
        }
    }
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
    cacheStore.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
    const stats = {
        totalEntries: cacheStore.size,
        activeEntries: 0,
        expiredEntries: 0,
    };

    const currentTime = Date.now();
    for (const item of cacheStore.values()) {
        if (currentTime < item.expiry) {
            stats.activeEntries++;
        } else {
            stats.expiredEntries++;
        }
    }

    return stats;
}

/**
 * Force cleanup of expired cache entries
 */
export function cleanupExpiredCache(): number {
    const currentTime = Date.now();
    let removedCount = 0;

    for (const [key, item] of cacheStore.entries()) {
        if (currentTime >= item.expiry) {
            cacheStore.delete(key);
            removedCount++;
        }
    }

    return removedCount;
}

/**
 * Decorator to mark a method that invalidates cache for another method
 * @param targetClass Class containing the method to invalidate
 * @param methodName Name of the method to invalidate
 */
export function InvalidatesCache(targetClass: any, methodName: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const result = originalMethod.apply(this, args);

            invalidateCache(targetClass, methodName);

            return result;
        };

        return descriptor;
    };
}