![](/home/aritra/Desktop/codebench/title.png)

# codebench

The ultimate tool to benchmark your Javascript/Typescript code.

## Documentation

### 📚 Table of Contents

[TOC]

### ⚙️ Installation and Usage

```shell
npm i codebench
OR
bun add codebench
```

```typescript
import { CodeBench } from 'codebench';
```



### 💼 Benchmark Suites

All CodeBench instances are treated as a suite and each of the suites contain cases.

`const cb = new CodeBench(config);`

- `config.iterations: number`

  Number of times a case would be re-executed. A higher value would give a more accurate result but would require more time to complete whereas a lower value would give less accurate result but would require less time to complete. Default value is `1`.

- `config.onError: () => { }`

  Function passed which would be executed if any of the tests encounter error while the benchmark was running.



### 📑 Test Cases

Each block of code added to the benchmark suite is a Case.

`<CodeBench>.addCase(description, function)`

Example:

```typescript
const cb = new CodeBench()
	.addCase("foo function", () => {
		// do something
	});
```



### 🏃 Run benchmark

`<CodeBench>.runBenchmark()`

This starts the benchmarking after all the cases have been added to the suite.

**⚠️ CAUTION:** This function runs asynchronously so it returns a promise and hence should be ***awaited*** else might result into weird errors.
