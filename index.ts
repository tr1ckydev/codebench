import chalk from 'chalk';
import { performance } from 'perf_hooks';

namespace Styles {
    export const error = chalk.bgRedBright.bold.italic;
    export const title = chalk.bgYellow.red.bold.italic;
}

interface Config {
    iterations?: number;
    delay?: number;
    onError?: (error: Error) => void;
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Stopwatch {
    private timer = 0;
    start() { this.timer = performance.now(); }
    stop() { return performance.now() - this.timer; }
    reset() { this.timer = 0; }
}

export class CodeBench {

    private cases: { description: string, func: Function }[] = [];
    private results: { description: string, timeTaken: number[], avgTimeTaken: number }[] = [];
    private config: Config = {
        iterations: 1,
        onError: (error) => this.printOutput("ERROR", error),
    };

    constructor(config?: Config) {
        this.config = Object.assign(this.config, config);
    }

    public addCase(description: string, func: Function) {
        this.cases.push({ description, func });
        return this;
    }

    get casesCount() {
        return this.cases.length;
    }

    public async runBenchmark() {
        const sw = new Stopwatch();
        let i = this.cases.length + 1;
        while (--i) {
            const func = this.cases[i - 1].func;
            const timeTaken: number[] = [];
            let totalTime = 0;
            let j = this.config.iterations + 1;
            while (--j) {
                sw.start();
                try { await func(); } catch (error) {
                    this.config.onError(error); return;
                }
                const elapsed = sw.stop();
                timeTaken.push(elapsed);
                totalTime += elapsed;
                if (this.config.delay) await sleep(this.config.delay);
                sw.reset();
            }
            this.results.push({
                description: this.cases[i - 1].description,
                timeTaken,
                avgTimeTaken: totalTime / this.config.iterations
            });
        }
        this.results.sort((a, b) => a.avgTimeTaken - b.avgTimeTaken);
        this.printOutput("RESULT");
    }

    private printOutput(type: "ERROR" | "RESULT", data?: Error) {
        console.clear();
        switch (type) {
            case "ERROR":
                console.log(Styles.error(" CodeBench Error "), "\n └─ ⚠️ Benchmark has been aborted as one of the test(s) ran into an error !\n");
                console.log(data);
                break;
            case "RESULT":
                console.log(
                    Styles.title(" CodeBench Results "),
                    chalk.green.bold("\n🚀 Winner:"), chalk.bgBlack(this.results[0].description),
                    chalk.gray("\n └─ ⏳ Time taken was"), this.results[0].avgTimeTaken.toFixed(2), "ms\n"
                );
                break;
        }
    }

}

const cb = new CodeBench()
    .addCase("helo", () => { throw new Error("fuck") })
    .addCase("helo", () => { });

await cb.runBenchmark();