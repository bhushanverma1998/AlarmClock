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
    let zone = hr >= 12 ? "PM" : "AM";
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
    if(alarms[0]-curtime.getTime()<=0){
        alarmFire(alarms[0]);
    }
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
            hr=hr<10?"0"+hr:hr;
            list += `
        <div class="alarm-items">
        <div class="alarm-time">
            <span>${hr==='00'?12:hr}</span>:
            <span>${date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes()}</span>:
            <span>${date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds()}</span>:
            <span>${date.getHours() >= 12 ? "PM" : "AM"}</span>
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
    //Filter alarm from alarm list
    let newList = alarms.filter((elem) => {
        return elem !== Number(alarmId);
    });
    alarms = newList;
    localStorage.setItem('alarms',JSON.stringify(alarms));
    showNotification("Alarm deleted");
    renderList();
}

//Trigger alarm alert when invoked
function alarmFire(alarm) {
    let newAlarms=alarms.slice(1);
    alarms=newAlarms;
    localStorage.setItem('alarms',JSON.stringify(alarms));
    let response=confirm("Press Ok! to turn off alarm. Cancel to snooze for 5 minutes");
    if(response){
        renderList();
    }
    else{
        snoozeAlarm(alarm);
    }
}

//Snooze alarm by 5 minutes
function snoozeAlarm(alarm){ 
    let time=new Date(alarm);
    time.setMinutes(time.getMinutes()+5);
    alarms.push(time.getTime());
    alarms.sort();
    localStorage.setItem('alarms',JSON.stringify(alarms));
    showNotification("Alarm snoozed to 5 minutes")
    renderList();
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

        //Check upper and lower conditions for valid time
        if (userHr.value === '' || userMin.value === '' || userSec.value === '' || userZone.value === '' ||userHr.value < 0 || userHr.value>12 || userMin.value < 0 || userMin.value > 60 || userSec.value < 0 || userSec.value > 60) {
            showNotification("Set a valid input in alarm");
            userHr.value='';
            userMin.value='';
            userSec.value='';
            userZone.value='';
            return;
        }
        else {
            //if zone is PM add 12 in hour
            let newHr
            if (userZone.value === "PM") {
                newHr =Number(userHr.value)===12?Number(userHr.value):Number(userHr.value) + 12;
            }
            else {
                newHr =Number(userHr.value)===12?0: Number(userHr.value);
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

