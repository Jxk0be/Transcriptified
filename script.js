totalQualityPoints = 0;
totalCreditHours = 0;

function modalHandler(element) {
    const bg = document.createElement("div");
    bg.classList.add("blackout");
    document.body.appendChild(bg);

    const modal = document.createElement("div");
    modal.classList.add("pModal");
    document.body.appendChild(modal);

    /* When the background is clicked, we remove the modal and background */
    bg.onclick = function() { 
        bg.remove();
        modal.remove();
    }
}

function addClass(cName, cCode, cHours, lGrade, summ) {
    const gradingTable = {
        'A': 4,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2,
        'C-': 1.7,
        'D+': 1.3,
        'D': 1,
        'D-': 0.7,
        'F': 0
    }

    /* Converting all user input to uppercase and then calculating quality points for the specific course, then adding
       it to the running total of quality points for this individual user.
    */
    lGrade.value = lGrade.value.toUpperCase()
    qualityPoints = Number(cHours.value) * Number(gradingTable[lGrade.value])
    totalQualityPoints += qualityPoints;
    totalCreditHours += Number(cHours.value);

    /* The following section of code is creating the course UI for the transcript section of the page */
    const transcript = document.querySelector("#transcript");

    const newClass = document.createElement('div');
    newClass.classList.add("classes");
    transcript.appendChild(newClass);

    const lClass = document.createElement("h1");
    lClass.innerText = `${cCode.value}: ${cName.value}`;
    lClass.classList.add("lClass");
    newClass.appendChild(lClass);

    const rSide = document.createElement("div");
    rSide.classList.add("neater");
    newClass.appendChild(rSide);

    const qPoints = document.createElement("h1");
    qPoints.innerText = `Grade: ${lGrade.value}`;
    rSide.appendChild(qPoints);

    const rClass = document.createElement("h1");
    rClass.innerText = "Summary";
    rClass.classList.add("rClass");
    rClass.classList.add("sumModal")
    rClass.onclick = function() { modalHandler(newClass) }
    rSide.appendChild(rClass);
    
    /* Resetting the input fields assuming a valid response has been made by the user */
    cName.value = "";
    cCode.value = "";
    cHours.value = "";
    lGrade.value = "";
    summ.value = "";

    console.log("total qp's: " + totalQualityPoints);
    console.log("total ch's: " + totalCreditHours);
}


function collectInformation() {
    const validGrades = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-","F"];

    /* Grabbing all input fields from the Add Class modal */
    const cName = document.querySelector("#cn");
    const cCode = document.querySelector("#cc");
    const cHours = document.querySelector("#ch");
    const lGrade = document.querySelector("#lg");
    const summ = document.querySelector("#summary");

    /* Error-checking all mandatory fields, if not filled out, we return and don't reset values */
    if (cName.value === "" || cCode.value === "" || cHours.value == "" || lGrade.value === "") {
        console.log("Fill out all mandatory fields please");
        return;
    }

    if (lGrade.value.length > 2 || !validGrades.includes(lGrade.value.toUpperCase())) {
        console.log("You need to give a valid letter grade. i.e. A, B+, C-");
        return;
    }
    addClass(cName, cCode, cHours, lGrade, summ);
}