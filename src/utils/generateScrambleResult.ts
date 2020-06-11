export default function (inputStr: string, resultAmount: number): Array<string> {
    const res = [];
    let chs;
    while (res.length < resultAmount) {
        let idx;
        chs = inputStr.split('');
        for (let i = 0; i < chs.length - 1; i++) {
            idx = Math.floor(Math.random() * (chs.length - i));
            [chs[idx], chs[chs.length - 1 - i]] = [chs[chs.length - 1 - i], chs[idx]];
        }
        res.push(chs.join(''));
    }
    return res;
}
