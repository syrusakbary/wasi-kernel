import { ExecCore } from "./process";

declare var self: DedicatedWorkerGlobalScope;



const core = new ExecCore({tty: true});


postMessage({stdin: core.stdin});

core.on('stream:out', ev => postMessage(ev));

addEventListener('message', (ev) => {
    if (ev.data.exec) core.start(ev.data.exec);
});