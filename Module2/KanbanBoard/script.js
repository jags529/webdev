let isDeleteActive = false;
let colorArr = ['red', 'blue', 'orange', 'green'];
let ticketArr = [];


// Display existing tickets whe page is loaded
if(localStorage.getItem("storageArr")){
    ticketArr = JSON.parse(localStorage.getItem("storageArr"));
    for(let i = 0; i<ticketArr.length; i++){
        let ticketArrEle = ticketArr[i];
        createTicket(ticketArrEle.taskS, ticketArrEle.idS, ticketArrEle.colorS);
    }
}


// function to create ticket
function createTicket(task, id, color){
    let mainBody = document.querySelector('.main-body');
    let div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `<div class="card-top ${color}"></div>
    <div class="card-id">${id}</div>
    <div class="card-body">${task}</div>
    <div class="lock-unlock">
        <i class="fa-solid fa-lock"></i>
    </div>`;
    mainBody.append(div);

    

    // Adding Lock functionality (Make ticket task editable by clicking lock)
    let lockDiv = div.childNodes[6];
    let lockIcon = lockDiv.querySelector('.fa-lock');
    let isLocked = true;
    lockIcon.addEventListener('click', function(e){
        
        
        let taskBody = e.target.parentElement.previousElementSibling;
        if(isLocked){
            lockIcon.classList.remove('fa-lock');
            lockIcon.classList.add('fa-lock-open');
            isLocked = false;
            taskBody.setAttribute("contenteditable","true");
        }
        else{
            console.log(taskBody.innerText);
            lockIcon.classList.remove('fa-lock-open');
            lockIcon.classList.add('fa-lock');
            isLocked = true;
            taskBody.setAttribute("contenteditable","false");

            // updating in storage
            let ind = ticketArr.findIndex(function(obj){
                return obj.idS == id;
            })
            ticketArr[ind].taskS = taskBody.innerText;
            updateLocalStorage();
        }
    })
    
    // Add click event listener on new ticket for delete
    div.addEventListener('click', function(e){
        if(isDeleteActive){
            div.remove();

            // updating in storage
            let ind = ticketArr.findIndex(function(obj){
                return obj.idS == id;
            })
            ticketArr.splice(ind,1);
            updateLocalStorage();
        }
    })

    // Add color changing functionality when ticket is clicked at top
    let ticketColorCont = div.querySelector('.card-top');
    ticketColorCont.addEventListener('click', function(e){
        let ticketColor = e.target.classList[1];
        let colInd = findIndexOfStr(ticketColor, colorArr);
        e.target.classList.remove(ticketColor);
        e.target.classList.add(colorArr[(colInd+1)%4]);
        
        // updating in storage
        let ind = ticketArr.findIndex(function(obj){
            return obj.idS == id;
        })
        ticketArr[ind].colorS = colorArr[(colInd+1)%4];
        updateLocalStorage();
    })
}

// Open Create ticket Modal with Plus button
let plusBtn = document.querySelector('.fa-plus');
let isModalVisible = false;
plusBtn.addEventListener('click', function(e){
    let modal = document.querySelector('.modal');
    if(!isModalVisible){
        modal.style.display = 'flex';
        isModalVisible = true;
        modal.children[0].children[0].focus();
    }
    else{
        modal.style.display = 'none';
        isModalVisible = false;
        modal.children[0].children[0].value="";
    }

})

// function to find index of array which contains specific string
function findIndexOfStr(str, arr){
    for(let i = 0; i<arr.length; i++){
        if(arr[i].match(str)){
            return i;
        }
    }
    return -1;
}

// Creating ticket by pressing Enter in modal
let textArea = document.querySelector('textarea');
textArea.addEventListener('keydown', function(e){

    if(e.key=='Enter'){
        let task = e.target.value;
        const id = generateUniqueID();
        createTicket(task, id, modalColor);

        // adding to storage
        ticketArr.push({idS:id, taskS: task, colorS:modalColor});
        updateLocalStorage();

        // Clearing and hiding modal
        e.target.value = "";
        let modal = document.querySelector('.modal');
        modal.style.display = 'none';
        isModalVisible = false;

    }
})

// unique ID function
const existingIDs = ['AA1111','XY1234'];
const getRandomLetters = (length = 1) => Array(length).fill().map(e => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');
const getRandomDigits = (length = 1) => Array(length).fill().map(e => Math.floor(Math.random() * 10)).join('');
const generateUniqueID = () => {
  let id = getRandomLetters(2) + getRandomDigits(4);
  while (existingIDs.includes(id)) id = getRandomLetters(2) + getRandomDigits(4);
  return id;
};

// Add event listener on delete button
let delBtn = document.querySelector('.fa-trash');
delBtn.addEventListener('click', function(e){
    if(isDeleteActive){
        delBtn.classList.remove('red-font');
        isDeleteActive = false;
    }
    else{
        delBtn.classList.add('red-font');
        isDeleteActive = true;
    }
})

// Modal Color
let modalColorAll = document.querySelectorAll('.modal-color-cont');
let modalColor = 'red';
for(let i = 0; i<modalColorAll.length;i++){
    let modalColorCurrent = modalColorAll[i];
    modalColorCurrent.addEventListener('click', function(e){
        
        for(let j = 0; j<modalColorAll.length; j++){
            modalColorAll[j].classList.remove('outline');
        }
        e.target.classList.add('outline');
        modalColor = e.target.classList[1];
    })
}

// Filter functionality
let colorContAll = document.querySelectorAll('.color-cont');
for(let i = 0; i<colorContAll.length; i++){
    
    // click on color to enable filter
    colorContAll[i].addEventListener('click', function(e){
        let cardAll = document.querySelectorAll('.card');
        let colorContVal = e.target.classList[1];
        
        for(let j = 0; j<cardAll.length; j++){
            if(cardAll[j].children[0].classList.contains(colorContVal)){                
                cardAll[j].style.display = "inline";                
            }
            else{
                cardAll[j].style.display = "none";
            }            
        }
    })
    // double click on filter to remove filter
    colorContAll[i].addEventListener('dblclick', function(e){
        let cardAll = document.querySelectorAll('.card');
        for(let k = 0; k<cardAll.length; k++){
            cardAll[k].style.display = "inline";
        }
    })
}


// Local Storage Testing
let btn = document.querySelector('button');
btn.addEventListener('click', function(){
    updateLocalStorage();
})

// function for updating local storage
function updateLocalStorage(){
    let ticketArrStr = JSON.stringify(ticketArr);
    localStorage.setItem("storageArr",ticketArrStr);
}


