const domain =
    import.meta.env.VITE_API_DEV_URL || import.meta.env.VITE_API_PROD_URL;
const base_url = `${domain}/scores`;

async function getFinalScores() {
    const url = `${base_url}/get-scores`;

    const options = {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
    };

    try {
        const response = await fetch(url, options);
        const results = await response.json();
        return results;
    } catch (err) {
        console.error("tag check error:", err);
        throw err;
    }
}

export { getFinalScores };
