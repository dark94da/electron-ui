export default function (
    pepStr: string,
    dnaStr: string,
    replacePep: string,
    replaceDna: string
): {
    pepStrArr: string[];
    dnaStrArr: string[];
} {
    const chs = pepStr.split('');
    const dnaArr = [];
    for (let i = 0; i < pepStr.length; i++) {
        dnaArr[i] = dnaStr.slice(i * 3, (i + 1) * 3);
    }
    let cur = 0;
    const res = [];
    const dnaRes = [];
    let temp;
    while (cur < chs.length) {
        if (chs[cur] === replacePep) {
            cur++;
            continue;
        }
        temp = chs[cur];
        chs[cur] = replacePep;
        res.push(chs.join(''));
        chs[cur] = temp;
        temp = dnaArr[cur];
        dnaArr[cur] = replaceDna;
        dnaRes.push(dnaArr.join(''));
        dnaArr[cur] = temp;
        cur++;
    }
    return {
        pepStrArr: res,
        dnaStrArr: dnaRes,
    };
}
