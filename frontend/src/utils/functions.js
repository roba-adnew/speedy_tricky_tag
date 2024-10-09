function formattedTime(timeMS) {
    const totalSeconds = timeMS / 1000; // time in API in MS;

    const minutes = Math.floor(totalSeconds / 60);
    const displayMinutes = `${minutes.toString().padStart(1, "0")}`;

    const seconds = Math.floor(totalSeconds % 60);
    const displaySeconds = `${seconds.toString().padStart(2, "0")}`;

    const displayTime = `${displayMinutes}:${displaySeconds}`;
    return displayTime;
}

export { formattedTime };
