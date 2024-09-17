require("dotenv").config();
const debug = require("debug")("backend:data");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const prisma = new PrismaClient();
const supabase = createClient(process.env.SB_API_URL, process.env.SB_API_KEY);

exports.downloadImage = async (req, res, next) => {
    debug("image request body: %O", req.body);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Image name is required" });
    }
    try {
        const { data, error } = await supabase.storage
            .from("images")
            .download(`public/${name}`);

        if (error) {
            debug("Error downloading from Supabase:", error);
            return res.status(500).json({ error: "Failed to download file" });
        }

        const fileBuffer = Buffer.from(await data.arrayBuffer());

        debug("sb data raw:%O", data);
        debug("buffer from file object:%O", fileBuffer);
        debug("type:", data.type);

        res.setHeader("Content-Type", data.type);
        res.setHeader("Content-Disposition", `inline; filename="${name}"`);

        return res.send(fileBuffer);
    } catch (err) {
        debug("unexpected error", err);
    }
};

exports.getImageMeta = async (req, res, next) => {
    debug("image request body: %O", req.body);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Image name is required" });
    }

    try {
        const imageMetaRaw = await prisma.image.findFirst({
            where: { name: name },
        });
        const imageMeta = JSON.stringify(imageMetaRaw, null, 1);
        debug("prisma results:", imageMeta);

        return res.json(imageMetaRaw);
    } catch (err) {
        debug("unexpected error", err);
    }
};
