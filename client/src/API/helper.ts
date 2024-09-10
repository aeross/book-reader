import { User } from "./types";

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

export function checkIfUserIsAnAuthor(authors?: User[] | null, user?: User | null) {
    if (!authors) return false;
    if (!user) return false;

    let output = false;
    for (let i = 0; i < authors.length; i++) {
        let author = authors[i];
        if (author.username === user.username) {
            output = true;
            break;
        }
    }
    return output;
}

export function getWordCountFromPlainText(plainText: string) {
    const words = plainText.trim().split(/\s+/);
    return words.filter(Boolean).length;
}