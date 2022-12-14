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

    /* Converting all user input to uppercase and then calculating quality points for the specific course */
    lGrade.value = lGrade.value.toUpperCase()
    qualityPoints = Number(cHours.value) * Number(gradingTable[lGrade.value])

    /* The following section of code is creating the course UI for the transcript section of the page */
    const transcript = document.querySelector("#transcript");

    const newClass = document.createElement('div');
    newClass.classList.add("classes");
    transcript.appendChild(newClass);

    const lClass = document.createElement("h1");
    lClass.innerText = `${cCode.value}: ${cName.value}`;
    lClass.classList.add("lClass");
    newClass.appendChild(lClass);

    const qPoints = document.createElement("h1");
    qPoints.innerText = `Qaulity Points: ${qualityPoints}`;
    newClass.appendChild(qPoints);

    const rClass = document.createElement("h1");
    rClass.innerText = "Summary";
    rClass.classList.add("rClass");
    newClass.appendChild(rClass);

    /* Resetting the input fields assuming a valid response has been made by the user */
    cName.value = "";
    cCode.value = "";
    cHours.value = "";
    lGrade.value = "";
    summ.value = "";
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