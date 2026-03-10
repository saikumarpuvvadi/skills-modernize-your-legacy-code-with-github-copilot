const readlineSync = require('readline-sync');

class DataProgram {
  constructor() {
    this.storageBalance = 1000.0;
  }

  execute(operationType, balance = 0) {
    if (operationType === 'READ') {
      return this.storageBalance;
    }

    if (operationType === 'WRITE') {
      this.storageBalance = balance;
      return this.storageBalance;
    }

    return this.storageBalance;
  }
}

class Operations {
  constructor(dataProgram, io) {
    this.dataProgram = dataProgram;
    this.io = io;
  }

  execute(passedOperation) {
    if (passedOperation === 'TOTAL ') {
      const finalBalance = this.dataProgram.execute('READ');
      this.io.print(`Current balance: ${finalBalance.toFixed(2)}`);
      return;
    }

    if (passedOperation === 'CREDIT') {
      const amount = Number(this.io.prompt('Enter credit amount: '));
      const finalBalance = this.dataProgram.execute('READ');
      const newBalance = finalBalance + amount;
      this.dataProgram.execute('WRITE', newBalance);
      this.io.print(`Amount credited. New balance: ${newBalance.toFixed(2)}`);
      return;
    }

    if (passedOperation === 'DEBIT ') {
      const amount = Number(this.io.prompt('Enter debit amount: '));
      const finalBalance = this.dataProgram.execute('READ');

      if (finalBalance >= amount) {
        const newBalance = finalBalance - amount;
        this.dataProgram.execute('WRITE', newBalance);
        this.io.print(`Amount debited. New balance: ${newBalance.toFixed(2)}`);
      } else {
        this.io.print('Insufficient funds for this debit.');
      }
    }
  }
}

function createReadlineIO() {
  return {
    prompt(questionText) {
      return readlineSync.question(questionText);
    },
    print(message) {
      console.log(message);
    }
  };
}

function runApp(io = createReadlineIO()) {
  let continueFlag = 'YES';

  const dataProgram = new DataProgram();
  const operations = new Operations(dataProgram, io);

  while (continueFlag !== 'NO') {
    io.print('--------------------------------');
    io.print('Account Management System');
    io.print('1. View Balance');
    io.print('2. Credit Account');
    io.print('3. Debit Account');
    io.print('4. Exit');
    io.print('--------------------------------');

    const userChoice = Number(io.prompt('Enter your choice (1-4): '));

    switch (userChoice) {
      case 1:
        operations.execute('TOTAL ');
        break;
      case 2:
        operations.execute('CREDIT');
        break;
      case 3:
        operations.execute('DEBIT ');
        break;
      case 4:
        continueFlag = 'NO';
        break;
      default:
        io.print('Invalid choice, please select 1-4.');
        break;
    }
  }

  io.print('Exiting the program. Goodbye!');
  return dataProgram.execute('READ');
}

if (require.main === module) {
  runApp();
}

module.exports = {
  DataProgram,
  Operations,
  createReadlineIO,
  runApp
};
