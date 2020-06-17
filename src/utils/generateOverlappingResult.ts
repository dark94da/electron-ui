function generateOverlappingResult(
    pepStr: string,
    dnaStr: string,
    resLength: number,
    jump: number,
    isCyclic: boolean
): {
    pepStrArr: string[];
    dnaStrArr: string[];
} {
    const arr = pepStr.split('');
    const dnaArr = [];
    for (let i = 0; i < pepStr.length; i++) {
        dnaArr[i] = dnaStr.slice(i * 3, (i + 1) * 3);
    }
    const len = arr.length;
    const res = [];
    const dnaRes = [];
    let start = 0;
    let cur, curStr, curDna;
    while (start < len) {
        cur = start;
        if (!isCyclic && cur + resLength > len) {
            break;
        }
        curStr = '';
        curDna = '';
        for (let i = 0; i < resLength; i++) {
            curStr += arr[cur];
            curDna += dnaArr[cur];
            if (++cur === len) {
                cur = 0;
            }
        }
        res.push(curStr);
        dnaRes.push(curDna);
        start += jump;
    }
    return {
        pepStrArr: res,
        dnaStrArr: dnaRes,
    };
}

export default generateOverlappingResult;
