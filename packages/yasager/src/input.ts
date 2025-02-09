import * as readline from "readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const ask6DigitPin = async () => {
  let answer: string;
  try {
    answer = await rl.question("Enter the 6-digit pin code: ", {
      signal: AbortSignal.timeout(120_000), // 120s timeout
    });
  } finally {
    rl.close();
  }
  return answer;
};
