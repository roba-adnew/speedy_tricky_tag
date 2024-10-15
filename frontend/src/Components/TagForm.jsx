import { useState } from "react";
import PropTypes from "prop-types";

export function TagForm({ tagFlag, setTagFlag, tag, handleTagSubmission }) {
    const [isTagging, setIsTagging] = useState(false);

    function toggleTagging() {
        setIsTagging(!isTagging);
    }

    function tagTarget(e) {
        if (isTagging) return;
        const frame = e.target.getBoundingClientRect();
        const x = e.clientX - frame.left;
        const y = e.clientY - frame.top;
        setTag({ x, y });
        if (!selectedRiddle) {
            setTagFlag(true);
            setIsTagging(false);
            return;
        }
        toggleTagging();
    }

    return (
        <>
            {tagFlag && (
                <div
                    className="unselectedTag"
                    style={{
                        border: "1px solid black",
                        backgroundColor: "pink",
                        position: "absolute",
                        left: `${tag.x}px`,
                        top: `${tag.y}px`,
                        transform: "translate(-10%, -10%)",
                        zIndex: 1000,
                    }}
                >
                    You have to select a riddle first
                </div>
            )}
            {isTagging && !tagFlag && (
                <form
                    onSubmit={handleTagSubmission}
                    style={{
                        position: "absolute",
                        left: `${tag.x}px`,
                        top: `${tag.y}px`,
                        transform: "translate(-10%, -10%)",
                        zIndex: 1000,
                    }}
                >
                    <button type="submit">
                        that&apos;s it, tag it! TAG IT NOW!
                    </button>
                    <button onClick={toggleTagging} type="button">
                        ehh, nevermind
                    </button>
                </form>
            )}
        </>
    );
}

TagForm.propTypes = {
    toggleTagging: PropTypes.func,
    tagFlag: PropTypes.bool,
    setTagFlag: PropTypes.func,
    tag: PropTypes.object,
    handleTagSubmission: PropTypes.func,
};
