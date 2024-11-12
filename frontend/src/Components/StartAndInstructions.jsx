import { useState, useEffect } from "react";
import { getImageSetMeta as apiGetImageSetMeta } from "../utils/api/gamePlayApi";
import { useNavigate } from "react-router-dom";
import "../Styles/Start.css";

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
        <>
            <h3>speeedy triicky riddle tag!</h3>
            <div>
                how to play
                <ul>
                    <li>
                        there are 3 rounds and round has 7 riddles that need to
                        be solved
                    </li>
                    <li>
                        the answer to each riddle will have a corresponding
                        element in the image for a round
                    </li>
                    <li>there will be a timer running for each round</li>
                    <li>
                        once a round has been completed, you will move onto the
                        next with your time recorded, and your times will
                        provide your score at the end of the game
                    </li>
                    <ol>
                        game play
                        <li>select a riddle</li>
                        <li>
                            click and tag the answer in the image, a few riddles
                            have more than one element that will suffice
                        </li>
                        <li>
                            note: you can resize the screen but the tags may
                            shift in doing so
                        </li>
                    </ol>
                </ul>
            </div>
            <button type="button" onClick={startGame}>
                start game
            </button>
        </>
    );
}

export default StartAndInstructions;
