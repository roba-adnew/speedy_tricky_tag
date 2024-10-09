import App from "../App";
import StartAndInstructions from "../Components/StartAndInstructions";
import ImageViewer from "../Components/ImageViewer";
import GameEnd from "../Components/Scoreboard";

const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <StartAndInstructions />,
            },
            {
                path: "/game",
                element: <ImageViewer />,
            },
            {
                path: "/scoreboard",
                element: <GameEnd />,
            },
        ],
    },
];

export default routes;
