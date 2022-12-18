/* Array to hold all the user's courses on their transcript */
let allClasses = [];

/* Function to be called for any error messages the user needs to be notified about */
function errorHandler(message) {
    const bg = document.createElement("div");
    bg.classList.add("blackout");
    document.body.appendChild(bg);

    const modal = document.createElement("div");
    modal.classList.add("errorModal");
    document.body.appendChild(modal);

    const title = document.createElement("h1");
    title.innerText = "User Error";
    title.classList.add("errorTitle");
    modal.appendChild(title);

    const summ = document.createElement("p");
    summ.innerText = message;
    summ.classList.add("error");
    modal.appendChild(summ);

    /* When the background is clicked, we remove the modal and background */
    bg.onclick = function() { 
        bg.remove();
        modal.remove();
    }
}

function modalHandler(name, code, hours, grade, summary) {
    const bg = document.createElement("div");
    bg.classList.add("blackout");
    document.body.appendChild(bg);

    const modal = document.createElement("div");
    modal.classList.add("pModal");
    document.body.appendChild(modal);

    const title = document.createElement("h1");
    title.innerText = name + ": (" + code + ")";
    title.classList.add("center");
    modal.appendChild(title);

    const summ = document.createElement("p");
    summ.innerText = summary;
    summ.classList.add("paragraph");
    modal.appendChild(summ);

    /* When the background is clicked, we remove the modal and background */
    bg.onclick = function() { 
        bg.remove();
        modal.remove();
    }
}

/* Function is called everytime we add or remove a class from the transcript
   It calculates the GPA each time the list is updated.
*/
function updateGPA(allClasses) {
    let tQP = 0;
    let tCH = 0;

    for (let i = 0; i < allClasses.length; ++i) {
        tQP += allClasses[i].qPoints;
        tCH += allClasses[i].credHours;
    }

    const pGPA = document.querySelector('#gpa');
    const GPA = tQP / tCH;

    pGPA.innerText = `GPA: ${GPA.toFixed(2)}`
}

/* The most straight-forward way to remove a class and then update the GPA */
function removeClass(curCourse, allClasses, name) {
    curCourse.remove();

    for (let i = 0; i < allClasses.length; ++i) {
        if (allClasses[i].className === name) allClasses.splice(i, 1);
    }

    localStorage.setItem('courses', JSON.stringify(allClasses));
    updateGPA(allClasses);
}

/* This creates all the UI for the new course and updates the GPA */
function addClass(cName, cCode, cHours, lGrade, summ) {
    /* Storing values of elements while we have access to them */
    const name = cName;
    const code = cCode;
    const hours = cHours;
    const grade = lGrade;
    const summary = summ;

    /* The following section of code is creating the course UI for the transcript section of the page */
    const transcript = document.querySelector("#transcript");

    const newClass = document.createElement('div');
    newClass.classList.add("classes");
    transcript.appendChild(newClass);

    const lClass = document.createElement("h1");
    lClass.innerText = `${cCode}: ${cName}`;
    lClass.classList.add("lClass");
    newClass.appendChild(lClass);

    const rSide = document.createElement("div");
    rSide.classList.add("neater");
    newClass.appendChild(rSide);

    const qPoints = document.createElement("h1");
    qPoints.innerText = `Grade: ${lGrade}`;
    rSide.appendChild(qPoints);

    const rClass = document.createElement("h1");
    rClass.innerText = "Summary";
    rClass.classList.add("rClass");
    rClass.classList.add("sumModal");
    rClass.onclick = function() { modalHandler(name, code, hours, grade, summary) };
    rSide.appendChild(rClass);

    const remove = document.createElement("h1");
    remove.innerHTML = `<i class="fas fa-times fa-lg"></i>`;
    remove.classList.add("remove");
    remove.onclick = function() { removeClass(newClass, allClasses, name) }; 
    newClass.appendChild(remove);

    /* Finally we update the GPA to its new value */
    updateGPA(allClasses);
}

/* Function is ran at the load time to rebuild the user's transcript (so long as they are using
   the same browser since we are using localStorage) 
*/
window.onload = function () {
    /* Everytime we open/reload the page, we want to grab existing courses, credit hours, and quality points */
    const tempArr = JSON.parse(localStorage.getItem('courses'));

    /* Everything below is logic updating the UI to it's most recent form */
    const size = tempArr.length;
    allClasses = tempArr;

    for (let i = 0; i < allClasses.length; ++i) {
        addClass(allClasses[i].className, allClasses[i].classCode, allClasses[i].credHours, allClasses[i].letterGrade, allClasses[i].summary);
    }
}

/* Initial function call to parse all data from the input fields on the UI */
function collectInformation() {
    const validGrades = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-","F"];
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

    /* Grabbing all input fields from the Add Class modal */
    const cName = document.querySelector("#cn");
    const cCode = document.querySelector("#cc");
    const cHours = document.querySelector("#ch");
    const lGrade = document.querySelector("#lg");
    const summ = document.querySelector("#summary");

    lGrade.value = lGrade.value.toUpperCase()

    /* Error-checking all mandatory fields, if not filled out, we return and don't reset values */
    if (cName.value === "" || cCode.value === "" || cHours.value == "" || lGrade.value === "") {
        errorHandler("Fill out all mandatory fields please");
        return;
    }

    if (lGrade.value.length > 2 || !validGrades.includes(lGrade.value)) {
       errorHandler("You need to give a valid letter grade. i.e. A, B+, C-");
        return;
    }

    /* Creating an object for every new course added. This makes it easier to mutate these values
       and pass by reference in future functions. 
    */
    let newObject = {
        'className': cName.value,
        'classCode': cCode.value,
        'credHours': Number(cHours.value),
        'letterGrade': lGrade.value,
        'summary': summ.value,
        'qPoints': 0
    }

    /* Calculating quality points */
    newObject.qPoints = Number(cHours.value) * Number(gradingTable[lGrade.value])

    /* Adding new course to list of all courses, then updating localStorage and calling a function to build the UI */
    allClasses.push(newObject);
    localStorage.setItem('courses', JSON.stringify(allClasses));
    addClass(cName.value, cCode.value, cHours.value, lGrade.value, summ.value);

    /* Resetting the input fields assuming a valid response has been made by the user */
    cName.value = "";
    cCode.value = "";
    cHours.value = "";
    lGrade.value = "";
    summ.value = "";
}