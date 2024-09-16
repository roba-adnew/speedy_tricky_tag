import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
const mime = require("mime-types");

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

type ImageData = {
    riddle1: string;
    riddle1Answer: string;
    riddle1Targets: Array<Array<{ x: number; y: number }>>;
    riddle2: string;
    riddle2Answer: string;
    riddle2Targets: Array<Array<{ x: number; y: number }>>;
    riddle3: string;
    riddle3Answer: string;
    riddle3Targets: Array<Array<{ x: number; y: number }>>;
    riddle4: string;
    riddle4Answer: string;
    riddle4Targets: Array<Array<{ x: number; y: number }>>;
    riddle5: string;
    riddle5Answer: string;
    riddle5Targets: Array<Array<{ x: number; y: number }>>;
    riddle6: string;
    riddle6Answer: string;
    riddle6Targets: Array<Array<{ x: number; y: number }>>;
    riddle7: string;
    riddle7Answer: string;
    riddle7Targets: Array<Array<{ x: number; y: number }>>;
};

type Targets = {
    [key: string]: ImageData;
};

const targets: Targets = {
    "flea_market.jpg": {
        riddle1: "face",
        riddle1Answer: "face",
        riddle1Targets: [
            [
                { x: 1017, y: 484 },
                { x: 1023, y: 612 },
                { x: 1191, y: 607 },
                { x: 1193, y: 494 },
            ],
        ],
        riddle2: "flashlight",
        riddle2Answer: "flashlight",
        riddle2Targets: [
            [
                { x: 1411, y: 1334 },
                { x: 1700, y: 1418 },
                { x: 1701, y: 1505 },
                { x: 1393, y: 1399 },
            ],
        ],
        riddle3: "trophy",
        riddle3Answer: "trophy",
        riddle3Targets: [
            [
                { x: 654, y: 991 },
                { x: 894, y: 1004 },
                { x: 824, y: 1177 },
                { x: 704, y: 1168 },
            ],
        ],
        riddle4: "helmet",
        riddle4Answer: "helmet",
        riddle4Targets: [
            [
                { x: 1973, y: 781 },
                { x: 1801, y: 609 },
                { x: 1985, y: 533 },
                { x: 2094, y: 732 },
            ],
        ],
        riddle5: "horse",
        riddle5Answer: "horse",
        riddle5Targets: [
            [
                { x: 1387, y: 1136 },
                { x: 1296, y: 987 },
                { x: 1636, y: 1085 },
                { x: 1635, y: 1272 },
            ],
        ],
        riddle6: "fannypack",
        riddle6Answer: "fannypack",
        riddle6Targets: [
            [
                { x: 1411, y: 1334 },
                { x: 1700, y: 1418 },
                { x: 1701, y: 1505 },
                { x: 1393, y: 1399 },
            ],
        ],
        riddle7: "shotglasses",
        riddle7Answer: "shotglasses",
        riddle7Targets: [
            [
                { x: 1215, y: 1087 },
                { x: 912, y: 1051 },
                { x: 914, y: 830 },
                { x: 1299, y: 885 },
            ],
        ],
    },
    "intersection.jpg": {
        riddle1: "lion",
        riddle1Answer: "lion",
        riddle1Targets: [
            [
                { x: 1094, y: 1231 },
                { x: 1076, y: 2024 },
                { x: 2013, y: 1674 },
                { x: 2021, y: 2292 },
            ],
            [
                { x: 2238, y: 1676 },
                { x: 2393, y: 1684 },
                { x: 2232, y: 2525 },
                { x: 2401, y: 2524 },
            ],
        ],
        riddle2: "prudential",
        riddle2Answer: "prudential",
        riddle2Targets: [
            [
                { x: 3552, y: 999 },
                { x: 3547, y: 654 },
                { x: 3860, y: 689 },
                { x: 3969, y: 987 },
            ],
        ],
        riddle3: "campaign",
        riddle3Answer: "campaign",
        riddle3Targets: [
            [
                { x: 5511, y: 2908 },
                { x: 5779, y: 2019 },
                { x: 5755, y: 1801 },
                { x: 5517, y: 1955 },
            ],
        ],
        riddle4: "times",
        riddle4Answer: "times",
        riddle4Targets: [
            [
                { x: 2674, y: 1320 },
                { x: 2672, y: 874 },
                { x: 2553, y: 888 },
                { x: 2540, y: 1301 },
            ],
        ],
        riddle5: "duck",
        riddle5Answer: "duck",
        riddle5Targets: [
            [
                { x: 2115, y: 2019 },
                { x: 2110, y: 2772 },
                { x: 2660, y: 2770 },
                { x: 2293, y: 3019 },
            ],
        ],
        riddle6: "beer",
        riddle6Answer: "beer",
        riddle6Targets: [
            [
                { x: 4015, y: 2419 },
                { x: 4225, y: 2421 },
                { x: 4210, y: 1831 },
                { x: 4003, y: 1835 },
            ],
        ],
        riddle7: "selfie",
        riddle7Answer: "selfie",
        riddle7Targets: [
            [
                { x: 441, y: 3007 },
                { x: 557, y: 3938 },
                { x: 1028, y: 2989 },
                { x: 1060, y: 2990 },
            ],
        ],
    },
    "busy_beach.jpg": {
        riddle1: "horses",
        riddle1Answer: "horses",
        riddle1Targets: [
            [
                { x: 1048, y: 418 },
                { x: 1086, y: 572 },
                { x: 1211, y: 557 },
                { x: 1201, y: 427 },
            ],
        ],
        riddle2: "fishingnet",
        riddle2Answer: "fishingnet",
        riddle2Targets: [
            [
                { x: 510, y: 618 },
                { x: 552, y: 490 },
                { x: 584, y: 401 },
                { x: 546, y: 618 },
            ],
        ],
        riddle3: "clocktower",
        riddle3Answer: "clocktower",
        riddle3Targets: [
            [
                { x: 345, y: 286 },
                { x: 343, y: 160 },
                { x: 403, y: 161 },
                { x: 404, y: 298 },
            ],
        ],
        riddle4: "car",
        riddle4Answer: "car",
        riddle4Targets: [
            [
                { x: 679, y: 403 },
                { x: 760, y: 402 },
                { x: 756, y: 380 },
                { x: 676, y: 377 },
            ],
        ],
        riddle5: "signature",
        riddle5Answer: "signature",
        riddle5Targets: [
            [
                { x: 84, y: 665 },
                { x: 85, y: 685 },
                { x: 0, y: 663 },
                { x: 0, y: 685 },
            ],
        ],
        riddle6: "fence",
        riddle6Answer: "fence",
        riddle6Targets: [
            [
                { x: 1105, y: 376 },
                { x: 1102, y: 354 },
                { x: 1251, y: 355 },
                { x: 1252, y: 366 },
            ],
        ],
        riddle7: "whitedog",
        riddle7Answer: "whitedog",
        riddle7Targets: [
            [
                { x: 119, y: 662 },
                { x: 171, y: 661 },
                { x: 171, y: 615 },
                { x: 120, y: 622 },
            ],
        ],
    },
};

