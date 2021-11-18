import React from 'react';
import './App.css';
import { CerbymaskWindow, TransactionFieldsT } from '@cerbymask/cerbymask-lib';

declare let window: CerbymaskWindow;

interface IProps {
    
}

interface IState {
    detected: boolean,
    connected: boolean
}

class App extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)
        this.state = {
            detected: false,
            connected: false
        }
    }

    componentDidMount() {
        this.connectCerby().then((connected) => {
            console.log(`Connected to CerbyMask`)
        }).catch(() => {
            console.log(`No CerbyMask instance found :(`)
        })
    }

    connectCerby() {
        return new Promise(async (resolve, reject) => {
            await new Promise(r => setTimeout(r, 200));
            if(window.cerbymask) {
                this.setState({detected: true})

                // Validate
                window.cerbymask.validateWallet()

                // On connect
                window.cerbymask.events.on("onApproveClient", (data) => this.setState({connected: true}))

                // On reconnect
                window.cerbymask.events.on("onValidateWallet", (data) => this.setState({connected: data}))
                return resolve(true)
            }
            return reject(false)
        })
    }

    createTransaction() {
        if(this.state.connected) {
            const transaction = { from: "Hello World", to: "From here" } as TransactionFieldsT
            window.cerbymask.submitTransaction(transaction)
        }
    }

    render() {
        return (
            <div className="App h-100">
                <div className="h-100 d-flex centered">
                    { !this.state.detected &&
                        <button type="button" className="button-1">Install CerbyMask</button> 
                    }
                    { this.state.detected && !this.state.connected &&
                        <button type="button" className="button-1" onClick={() => window.cerbymask.connect()}>Connect Wallet</button> 
                    }
                    { this.state.detected && this.state.connected &&
                        <button type="button" className="button-1" onClick={() => this.createTransaction()}>Buy CERBY</button>
                    }
                </div>
            </div>
        );
    }
}

export default App;
