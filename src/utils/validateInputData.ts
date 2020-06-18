import showErrorInfo from './showErrorInfo';

export default {
    checkPepStrAndDnaStr: (pepStr: string, dnaStr: string): boolean => {
        if (pepStr.length * 3 !== dnaStr.length) {
            showErrorInfo('输入数据错误', ['请检查多肽序列与DNA序列对应关系', pepStr, dnaStr]);
            return false;
        }
        return true;
    },
};
