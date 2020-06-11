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
    return {
        inputArr: [...workSheetsFromFile[0].data],
        fileName: path.basename(chosenFiles[0]),
    };
}
