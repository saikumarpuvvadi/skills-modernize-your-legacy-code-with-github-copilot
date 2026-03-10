const { runApp } = require('./index');

function createMockIO(inputs) {
  const outputs = [];
  let pointer = 0;

  return {
    outputs,
    prompt() {
      const value = inputs[pointer];
      pointer += 1;
      return value === undefined ? '' : String(value);
    },
    print(message) {
      outputs.push(String(message));
    }
  };
}

describe('COBOL parity business logic tests', () => {
  test('TC-001: displays main menu on app start', () => {
    const io = createMockIO(['4']);
    runApp(io);

    expect(io.outputs).toEqual(
      expect.arrayContaining([
        'Account Management System',
        '1. View Balance',
        '2. Credit Account',
        '3. Debit Account',
        '4. Exit'
      ])
    );
  });

  test('TC-002: shows initial balance as 1000.00', () => {
    const io = createMockIO(['1', '4']);
    runApp(io);

    expect(io.outputs).toContain('Current balance: 1000.00');
  });

  test('TC-003: handles invalid menu option and continues', () => {
    const io = createMockIO(['5', '4']);
    runApp(io);

    expect(io.outputs).toContain('Invalid choice, please select 1-4.');
    const menuCount = io.outputs.filter((line) => line === 'Account Management System').length;
    expect(menuCount).toBe(2);
  });

  test('TC-004: exits on option 4', () => {
    const io = createMockIO(['4']);
    runApp(io);

    expect(io.outputs[io.outputs.length - 1]).toBe('Exiting the program. Goodbye!');
  });

  test('TC-005: credit increases balance', () => {
    const io = createMockIO(['2', '200', '1', '4']);
    runApp(io);

    expect(io.outputs).toContain('Amount credited. New balance: 1200.00');
    expect(io.outputs).toContain('Current balance: 1200.00');
  });

  test('TC-006: debit with sufficient funds decreases balance', () => {
    const io = createMockIO(['3', '250', '1', '4']);
    runApp(io);

    expect(io.outputs).toContain('Amount debited. New balance: 750.00');
    expect(io.outputs).toContain('Current balance: 750.00');
  });

  test('TC-007: debit with insufficient funds keeps balance unchanged', () => {
    const io = createMockIO(['3', '1200', '1', '4']);
    runApp(io);

    expect(io.outputs).toContain('Insufficient funds for this debit.');
    expect(io.outputs).toContain('Current balance: 1000.00');
  });

  test('TC-008: sequential transactions persist in same run', () => {
    const io = createMockIO(['2', '300', '3', '100', '1', '4']);
    runApp(io);

    expect(io.outputs).toContain('Current balance: 1200.00');
  });

  test('TC-009: repeated balance inquiry is read-only', () => {
    const io = createMockIO(['1', '1', '4']);
    runApp(io);

    const balances = io.outputs.filter((line) => line === 'Current balance: 1000.00');
    expect(balances.length).toBe(2);
  });

  test('TC-010: balance resets to default on new app run', () => {
    const firstRun = createMockIO(['2', '100', '4']);
    runApp(firstRun);

    const secondRun = createMockIO(['1', '4']);
    runApp(secondRun);

    expect(secondRun.outputs).toContain('Current balance: 1000.00');
  });

  test('TC-011: exact-balance debit is allowed', () => {
    const io = createMockIO(['3', '1000', '1', '4']);
    runApp(io);

    expect(io.outputs).toContain('Amount debited. New balance: 0.00');
    expect(io.outputs).toContain('Current balance: 0.00');
  });

  test('TC-012: zero credit leaves balance unchanged', () => {
    const io = createMockIO(['2', '0', '1', '4']);
    runApp(io);

    expect(io.outputs).toContain('Amount credited. New balance: 1000.00');
    expect(io.outputs).toContain('Current balance: 1000.00');
  });

  test('TC-013: zero debit leaves balance unchanged', () => {
    const io = createMockIO(['3', '0', '1', '4']);
    runApp(io);

    expect(io.outputs).toContain('Amount debited. New balance: 1000.00');
    expect(io.outputs).toContain('Current balance: 1000.00');
  });

  test('TC-014: negative amount behavior is documented as-is', () => {
    const creditFlow = createMockIO(['2', '-50', '1', '4']);
    runApp(creditFlow);
    expect(creditFlow.outputs).toContain('Amount credited. New balance: 950.00');
    expect(creditFlow.outputs).toContain('Current balance: 950.00');

    const debitFlow = createMockIO(['3', '-50', '1', '4']);
    runApp(debitFlow);
    expect(debitFlow.outputs).toContain('Amount debited. New balance: 1050.00');
    expect(debitFlow.outputs).toContain('Current balance: 1050.00');
  });

  test('TC-015: non-numeric amount behavior is documented as-is', () => {
    const creditFlow = createMockIO(['2', 'abc', '1', '4']);
    runApp(creditFlow);
    expect(creditFlow.outputs).toContain('Amount credited. New balance: NaN');
    expect(creditFlow.outputs).toContain('Current balance: NaN');

    const debitFlow = createMockIO(['3', 'abc', '1', '4']);
    runApp(debitFlow);
    expect(debitFlow.outputs).toContain('Insufficient funds for this debit.');
    expect(debitFlow.outputs).toContain('Current balance: 1000.00');
  });
});
