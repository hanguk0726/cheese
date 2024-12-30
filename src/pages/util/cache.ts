const CACHE_KEY = "categoryImageMap";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day (in milliseconds)

// Load cached data
function loadCache(): Record<string, string> | null {
    if (typeof localStorage === "undefined") {
        console.log("Local storage is not supported - Load failed");
        return {}; // Prevent server-side execution
    }
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) {
        console.log("No cached data found - Load failed");
        return null;
    }

    try {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp > CACHE_TTL) {
            localStorage.removeItem(CACHE_KEY); // Remove if expired
            console.log("Cache has expired - Load failed");
            return null;
        }
        console.log("Cache data loaded successfully");
        return data;
    } catch (error) {
        console.error("Error parsing cached data - Load failed:", error);
        return null;
    }
}

// Save cached data
function saveCache(data: Record<string, string>): void {
    if (typeof localStorage !== "undefined") {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
            console.log("Cache data saved successfully");
        } catch (error) {
            console.error("Error saving cache data - Save failed:", error);
        }
    } else {
        console.log("Local storage is not supported - Save failed");
    }
}

export { loadCache, saveCache };