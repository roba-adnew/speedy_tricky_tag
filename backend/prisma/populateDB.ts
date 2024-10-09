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

type Riddle = {
    question: string;
    answer: string;
    targets: Array<Array<{ x: number; y: number }>>;
};

type Targets = {
    [key: string]: Riddle[];
};

const targets: Targets = {
    "flea_market.jpg": [
        {
            question:
                "I can express joy, sadness, or fear; I'm what you see \
            when you look in a mirror; On a clock, I help tell time and pace; \
            What am I that's both feature and place?",
            answer: "face",
            targets: [
                [
                    { x: 1017, y: 484 },
                    { x: 1023, y: 612 },
                    { x: 1191, y: 607 },
                    { x: 1193, y: 494 },
                ],
            ],
        },
        {
            question:
                "In darkness, I become your guide; With batteries and \
            bulb inside; A beam of light from handheld might; What am I that \
            shines so bright?",
            answer: "flashlight",
            targets: [
                [
                    { x: 1411, y: 1334 },
                    { x: 1700, y: 1418 },
                    { x: 1701, y: 1505 },
                    { x: 1393, y: 1399 },
                ],
            ],
        },
        {
            question:
                "A symbol of victory, shiny and grand; Held up high when \
            champions stand; Placed on a shelf for all to see; What is this\
            prize awarded to thee?",
            answer: "trophy",
            targets: [
                [
                    { x: 654, y: 991 },
                    { x: 894, y: 1004 },
                    { x: 824, y: 1177 },
                    { x: 704, y: 1168 },
                ],
            ],
        },
        {
            question:
                "Worn on the head for safety's sake; By soldiers, riders,\
             and those who race; Protecting from harm in every event; What is \
             this hard-shell ornament?",
            answer: "helmet",
            targets: [
                [
                    { x: 1973, y: 781 },
                    { x: 1801, y: 609 },
                    { x: 1985, y: 533 },
                    { x: 2094, y: 732 },
                ],
            ],
        },
        {
            question:
                "With mane and tail, I gallop fast; In fields and races,\
             my shadow is cast; A noble steed of strength and force; What am I?",
            answer: "horse",
            targets: [
                [
                    { x: 1387, y: 1136 },
                    { x: 1296, y: 987 },
                    { x: 1636, y: 1085 },
                    { x: 1635, y: 1272 },
                ],
            ],
        },
        {
            question:
                "Worn around the waist, compact and snug; Holding keys, \
            phone, and perhaps a mug; Handy for travel without a sack; What is\
             this pouch called? Think back.",
            answer: "fanny pack",
            targets: [
                [
                    { x: 0, y: 994 },
                    { x: 0, y: 796 },
                    { x: 284, y: 804 },
                    { x: 285, y: 935 },
                ],
            ],
        },
        {
            question:
                "Small vessels lined up in a row; Filled with spirits \
            ready to go; Raise me up for a quick cheers; What are these tiny \
            cups found in bars and fairs?",
            answer: "shotglasses",
            targets: [
                [
                    { x: 1215, y: 1087 },
                    { x: 912, y: 1051 },
                    { x: 914, y: 830 },
                    { x: 1299, y: 885 },
                ],
            ],
        },
    ],
    "intersection.jpg": [
        {
            question:
                "I am called a king without a throne, My mighty \
            roar chills to the bone. With a mane of gold, I roam the land, \
            The savannah is where I make my stand. Who am I?",
            answer: "lion",
            targets: [
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
        },
        {
            question:
                "I represent wisdom in choices you make, A careful \
            approach for safety's sake. An insurance giant with a towering \
            sign, A rock that endures the test of time. Who am I?",
            answer: "prudential",
            targets: [
                [
                    { x: 3552, y: 999 },
                    { x: 3547, y: 654 },
                    { x: 3860, y: 689 },
                    { x: 3969, y: 987 },
                ],
            ],
        },
        {
            question:
                "I am a journey with a goal in sight, In politics or war,\
             I lead the fight. A series of actions, a strategic plan, To win \
             hearts or battles across the land. What am I?",
            answer: "campaign",
            targets: [
                [
                    { x: 5511, y: 2908 },
                    { x: 5779, y: 2019 },
                    { x: 5755, y: 1801 },
                    { x: 5517, y: 1955 },
                ],
            ],
        },
        {
            question:
                "I come in good and hard, and sometimes trying \
            Newspapers use me in their name without lying. I represent eras \
            and moments that pass, Counting me helps history amass. What am I?",
            answer: "times",
            targets: [
                [
                    { x: 2674, y: 1320 },
                    { x: 2672, y: 874 },
                    { x: 2553, y: 888 },
                    { x: 2540, y: 1301 },
                ],
            ],
        },
        {
            question:
                "I waddle on land and glide on a lake; Quacking aloud, \
            the sounds I make; Hunters may seek me in season's luck; Feathered \
            and billed, I am a...?",
            answer: "duck",
            targets: [
                [
                    { x: 2090, y: 2062 },
                    { x: 2071, y: 3006 },
                    { x: 2319, y: 3027 },
                    { x: 2314, y: 2727 },
                ],
            ],
        },
        {
            question:
                "Brewed from barley, hops, and yeast; In a pint or mug, \
            I am released; A frothy head and golden hue; At pubs and bars, I'm \
            poured for you; What am I?",
            answer: "beer",
            targets: [
                [
                    { x: 4015, y: 2419 },
                    { x: 4225, y: 2421 },
                    { x: 4210, y: 1831 },
                    { x: 4003, y: 1835 },
                ],
            ],
        },
        {
            question:
                "A photo taken at arm's length; To capture yourself with \
            all your strength; Shared on social media for all to see; This\
            modern portrait is called a...?",
            answer: "selfie",
            targets: [
                [
                    { x: 441, y: 3007 },
                    { x: 557, y: 3938 },
                    { x: 1028, y: 2989 },
                    { x: 1060, y: 2990 },
                ],
            ],
        },
    ],
    "busy_beach.jpg": [
        {
            question:
                "Strong and swift with flowing mane, we pull the cart and\
             race the lane; Once vital in wars, now in sport we thrive; With\
              hooves that thunder, we come alive; What am we?",
            answer: "horses",
            targets: [
                [
                    { x: 1048, y: 418 },
                    { x: 1086, y: 572 },
                    { x: 1211, y: 557 },
                    { x: 1201, y: 427 },
                ],
            ],
        },
        {
            question:
                "Cast me wide into the sea; To catch some fish is the \
            hope for me; With mesh and lines carefully set; What tool am I that\
             fishers get?",
            answer: "fishing net",
            targets: [
                [
                    { x: 510, y: 618 },
                    { x: 552, y: 490 },
                    { x: 584, y: 401 },
                    { x: 546, y: 618 },
                ],
            ],
        },
        {
            question:
                "I stand tall in the center of town; My hands move but I\
             make no sound; When bells ring, the hour I tell; What structure \
             am I? Can you spell?",
            answer: "clock tower",
            targets: [
                [
                    { x: 345, y: 286 },
                    { x: 343, y: 160 },
                    { x: 403, y: 161 },
                    { x: 404, y: 298 },
                ],
            ],
        },
        {
            question:
                "With four wheels rolling down the street; An engine \
            powers my front seat; From place to place, near or far; Hop in and\
             ride—what am I?",
            answer: "car",
            targets: [
                [
                    { x: 679, y: 403 },
                    { x: 760, y: 402 },
                    { x: 756, y: 380 },
                    { x: 676, y: 377 },
                ],
            ],
        },
        {
            question:
                "A unique mark made by your hand; On dotted lines is \
            where I stand; Authenticating documents pure; What is this personal\
             script called, for sure?",
            answer: "signature",
            targets: [
                [
                    { x: 84, y: 665 },
                    { x: 85, y: 685 },
                    { x: 0, y: 663 },
                    { x: 0, y: 685 },
                ],
            ],
        },
        {
            question:
                "I can be wooden, metal, or wire; Surrounding yards, I'm \
            often higher; Defining borders in every sense; What am I? A \
            boundary...?",
            answer: "fence",
            targets: [
                [
                    { x: 1098, y: 337 },
                    { x: 1098, y: 385 },
                    { x: 1251, y: 392 },
                    { x: 1248, y: 339 },
                ],
            ],
        },
        {
            question:
                "Covered in fur as pale as snow; A loyal friend wherever \
            you go; From fluffy Samoyeds to little Bichons; What am I, in \
            canine forms?",
            answer: "white dog",
            targets: [
                [
                    { x: 119, y: 662 },
                    { x: 171, y: 661 },
                    { x: 171, y: 615 },
                    { x: 120, y: 622 },
                ],
            ],
        },
    ],
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

        console.log("image name and type", image, mime_type);
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
                riddle1: imageData[0],
                riddle2: imageData[1],
                riddle3: imageData[2],
                riddle4: imageData[3],
                riddle5: imageData[4],
                riddle6: imageData[5],
                riddle7: imageData[6],
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
