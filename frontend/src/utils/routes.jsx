import App from "../App";
import StartAndInstructions from "../Components/StartAndInstructions";
import ImageViewer from "../Components/ImageViewer";

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
        ],
    },
];

export default routes;
