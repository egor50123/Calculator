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
                function checkLastSymbol (symbol) {
                    let lastNumber = calcFunc.findLastNumber(symbols);

                    if ( symbol.match(/[/+*]/) && symbols.length === 0) {                   
                        input.value = '';
                        console.log("Нельзя начинать строку с 0 или служебных знаков (кроме минуса)");
                        return true;
                    }
                    ///console.log("Нельзя писать несколко точек в числе");
                    if ( lastNumber && symbol === '.' && lastNumber.includes('.')) {
                        console.log("есть точка");
                        return true;
                    }
                    //if ( lastNumber.includes('.'))
                //     // if ( symbol === '0' && symbols[symbols.length - 1].match(/[/+*-]/)) {
                //     //     console.log("Нельзя писать 0 после служебных знаков");
                //     //     return true;
                //     // }
                //     //if ( )
                }
                if (checkLastSymbol(symbol)) return;

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
                if ( !arr.join('').match(/[/+*.-]\d/)) return;
                newArr = arr.slice();

                if ( newArr[newArr.length - 1].match(/[/+*.-]/)) return;
                while (true) {
                    let sortChars = makePriority(newArr);
                    if( sortChars.length === 0) break;
                    result(newArr,sortChars[0]);
                    sortChars.splice(0,1);

                }
            },
            findLastNumber (arr) {
                let a = [];
                if ( arr.length !== 0 && arr[arr.length - 1].match(/[\d.]/)) {
                    let lastIndex = null;
                    for (let i = arr.length - 1; i>=0; i--) {
                        lastIndex = i;
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
                input.value = this.total;
            }
        }
            
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
            calcFunc.start(symbols);

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