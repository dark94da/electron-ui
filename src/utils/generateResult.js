export default function generateResult (inputString, resLength, jump) {
    const arr = inputString.split('');
    const len = arr.length;
    const res = [];
    let start = 0;
    let cur, curStr;
    while (start < len) {
        cur = start;
        curStr = '';
        for (let i = 0; i < resLength; i++) {
            curStr += arr[cur];
            if (++cur === len) {
                cur = 0;
            }
        }
        res.push(curStr);
        start += jump;
    }
    return res;
}
