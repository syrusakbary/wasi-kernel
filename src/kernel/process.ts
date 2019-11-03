import { EventEmitter } from 'events';

import { Stdin, TransformStreamDuplex } from './streams';
import { SignalVector, ChildProcessQueue } from './bits/proc';

import { Worker } from './bindings/workers';
import { SharedQueue } from './bits/queue';
import { ExecCore, ExecCoreOptions } from './exec';



abstract class ProcessBase extends EventEmitter {

    opts: ProcessStartupOptions

    stdin:  TransformStreamDuplex
    stdout: TransformStreamDuplex

    stdin_raw: Stdin
    sigvec: SignalVector
    childq: ChildProcessQueue

    constructor(opts: ProcessStartupOptions) {
        super();
        this.opts = opts;
        
        if (typeof TextEncoderStream !== 'undefined') {
            this.stdin = new TransformStreamDuplex(new TextEncoderStream());
            this.stdin.on('data', bytes => this.stdin_raw.write(bytes));

            this.stdout = new TransformStreamDuplex(new TextDecoderStream());
        }
        else if (typeof process !== 'undefined') {
            process.stdin.on('data', buf => this.stdin_raw.write(buf));
            this.stdout = <any>process.stdout;
        }
    }

    abstract exec(wasm: string): void;
}


/**
 * Suitable for running a WASI process in a Web Worker or
 * a Node.js worker thread.
 */
class WorkerProcess extends ProcessBase {

    worker : Worker

    constructor(wasm : string, workerJs : string, opts: ProcessStartupOptions={}) {
        super(opts);
        
        this.worker = new Worker(workerJs);
        this.worker.addEventListener('message', ev => {
            if (ev.data.stdin)  this.stdin_raw = Stdin.from(ev.data.stdin);
            if (ev.data.sigvec) this.sigvec = SignalVector.from(ev.data.sigvec);
            if (ev.data.childq) this.childq = SharedQueue.from(ev.data.childq);
            if (ev.data.fd)     this.stdout.write(ev.data.data);

            if (ev.data.event)  this.emit(ev.data.event, ev.data.arg, wasm);

            if (ev.data.event === 'spawn') {
                // Emulate subprocess 1 exiting (for testing)
                setTimeout(() => {
                    console.log("- wake rainbow -");
                    this.childq.enqueue(ev.data.arg.pid);
                }, 1000);
            }
        });

        if (wasm) this.exec(wasm);
    }

    exec(wasm: string) {
        this.worker.postMessage({exec: wasm, opts: this.opts});
    }
}


class BareProcess extends ProcessBase {

    core: ExecCore;

    constructor(wasm: string, opts: ProcessStartupOptions={}) {
        super(opts);
        this.exec(wasm);
    }

    async exec(wasm: string) {
        const {ExecCore} = await import('./exec');  // on-demand import

        this.core = new ExecCore(this.opts);
        this.core.on('stream:out', ev => process.stdout.write(ev.data));
        try {
            await this.core.start(wasm, this.opts.argv);
            this.emit('exit', {code: 0});
        }
        catch (err) {
            this.emit('error', err, wasm);
        }
    }
}


type ProcessStartupOptions = ExecCoreOptions & {
    argv?: string[];
}



export { WorkerProcess, BareProcess, ProcessStartupOptions }
