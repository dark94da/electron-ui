export default function (inputStr: string, len: number, fromTail: boolean): Array<string> {
    const res = [];
    if (fromTail) {
        let curEnd = inputStr.length;
        while (curEnd >= len) {
            res.push(inputStr.slice(0, curEnd - len));
            curEnd -= len;
        }
    } else {
        let curStart = 0;
        while (curStart + len <= inputStr.length - 1) {
            res.push(inputStr.slice(curStart + len));
            curStart += len;
        }
    }
    return res;
}
