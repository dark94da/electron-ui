import React, { useState } from 'react';

import './App.scss';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Overlapping from './tabs/Overlapping';
import Alias from './tabs/Alias';
import Truncation from './tabs/Truncation';
import Scramble from './tabs/Scramble';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    btn: {
        fontSize: '0.3rem',
    },
}));

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function App() {
    const classes = useStyles();
    const [isComputing] = useState(false);
    const [idx, setIdx] = useState(0);

    return (
        <div className="App">
            <Backdrop className={classes.backdrop} open={isComputing} addEndListener={() => {}}>
                <CircularProgress color="inherit" size="3rem" />
            </Backdrop>
            <AppBar position="static">
                <Tabs
                    value={idx}
                    onChange={(event, newValue) => {
                        setIdx(newValue);
                    }}
                    variant="fullWidth"
                    aria-label="wrapped full width tabs example">
                    <Tab label="Overlapping" {...a11yProps(0)} />
                    <Tab wrapped label="Ala Scanning" {...a11yProps(1)} />
                    <Tab label="Truncation" {...a11yProps(2)} />
                    <Tab label="Scramble" {...a11yProps(3)} />
                </Tabs>
            </AppBar>
            {idx === 0 && <Overlapping />}
            {idx === 1 && <Alias />}
            {idx === 2 && <Truncation />}
            {idx === 3 && <Scramble />}
        </div>
    );
}

export default App;
