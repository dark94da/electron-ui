export default function (
    pepStr: string,
    dnaStr: string,
    resultAmount: number
): {
    pepStrArr: Array<string>;
    dnaStrArr: Array<string>;
} {
    const res = [];
    const dnaRes = [];
    let chs, dnaArr;
    while (res.length < resultAmount) {
        let idx, pIdx;
        chs = pepStr.split('');
        dnaArr = [];
        for (let i = 0; i < pepStr.length; i++) {
            dnaArr[i] = dnaStr.slice(i * 3, (i + 1) * 3);
        }
        for (let i = 0; i < chs.length - 1; i++) {
            idx = Math.floor(Math.random() * (chs.length - i));
            pIdx = chs.length - 1 - i;
            [chs[idx], chs[pIdx]] = [chs[pIdx], chs[idx]];
            [dnaArr[idx], dnaArr[pIdx]] = [dnaArr[pIdx], dnaArr[idx]];
        }
        res.push(chs.join(''));
        dnaRes.push(dnaArr.join(''));
    }
    return {
        pepStrArr: res,
        dnaStrArr: dnaRes,
    };
}
