import { useState, useRef, useEffect } from "react";
import { sendViewportDetails as apiSendViewportDetails } from "../utils/api/gamePlayApi";

export function useViewport() {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [vpDetails, setVpDetails] = useState(null);
    const [vpDetailsReady, setVpDetailsReady] = useState(false);
    const imageRef = useRef(null);

    useEffect(() => {
        async function sendViewportDetails() {
            if (vpDetailsReady) {
                try {
                    await apiSendViewportDetails(vpDetails);
                } catch (err) {
                    console.error(err);
                }
            }
        }
        sendViewportDetails();
    }, [vpDetailsReady, vpDetails]);

    useEffect(() => {
        if (imageLoaded && vpDetails) {
            setVpDetailsReady(true);
        }
    }, [imageLoaded, vpDetails]);

    useEffect(() => {
        let resizeTimer;
        function handleResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                getViewportDetails();
            }, 500);
        }

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimer);
        };
    }, []);

    function getViewportDetails() {
        if (!imageRef?.current) return;
        const scalerX = imageRef.current.width / imageRef.current.naturalWidth;
        const scalerY =
            imageRef.current.height / imageRef.current.naturalHeight;
        const { x: xOffset, y: yOffset } =
            imageRef.current.getBoundingClientRect();
        const viewportDetails = { scalerX, scalerY, xOffset, yOffset };
        setVpDetails(viewportDetails);
        return viewportDetails;
    }

    return {
        imageRef,
        getViewportDetails,
        setImageLoaded,
    };
}
