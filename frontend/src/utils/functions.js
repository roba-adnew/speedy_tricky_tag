function formattedTime(timeMS) {
    const totalSeconds = timeMS / 1000; // time in API in MS;

    const minutes = Math.floor(totalSeconds / 60);
    const displayMinutes = `${minutes.toString().padStart(1, "0")}`;

    const seconds = Math.floor(totalSeconds % 60);
    const displaySeconds = `${seconds.toString().padStart(2, "0")}`;

    const displayTime = `${displayMinutes}:${displaySeconds}`;
    return displayTime;
}

function formattedName(name) {
    return name.replaceAll("_", " ").slice(0, name.length - 4);
}

function formattedScore(score) {
    const scoreStr = score.toString();
    if (scoreStr.length <= 3) {
        return scoreStr;
    }
    const lastThree = scoreStr.slice(-3);
    const remaining = scoreStr.slice(0, -3);

    return formattedScore(remaining) + "," + lastThree;
}

export { formattedTime, formattedName, formattedScore };
