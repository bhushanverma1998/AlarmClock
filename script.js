let currentTime=document.getElementById('current-time');


setInterval(() => {
    let curtime=new Date();
    console.log(curtime);
    let hr=curtime.getHours();
    let min=curtime.getMinutes();
    let sec=curtime.getSeconds();
    let zone=hr>12?"PM":"AM";
    if(hr>12){
        hr=hr%12;
    }
    if(hr<10){
        hr="0"+hr;
    }
    if(min<10){
        min="0"+min;
    }
    if(sec<10){
        sec="0"+sec;
    }

    currentTime.innerHTML=`${hr}:${min}:${sec} ${zone}`;
}, 1000);