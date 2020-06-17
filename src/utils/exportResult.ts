const { dialog } = window.require('electron').remote;
const createCsvWriter = window.require('csv-writer').createObjectCsvWriter;

export interface ResItem {
    res: string;
    batchId: string;
    dnaRes: string;
}

const exportResult = ({ prefix, resArr }: { prefix: string; resArr: ResItem[] }) => {
    const now = new Date();
    const filePath = dialog.showSaveDialogSync({
        showsTagField: false,
        defaultPath: `${prefix}_${now.getFullYear()}${(now.getMonth() + 1)
            .toString()
            .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`,
        filters: [
            {
                name: 'csv',
                extensions: ['csv'],
            },
        ],
    });
    if (!filePath) {
        return;
    }
    const csvWriter = createCsvWriter({
        path: filePath,
        header: [
            { id: 'peptide', title: 'Peptide' },
            { id: 'dna', title: 'DNA' },
            { id: 'batch', title: 'BatchId' },
        ],
    });

    const records = resArr.map((resStr) => ({
        peptide: resStr.res,
        dna: resStr.dnaRes,
        batch: resStr.batchId,
    }));

    csvWriter
        .writeRecords(records)
        .then(() => {})
        .catch(() => {});
};

export default exportResult;
