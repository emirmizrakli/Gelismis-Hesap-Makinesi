class Calculator {
    constructor() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.historyList = document.querySelector('.history-list');
        this.clear();
        this.loadHistory();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    }

    calculate() {
        let computation;
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
                    alert('Sıfıra bölme hatası!');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        this.addToHistory(`${prev} ${this.operation} ${current} = ${computation}`);
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    scientificOperation(operation) {
        const current = parseFloat(this.currentOperand);
        let result;

        switch (operation) {
            case 'sin':
                result = Math.sin(current * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(current * Math.PI / 180);
                break;
            case 'sqrt':
                if (current < 0) {
                    alert('Negatif sayının karekökü alınamaz!');
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'square':
                result = current * current;
                break;
            case 'log':
                if (current <= 0) {
                    alert('Logaritma için pozitif sayı gerekli!');
                    return;
                }
                result = Math.log10(current);
                break;
            case 'ln':
                if (current <= 0) {
                    alert('Doğal logaritma için pozitif sayı gerekli!');
                    return;
                }
                result = Math.log(current);
                break;
            case 'pi':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
            case 'factorial':
                if (current < 0 || !Number.isInteger(current)) {
                    alert('Faktöriyel için pozitif tam sayı gerekli!');
                    return;
                }
                result = this.factorial(current);
                break;
            case 'abs':
                result = Math.abs(current);
                break;
            default:
                return;
        }

        this.addToHistory(`${operation}(${current}) = ${result}`);
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        return n * this.factorial(n - 1);
    }

    addToHistory(calculation) {
        const history = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
        history.unshift(calculation);
        if (history.length > 10) history.pop();
        localStorage.setItem('calculatorHistory', JSON.stringify(history));
        this.updateHistory();
    }

    loadHistory() {
        this.updateHistory();
    }

    updateHistory() {
        const history = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
        this.historyList.innerHTML = '';
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = item;
            historyItem.addEventListener('click', () => {
                const result = item.split('=')[1].trim();
                this.currentOperand = result;
                this.updateDisplay();
            });
            this.historyList.appendChild(historyItem);
        });
    }

    clearHistory() {
        localStorage.removeItem('calculatorHistory');
        this.updateHistory();
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

const calculator = new Calculator();

// Event Listeners
document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        button.style.animation = 'buttonPress 0.2s ease';
        setTimeout(() => {
            button.style.animation = '';
        }, 200);
    });
});

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        button.style.animation = 'buttonPress 0.2s ease';
        setTimeout(() => {
            button.style.animation = '';
        }, 200);

        switch (action) {
            case 'clear':
                calculator.clear();
                break;
            case 'delete':
                calculator.delete();
                break;
            case 'calculate':
                calculator.calculate();
                break;
            default:
                calculator.chooseOperation(button.innerText);
        }
    });
});

document.querySelectorAll('.scientific').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        button.style.animation = 'buttonPress 0.2s ease';
        setTimeout(() => {
            button.style.animation = '';
        }, 200);
        calculator.scientificOperation(action);
    });
});

document.querySelector('.clear-history').addEventListener('click', () => {
    calculator.clearHistory();
});

// Theme Switcher
document.querySelectorAll('.theme-btn').forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.dataset.theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('calculatorTheme', theme);
    });
});

// Load saved theme
const savedTheme = localStorage.getItem('calculatorTheme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
}

// Klavye desteği
document.addEventListener('keydown', (event) => {
    if (/[0-9]/.test(event.key)) {
        calculator.appendNumber(event.key);
    } else if (event.key === '.') {
        calculator.appendNumber('.');
    } else if (event.key === '+') {
        calculator.chooseOperation('+');
    } else if (event.key === '-') {
        calculator.chooseOperation('-');
    } else if (event.key === '*') {
        calculator.chooseOperation('×');
    } else if (event.key === '/') {
        event.preventDefault();
        calculator.chooseOperation('÷');
    } else if (event.key === '%') {
        calculator.chooseOperation('%');
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculator.calculate();
    } else if (event.key === 'Backspace') {
        calculator.delete();
    } else if (event.key === 'Escape') {
        calculator.clear();
    }
}); 