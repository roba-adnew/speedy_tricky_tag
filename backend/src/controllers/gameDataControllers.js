require("dotenv").config();
const debug = require("debug")("backend:data");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const prisma = new PrismaClient();
const supabase = createClient(process.env.SB_API_URL, process.env.SB_API_KEY);

exports.getImage = async (req, res, next) => {
    debug("image request body: %O", req.body);
    const { name } = req.body;

    try {
        const { data, error } = await supabase.storage
            .from("images")
            .download(`public/${name}`);

        if (error) {
            debug("Error downloading from Supabase:", error);
            return res.status(500).json({ error: "Failed to download file" });
        }

        const fileObject = new File([data], name);
        const fileBuffer1 = Buffer.from(await fileObject.arrayBuffer());

        const arrayBuffer = await data.arrayBuffer();
        const fileBuffer2 = Buffer.from(await arrayBuffer);

        debug("sb data raw:%O", data);
        debug("sb download file object:%O", fileObject);
        debug("buffer from file object:%O", fileBuffer1);
        debug("buffer from supabase directly:%O", fileBuffer2);
        debug('type:', data.type)
        
        res.setHeader("Content-Type", data.type);
        res.setHeader(
            "Content-Disposition",
            `inline; filename="${name}"`
        );

        return res.send(fileBuffer2);
    } catch (err) {
        debug("unexpected error downloading from supabase", err);
    }
};
