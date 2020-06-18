export default function (
    pepStr: string,
    dnaStr: string,
    len: number,
    fromTail: boolean
): {
    pepStrArr: Array<string>;
    dnaStrArr: Array<string>;
} {
    const res: string[] = [];
    const dnaRes: string[] = [];
    if (!(len > 0)) {
        return {
            pepStrArr: res,
            dnaStrArr: dnaRes,
        };
    }
    if (fromTail) {
        let curEnd = pepStr.length;
        while (curEnd > len) {
            res.push(pepStr.slice(0, curEnd - len));
            dnaRes.push(dnaStr.slice(0, (curEnd - len) * 3));
            curEnd -= len;
        }
    } else {
        let curStart = 0;
        while (curStart + len <= pepStr.length - 1) {
            res.push(pepStr.slice(curStart + len));
            dnaRes.push(dnaStr.slice((curStart + len) * 3));
            curStart += len;
        }
    }
    return {
        pepStrArr: res,
        dnaStrArr: dnaRes,
    };
}
