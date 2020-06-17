const xlsx = window.require('node-xlsx');
const { dialog } = window.require('electron').remote;
const path = window.require('path');

export default function (): {
    inputArr: string[];
    fileName: string;
} {
    const chosenFiles: string[] = dialog.showOpenDialogSync({
        filters: [
            {
                name: 'xlsx',
                extensions: ['xlsx', 'xls', 'xlsm'],
            },
        ],
    });
    if (!chosenFiles) {
        return {
            inputArr: [],
            fileName: '',
        };
    }
    const workSheetsFromFile = xlsx.parse(chosenFiles[0]);
    if (!workSheetsFromFile) {
        return {
            inputArr: [],
            fileName: '',
        };
    }
    let start = 0;
    if (workSheetsFromFile[0].data && workSheetsFromFile[0].data.length > 0) {
        start = 1;
    }
    return {
        inputArr: workSheetsFromFile[0].data.slice(start),
        fileName: path.basename(chosenFiles[0]),
    };
}
