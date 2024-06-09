
// step one handle Phone time
const timeElement = document.querySelector(".time");
const padStart = time => time.toString().padStart(2, "0");
const setTime = _ => {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let format = "";
    if(hours < 12) format = "AM";
    else format = "PM";
    if(hours > 12) hours -= 12;
    else if(hours === 0) hours = 12;
    timeElement.innerHTML = `<span>${padStart(hours)}</span>:<span>${padStart(minutes)}</span> ${format}`;
}
setTime();
window.addEventListener("load", _ => {
    setInterval(setTime, 1000);
});


// step two handle Phone calculator
const screen = document.querySelector(".screen");

const numbers = document.querySelectorAll("[data-number]");
const operators = document.querySelectorAll("[data-operation]");

const allClearBtn = document.querySelector("[data-all-clear]");
const negativeBtn = document.querySelector("[data-negative]");
const percentBtn = document.querySelector("[data-percent]");
const equalsBtn = document.querySelector("[data-equals]");
const decimalBtn = document.querySelector("[data-decimal]");

/* ÷ */

class Calculator {
    constructor(screen, allClear, operationBtns) {
        this.screen = screen;
        this.allClear = allClear;
        this.operators = operationBtns;
        
        this.current = "";
        this.previous = "";
        this.op = undefined;
        this.updates();
    }
    // Change all clear button inner text
    changeAllClear() {
        if(this.current !== "") this.allClear.innerText = "C";
        else this.allClear.innerText = "AC";
    }
    updateScreenFont() {
        const len = this.screen.innerText.split(".").join("").length;
        const int = this.screen.innerText.split(".")[0].length;
        if(len === 7) {
            if(int < 4) this.screen.style.fontSize = "3.7rem";
            else if(int > 4) this.screen.style.fontSize = "3.6rem";
        } else if (len === 8) {
            if(int < 4) this.screen.style.fontSize = "3.3rem";
            else if(int > 4) this.screen.style.fontSize = "3.2rem";
        } else if (len > 8) {
            if(int < 4) this.screen.style.fontSize = "3rem";
            else if(int > 4) this.screen.style.fontSize = "2.9rem";
        }
    }
    addZero() {
        if(this.current === "") this.screen.innerText = "0";
    }
    updates() {
        this.addZero();
        this.updateScreenFont();
        this.changeAllClear();
    }
    getClearInt() {
        return this.screen.innerText.split(",").join("");
    }
    setValue(value) {
        if(value === "-") {
            const curr = this.getClearInt();
            const [int, dec] = curr.split(".");
            if(curr.at() !== "-") {
                if(dec) {
                    this.screen.innerText = `-${parseFloat(int).toLocaleString()}.${dec}`;
                } else {
                    this.screen.innerText = `-${parseFloat(int).toLocaleString()}`;
                }
            } else {
                if(dec) {
                    this.screen.innerText = `${parseFloat(int.slice(1)).toLocaleString()}.${dec}`;
                } else {
                    this.screen.innerText = `${parseFloat(int.slice(1)).toLocaleString()}`;
                }
            }
            
            return;
        }
        if(value === ".") {
            this.current = "0.";
            this.screen.innerText = this.current;
            return;
        }
        if(value.at(-1) === ".") {
            this.screen.innerText = parseFloat(value).toLocaleString()+".";
            return;
        }
        if(value.includes("e")) {
            this.screen.innerText = value;
            return;
        }
        if(value.includes(".")) {
            const [int, dec] = value.split(".");
            this.screen.innerText = `${parseFloat(int).toLocaleString()}.${dec}`;
        } else {
            this.screen.innerText = parseFloat(value).toLocaleString();
        }
    }
    addNumber(value) {
        const len = this.current.split(".").join("").length;
        if(len === 9) return;
        if(this.current === "") this.current = value;
        else this.current += value;
        this.setValue(this.current);
        this.updates();
    }
    makeItPercent() {
        this.current = (this.current / 100).toString();
        this.setValue(this.current);
        this.updates();
    }
    clear() {
        if(this.current === "") {
            this.previous = "";
            this.op = undefined;
            this.operators.forEach(op=>op.classList.remove("active__op"));
        } else {
            this.current = "";
            this.updates();
        }
        this.changeAllClear();
    }
    makeItNegative() {
        this.setValue("-");
    }
    calcValue() {
        let final;
        const currentValue = parseFloat(this.getClearInt());
        switch(this.op) {
            case "÷" :
                final = parseFloat(this.previous) / currentValue;
                break;
            case "-":
                final = parseFloat(this.previous) - currentValue;
                break;
            case "×":
                final = parseFloat(this.previous) * currentValue;
                break;
            case "+":
                final = parseFloat(this.previous) + currentValue;
                break;
        }
        const len = final.toString().split(".").join("").length;
        if(final.toString().includes(".")){
            const int = final.toString().split(".")[0];
            if(len > 9 && int.length < 9) {
                const decLen = 9 - int.length;
                final = final.toFixed(decLen);
            }
        }
        return parseFloat(final).toString();
    }
    addOperation(value) {
        if(this.previous === "" && this.op === undefined) {
            this.previous = this.current || 0;
            this.current = "";
            this.op = value;
        } else {
            const sumValue = this.calcValue();
            this.op = value;
            this.previous = sumValue.toString();
            this.current = "";
            this.setValue(this.previous);
        }
        this.updateScreenFont();
    }
    getEqual() {
        if(this.op && this.previous) {
            this.current = this.calcValue();
            this.previous = "";
            this.op = undefined;
            this.operators.forEach(op=>op.classList.remove("active__op"));
            this.setValue(this.current);
            this.updates();
        }
    }

}

const calc = new Calculator(screen, allClearBtn, operators);

numbers.forEach(num => {
    num.addEventListener("click", e => {
        let value = e.target.innerText;
        calc.addNumber(value);
    });
});
decimalBtn.onclick = _ => {
    let value = calc.current;
    if(value.includes(".")) return;
    calc.addNumber(".");
}
operators.forEach(op => {
    op.addEventListener("click", e => {
        let value = e.target.innerText;
        operators.forEach(op=>op.classList.remove("active__op"));
        e.target.classList.add("active__op");
        calc.addOperation(value);
    });
});
percentBtn.onclick = _ => {
    calc.makeItPercent();
}
allClearBtn.onclick = _ => {
    calc.clear();
}
negativeBtn.onclick = _ => {
    calc.makeItNegative();
}
equalsBtn.onclick = _ => {
    calc.getEqual();
}
