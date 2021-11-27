import { CerbymaskWindow, TransactionFieldsT } from '@cerbymask/cerbymask-lib';

declare let window: CerbymaskWindow;

export function createTransaction() {
    const transaction = { from: "Hello World", to: "From here" } as TransactionFieldsT
    window.cerbymask.submitTransaction(transaction)
}