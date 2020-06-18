import React, { useState } from 'react';
import exportResult, { ResItem } from '../utils/exportResult';
import StorageNameEnum from '../enums/StorageNameEnum';
import { Button, TextField } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import styled from 'styled-components';
import generateTruncationResult from '../utils/generateTruncationResult';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import useStagingLoader from '../hooks/useStagingLoader';
import readFromExcel from '../utils/readFromExcel';
import stagingUtils from '../utils/stagingUtils';
import validateInputData from '../utils/validateInputData';

interface TruncationProps {}

// language=SCSS
const StyledTextField = styled(TextField)`
    .MuiInputBase-root {
        margin-right: 1rem;
        font-size: 0.8rem;
    }

    .MuiFormLabel-root {
        font-size: 0.6rem;
    }
`;

interface StateProps {
    inputString: string;
    jump: number;
    fromTail: boolean;
    batchId: string;
    currentResult: Array<ResItem>;
    stagingResult: Array<ResItem>;
    selectedFile: string;
}

const initialState = {
    inputString: '',
    jump: 0,
    fromTail: false,
    batchId: '',
    currentResult: [],
    stagingResult: [],
    selectedFile: '',
};

function Truncation() {
    const [state, setState] = useState<StateProps>(initialState);

    // @ts-ignore
    useStagingLoader(StorageNameEnum.Truncation, setState);

    const getResult = () => {
        const result: ResItem[] = [];
        state.inputString.split('\n').forEach((str) => {
            const [pepStr = '', dnaStr = '', batchId] = str.split(',');
            if (!validateInputData.checkPepStrAndDnaStr(pepStr, dnaStr)) {
                return;
            }
            const { pepStrArr, dnaStrArr } = generateTruncationResult(
                pepStr,
                dnaStr,
                state.jump,
                state.fromTail
            );
            for (let i = 0; i < pepStrArr.length; i++) {
                result.push({
                    res: pepStrArr[i],
                    dnaRes: dnaStrArr[i],
                    batchId: batchId || state.batchId,
                });
            }
        });
        setState({
            ...state,
            currentResult: result,
        });
    };

    const saveToStaging = () => {
        const updatedStaging = state.stagingResult.concat(state.currentResult);
        setState({
            ...state,
            stagingResult: updatedStaging,
            currentResult: [],
        });
        stagingUtils.updateStaging(StorageNameEnum.Truncation, updatedStaging);
    };

    const clearStaging = () => {
        setState({
            ...state,
            stagingResult: [],
        });
        stagingUtils.clearStaging(StorageNameEnum.Truncation);
    };

    const doExport = (isStaging: boolean) => {
        exportResult({
            prefix: StorageNameEnum.Truncation,
            resArr: isStaging ? state.stagingResult : state.currentResult,
        });
    };

    const openFile = () => {
        const result = readFromExcel();
        if (!result.fileName) return;
        setState({
            ...state,
            selectedFile: result.fileName,
            inputString: result.inputArr.join('\n'),
        });
    };

    return (
        <div className="wrapper">
            <style jsx>
                {
                    //language=SCSS
                    `
                        .input-area,
                        .output-area {
                            position: relative;
                            display: flex;
                            justify-content: center;
                            align-items: flex-start;
                            padding: 1rem 0;
                        }

                        .left-column {
                            width: 10%;
                        }

                        .label {
                            font-size: 1rem;
                        }

                        .right-column {
                            width: 40%;
                            margin-right: 1rem;
                        }

                        .text-area {
                            width: 100%;
                            margin-bottom: 0.5rem;
                        }

                        .result-area {
                            min-height: 10rem;
                            overflow: scroll;
                        }

                        .export-btn {
                            margin-top: 0.8rem;
                        }

                        .title {
                            text-align: center;
                            background-color: rgb(0, 0, 0, 0.14);
                            margin-top: 0;
                            line-height: 1.5;
                            margin-bottom: 0.5rem;
                        }
                        .input-file-area {
                            display: flex;
                            align-items: center;
                            color: rgba(0, 0, 0, 0.7);
                        }
                    `
                }
            </style>
            <div className="input-area">
                <div className="left-column">
                    <div className="label">Input</div>
                </div>
                <div className="right-column">
                    <div className="text-area">
                        <StyledTextField
                            placeholder={'Please type input string here.'}
                            value={state.inputString}
                            rows={4}
                            variant={'outlined'}
                            onChange={(event) => {
                                setState({
                                    ...state,
                                    inputString: event.target.value,
                                });
                            }}
                            fullWidth
                            multiline
                        />
                    </div>
                    <div className="input-file-area">
                        <Button
                            style={{ marginRight: '0.5rem' }}
                            color="primary"
                            size="small"
                            variant="contained"
                            onClick={openFile}>
                            OpenFile
                        </Button>
                        <div className="selected-file">{state.selectedFile}</div>
                    </div>
                </div>
                <div className="right-column">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <StyledTextField
                            required
                            label="jump"
                            type="number"
                            value={state.jump || ''}
                            onChange={(event) => {
                                setState({
                                    ...state,
                                    jump: parseInt(event.target.value, 10) || 0,
                                });
                            }}
                        />
                        <StyledTextField
                            required
                            label="batch id"
                            value={state.batchId}
                            onChange={(event) => {
                                setState({
                                    ...state,
                                    batchId: event.target.value,
                                });
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: '0.6rem', color: 'rgba(0, 0, 0, 0.54)' }}>
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">Style</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={state.fromTail ? 'tail' : 'head'}
                                    onChange={(event) => {
                                        console.log(event.target.value);
                                        setState({
                                            ...state,
                                            fromTail: event.target.value === 'tail',
                                        });
                                    }}>
                                    <MenuItem value={'head'}>N Truncation</MenuItem>
                                    <MenuItem value={'tail'}>C Truncation</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            paddingTop: '0.8rem',
                        }}>
                        <Button
                            style={{ marginRight: '0.5rem' }}
                            color="primary"
                            size="small"
                            variant="contained"
                            onClick={() => {
                                getResult();
                            }}>
                            generate
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                setState({
                                    ...initialState,
                                });
                            }}>
                            reset
                        </Button>
                    </div>
                </div>
            </div>
            <Divider />
            <div className="output-area">
                <div className="left-column">
                    <div className="label">Output</div>
                </div>
                <div className="right-column">
                    <div className="title">Current Result</div>
                    <TableContainer
                        component={Paper}
                        style={{ minHeight: '15rem', maxHeight: '15rem' }}>
                        <Table aria-label="simple table" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">No.</TableCell>
                                    <TableCell align="right">Peptide</TableCell>
                                    <TableCell align="right">DNA</TableCell>
                                    <TableCell align="right">Batch ID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.currentResult.map((res, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell align="left">{idx + 1}</TableCell>
                                        <TableCell align="right">{res.res}</TableCell>
                                        <TableCell align="right">{res.dnaRes}</TableCell>
                                        <TableCell align="right">{res.batchId}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="export-btn">
                        <Button
                            style={{ marginRight: '0.5rem' }}
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                doExport(false);
                            }}>
                            export
                        </Button>
                        <Button size="small" variant="outlined" onClick={saveToStaging}>
                            save to staging
                        </Button>
                    </div>
                </div>
                <div className="right-column">
                    <div className="title">Staging Result</div>
                    <TableContainer
                        component={Paper}
                        style={{ minHeight: '15rem', maxHeight: '15rem' }}>
                        <Table aria-label="simple table" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">No.</TableCell>
                                    <TableCell align="right">Peptide</TableCell>
                                    <TableCell align="right">DNA</TableCell>
                                    <TableCell align="right">Batch ID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.stagingResult.map((res, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell align="left">{idx + 1}</TableCell>
                                        <TableCell align="right">{res.res}</TableCell>
                                        <TableCell align="right">{res.dnaRes}</TableCell>
                                        <TableCell align="right">{res.batchId}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="export-btn">
                        <Button
                            style={{ marginRight: '0.5rem' }}
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                doExport(true);
                            }}>
                            export
                        </Button>
                        <Button size="small" variant="outlined" onClick={clearStaging}>
                            clear staging
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Truncation;
