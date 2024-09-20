import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
if (!process.env.SB_API_URL || !process.env.SB_API_KEY) {
    console.error(
        "Error: Supabase URL or API key is missing. \
        Please check your .env file."
    );
    process.exit(1);
}

const prisma = new PrismaClient();
const supabase = createClient(process.env.SB_API_URL, process.env.SB_API_KEY);

async function clearSupabaseAndPostgres() {
    try {
        const imageDeletion = await prisma.image.deleteMany();
        const scoreboardDeletion = await prisma.score.deleteMany();

        const { data: listData, error: listError } = await supabase.storage
            .from("images")
            .list("public");

        if (listError) console.error("supabase listing error", listError);

        let imageList: string[] = [];
        if (listData) {
            listData.forEach((image: { name: string }) => {
                if (image.name !== ".emptyFolderPlaceholder")
                    imageList.push(image.name);
            });
        }

        let deletionData: any[] = [];
        imageList.forEach(async (image) => {
            const { data: deleteData, error: deleteError } =
                await supabase.storage
                    .from("images")
                    .remove(imageList.map((image) => `public/${image}`));

            if (deleteError)
                console.error("supabase deleting error", deleteError);
        });

        console.log(
            "images deleted",
            imageDeletion,
            "scoreboard deleted",
            scoreboardDeletion,
            "supabase deletion",
            deletionData
        );
    } catch (err) {
        console.error(err);
    }
}

async function selectAll() {
    const images = await prisma.image.findMany();
    const scores = await prisma.score.findMany();
    console.log("images:", JSON.stringify(images, null, 2));
    console.log("scores:", scores);
}

selectAll()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
