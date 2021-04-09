hljs.highlightAll();

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
  let codeTag = document.getElementById("data");
  let codeBlock = codeTag.innerHTML;
  // console.log(codeBlock);

  let re1 = new RegExp(/<span.*?">/g);
  let pass1 = codeBlock.replaceAll(re1,"");
  // console.log("\n Pass1");
  // console.log(pass1);

  let re2 = new RegExp(/<\/span>/g);
  let pass2 = pass1.replaceAll(re2,"");
  // console.log("\n Pass 2");
  // console.log(pass2);

  stagesOfLife = JSON.parse(pass2);
  console.log(stagesOfLife)

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
  parseData();

  makeWeekNumberLabels();

  for (let year = 0; year < numberOfYears; year++) {
    let yearDiv = document.createElement("div");
    yearDiv.classList.add("year");
    let yClassString = "year_" + String(year);
    yearDiv.classList.add(yClassString);
    parentDiv.appendChild(yearDiv);

    let dateString = bdWeeks[year][1];
    let dispText = "Year " + numToString(year + 1, 2) + " : " + dateString;
    let yp = document.createElement("p");
    yp.classList.add("dateDisp");
    let tn = document.createTextNode(dispText);
    yp.appendChild(tn);
    yearDiv.appendChild(yp);

    for (let week = 0; week < numberOfWeeks; week++) {
      let weekNumber = year * numberOfWeeks + week;
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
}

function makeWeekNumberLabels() {
  let weekLabels = document.createElement("div");
  weekLabels.classList.add("year");
  let yClassString = "year_" + String(00);
  weekLabels.classList.add(yClassString);
  parentDiv.appendChild(weekLabels);

  let dispText = "Years↓\\Weeks→ ";
  let yp = document.createElement("p");
  yp.classList.add("cornerLabel");
  let tn = document.createTextNode(dispText);
  yp.appendChild(tn);
  weekLabels.appendChild(yp);

  for (let week = 0; week < numberOfWeeks; week++) {
    let weekNumber = numToString(week+1,2);
    let wp = document.createElement("p");
    wp.classList.add("weekLabel");
    let wtn = document.createTextNode(weekNumber);
    wp.appendChild(wtn)
    weekLabels.appendChild(wp);
  }
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

    let stageColor = stage.color;

    stageColors.push(stageColor);

    for (let i = sc; i < ec; i++) {
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
  // setTimeout(printToPNG(), 3000);
  printToPNG();
}

function hideUI() {
  let codeDiv = document.getElementsByClassName("codeHolder")[0];
  codeDiv.remove();

  let buttonsDivTag = document.getElementById("buttonsDivTag");
  buttonsDivTag.remove();
}

function zoomOut() {
  let winWidth = window.innerWidth;
  let divWidth = document.body.scrollWidth;

  let zoomRatio = winWidth / divWidth;

  console.log(winWidth, divWidth, zoomRatio);

  if (zoomRatio < 1) {
    let zoom = Math.round(zoomRatio * 100);
    let z = String(zoom - 10) + "%";
    console.log("Zoom :", z);
    document.body.style.zoom = z;
  }
}

function printToPNG() {
  var container = document.body;
  html2canvas(container).then(function (canvas) {
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.download = "html_image.png";
    link.href = canvas.toDataURL("image/png");
    link.target = "_blank";
    link.click();
  });
}
