// 计算器逻辑 - 王芳 2024002
// 功能：四则运算、连续运算、取余、退格、清空、键盘输入、除零提示

class Calculator {
  constructor() {
    this.current = '0';   // 当前输入
    this.previous = null; // 上一个操作数
    this.operator = null; // 当前运算符
    this.waiting = false; // 是否等待下一个操作数
    this.init();
  }

  init() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleKey(btn.dataset.key));
    });
    document.addEventListener('keydown', e => this.handleKey(e.key));
  }

  handleKey(key) {
    if (/^[0-9]$/.test(key)) this.inputDigit(key);
    else if (key === '.') this.inputDot();
    else if (['+', '-', '*', '/', '%'].includes(key)) this.setOperator(key);
    else if (key === '=' || key === 'Enter') this.calculate();
    else if (key === 'C' || key === 'Escape') this.clear();
    else if (key === 'Backspace') this.backspace();
    this.updateDisplay();
  }

  inputDigit(d) {
    if (this.waiting) {
      this.current = d;
      this.waiting = false;
    } else {
      this.current = this.current === '0' ? d : this.current + d;
    }
  }

  inputDot() {
    if (this.waiting) {
      this.current = '0.';
      this.waiting = false;
      return;
    }
    if (!this.current.includes('.')) this.current += '.';
  }

  setOperator(op) {
    if (this.operator !== null && !this.waiting) {
      // 连续点击运算符时先算一次
      this.calculate();
    }
    this.operator = op;
    this.previous = this.current;
    this.waiting = true;
  }

  calculate() {
    if (this.operator === null || this.previous === null) return;
    const a = parseFloat(this.previous);
    const b = parseFloat(this.current);
    let result;

    switch (this.operator) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/':
        // 除零友好提示
        if (b === 0) {
          this.current = '不能除以0';
          this.operator = null;
          this.previous = null;
          return;
        }
        result = a / b;
        break;
      case '%': result = a % b; break;
      default: return;
    }
    // 处理浮点精度
    this.current = String(parseFloat(result.toFixed(10)));
    this.operator = null;
    this.previous = null;
    this.waiting = false;
  }

  backspace() {
    if (this.waiting) return;
    this.current = this.current.length > 1
      ? this.current.slice(0, -1)
      : '0';
  }

  clear() {
    this.current = '0';
    this.previous = null;
    this.operator = null;
    this.waiting = false;
  }

  updateDisplay() {
    document.getElementById('result').textContent = this.current;
    const expr = this.previous !== null
      ? `${this.previous} ${this.operator}`
      : ' ';
    document.getElementById('expression').textContent = expr;
  }
}

new Calculator();