async function addImages() {
    const publicFolder = "./public";
    const images = fs.readdirSync(publicFolder);
    console.log("images:", images);
    let results = [];

    images.forEach(async (image) => {
        const imagePath = path.join(publicFolder, image);
        const imageContent = fs.readFileSync(imagePath);
        const mime_type = mime.lookup(image);

        console.log('image name and type', image, mime_type)
        const { data, error } = await supabase.storage
            .from("images")
            .upload(`public/${image}`, imageContent, {
                contentType: mime_type,
                upsert: true,
            });

        if (error) {
            console.error(`Error uploading ${image}:`, error);
        }

        results.push(data);
        console.log(results);

        const {
            data: { publicUrl },
        } = supabase.storage.from("public/images").getPublicUrl(image);

        const imageData = targets[image] || {};

        const imageRecord = await prisma.image.create({
            data: {
                name: image,
                url: publicUrl,
                riddle1: imageData.riddle1,
                riddle1Answer: imageData.riddle1Answer,
                riddle1Targets: imageData.riddle1Targets,
                riddle2: imageData.riddle2,
                riddle2Answer: imageData.riddle2Answer,
                riddle2Targets: imageData.riddle2Targets,
                riddle3: imageData.riddle3,
                riddle3Answer: imageData.riddle3Answer,
                riddle3Targets: imageData.riddle3Targets,
                riddle4: imageData.riddle4,
                riddle4Answer: imageData.riddle4Answer,
                riddle4Targets: imageData.riddle4Targets,
                riddle5: imageData.riddle5,
                riddle5Answer: imageData.riddle5Answer,
                riddle5Targets: imageData.riddle5Targets,
                riddle6: imageData.riddle6,
                riddle6Answer: imageData.riddle6Answer,
                riddle6Targets: imageData.riddle6Targets,
                riddle7: imageData.riddle7,
                riddle7Answer: imageData.riddle7Answer,
                riddle7Targets: imageData.riddle7Targets,
            },
        });

        console.log("postgres addition:", imageRecord);
    });
}

addImages()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
