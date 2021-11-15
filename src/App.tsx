import React from 'react';
import './App.css';
import { CerbymaskWindow } from '@cerbymask/cerbymask-lib';

declare let window: CerbymaskWindow;

function App() {
    return (
        <div className="App h-100">
            <div className="h-100 d-flex centered">
                <button type="button" className="button-1" onClick={() => window.cerbymask.connect()}>Connect Wallet</button>
            </div>
        </div>
    );
}

export default App;
