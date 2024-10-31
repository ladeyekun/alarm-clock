'use strict';

function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

const currentClock = select('.current-clock');
const alarm = select('.alarm-time');
const alarmDisplay = select('.alarm');

const inputHour = select('input[name="hours"]');
const inputMinutes = select('input[name="minutes"]');
const setAlarmBtn = select('input[type="button"]');

let isAlarmEnabled = false;
let isAlarmTriggered = false;

setCurrentTime();
alarmClock();

function alarmClock() {
    const monitorAlarm = setInterval(() => {
        setCurrentTime();
        if (isAlarmEnabled && ! isAlarmTriggered) checkAlarm();
        if (isAlarmTriggered) {
            isAlarmTriggered = false;
        }
    }, 1000);    
}

listen('click', setAlarmBtn, () => {
    validateAlarmTime();
});

listen('input', inputHour, (event) => {
    let value = event.target.value;
    event.target.value = validateInput(value);
});

listen('input', inputMinutes, (event) => {
    let value = event.target.value;
    event.target.value = validateInput(value);
});

function setCurrentTime() {
    let h = paddedInput(String(getCurrentHour()));
    let m = paddedInput(String(getCurrentMinutes()));
    currentClock.innerText = `${h}:${m}`;
}

function isNumberValid(input) {
    let numb = Number(input);
    if (! typeof numb === "number") return false;

    return true;
}

function validateInput(input) {
    return input.replace(/[^0-9]/g, '');
}

function isHourValid(input) {
    let numb = Number(input);
    if (! input.length > 0) return false;
    if (! isNumberValid(input)) return false;
    if (numb < 0 || numb > 23) return false;

    return true;
}

function isMinutesValid(input) {
    let numb = Number(input);
    if (! input.length > 0) return false;
    if (! isNumberValid(input)) return false;
    if (numb < 0 || numb > 59) return false;

    return true;
}

function isCurrentTime(alarmClock) {
    const [hour, minutes] = alarmClock.split(':');

    const alarmTime = new Date();

    alarmTime.setHours(hour);
    alarmTime.setMinutes(minutes);
    alarmTime.setSeconds(0);
    alarmTime.setMilliseconds(0);

    const now = new Date();
    const currentTime = new Date();
    currentTime.setHours(now.getHours());
    currentTime.setMinutes(now.getMinutes());
    currentTime.setSeconds(0);
    currentTime.setMilliseconds(0);

    if (alarmTime.getHours() === currentTime.getHours() &&
        alarmTime.getMinutes() === currentTime.getMinutes()){
        return true;
    }
    return false;
}

function validateAlarmTime() {
    let hours = inputHour.value;
    let minutes = inputMinutes.value;
    let alarmHour = '';
    let alarmMinutes = '';
    
    if(! isHourValid(hours)) {
        inputHour.focus();
        return;
    } else {
        alarmHour = paddedInput(hours);
    }

    if(! isMinutesValid(minutes)) {
        inputMinutes.focus();
        return;
    } else {
        alarmMinutes = paddedInput(minutes);
    }

    let alarmTime = `${alarmHour}:${alarmMinutes}`;

    if (isCurrentTime(alarmTime)) {
        clearInputs();
        inputHour.focus();
        return;
    }

    setAlarmTime(alarmTime);
    enabledAlarm();
    clearInputs();
}

function setAlarmTime(alarmTime) {
    alarm.innerText = alarmTime;
}

function enabledAlarm() {
    isAlarmEnabled = true;

    if (isAlarmEnabled) {
        if (alarmDisplay.classList.contains('elapsed'))
            alarmDisplay.classList.remove('elapsed');
        if (alarm.classList.contains('off'))
            alarm.classList.replace('off', 'on');
    }
}

function disabledAlarm() {
    isAlarmEnabled = false;
    alarmDisplay.classList.add('elapsed');
}

function clearInputs() {
    inputHour.value = '';
    inputMinutes.value = '';
}

function checkAlarm() {
    const alarmTime = new Date();
    const [hour, minutes] = alarm.innerText.split(':');

    alarmTime.setHours(hour);
    alarmTime.setMinutes(minutes);
    alarmTime.setSeconds(0);
    alarmTime.setMilliseconds(0);

    const now = new Date();
    const currentTime = new Date();
    currentTime.setHours(now.getHours());
    currentTime.setMinutes(now.getMinutes());
    currentTime.setSeconds(0);
    currentTime.setMilliseconds(0);

    if (currentTime >= alarmTime) {
        triggerAlarm();
    }
}

function triggerAlarm() {
    isAlarmTriggered = true;
    const alarmSound = new Audio('./assets/media/alarm-clock.mp3');
    alarmSound.type = 'audio/mp3';
    alarmSound.play();

    currentClock.classList.add('flasher');
    setTimeout(() => { 
        currentClock.classList.remove('flasher')
    }, 6000);

    disabledAlarm();
}

function getCurrentHour() {
    return new Date().getHours();
}

function getCurrentMinutes() {
    return new Date().getMinutes();
}

function getCurrentSeconds() {
    return new Date().getSeconds();
}

function paddedInput(input) {
    return input.padStart(2, 0);
}