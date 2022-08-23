function checkTime(){
    let currentDay = moment().format("MMMM DD, YYYY");
    let displayDate = document.getElementById("date");
    displayDate.innerHTML = currentDay
};

checkTime(); // run checkTime function
setInterval(checkTime, 1000); // timer updates every second

// BMI Calculator
$(function () {
    $("#bmi").hide();
});

$("#bmiBtn").click(function () {
    $('.nutrition').hide();
    $('.exercise').hide();
    $('#bmi').show();
});

function calculateBmi() {
    let weight = document.getElementById("weight").value
    let height = document.getElementById("height").value
    let bmi = (weight / (height * height) * 703)

    document.getElementById("heading").innerHTML = "Your BMI is:&nbsp";
    document.getElementById("bmi-output").innerHTML = bmi.toFixed(1)
    console.log(bmi);

    if (bmi <= 18.4) {
        document.getElementById("message").innerHTML = "&nbsp&nbsp&nbsp You are underweight"
    } else if (bmi <= 25 && bmi >= 18.4) {
        document.getElementById("message").innerHTML = "&nbsp&nbsp&nbsp You have a healthy weight"
    } else {
        document.getElementById("message").innerHTML = "&nbsp&nbsp&nbsp You are overweight"
    }
}
// Clear Local Storage btn
function deleteItems(){
    localStorage.removeItem("nutritionRow");
    // localStorage.clear();
     location.reload();
}


$(function(){
    $(".exercise").hide();
});

$("#exerBtn").click(function () {
    $('.nutrition').hide();
    $("#bmi").hide();
    $('.exercise').show();
});

$("#nutriBtn").click(function() {
    $('.exercise').hide();
    $("#bmi").hide();
    $('.nutrition').show();
});

$("#exerciseSearch").submit(function (event) {
    event.preventDefault();

    $('.modal').show();
    var intensityInput = document.getElementsByName("intensity");
    for (var i = 0; i < intensityInput.length; i++) {
        if (intensityInput[i].checked) {
            var intensityValue = intensityInput[i].value
        }
    }
    var typeInput = document.getElementsByName("type");
    for (var i = 0; i < typeInput.length; i++) {
        if (typeInput[i].checked) {
            var typeValue = typeInput[i].value
        }
    }
    var muscleInput = document.getElementsByName("muscle");
    for (var i = 0; i < muscleInput.length; i++) {
        if (muscleInput[i].checked) {
            var muscleValue = muscleInput[i].value
        }
    }
    let requestUrl = 'https://api.api-ninjas.com/v1/exercises?muscle=' + muscleValue + '&difficulty=' + intensityValue + '&type=' + typeValue
    fetch(requestUrl, {
        headers: {
            'X-Api-Key': 'GKg0l9hlc0fRJEHUdIsVzw==lti9bU3OVAYwF8Wk'
        }
    })
    .then(function (response) {
        return response.json();

    })
    .then(function (data) {
        $(".saved-exercises").hide()
        $('.exercise-selection-body').text("")
        if (data.length===0){
            $('.exercise-selection-body').text("No Results Found")
            return
        }  
        for(var i=0; i < data.length; i++) {
            var name = data[i].name
            var equipment = data[i].equipment
            var instructions = data[i].instructions
            var results = $(`<input type="radio" name="result" data-name="${name}" data-equipment="${equipment}" data-instructions="${instructions}"/><label for="result"/>${name}<br>`);
            results.on("change",saveworkout)
            $('.exercise-selection-body').append(results)
        }
    });
});
function saveworkout(){
    var workouts=JSON.parse(localStorage.getItem("workouts"))||[]
    var workout={
        name:this.dataset.name,
        equipment:this.dataset.equipment,
        instructions:this.dataset.instructions,
    }
    workouts.push(workout)
    $("#savebutton").on("click",function(){
        localStorage.setItem("workouts",JSON.stringify(workouts))

    })
}
$(".exercises-saved").click(function(){
    $(".saved-exercises").show()
    var workouts=JSON.parse(localStorage.getItem("workouts"))||[]

    for(var i=0; i < workouts.length; i++) {
        var name = workouts[i].name
        var equipment = workouts[i].equipment
        var instructions = workouts[i].instructions
        var results = $(`<div><h3>${name}</h3><p>equipment: ${equipment}</p><p>instructions: ${instructions}</p></div><br>`);
        $('.saved-exercise-body').append(results)
    }

})
$(".remove-button").click(function(){
    localStorage.removeItem("workouts");
    $('.saved-exercise-body').empty()


})

$('.delete, .cancel-button').click(function(){
    $(".modal").hide();
});

