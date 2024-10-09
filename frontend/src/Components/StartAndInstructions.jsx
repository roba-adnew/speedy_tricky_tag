import { useState, useEffect } from "react";
import { getImageSetMeta as apiGetImageSetMeta } from "../utils/gamePlayApi";
import { useNavigate } from "react-router-dom";

function StartAndInstructions() {
    const [imageIds, setImageIds] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function getImageSet() {
            const imageSet = await apiGetImageSetMeta();
            setImageIds(imageSet);
        }
        getImageSet();
    }, []);

    function startGame() {
        navigate("/game", { state: { imageIds } });
    }

    return (
        <button type="button" onClick={startGame}>
            start game
        </button>
    );
}

export default StartAndInstructions;
