let alarms = [];
let currentTime = document.getElementById('current-time');
let alarmInput = document.getElementById('alarm-input');
let alarmList = document.getElementById('alarm-list');

//IIFE function of display data first time.
(
    function(){
        let data=localStorage.getItem('alarms');
        if(data){
            alarms=JSON.parse(data);
        }
        else{
            localStorage.setItem('alarms',[]);
        }
        renderList();
    }
)();

//Display current time on clock And check alarm
setInterval(() => {
    //Set time on display
    let curtime = new Date();
    let hr = curtime.getHours();
    let min = curtime.getMinutes();
    let sec = curtime.getSeconds();
    let zone = hr > 12 ? "PM" : "AM";
    if (hr > 12) {
        hr = hr % 12;
    }
    if (hr < 10) {
        hr = "0" + hr;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }

    currentTime.innerHTML = `${hr}:${min}:${sec} ${zone}`;


    //Check for alarms alert

}, 1000);

//Display the list of alarms
function renderList() {
    let list = `
        <h1>List of Alarms</h1>
    `;
    if (alarms.length > 0) {
        alarms.map((elem) => {
            let date = new Date(elem);
            let hr = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
            list += `
        <div class="alarm-items">
        <div class="alarm-time">
            <span>${hr}</span>:
            <span>${date.getMinutes()}</span>:
            <span>${date.getSeconds()}</span>:
            <span>${date.getHours() > 12 ? "PM" : "AM"}</span>
        </div>
        <button class="delete-btn" id=${date.getTime()}>Delete</button>
        </div>
        `
        })
    }
    else {
        list += `<h1 style="color:red; border: 1px solid red; padding: .5rem 2rem; backdrop-filter:blur(4px); border-radius:4rem; cursor: not-allowed;">No alarm set</h1>`
    }
    alarmList.innerHTML = list;
}




function setAlarm(date) {
    alarms.push(date.getTime());
    alarms.sort();
    localStorage.setItem('alarms',JSON.stringify(alarms));
    showNotification(`Alarm set Successfully`);
    renderList();
}

function deleteAlarm(alarmId) {
    let newList = alarms.filter((elem) => {
        return elem !== Number(alarmId);
    });
    alarms = newList;
    localStorage.setItem('alarms',JSON.stringify(alarms));
    showNotification("Alarm deleted");
    renderList();
}

function invokeAlarm() {

}

function showNotification(text) {
    alert(text)
}


//Event delegation 
document.addEventListener('click', (event) => {
    if (event.target.id === 'alarm-btn') {
        //Convert hr,min,sec,zone to valid date
        let userHr = document.getElementById('user-hr');
        let userMin = document.getElementById('user-min');
        let userSec = document.getElementById('user-sec');
        let userZone = document.getElementById('user-zone');
        if (userHr.value === '' || userMin.value === '' || userSec.value === '' || userZone.value === '') {
            showNotification("Set a valid input in alarm");
        }
        else {
            //if zone is PM add 12 in hour
            let newHr
            if (userZone.value === "PM") {
                newHr = Number(userHr.value) + 12;
            }
            else {
                newHr = Number(userHr.value);
            }
            //Set the alarm
            let date = new Date();
            date.setHours(newHr);
            date.setMinutes(Number(userMin.value));
            date.setSeconds(Number(userSec.value));
            let alarmTime = date - new Date();
            //If alarm is set less than current time set the alarm for next day
            if (alarmTime < 0) {
                date.setDate(date.getDate() + 1);
            }
            setAlarm(date);
            userHr.value='';
            userMin.value='';
            userSec.value='';
            userZone.value='';
        }
    }
    if (event.target.className === "delete-btn") {
        deleteAlarm(event.target.id);
    }
})