let amount = '';
let unit = "";
let food = "";
let displayedUnit = "";
let amountInput = $('#amountInput');
let unitInput = $('#unitInput');
let itemInput = $('#itemInput');
let table = $('table');

// nutrition page functionality

//prevent negative numbers from being typed in Amount, html min="0" covers the up/down arrows
var inputNumber = document.getElementById('amountInput');

inputNumber.onkeydown = function(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58) 
      || e.keyCode == 8)) {
        return false;
    }
}
//prevent numbers from being typed in food field
var foodInput = document.getElementById('itemInput');

//check for all text input is either text, backspace or space
foodInput.onkeydown = function(e) {
    if(!((e.keyCode > 64 && e.keyCode < 91)
      || e.keyCode == 8 || e.keyCode == 32 || e.keyCode == 46)) {
        return false;
    }
}

//prevent letters from being typed in BMI fields
var bmiInput = document.getElementById('weight', 'height');

bmiInput.onkeydown = function(e) {
    if(!((e.keyCode > 47 && e.keyCode < 58)
      || e.keyCode == 8)) {
        return false;
    }
}

//display information if any exists in local storage
if (localStorage.getItem('nutritionRow') !== null) {
    printSavedNutrition();
}

$('#submitBtn').on('click', function () {
    //hide notification
    $(".notification").addClass("is-hidden");

    food = itemInput.val();
    food.trim().toLowerCase();
    food.split("");

    //remove any spaces within the item and replace with %20
    for (let i = 0; i < food.length; i++) {
        if (food[i] = " ") {
            food[i] = "%20";
        }
    }
    food.toString();

    unit = unitInput.val();

    //if unit input is used, use fetch request with only food item name
    if (unit === "item") {
        itemNotif();
        let itemUrl = 'https://api.api-ninjas.com/v1/nutrition?query=' + food;
        displayedUnit = "item";
        getData(itemUrl);
        return;
    }

    //assign user input to API queries and clean up extra spaces

    amount = amountInput.val().trim();
    displayedUnit = amount + unit;

    if (amount === "") {
        errorMessage();
        return;
    }

    parseInt(amount,10);
    //exit request if amount is negative
    if (amount < 0 ) {
        return;
    }

    //round as only whole numbers are taken
    amount = Math.round(amount).toString();

   
    // call API with user input
    let requestNutriUrl = 'https://api.api-ninjas.com/v1/nutrition?query=' + amount + '%20' + unit + '%20' + food;
    getData(requestNutriUrl);
})

function printNutrition(data) {
    let newRow = $('<tr>');

    let itemInfo = $('<td>');
    itemInfo.text(data[0].name+" ("+displayedUnit+")").addClass('nameInfo');
    newRow.append(itemInfo);

    let calInfo = $('<td>');
    calInfo.text(data[0].calories).addClass('calInfo');
    newRow.append(calInfo);

    let protInfo = $('<td>');
    protInfo.text(data[0].protein_g).addClass('protInfo');
    newRow.append(protInfo);

    let carInfo = $('<td>');
    carInfo.text(data[0].carbohydrates_total_g).addClass('carInfo');
    newRow.append(carInfo);

    let fatInfo = $('<td>');
    fatInfo.text(data[0].fat_total_g).addClass('fatInfo');
    newRow.append(fatInfo);

    let sodInfo = $('<td>');
    sodInfo.text(data[0].sodium_mg).addClass('sodInfo is-hidden-mobile');
    newRow.append(sodInfo);

    let cholInfo = $('<td>');
    cholInfo.text(data[0].cholesterol_mg).addClass('cholInfo is-hidden-mobile');
    newRow.append(cholInfo);

    let remove = $('<td>');
    let removeBtn = $('<button>')
    removeBtn.addClass('removeBtn').text('X');
    remove.append(removeBtn);
    newRow.append(remove);

    table.append(newRow);
    sumTotal();
}

function addToArray(data) {
    let newSaved = [];

    if (localStorage.getItem('nutritionRow') !== null) {
        newSaved = JSON.parse(localStorage.getItem('nutritionRow'));
    }

    newSaved.push(data[0].name+" ("+displayedUnit+")");
    newSaved.push(data[0].calories);
    newSaved.push(data[0].protein_g);
    newSaved.push(data[0].carbohydrates_total_g);
    newSaved.push(data[0].fat_total_g);
    newSaved.push(data[0].sodium_mg);
    newSaved.push(data[0].cholesterol_mg);

    rowSaved(newSaved);
}

//function to fetch API info
async function getData(url) {
    let response = await fetch(url, {
        headers: {
            'X-Api-Key': 'GKg0l9hlc0fRJEHUdIsVzw==lti9bU3OVAYwF8Wk'
        }
    });
    let data = await response.json();
    console.log(data);
    //check output if blank or name nan
    if (data.length === 0 || data[0].name === 'nan') {
        errorMessage();
        return;
    }
    printNutrition(data);
    addToArray(data);
}

