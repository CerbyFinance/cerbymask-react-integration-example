import React from 'react';
import { CerbymaskWindow, TransactionFieldsT } from '@cerbymask/cerbymask-lib';
import { createTransaction } from './lib/cerby';
import './App.css';

declare let window: CerbymaskWindow;

interface IProps {
    
}

interface IState {
    detected: boolean,
    connected: boolean,
    addresses: string[],
}

class App extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)
        this.state = {
            detected: false,
            connected: false,
            addresses: []
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
                window.cerbymask.events.on("onApproveClient", (connected) => this.handleWalletConnection(connected))

                // On reconnect
                window.cerbymask.events.on("onValidateWallet", (connected) => this.handleWalletConnection(connected))

                // On public addresses
                window.cerbymask.events.on("onPublicAddresses", (addresses) => this.handlePublicAddresses(addresses))

                return resolve(true)
            }
            return reject(false)
        })
    }

    handleWalletConnection(isConnected: boolean) {
        this.setState({connected: isConnected})
        if(isConnected) {
            window.cerbymask.getPublicAddresses()
        }
    }

    handlePublicAddresses(addresses: string[]) {
        this.setState({addresses: addresses})
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
                    <div className="container-column row-gap-1">
                        <select className="select-address">
                            {
                                this.state.addresses.map(address => {
                                    return (
                                        <option key={address} value={address}>
                                            {address}
                                        </option>
                                    )
                                })
                            }
                        </select>
                        <button type="button" className="button-1" onClick={() => createTransaction()}>Buy CERBY</button>
                    </div>
                    }
                </div>
            </div>
        );
    }
}

export default App;
