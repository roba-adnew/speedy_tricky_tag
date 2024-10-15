import { useState } from "react";

export function useRiddles() {
    const [selectedRiddle, setSelectedRiddle] = useState(null);
    const [tagFlag, setTagFlag] = useState(false);

    function selectRiddle(e) {
        const selectedRiddle = e.target.id;
        if (tagFlag) setTagFlag(false);
        setSelectedRiddle(selectedRiddle);
    }

    return {
        selectRiddle,
        selectedRiddle,
        setSelectedRiddle,
        tagFlag,
        setTagFlag,
    };
}