//save row into local storage
function rowSaved(newSaved) {
    localStorage.setItem('nutritionRow', JSON.stringify(newSaved));
}

//function to print all food info already saved in local storage
function printSavedNutrition() {
    let savedNArray = JSON.parse(localStorage.getItem('nutritionRow'));
    for (let i = 0; i < (savedNArray.length / 7); i++) {
        let base = 7;
        base = base * i;

        let newRow = $('<tr>');

        let itemInfo = $('<td>');
        itemInfo.text(savedNArray[base]).addClass('nameInfo');
        newRow.append(itemInfo);

        let calInfo = $('<td>');
        calInfo.text(savedNArray[base + 1]).addClass('calInfo');
        newRow.append(calInfo);

        let protInfo = $('<td>');
        protInfo.text(savedNArray[base + 2]).addClass('protInfo');
        newRow.append(protInfo);

        let carInfo = $('<td>');
        carInfo.text(savedNArray[base + 3]).addClass('carInfo');
        newRow.append(carInfo);

        let fatInfo = $('<td>');
        fatInfo.text(savedNArray[base + 4]).addClass('fatInfo');
        newRow.append(fatInfo);

        let sodInfo = $('<td>');
        sodInfo.text(savedNArray[base + 5]).addClass('sodInfo is-hidden-mobile');
        newRow.append(sodInfo);

        let cholInfo = $('<td>');
        cholInfo.text(savedNArray[base + 6]).addClass('cholInfo is-hidden-mobile');
        newRow.append(cholInfo);

        let remove = $('<td>');
        let removeBtn = $('<button>')
        removeBtn.addClass('removeBtn').text('X');
        remove.append(removeBtn);
        newRow.append(remove);

        table.append(newRow);
        sumTotal();
    }
}

//remove button both removes the row from the diaply and local storage
$("#foodValues").on('click', '.removeBtn', function () {
    let removedName = $(this).parent().siblings('.nameInfo').text();
    let removedCal = $(this).parent().siblings('.calInfo').text();
    $(this).closest('tr').remove();
    sumTotal();
    let oldSaved = JSON.parse(localStorage.getItem('nutritionRow'));
    for (let i = 0; i < oldSaved.length; i++) {
        if (oldSaved[i] === removedName && oldSaved[i + 1] == removedCal) {
            oldSaved.splice(i, 7);
            console.log(oldSaved);
            localStorage.setItem('nutritionRow', JSON.stringify(oldSaved));
            return;
        }
    }
})

//aggregate all the amounts from the page displayed in the total row
function sumTotal() {
    let calInfoTot = 0;
    let protInfoTot = 0;
    let carInfoTot = 0;
    let fatInfoTot = 0;
    let sodInfoTot = 0;
    let cholInfoTot = 0;


    $(".calInfo").each(function () {
        let totalcal = this.textContent;
        calInfoTot = calInfoTot + parseInt(totalcal);
    })
    $(".protInfo").each(function () {
        let totalprot = this.textContent;
        protInfoTot = protInfoTot + parseInt(totalprot);
    })
    $(".carInfo").each(function () {
        let totalcar = this.textContent;
        carInfoTot = carInfoTot + parseInt(totalcar);
    })
    $(".fatInfo").each(function () {
        let totalfat = this.textContent;
        fatInfoTot = fatInfoTot + parseInt(totalfat);
    })
    $(".sodInfo").each(function () {
        let totalsod = this.textContent;
        sodInfoTot = sodInfoTot + parseInt(totalsod);
    })
    $(".cholInfo").each(function () {
        let totalchol = this.textContent;
        cholInfoTot = cholInfoTot + parseInt(totalchol);
    })

    $("#caloriesTot").text(calInfoTot + " kcal");
    $("#proteinTot").text(protInfoTot + " g");
    $("#carbsTot").text(carInfoTot + " g");
    $("#fatTot").text(fatInfoTot + " g");
    $("#sodiumTot").text(sodInfoTot + " mg");
    $("#cholesterolTot").text(cholInfoTot + " mg");
}

//message displayd if API request pulls bad info
function errorMessage() {
    $(".notifText").text("Please submit valid entry.");
    $(".notification").removeClass("is-hidden");
}

//functionality for delete button
$('.delete').click(function(){
    $(".notification").addClass("is-hidden");
})



function itemNotif() {
    $(".notifText").text("Item unit only displays the nutritional info for one serving size.");
    $(".notification").removeClass("is-hidden");
}


