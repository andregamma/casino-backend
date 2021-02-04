import rl from 'readline';

const reader = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export default class Questioner {
  public readonly reader = reader;

  public ask(question): Promise<string> {
    return new Promise((resolve) => {
      reader.question(`${question} `, (data) => {
        resolve(data.toLowerCase());
      });
    });
  }

  public end() {
    this.reader.close();
  }
}

export { reader };
