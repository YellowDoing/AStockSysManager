const { ipcRenderer } = require('electron')

let codes = getStorageData('codes')
let names = getStorageData('names')

initBounds();




if(codes.length > 0 && names.length > 0){
    getStockData(true,codes.join(','));

}

function getStorageData(key){
    let data = localStorage.getItem(key);
    console.log(data)
    if(data  == null || data == ''){
        return []
    }else{
        return data.split(',')
    }
}

setInterval(() => {
    if (codes.length > 0) {
        getStockData(false, codes.join(','));
    }
}, 3000);
//codes.join(',')

function getStockData(needCreate, symbols) {
    fetch('https://stock.xueqiu.com/v5/stock/realtime/quotec.json?symbol=' + symbols)
        .then((e) => {
            e.json().then((json) => {
                let length = json.data.length;
                for (let i = 0; i < length; i++) {
                    const stock = json.data[i];
                    if (needCreate) {
                        createStockTr(stock)
                    }
                    updateStockData(stock)
                }
            })
        })
}

let input = document.getElementById('input');
let inputVisible = false;

input.addEventListener('keydown', (e) => {
    if (e.key == "Enter") {
        let value = e.target.value;
        let keys = value.split(' ');
        if (keys[0] == 'add' && keys.length > 2) {
            names.push(keys[1])
            codes.push(keys[2])
            getStockData(true, keys[2]);
           
        } else if (keys[0] == 'remove' && keys.length > 1) {
            let index = names.indexOf(keys[1]);

            names.splice(index, 1)
            codes.splice(index, 1)

            let table = document.getElementById('table');
            table.removeChild(table.childNodes[index + 2])

        } else if (keys[0] == 'clear') {
            names = [];
            codes = [];
            let table = document.getElementById('table');
            let length = table.childNodes.length;
            for (let i = 2; i < length; i++) {
                table.removeChild(table.childNodes[2])
            }
        }

        localStorage.setItem('codes',codes.join(','))
        localStorage.setItem('names',names.join(','))
        e.target.value = ''

    }
})


function createStockTr(stock) {

    let symbol = stock['symbol'];

    let index = codes.indexOf(symbol);

    let stockName = names[index];

    let tr = document.createElement('tr')


    let tdSymbol = document.createElement('td')
    let tdCurrent = document.createElement('td')
    let tdPercent = document.createElement('td')
    let tdChg = document.createElement('td')

    tdSymbol.innerHTML = stockName
    tdCurrent.setAttribute('id', symbol + 'current')
    tdPercent.setAttribute('id', symbol + 'percent')
    tdChg.setAttribute('id', symbol + 'chg')

    tdChg.setAttribute('class', 'tdEnd')
    tdSymbol.setAttribute('class', 'tdStart')
    tdCurrent.setAttribute('class', 'tdCenter')
    tdPercent.setAttribute('class', 'tdCenter')

    tr.appendChild(tdSymbol)
    tr.appendChild(tdPercent)
    tr.appendChild(tdCurrent)
    tr.appendChild(tdChg)
    

    document.getElementById('table').appendChild(tr)

}

function updateStockData(stock) {

    let symbol = stock['symbol'];

    let tdCurrent = document.getElementById(symbol + 'current')
    let tdPercent = document.getElementById(symbol + 'percent')
    let tdChg = document.getElementById(symbol + 'chg')

    tdCurrent.innerHTML = stock['current'];
    tdPercent.innerHTML = stock['percent'] + '%';
    tdChg.innerHTML = stock['chg'];
}

function initBounds(){
    let width =localStorage.getItem('width')
    let height =localStorage.getItem('height')
    if(width == null || width == ''){
        width = 300;
    }else
        width = Number.parseInt(width)
    if(height == null || height == ''){
        height = 360;
    }else
        height = Number.parseInt(height )
    
    ipcRenderer.send('content-bounds', {
        width:width,
        height:height,
    })


    ipcRenderer.on('save-content-bounds', (event, arg) => {
        console.log(arg) 
        localStorage.setItem('width',arg.width)
        localStorage.setItem('height',arg.height)
    })
    
}


window.addEventListener('keyup', (event)=>{
    if(event.key == 'Alt'){
        console.log('输入命令')
        input.style.visibility = inputVisible  ? 'hidden':'visible'
        inputVisible = !inputVisible;
    }
}, true)