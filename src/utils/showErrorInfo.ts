const { dialog } = window.require('electron').remote;

export default function (errorMsg: string, errorData: string[]) {
    dialog.showErrorBox(errorMsg, errorData.join('\n'));
}
