import App from "../App";
import StartAndInstructions from "../Components/StartAndInstructions";
import PhotoViewer from "../Components/PhotoViewer";

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
                element: <PhotoViewer />,
            },
        ],
    },
];

export default routes;
