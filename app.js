
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

const allClearBtn = document.querySelector("[data-equals]");
const negativeBtn = document.querySelector("[data-negative]");
const percentBtn = document.querySelector("[data-percent]");
const equalsBtn = document.querySelector("[data-equals]");
const decimalBtn = document.querySelector("[data-decimal]");

// ÷

class Calculator {
    constructor(screen, allClear) {
        this.screen = screen;
        this.allClear = allClear;
        
        this.current = "";
        this.previous = "";
        this.op = undefined;
        this.addZero();
    }
    updateScreenFont() {
        const len = this.current.split(".").join("").length;
        const int = this.current.split(".")[0].length;
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
    updates() {
        this.updateScreenFont();
    }
    addZero() {
        if(this.current === "") this.screen.innerText = "0";
    }
    getClearInt() {
        return this.screen.innerText.split(",").join("");
    }
    setValue(value) {
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
        if(this.current === "") {
            if(value === ".") this.current = "0.";
            else this.current = value;
        } else this.current += value;
        this.setValue(this.current);
        this.updates();
    }

    makeItPercent() {
        this.current = (this.current / 100).toString();
        this.setValue(this.current);
        this.updates();
    }
}

const calc = new Calculator(screen, allClearBtn);

numbers.forEach(num => {
    num.addEventListener("click", e => {
        let value = e.target.innerText;
        calc.addNumber(value);
    });
});
decimalBtn.onclick = _ => {
    let value = screen.innerText;
    if(value.includes(".")) return;
    calc.addNumber(".");
}
operators.forEach(op => {
    op.addEventListener("click", e => {
        let value = e.target.innerText;
        operators.forEach(op=>op.classList.remove("active__op"));
        e.target.classList.add("active__op");
    });
});
percentBtn.onclick = _ => {
    calc.makeItPercent();
}



