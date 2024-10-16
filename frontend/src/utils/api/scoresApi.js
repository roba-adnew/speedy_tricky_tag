const domain = import.meta.env.ENV === 'DEV' ? 
    import.meta.env.VITE_API_DEV_URL : import.meta.env.VITE_API_PROD_URL;

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

async function getScoreboard() {
    const url = `${base_url}/scoreboard`;

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

async function submitScore(gamerTag) {
    const url = `${base_url}/submit`;
    const options = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ gamerTag }),
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Upload failed");
        }
        return response.json();
    } catch (err) {
        console.error("score submission error:", err);
        throw err;
    }
}

export { getFinalScores, getScoreboard, submitScore };
