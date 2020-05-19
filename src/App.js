import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import './App.scss';
import Divider from "@material-ui/core/Divider";
import generateResult from "./utils/generateResult";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const { dialog } = window.require('electron').remote;
const createCsvWriter = window.require('csv-writer').createObjectCsvWriter;

// language=SCSS
const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    margin-right: 1rem;
    font-size: .8rem;
  }

  .MuiFormLabel-root {
    font-size: .6rem;
  }
`;

const initialState = {
    inputString: '',
    jump: undefined,
    length: undefined,
    replace: '',
    replaceWith: '',
    batchId: '',
    isComputing: false,
    result: [],
};

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    btn: {
        fontSize: '0.3rem'
    }
}));

function getResultStringPromise(state) {
    return new Promise(resolve => {
       setTimeout(() => {
           const result = [];
           let realInput = state.inputString;
           let inputStr = realInput.split('\n');
           if (state.replace && state.replaceWith) {
               let index = parseInt(state.replace, 10) - 1;
               inputStr = inputStr.map(str => {
                   if (index < str.length) {
                       return str.substr(0, index) + state.replaceWith + str.substr(index + state.replaceWith.length);
                   }
                   return str;
               });
           }
           inputStr.forEach(str => {
               result.push.apply(result, generateResult(str, parseInt(state.length,10), parseInt(state.jump, 10)));
           });
           resolve(result);
       });
    });
}

function App() {
    const [state, setState] = useState(initialState);

    const classes = useStyles();

    const getResult = () => {
        if (state.isComputing) {
            return;
        }
        setState({
            ...state,
            isComputing: true
        });
        getResultStringPromise(state)
            .then(result => setState({
                ...state,
                result,
                isComputing: false
            }));
    };

    const exportResult = () => {
        const now = new Date();
        const filePath = dialog.showSaveDialogSync({
            showsTagField: false,
            defaultPath: `output_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`,
            filters: [
                {
                    name: 'csv',
                    extensions: ['csv']
                }
            ]
        });
        if (!filePath) {
            return;
        }
        const csvWriter = createCsvWriter({
            path: filePath,
            header: [
                {id: 'no', title: 'No.'},
                {id: 'output', title: 'Output'},
                {id: 'batch', title: 'BatchId'}
            ]
        });

        const records = state.result.map((resStr, idx) => (
            {no: idx, output: resStr, batch: state.batchId}
        ));

        csvWriter.writeRecords(records)
            .then(() => {
            })
            .catch(() => {

            })
    };

    return (
        <div className="App">
            <div className="input-area">
                <div className="left-column">
                    <div className="label">
                        Input
                    </div>
                </div>
                <div className="right-column">
                    <div className="text-area">
                        <StyledTextField
                            placeholder={'Please type input string here.'}
                            value={state.inputString}
                            rows={2}
                            variant={'outlined'}
                            onChange={(event) => {
                                setState({
                                    ...state,
                                    inputString: event.target.value
                                });
                            }}
                            fullWidth
                            multiline
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <StyledTextField
                            required
                            label="length"
                            type="number"
                            value={state.length}
                            onChange={(event) => {
                                setState({
                                    ...state,
                                    length: event.target.value
                                });
                            }}
                        />
                        <StyledTextField
                            required
                            label="jump"
                            type="number"
                            value={state.jump}
                            onChange={(event) => {
                                setState({
                                    ...state,
                                    jump: event.target.value
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
                                    batchId: event.target.value
                                });
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <StyledTextField
                            label="replace position"
                            value={state.replace}
                            onChange={(event) => {
                                setState({
                                    ...state,
                                    replace: event.target.value
                                });
                            }}
                        />
                        <StyledTextField
                            label="replace with"
                            value={state.replaceWith}
                            onChange={(event) => {
                                setState({
                                    ...state,
                                    replaceWith: event.target.value
                                });
                            }}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        paddingTop: '0.8rem'
                    }}>
                        <Button
                            classes={classes.btn}
                            style={{ marginRight: '0.5rem' }}
                            color="primary"
                            size="small"
                            variant="contained"
                            onClick={() => {
                                getResult();
                            }}
                        >generate</Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                setState({
                                    ...initialState,
                                    length: 0,
                                    jump: 0
                                });
                            }}
                        >reset</Button>
                    </div>
                </div>
            </div>
            <Divider />
            <div className="output-area">
                <div className="left-column">
                    <div className="label">
                        Output
                    </div>
                </div>
                <div className="right-column">
                    <TableContainer component={Paper} style={{ minHeight: '10rem', maxHeight: '10rem' }}>
                        <Table aria-label="simple table" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">No.</TableCell>
                                    <TableCell align="right">Result String</TableCell>
                                    <TableCell align="right">Batch ID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.result.map((res, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell align="left">{idx + 1}</TableCell>
                                        <TableCell align="right">
                                            {res}
                                        </TableCell>
                                        <TableCell align="right">{state.batchId}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="export-btn">
                        <Button
                            variant="outlined"
                            onClick={exportResult}
                        >export</Button>
                    </div>
                </div>
            </div>
            <Backdrop className={classes.backdrop} open={state.isComputing} addEndListener={() => {}}>
                <CircularProgress color="inherit" size="3rem" />
            </Backdrop>
        </div>
    );
}

export default App;
