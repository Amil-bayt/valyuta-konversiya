//https://v6.exchangerate-api.com/v6/1fbc43e81a1a0b8369e8bf2e/latest/USD

const apiKey = '1fbc43e81a1a0b8369e8bf2e';
const apiUrl = 'https://v6.exchangerate-api.com/v6/';

let fromCurrency = 'RUB';
let toCurrency = 'USD';

let currentRate = 1;
let currentReverseRate = 1;

let activeInput = 'input1'; // default olaraq sol input

fetch(`${apiUrl}${apiKey}/latest/USD`)
    .then(res => res.json())
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });

const btnGroup1 = document.querySelectorAll('.buttons1 button');
const btnGroup2 = document.querySelectorAll('.buttons2 button');

const div1p = document.querySelector('.div1p');
const div2p = document.querySelector('.div2p');

const input1 = document.querySelector('.number1');
const input2 = document.querySelector('.number2');

//aşağıdakı p 

function updateRates() {
    updateConversion();
}

document.querySelectorAll('.buttons1 button').forEach(button => {
    button.addEventListener('click', () => {
        fromCurrency = button.className.replace(/[0-9]/g, '');
        updateRates();
    });
});

document.querySelectorAll('.buttons2 button').forEach(button => {
    button.addEventListener('click', () => {
        toCurrency = button.className.replace(/[0-9]/g, '');
        updateRates();
    });
});

// updateRates();

// input . ,
const inputs = document.querySelectorAll('.number1, .number2');
inputs.forEach(input => {
    input.addEventListener('input', (e) => {
        const pos = input.selectionStart;
        let newValue = input.value.replace(/,/g, '.');

        // input maksimum 4 hissəsi
        const decimalIndex = newValue.indexOf('.');
        if (decimalIndex !== -1) {
            newValue = newValue.substring(0, decimalIndex + 5);
        }

        newValue = newValue
            .replace(/[^0-9.]/g, '')
            .replace(/(\..*)\./g, '$1');
        input.value = newValue;
        input.setSelectionRange(pos, pos);
    });
});

// buttons onclick
document.querySelectorAll('button').forEach(button => {
    button.onclick = () => {
        let group = button.parentElement;
        group.querySelectorAll('button').forEach(btn => {
            btn.style.backgroundColor = '#fff';
            btn.style.color = '#959BA4';
        });
        button.style.backgroundColor = '#833AE0';
        button.style.color = '#fff';
    };
});

// internet 

const connectionWarning = document.getElementById('internetsiz');

window.addEventListener('offline', () => {
    connectionWarning.style.display = 'block';
});

window.addEventListener('online', () => {
    connectionWarning.style.display = 'none';
});

// ........................

function setActiveButton(group, currency) {
    group.forEach(btn => {
        const cur = btn.className.replace(/[0-9]/g, '');
        if (cur === currency) {
            btn.style.backgroundColor = '#833AE0';
            btn.style.color = '#fff';
        } else {
            btn.style.backgroundColor = '#fff';
            btn.style.color = '#959BA4';
        }
    });
}

function updateConversion() {
    const v1 = parseFloat(input1.value.replace(',', '.'));
    const v2 = parseFloat(input2.value.replace(',', '.'));

    if (fromCurrency === toCurrency) {
        div1p.textContent = `1 ${fromCurrency} = 1 ${toCurrency}`;
        div2p.textContent = `1 ${toCurrency} = 1 ${fromCurrency}`;

        if (activeInput === 'input1' && !isNaN(v1)) {
            input2.value = v1.toFixed(4);
        } else if (activeInput === 'input2' && !isNaN(v2)) {
            input1.value = v2.toFixed(4);
        }
        return;
    }

    fetch(`${apiUrl}${apiKey}/latest/${fromCurrency}`)
        .then(res => res.json())
        .then(data => {
            currentRate = data.conversion_rates[toCurrency];
            currentReverseRate = 1 / currentRate;

            div1p.textContent = `1 ${fromCurrency} = ${currentRate.toFixed(4)} ${toCurrency}`;
            div2p.textContent = `1 ${toCurrency} = ${currentReverseRate.toFixed(4)} ${fromCurrency}`;

            if (activeInput === 'input1' && !isNaN(v1)) {
                input2.value = (v1 * currentRate).toFixed(4);
            } else if (activeInput === 'input2' && !isNaN(v2)) {
                input1.value = (v2 * currentReverseRate).toFixed(4);
            }
        })
        .catch(err => console.error('Fetch error:', err));
}



btnGroup1.forEach(btn => {
    btn.addEventListener('click', () => {
        fromCurrency = btn.className.replace(/[0-9]/g, '');
        setActiveButton(btnGroup1, fromCurrency);
        updateConversion(activeInput);
    });
});
btnGroup2.forEach(btn => {
    btn.addEventListener('click', () => {
        toCurrency = btn.className.replace(/[0-9]/g, '');
        setActiveButton(btnGroup2, toCurrency);
        updateConversion(activeInput);
    });
});

input1.addEventListener('focus', () => {
    activeInput = 'input1';
});
input1.addEventListener('input', () => {
    if (activeInput !== 'input1') activeInput = 'input1';
    updateConversion(activeInput);
});

input2.addEventListener('focus', () => {
    activeInput = 'input2';
});
input2.addEventListener('input', () => {
    if (activeInput !== 'input2') activeInput = 'input2';
    updateConversion(activeInput);
});


//default rub usd
window.addEventListener('DOMContentLoaded', () => {
    setActiveButton(btnGroup1, fromCurrency);
    setActiveButton(btnGroup2, toCurrency);
    // input1.value = '5000';       // inputa default dəyər vermək
    updateConversion(activeInput);
});
