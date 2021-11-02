'use strict';
document.addEventListener("DOMContentLoaded", () => {

    const calculator = () => {
        const calc = document.querySelector('.calculator'),
            input = calc.querySelector('.display__input'),
            output = calc.querySelector('.display__text');

        let symbols = [];
        let str = '';
        const calcFunc = {
            // функция показа строки в input
            showOnDisplay (symbol) {
                let { number: lastNumber} = this.findLastNumber(symbols);
                let lastIndex = symbols.length - 1;

                // если символ не проходит проверки - не выводим его и не добавляем в массив
                function checkSymbol (symbol) {
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
                        console.log("!!!")
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
                // Если первый символ 0 и длина строки 1  -  меняем ноль на соответсвующее число
                if( typeof lastNumber == 'string') {
                    if(symbol.match(/[1-9]/) && !lastNumber.match(/\./) && symbols[lastIndex] === '0') {
                        symbols[lastIndex] = symbol;
                        str = symbols.join('');
                        input.value = str;
                        return;
                    }
                }

                symbols.push(symbol);
                str+=symbol;
                input.value = str;
            },
            checkStaples () {
                let check = 0;
                let rightStaple = 0;
                let leftStaple = 0;
                for (let  i = 0; i < symbols.length; i++) {
                    let item = symbols[i];
                    if ( item === '(') {
                        check++;
                        rightStaple++;
                    } else if ( item === ')') {
                        check--;
                        leftStaple++;
                    }
                    if (leftStaple > rightStaple) {
                        throw new Error(" Закрывающих скобок больше открывающих");
                    }
                }
                return check === 0 ? true : false;
            },
            //Вычисления
            start(arr) {
            // Вычисления будут производится в соответствии с массивом приоритета выполнения действий
                function makePriority(arr) {
                    let chars = [];
                    let morePriority = 0;

                    for ( let i = 0; i < arr.length; i++) {
                        let item = arr[i];
                        if ( item === '(') {
                            morePriority+=100;
                        } else if ( item === ')') {
                            morePriority-=100;
                        }
                        // если перед минусом или плюсом есть ( , то она не будет внесена в массив
                        if ( (item === '-' || item === '+') && arr[i - 1] === '(' ) { continue; }
                        switch(item) {
                            case "+": chars.push( {name: "+", index: i,priority: 1 + morePriority,} );
                            break;
                            case "-": chars.push( {name: "-", index: i,priority: 1 + morePriority,} );
                            break;
                            case "/": chars.push( {name: "/", index: i,priority: 10 + morePriority,} );
                            break;
                            case "*": chars.push( {name: "*", index: i,priority: 10 + morePriority,} );
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
                    let lastExpressionIndex = null;
                    let count = 1;
                    // находим а
                    for ( let i = index-1; i >= 0; i--) {
                        // если перед числом есть знак выражнние ([-+] то выполняем и выходим
                        // нужно для того, чтобы в число а входил + или -
                        if ( arrFromDisplay[i].match(/[-+]/) && arrFromDisplay[i-1] === '(') {
                            firstExpressionIndex = i;
                            count++;
                            a.push(arrFromDisplay[i]);
                            break;
                        }

                        if ( !arrFromDisplay[i].match(/[\d.]/) ) {
                            break;
                        }
                        firstExpressionIndex = i;
                        count++;
                        a.push(arrFromDisplay[i]);
                    }
                    // находим b
                    for ( let i = index+1; i < arrFromDisplay.length; i++) {
                        if ( !arrFromDisplay[i].match(/[\d.]/) ) break;
                        lastExpressionIndex = i;
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
                    //(если числа были заключнены в скобки, то скобки тоже убираем)
                    if (newArr[firstExpressionIndex-1] === '(' && newArr[lastExpressionIndex+1] === ')') {
                        newArr.splice(firstExpressionIndex - 1,count + 2,`${total}`);
                    } else {
                        newArr.splice(firstExpressionIndex,count,`${total}`);
                    }
                }
                // Убирает скобки у числа заключенного в  них , например (321) = 321
                function changeNumInStaples () {
                    let regexp = /\((\d+)\)/g;
                    let matchAll = str.matchAll(regexp);
                    let lessIndex = 0;
                    matchAll = Array.from(matchAll)

                    for ( let i = 0; i<matchAll.length; i++) {
                        let curMatch = matchAll[i];
                        let clearNum = curMatch[1];
                        let totalItems = clearNum.length+2;
                        let firstIndex = curMatch.index + lessIndex;

                        arr.splice(firstIndex,totalItems, clearNum);
                        str = arr.join('');
                        arr = str.split('');
                        lessIndex -= 2;
                    }
                }
                // если не все скобки закрыты , то не продолжаем
                if ( !this.checkStaples() ) return false;
                // если есть выражение вида "[-+/*] )" - выходим
                if ( str.match(/[-+/*]\)/)) return false;
                // если в массиве нету хотя бы 2ух слагаемых или последний элемент массива - знак
                if ( !arr.join('').match(/\-?\.?\d+\.?[+*/-]\.?\(?\d+\)?/) || arr[arr.length - 1].match(/[-/+*]/)) return false;

                // если есть число , заключенное в скобки - убираем скобки
                if ( str.match(/\(\d+\)/) ) { changeNumInStaples();}
                
                let newArr = arr.slice();
                // Вычисляем значение выражения
                while (true) {
                    let sortChars = makePriority(newArr);
                    if( sortChars.length === 0) break;  
                    result(newArr,sortChars[0]);
                    //sortChars.splice(0,1);
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
                // возвращаем число,его индекс в исходном массиве и длину
                return {
                    number: a,
                    index: firstIndex,
                    length: elements,
                };
            },
            // Здесь выводим выражение в output
            showInOutput() {
                let totalStr = String(calcMethod.total);
                let boolean = true;
                // ожидаем закрытие скобок
                if ( !this.checkStaples()) { boolean = false; }
                // если есть выражение вида "[-+/*] )" или последний символ - знак
                if ( str.match(/[-+/*]\)/) || str[str.length - 1].match(/[-+/*]/)) { boolean = false; }
                // если есть 2 слагаемых - выводим результат
                if (boolean && symbols.join('').match(/-?\d+\.?[-+/*]\d+\.?/)) {
                    output.textContent = `${symbols.join('')} = ${totalStr}`;
                    
                    if ( calcMethod.total > 100000) {
                        totalStr = `${totalStr[0]},${totalStr.slice(2,5)}*10^${totalStr.slice(1,-1).length + 1}`;
                    }

                    if(str.length > 12) {
                        if (calcMethod.total > Math.pow(10,14)) {
                            console.log(Math.pow(10,14))
                            output.textContent = "bigNumber";
                        } else {
                            output.textContent = `${symbols.slice(0,10).join('')}... = ${totalStr}`;
                        }
                    }
                } else {
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
                } else if ( str.match(/\/0/)) {
                    throw new ValidationError("Деление на 0!");
                } else if ( str.match(/\d+\.\d+\./) || str.match(/\.\d+\./) || str.match(/\.{2}/)) {
                    throw new ValidationError("Много точек");
                } else if ( str.match(/[^/+*\d.()-]/i) && str.length > 0) {
                    throw new ValidationError("Недопустимые символы");
                } else if ( str.match(/[+/*-]\.[+/*-]/)) {
                    throw new ValidationError("Лишние знаки");
                } else if (str.match(/\d+\(/)) {
                    throw new ValidationError("Перед скобкой нет знака действия");
                } else if ( str.match(/\(\)/)) {
                    throw new ValidationError("Пустые скобки");
                } else if ( str.match(/\([/*]/)) {
                    throw new ValidationError("Недопустимые знаки после скобки");
                }
            },
            // меняем шрифт у input
            changeFont(str) {
                if (str.length >= 26) {
                    input.style.fontSize = "15px";
                } else if (str.length >= 18) {
                    input.style.fontSize = "20px";
                } else if (str.length >= 15) {
                    input.style.fontSize = "28px";
                } else {
                    input.style.fontSize = "35px";
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
                // делим последнее число на 100 (если проходим проверку)
                let lastIndex = str.length - 1;
                if (str[lastIndex].match(/[-+/*]/) || (str.match(/[-+/*]\./) && str[lastIndex] === '.') || (str[0] === '.' && str.length === 1)) return;
                let {number,index,length} = calcFunc.findLastNumber(symbols);
                number = `${+(number/100).toFixed(5)}`;
                symbols.splice(index, length, number);
                str = symbols.join('');
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
                    case "staples":
                        if (e.target.closest('button').dataset.action === 'staple-right') {
                            calcFunc.showOnDisplay('(');
                        } else if (e.target.closest('button').dataset.action === 'staple-left')  {
                            calcFunc.showOnDisplay(')');
                        }
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
            calcFunc.changeFont(str);
            try {
                // Проверяем ошибки
                calcFunc.isError(str);
                // запуск основной функции
                calcMethod.success = calcFunc.start(symbols);
                // вывод в output
                calcFunc.showInOutput();
            } catch(err) {
                output.textContent = "Ошибка";
                console.log(err.message);
            }
        });

        input.addEventListener( 'input', () => {
            calcFunc.changeFont(str);
            try {
                // получаем массив из input
                symbols = input.value.split('');
                // получаем строку
                str = symbols.join('');
                calcFunc.isError(str);
                calcMethod.success = calcFunc.start(symbols);
                calcFunc.showInOutput();
            } catch (err) {
                output.textContent = "Ошибка";
                console.log(err.message);
            }
        });
    };
    calculator();
});