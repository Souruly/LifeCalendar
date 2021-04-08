let button = document.getElementById("buildCalButton");
let stagesOfLife;
let birthDate = new Date("Jan 01 2000");
let birthYear = birthDate.getFullYear();
let birthMonth = String(birthDate.getMonth() + 1);
let birthDays = [];
let bdWeeks = [];
let numberOfYears = 90;
let numberOfWeeks = 52;
let parsedData = [];
let stageColors = [];

let calendarBuilt = 0;

let parentDiv = document.createElement("div");
parentDiv.classList.add("parentContainer");
document.body.appendChild(parentDiv);

// let parsedData = Array(numberOfYears * numberOfWeeks).fill(255);

Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

Date.prototype.subtractDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
};

function parseInputData() {
  //   console.log("Parsing");

  let codeTag = document.getElementById("data");
  //   console.log(codeTag);
  let codeBlock = codeTag.innerHTML;
  //   console.log(codeBlock);
  stagesOfLife = JSON.parse(codeBlock);
  birthDate = new Date(stagesOfLife[0].startDate);
  birthYear = birthDate.getFullYear();
  birthDays = [];
  bdWeeks = [];
  parsedData = [];
  stageColors = [];

  removeAllChildNodes(parentDiv);

  buildCalendar();
}

function buildCalendar() {
  //   console.log(birthDate.toDateString());
  //   console.log(stagesOfLife);

  parseData();

  for (let year = 0; year < numberOfYears; year++) {
    let yearDiv = document.createElement("div");
    yearDiv.classList.add("year");
    let yClassString = "year_" + String(year);
    yearDiv.classList.add(yClassString);
    parentDiv.appendChild(yearDiv);

    let dateString = bdWeeks[year][1];
    let dispText = "Year " + numToString(year + 1, 2) + " : " + dateString;
    // let yS = "Year " + numToString(year + 1, 2) + " : 021997";
    let yp = document.createElement("p");
    yp.classList.add("dateDisp");
    let tn = document.createTextNode(dispText);
    yp.appendChild(tn);
    yearDiv.appendChild(yp);

    for (let week = 0; week < numberOfWeeks; week++) {
      let weekNumber = year * numberOfWeeks + week;
      //   let weekColor = "#07b8b4";
      let weekColor = parsedData[weekNumber];

      let wCell = document.createElement("div");
      let wClassString = "week_" + String(weekNumber);
      wCell.classList.add("week");
      wCell.classList.add(wClassString);
      wCell.style.background = weekColor;
      yearDiv.appendChild(wCell);
    }
  }

  calendarBuilt = 1;
  //   styleWeekCells();
}

function numToString(num, stringSize) {
  let ret = String(num);
  if (ret.length < stringSize) {
    for (let i = 0; i < stringSize - ret.length; i++) {
      ret = "0" + ret;
    }
  }
  return ret;
}

function subtractDatesIntoDays(date1, date2) {
  let diff = date1 - date2;
  let oneDay = 1000 * 60 * 60 * 24;
  let days = Math.floor(diff / oneDay);
  return days;
}

function getDayOfYear(dayDate) {
  let start = new Date(dayDate.getFullYear(), 0, 0);
  let diff = dayDate - start;
  let oneDay = 1000 * 60 * 60 * 24;
  let day = Math.floor(diff / oneDay);
  return day;
}

function getStartDates() {
  let bdDateString = birthDate.toDateString();
  let splitBDString = bdDateString.split(" ");
  let bdDay = splitBDString[2];
  let bdMonth = splitBDString[1];
  let bdYear = parseInt(splitBDString[3]);

  for (let year = bdYear; year < bdYear + numberOfYears; year++) {
    let thisBDString = bdMonth + " " + bdDay + " " + String(year);
    let thisBD = new Date(thisBDString);
    birthDays.push(thisBD);
    // console.log(thisBD);
    let d = getWeekStart(thisBD);
    let dStr = d.toDateString().substring(4);
    let dYear = d.getFullYear();
    let dDayNum = getDayOfYear(d);
    let dInfo = [d, dStr, dYear, dDayNum];
    bdWeeks.push(dInfo);
  }
}

function getWeekStart(someDateInWeek) {
  // console.log(ct);
  let dayOfWeek = someDateInWeek.getDay();
  dayOfWeek -= 1;
  if (dayOfWeek < 0) {
    dayOfWeek = 6;
  }
  let weekStartDate = someDateInWeek.subtractDays(dayOfWeek);
  return weekStartDate;
}

function parseData() {
  getStartDates();

  for (let stageIndex = 0; stageIndex < stagesOfLife.length; stageIndex++) {
    let stage = stagesOfLife[stageIndex];
    let sd = new Date(stage.startDate);
    let sdWS = getWeekStart(sd);
    let sdWSY = sdWS.getFullYear();
    let sRow = sdWSY - birthYear;
    let sn = subtractDatesIntoDays(sdWS, bdWeeks[sRow][0]);
    let sCol = sn / 7;
    let sc = sRow * 52 + sCol;

    let ed = new Date(stage.endDate);
    let edWS = getWeekStart(ed);
    let edWSY = edWS.getFullYear();
    let eRow = edWSY - birthYear;
    let en = subtractDatesIntoDays(edWS, bdWeeks[eRow][0]);
    let eCol = en / 7;
    let ec = eRow * 52 + eCol;

    // console.log(sc, ec);

    // let numCells = ec-sc+1;
    let stageColor = stage.color;

    stageColors.push(stageColor);

    for (let i = sc; i < ec; i++) {
      //   parsedData[i] = stageIndex;
      parsedData[i] = stageColor;
    }
  }
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function printCal() {
  if (calendarBuilt == 0) {
    alert("Please build the calendar first");
    return;
  }
  hideUI();
//   zoomOut();
  showPrintWindow();
}

function hideUI() {
  let preTag = document.getElementById("preTag");
  preTag.hidden = true;
  let buttonsDivTag = document.getElementById("buttonsDivTag");
  buttonsDivTag.hidden = true;
  let buildCalButton = document.getElementById("buildCalButton");
  buildCalButton.hidden = true;
  let printCalButton = document.getElementById("printCalButton");
  printCalButton.hidden = true;
}

function zoomOut() {
  document.body.style.zoom = "80%";
}

function showPrintWindow() {
  let alertMessage =
    "These print settings seem to work for me:" +
    "\n0. Save as PDF" +
    "\n1. Layout: Portrait" +
    "\n2. Paper Size A4" +
    "\n3. Scale(Zoom): Custom, 39" +
    "\n4. Include background graphics";
  alert(alertMessage);
  window.print();
}
