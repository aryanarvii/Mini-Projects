



const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[strength-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");


// string of symbols to randomly select one of them
const symbols = '~`!@#$%^&*()_-+=[]{}"?<>,./';

let password = "";  //initially no password
let passwordLength = 10;  // default length of password to be generated

// Number of checkboxes ticked initially 
let checkCount = 1;


// function to set password length on UI
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    // For slider background-image->
    // observation: when we slide, the color before the slider portion changes
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min)) + "% 100%"
    // formula is used for width and the ->100% is used for height
}

handleSlider();
setIndicator("#ccc")


// Set indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


// Generating a Random Integer between the range of given min to max
// range for an integer -> 0-9
// range for an lowercase letter -> 97-123 Similarly for others
function getRndInteger(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9) ;
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,91));
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123));
}

function generateSymbol() {
    const randNum=getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}


// Password Strength Calculation
function calcStrength() {
    let hasUpper =false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

function handleCheckBoxChange() {
    checkCount=0;
    allCheckBox.forEach((checkbox) => 
    {
        if(checkbox.checked)
        checkCount++;
    });

    //Special Condition Check

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
    
};

// applying event listener by iterating through all the boxes
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
    
});


// copy password function
async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }

    catch(e){
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add("active");

    setTimeout( ()=> {
        copyMsg.classList.remove("active");
    },2000);
}



inputSlider.addEventListener("input", (e)=>{
    passwordLength=e.target.value;  // value of input slider is copied into password length
    handleSlider(); // updates value in the UI
});

copyBtn.addEventListener("click", function(e){
    if(passwordDisplay.value)
        copyContent();
});



function shufflePassword(array) {
    //Fisher Yates Algorithm to shuffle

    for (let i = array.length-1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i+1));
        
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;  
    }

    // changing it into string.
    let str = "";
    array.forEach((el) => (str += el));
    return str;
};



generateBtn.addEventListener('click', () =>{
    if (checkCount==0) {
        return alert('You have not checked any boxes!');
    }

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    //remove old password
    password="";

    // array to store random character generating functions
    // so that we can randomly choose one of them to get a random
    // character
    let funcArr = [];

    // check ingredients needed to be present and
    // inserting random generators into an array
    if(uppercaseCheck.checked)
    funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
    funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
    funcArr.push(generateSymbol);


    // compulsory checked addition
    // that is minimum prefered types of characters to 
    // form the password.
    // In other words, Checked fields to be included.
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
        // adding based on the checkbox sequence
    }

    // remaining addition

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        
        // generating a random index to randomly 
        // choose from the checked options to fill
        // the remaining required length of the password.
        let randomIndex = getRndInteger(0, funcArr.length);
        password+= funcArr[randomIndex]();
    }


    // We need to shuffle becoz the initial characters
    // are generated in the checked sequence
    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();

});