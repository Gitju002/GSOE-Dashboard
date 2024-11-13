import NodeCache from "node-cache";

export const caches = new NodeCache({
    stdTTL: parseInt(process.env.CACHE_TTL),
    checkperiod: 60,
    useClones: false,
});
