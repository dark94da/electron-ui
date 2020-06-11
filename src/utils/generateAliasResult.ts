export default function (inputStr: string, replaceCh: string): Array<string> {
    const chs = inputStr.split('');
    let cur = 0;
    const res = [];
    let temp;
    while (cur < chs.length) {
        if (chs[cur] === replaceCh) {
            cur++;
            continue;
        }
        temp = chs[cur];
        chs[cur] = replaceCh;
        res.push(chs.join(''));
        chs[cur] = temp;
        cur++;
    }
    return res;
}
