import { useState } from "react";
import starterImage from "../../public/intersection.jpg";
import "../Styles/PhotoViewer.css";

function PhotoViewer() {
    const [isTagging, setIsTagging] = useState(false);
    const [tag, setTag] = useState({ x: 0, y: 0 });

    function toggleTagging() { setIsTagging(!isTagging) }

    function tagTarget(e) {
        if (isTagging) return;
        const frame = e.target.getBoundingClientRect();
        const x = e.clientX - frame.left;
        const y = e.clientY - frame.top;
        setTag({ x, y });
        toggleTagging();
    }

    function handleTagSubmission(e) {
        e.preventDefault();
        console.log('tag submitted')
        toggleTagging()
    }

    return (
        <div style={{ position: 'relative'}}>
            <img
                className="photo"
                src={starterImage}
                alt="Intersection"
                onClick={tagTarget}
            />
            {isTagging && 
                <form
                    onSubmit={handleTagSubmission}
                    style={{
                        position: 'absolute',
                        left: `${tag.x}px`,
                        top: `${tag.y}px`,
                        transform: 'translate(-10%, -10%)',
                        zIndex: 1000
                    }}
                >
                    <button type="submit">
                        that&apos;s it, tag it! TAG IT NOW!
                    </button>
                    <button onClick={toggleTagging} type="button">
                        ehh, nevermind
                    </button>
                </form>
            }
        </div>
    );
}

export default PhotoViewer;
