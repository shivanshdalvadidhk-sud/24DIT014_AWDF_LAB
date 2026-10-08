const NodeCache = require("node-cache");

// Initialize node-cache instance with a standard TTL of 60 seconds
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Hit and Miss counters for debug endpoint
let hitCount = 0;
let missCount = 0;

const recordHit = () => {
    hitCount++;
};

const recordMiss = () => {
    missCount++;
};

const getStats = () => {
    const total = hitCount + missCount;
    return {
        hits: hitCount,
        misses: missCount,
        totalRequests: total,
        hitRate: total > 0 ? `${((hitCount / total) * 100).toFixed(2)}%` : "0%",
        cachedKeysCount: cache.keys().length,
        cachedKeys: cache.keys(),
        nodeCacheStats: cache.getStats()
    };
};

const resetStats = () => {
    hitCount = 0;
    missCount = 0;
};

module.exports = {
    cache,
    recordHit,
    recordMiss,
    getStats,
    resetStats
};
