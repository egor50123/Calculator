'use strict';
document.addEventListener("DOMContentLoaded", () => {

    const calculator = () => {
        const calc = document.querySelector('.calculator'),
            input = calc.querySelector('.display__input'),
            output = calc.querySelector('.display__text');

        let symbols = [];
        let str = '';
        const calcFunc = {
            // функция показа сторки в input
            showOnDisplay (symbol) {
                let lastIndex = symbols.length - 1;
                // если символ не проходит проверки - не выодим его и не добавляем в массив
                function checkSymbol (symbol) {
                    let { number: lastNumber} = calcFunc.findLastNumber(symbols);
                    let bollean = false;
                    // Настройка для корректного показа "."
                    if ( lastNumber && symbol === '.' && lastNumber.includes('.')) {
                        console.log(" уже есть точка");
                        bollean = true;
                    }
                    // Настройка для корректного показа  0
                    if ( symbol === '0' ) {
                        //Если длина массива больше 1 , предпоследний символ является знаком , последний символ не точка и не цифра
                        if (symbols.length > 1 && symbols[lastIndex - 1].match(/[/+*-]/) && !symbols[lastIndex].match(/[.\d]/)){
                            console.log(" error 2");
                            bollean = true;
                        // если последнее число в массиве не включает в себя цифры от 1 до 9 или точку и последний символ - 0
                        } else if( typeof lastNumber == 'string' && !lastNumber.match(/[1-9.]/) && symbols[lastIndex] === '0') {
                            console.log(" error 3");
                            bollean = true;
                        }
                    }
                    //Убираем 0 если поле него идет цифра (если ноль не часть числа до точки)
                    if( !lastNumber && symbol.match(/\d/) && symbols[lastIndex] === '0') {
                        symbols.splice(-1,1);
                        str = str.slice(0,-1);
                    }

                    return bollean;

                }
                // если функция возвращает true - выходим
                if (checkSymbol(symbol)) return;
                // если в начале жмем на символ знака , то добавляем дополнительный 0
                if ( symbol.match(/[/*+.-]/) && symbols.length === 0) {                   
                    symbols.push('0');
                    str = '0';
                //если нажата точка и  перед  ней есть знак,добавляем перед точкой 0
                } else if ( symbol.includes('.') && symbols[lastIndex].match(/[-+/*]/)) {                   
                    symbols.push('0')
                    str += '0';
                }
                //смена знака
                if (symbol.match(/[/+*-]/) && symbols[symbols.length - 1].match(/[/+*-]/)) {
                    symbols[symbols.length - 1] = symbol;
                    str = str.slice(0,-1) + symbol;
                    input.value = str;
                    return;
                }

                symbols.push(symbol);
                str+=symbol;
                input.value = str;
            },
            //Вычисления
            start(arr) {
                // Вычисления будут производится в соответствии с массивом приоритета выполнения действий
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

                // Вычисляет значение выражения из 2ух слагаемых
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

                    //вместо предыдущих 2ух слагаемых подставляем тотал
                    return newArr.splice(firstExpressionIndex,count,`${total}`)
                }
            // если в массиве нету хотя бы 2ух слагаемых или последний элемент массива - знак
            if ( !arr.join('').match(/\-?\.?\d+\.?[+*/-]\.?\d+/) || arr[arr.length - 1].match(/[-/+*]/)) return false;
                let newArr = arr.slice();
                console.log("go");

                // Вычисляем значение выражения из дисплея
                while (true) {
                    let sortChars = makePriority(newArr);
                    if( sortChars.length === 0) break;
                    result(newArr,sortChars[0]);
                    sortChars.splice(0,1);
                }
                // Если true, можем прожать знак равно (выполнить функцию calcMethod.equally())
                return true;
            },
            //находим последнее число в массиве
            findLastNumber (arr) {
                let a = [];
                let firstIndex = 0;
                let elements = 0;
                if ( arr.length !== 0 && arr[arr.length - 1].match(/[\d.]/)) {
                    for (let i = arr.length - 1; i>=0; i--) {
                        if ( !arr[i].match(/[\d.]/) ) break;
                        elements++;
                        firstIndex = i;
                        a.push(arr[i]);
                    }
                    a = a.reverse().join('');
                }
                // возвращаем число,его индекс м исходном массиве и длину
                return {
                    number: a,
                    index: firstIndex,
                    length: elements,
                };
            },
            // Здесь выводим выражение в output
            showInOutput() {
                let totalStr = String(calcMethod.total);

                // если есть 2 слагаемых - выводим результат 
                if (symbols.join('').match(/-?\d+\.?[-+/*]\d+\.?/g)) {
                    output.textContent = `${symbols.join('')} = ${totalStr}`;

                    if ( calcMethod.total > 1000000 ) {
                    totalStr = `${totalStr[0]},${totalStr.slice(2,7)}*10^${totalStr.slice(7,-1).length + 1}`;
                    }

                    if(str.length > 8) {
                        output.textContent = `${symbols.slice(0,10).join('')}... = ${totalStr}`;
                    }
                } else  {
                    output.textContent = '';
                }

            },
            // Ищем ошибки
            isError(str) {
                class ValidationError extends Error {
                    constructor(message) {
                      super(message);
                      this.name = "SyntaxError";
                    }
                }
                if (str.match(/[-+/*]{2}/) ) {
                    throw new ValidationError("Лишние знаки");
                }

                if ( str.match(/\/0/)) {
                    throw new ValidationError("Деление на 0!");
                }
                
                if ( str.match(/\d+\.\d+\./) || str.match(/\.\d+\./) || str.match(/\.{2}/)) {
                    throw new ValidationError("Много точек");
                }

                if ( str.match(/[^/+*\d.-]/i) && str.length > 0) {
                    throw new ValidationError("Недопустимые символы");
                }
                
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
            percent() {
                let {number,index,length} = calcFunc.findLastNumber(symbols);
                number = `${+(number/100).toFixed(5)}`;
                symbols.splice(index, length, number);
                str = symbols.join('')
                input.value = str;
                
            },
            division(a,b) {
                this.total = +(Number(a)/Number(b)).toFixed(5);
                return +(Number(a)/Number(b)).toFixed(5);
            },
            multiplication(a,b) {
                this.total = +(Number(a)*Number(b)).toFixed(5);
                return +(Number(a)*Number(b)).toFixed(5);
            },
            minus(a,b) {
                this.total = +(Number(a)-Number(b)).toFixed(5);
                return +(Number(a)-Number(b)).toFixed(5);
            },
            add(a,b) {
                this.total = +(Number(a)+Number(b)).toFixed(5);
                return +(Number(a)+Number(b)).toFixed(5);
            },
            equally() {
                if (this.success) {
                    input.value = this.total;
                    symbols = `${this.total}`.split('').slice();
                    str = `${this.total}`;
                    this.total = 0;
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
                        calcMethod.percent(symbols);
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

            try {
                calcFunc.isError(str);
                calcMethod.success = calcFunc.start(symbols);
                calcFunc.showInOutput();
            } catch(err) {
                output.textContent = "Ошибка";
            }
        });

        input.addEventListener( 'input', () => {
            try {
                symbols = input.value.split('');
                str = symbols.join('');
                calcFunc.isError(str);
                calcMethod.success = calcFunc.start(symbols);
                calcFunc.showInOutput();
            } catch (err) {
                output.textContent = "Ошибка";
            }
        });

        console.log()
    };
    calculator();
});