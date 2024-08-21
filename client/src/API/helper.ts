export function formatLargeNumber(n: number) {
    let nStr = n.toString();

    if (n >= 1_000_000_000) {
        return nStr.substring(0, nStr.length - 9) + "B";
    }
    else if (n >= 1_000_000) {
        return nStr.substring(0, nStr.length - 6) + "M";
    }
    else if (n >= 100_000) {
        return nStr.substring(3) + "K";
    }

    return nStr;
}