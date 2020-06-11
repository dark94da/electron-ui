export default function generateOverlappingResult(
    inputString: string,
    resLength: number,
    jump: number,
    isCyclic: boolean
): Array<string> {
    const arr = inputString.split('');
    const len = arr.length;
    const res = [];
    let start = 0;
    let cur, curStr;
    while (start < len) {
        cur = start;
        if (!isCyclic && cur + resLength >= len) {
            break;
        }
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
