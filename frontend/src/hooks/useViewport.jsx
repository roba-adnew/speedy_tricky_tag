import { useState, useRef, useEffect } from "react";
import { sendViewportDetails as apiSendViewportDetails } from "../utils/api/gamePlayApi";

export function useViewport() {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [vpDetails, setVpDetails] = useState(null);
    const [vpDetailsReady, setVpDetailsReady] = useState(false);
    // const [imageHeight, setImageHeight] = useState(null);
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const textRef = useRef(null);

    // useEffect(() => {
    //     function updateImageSize() {
    //         if (imageRef.current && textRef.current) {
    //             const availableHeight =
    //                 window.innerHeight - textRef.current.offsetHeight;
    //             console.log("window:", window.innerHeight);
    //             console.log("text:", textRef.current.offsetHeight);
    //             console.log("image:", imageRef.current.height);
    //             console.log("avail:", availableHeight);
    //             setImageHeight(availableHeight);
    //         }
    //     }
    //     updateImageSize();
    //     window.addEventListener("resize", updateImageSize);
    //     return () => window.removeEventListener("resize"), updateImageSize();
    // }, []);

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
    });

    function getViewportDetails() {
        if (!imageRef?.current) return;
        const scalerX = imageRef.current.width / imageRef.current.naturalWidth;
        const scalerY =
            imageRef.current.height / imageRef.current.naturalHeight;
        const { x: xOffset, y: yOffset } =
            imageRef.current.getBoundingClientRect();
        const viewportDetails = { scalerX, scalerY, xOffset, yOffset };
        console.log("viewportDetails:", viewportDetails)
        setVpDetails(viewportDetails);
        return viewportDetails;
    }

    return {
        // imageHeight,
        containerRef,
        textRef,
        imageRef,
        getViewportDetails,
        setImageLoaded,
    };
}
