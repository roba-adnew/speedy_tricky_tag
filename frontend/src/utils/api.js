const domain =
    import.meta.env.VITE_API_DEV_URL || import.meta.env.VITE_API_PROD_URL;
const base_url = `${domain}/images`;

async function getImageDetails(fileName) {
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
        console.error("file details retrieval error:", err);
        throw err;
    }
}

export { getImageDetails };
