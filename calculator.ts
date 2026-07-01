/**
 * Simple Calculator - TypeScript Implementation
 * This file contains the TypeScript logic for the calculator app.
 * To compile: tsc calculator.ts --outDir .
 */

class Calculator {
  private previousOperandElement: HTMLElement;
  private currentOperandElement: HTMLElement;
  private currentOperand: string;
  private previousOperand: string;
  private operation: string | undefined;
  private shouldResetScreen: boolean;

  constructor(previousOperandElement: HTMLElement, currentOperandElement: HTMLElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
  }

  clear(): void {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
  }

  delete(): void {
    if (this.currentOperand === '0') return;
    if (this.currentOperand.length === 1) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
  }

  appendNumber(number: string): void {
    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.shouldResetScreen = false;
    }
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }
  }

  chooseOperation(operation: string): void {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand + ' ' + operation;
    this.currentOperand = '0';
  }

  compute(): void {
    let computation: number;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
        computation = prev * current;
        break;
      case '÷':
        if (current === 0) {
          alert('Cannot divide by zero!');
          this.clear();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    // Round to avoid floating point precision issues
    this.currentOperand = String(Math.round(computation * 100000000) / 100000000);
    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;
  }

  percent(): void {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;
    this.currentOperand = String(current / 100);
  }

  updateDisplay(): void {
    this.currentOperandElement.textContent = this.currentOperand;
    this.previousOperandElement.textContent = this.previousOperand;
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const previousOperandElement = document.getElementById('previousOperand')!;
  const currentOperandElement = document.getElementById('currentOperand')!;
  const calculator = new Calculator(previousOperandElement, currentOperandElement);

  // Number buttons
  document.querySelectorAll<HTMLButtonElement>('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendNumber(button.dataset.number!);
      calculator.updateDisplay();
    });
  });

  // Operator buttons
  document.querySelectorAll<HTMLButtonElement>('[data-operator]').forEach(button => {
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.dataset.operator!);
      calculator.updateDisplay();
    });
  });

  // Clear button
  document.querySelector<HTMLButtonElement>('[data-action="clear"]')?.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
  });

  // Delete button
  document.querySelector<HTMLButtonElement>('[data-action="delete"]')?.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
  });

  // Percent button
  document.querySelector<HTMLButtonElement>('[data-action="percent"]')?.addEventListener('click', () => {
    calculator.percent();
    calculator.updateDisplay();
  });

  // Equals button
  document.querySelector<HTMLButtonElement>('[data-action="equals"]')?.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
  });

  // Keyboard support
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
      calculator.appendNumber(e.key);
      calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-') {
      calculator.chooseOperation(e.key);
      calculator.updateDisplay();
    } else if (e.key === '*') {
      calculator.chooseOperation('×');
      calculator.updateDisplay();
    } else if (e.key === '/') {
      e.preventDefault();
      calculator.chooseOperation('÷');
      calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
      calculator.compute();
      calculator.updateDisplay();
    } else if (e.key === 'Backspace') {
      calculator.delete();
      calculator.updateDisplay();
    } else if (e.key === 'Escape') {
      calculator.clear();
      calculator.updateDisplay();
    } else if (e.key === '%') {
      calculator.percent();
      calculator.updateDisplay();
    }
  });
});
