const domain =
    import.meta.env.VITE_API_DEV_URL || import.meta.env.VITE_API_PROD_URL;
const base_url = `${domain}/images`;

async function getImageDetails(fileName) {
    console.log(base_url)
    const download_url = `${base_url}/download`;
    const details_url = `${base_url}/meta`;

    const options = {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ name: fileName }),
    };
    try {
        const downloadResponse = await fetch(download_url, options);
        const blob = await downloadResponse.blob();
        const content = URL.createObjectURL(blob);

        const detailsResponse = await fetch(details_url, options);
        const detailsResults = await detailsResponse.json();

        const file = {
            content: content,
            details: detailsResults,
        };

        return file;
    } catch (err) {
        console.error("image retrieval error:", err);
        throw err;
    }
}

async function startTimer() {
    const url = `${base_url}/start-timer`;

    const options = {
        method: "POST",
        credentials: "include",
    };

    try {
        const response = await fetch(url, options);
        const results = await response.json();
        return results;
    } catch (err) {
        console.error("timer commencement error:", err);
        throw err;
    }
}

async function stopTimer() {
    const url = `${base_url}/stop-timer`;

    const options = {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ signal: "stop" }),
    };

    try {
        const response = await fetch(url, options);
        const results = await response.json();
        return results;
    } catch (err) {
        console.error("timer commencement error:", err);
        throw err;
    }
}

async function getTime() {
    const url = `${base_url}/get-time`;

    const options = {
        method: "POST",
        credentials: "include",
    };

    try {
        const response = await fetch(url, options);
        const json = await response.json();
        return json.time;
    } catch (err) {
        console.error("timer retrieval error:", err);
        throw err;
    }
}

export { getImageDetails, startTimer, getTime, stopTimer };
