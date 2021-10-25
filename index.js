'use strict';
console.log();
document.addEventListener("DOMContentLoaded", () => {

    const calculator = () => {
        const calc = document.querySelector('.calculator'),
            input = calc.querySelector('.display__input'),
            output = calc.querySelector('.display__text');

        let symbols = [];
        let newArr = [];
        let str = '';
        const calcFunc = {
            showOnDisplay (symbol) {
                function checkSymbol (symbol) {
                    let lastNumber = calcFunc.findLastNumber(symbols);
                    let lastIndex = symbols.length - 1
                    let bollean = false;
                    // Настройка для корректного показа "."
                    if ( lastNumber && symbol === '.' && lastNumber.includes('.')) {
                        console.log(" уже есть точка");
                        bollean = true;
                    }
                    // Настройка для корректного показа  0
                    if ( symbol === '0' ) {
                        if (symbols.length > 1 && symbols[lastIndex - 1].match(/[/+*-]/) && !symbols[lastIndex].match(/[.\d]/)){
                            console.log(" error 2");
                            bollean = true;
                        } else if( !lastNumber.includes('.') && symbols[lastIndex] === '0') {
                            console.log(" error 3");
                            bollean = true;
                        }
                    }
                    //Убираем 0 если поле него идет цифра (если ноль не часть числа до точки)
                    if( !lastNumber && symbol.match(/\d/) && symbols[lastIndex] === '0') {
                        symbols.splice(-1,1);
                        str = str.slice(0,-1);
                        console.log("!!!");
                    }

                    return bollean;

                }
                if (checkSymbol(symbol)) return;

                if ( symbol.match(/[/*+-]/) && symbols.length === 0) {                   
                    symbols.push('0');
                    str = '0';
                }

                if (symbol.match(/[/+*-]/) && symbols[symbols.length - 1].match(/[/+*-]/)) {
                    console.log("Замена знака");
                    symbols[symbols.length - 1] = symbol;
                    str = str.slice(0,-1) + symbol;
                    input.value = str;
                    return;
                }

                symbols.push(symbol);
                str+=symbol;
                input.value = str;
            },
            start(arr) {
                function makePriority(arr) {
                    let  chars = [];
                        for ( let i = 0; i < arr.length; i++) {
                            let item = arr[i];
                            switch(item) {
                                case "+": chars.push( {name: "+", index: i,priority: 1,} );
                                break;
                                case "-": chars.push( {name: "-", index: i,priority: 1,} );
                                break;
                                case "/": chars.push( {name: "/", index: i,priority: 10,} );
                                break;
                                case "*": chars.push( {name: "*", index: i,priority: 10,} );
                                break;
                                default: break;
                            }
                        }
                    chars.sort( (a,b) => b.priority - a.priority);
                    return chars;
                }
                function result(arrFromDisplay,{name, index}) {
                    let total = null;
                    let a = [];
                    let b = [];
                    let firstExpressionIndex = null;
                    let count = 1;
                    
                    for ( let i = index-1; i >= 0; i--) {
                      if ( !arrFromDisplay[i].match(/[\d.]/) ) {
                        break;
                      }
                      firstExpressionIndex = i;
                      count++;
                      a.push(arrFromDisplay[i]);
                    }
                    
                    for ( let i = index+1; i < arrFromDisplay.length; i++) {
                      if ( !arrFromDisplay[i].match(/[\d.]/) ) {
                        break;
                      }
                      count++;
                      b.push(arrFromDisplay[i]);
                    }

                    a = a.reverse().join("");
                    b = b.join("");

                    switch(name) {
                        case "-": total = calcMethod.minus(a,b);
                            break;
                        case "+": total = calcMethod.add(a,b);
                            break;
                        case "/": total = calcMethod.division(a,b);
                            break;
                        case "*": total = calcMethod.multiplication(a,b);
                            break;
                    }
                    return newArr.splice(firstExpressionIndex,count,`${total}`)
                }
                // Проверка есть ли в массиве хотя бы 2 слагаемых
                if ( (!arr.join('').match(/[/+*.-]\d/)) || arr[arr.length - 1].match(/[/+*.-]/)) return false;
                newArr = arr.slice();

                while (true) {
                    let sortChars = makePriority(newArr);
                    if( sortChars.length === 0) break;
                    result(newArr,sortChars[0]);
                    sortChars.splice(0,1);
                }
                return true;
            },
            findLastNumber (arr) {
                let a = [];
                if ( arr.length !== 0 && arr[arr.length - 1].match(/[\d.]/)) {
                    for (let i = arr.length - 1; i>=0; i--) {
                        if ( !arr[i].match(/[\d.]/) ) break;
                        a.push(arr[i]);
                    }
                    a = a.reverse().join('');
                }
                return a;
            }
        };

        const calcMethod = {
            total: null,
            success: false,
            clear() {
                str = '';
                symbols = [];
                input.value = str;
                output.textContent = str;
            },
            clearSymbol() {
                str = str.slice(0,-1);
                symbols.pop();
                input.value = str;
            },
            percent(arr) {
                //calcFunc.findLastNumber(symbols);
            },
            division(a,b) {
                this.total = Number(a)/Number(b);
                return Number(a)/Number(b);
            },
            multiplication(a,b) {
                this.total = Number(a)*Number(b);
                return Number(a)*Number(b);
            },
            minus(a,b) {
                this.total = Number(a)-Number(b);
                return Number(a)-Number(b);
            },
            add(a,b) {
                this.total = Number(a)+Number(b);
                return Number(a)+Number(b);
            },
            float() {},
            equally() {
                if (this.success) {
                    input.value = this.total;
                    symbols = [`${this.total}`];
                    str = `${this.total}`;
                }
            }
        };
            
        calc.addEventListener('click', e => {
            let target = e.target.closest('td');
            if(!target) return;
            
            let action = target.dataset.action;
            let number = target.dataset.number;

            if (action) {
                switch (action) {
                    case "clear":
                        calcMethod.clear();
                        break;
                    case "clear-symbol":
                        calcMethod.clearSymbol();
                        break;
                    case "percent":
                        calcMethod.percent();
                        break;
                    case "division":
                        calcFunc.showOnDisplay('/');
                        break;
                    case "multiplication":
                        calcFunc.showOnDisplay('*');
                        break;
                    case "minus":
                        calcFunc.showOnDisplay('-');
                        break;
                    case "add":
                        calcFunc.showOnDisplay('+');
                        break;
                    case "float":
                        calcFunc.showOnDisplay('.');
                        break;
                    case "equally":
                        calcMethod.equally();
                        break;
                }
            } else if (number) {
                switch(number) {
                    case "1":
                        calcFunc.showOnDisplay(number);
                        break;
                    case "2":
                        calcFunc.showOnDisplay(number);
                        break;
                    case "3":
                        calcFunc.showOnDisplay(number);
                        break;
                    case "4":
                        calcFunc.showOnDisplay(number);
                        break;
                    case "5":
                        calcFunc.showOnDisplay(number);
                        break;
                    case "6":
                        calcFunc.showOnDisplay(number);
                        break;
                    case "7":
                        calcFunc.showOnDisplay(number);
                        break;
                    case "8":
                        calcFunc.showOnDisplay(number);
                        break;
                    case "9":
                        calcFunc.showOnDisplay(number);
                        break;
                    case "0":
                        calcFunc.showOnDisplay(number);
                        break;
                }
            }

            calcMethod.success = calcFunc.start(symbols);

            if ( symbols.length && symbols.join('').match(/[/+*-]/)) {
                output.textContent = `${symbols.join('')} = ${calcMethod.total}`;
            }

            if (symbols.length && symbols[symbols.length - 1].match(/[/+*.-]/)) {
                output.textContent = '';
            }
        });
    };

    calculator();
});