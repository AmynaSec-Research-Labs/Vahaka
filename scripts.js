document.addEventListener('DOMContentLoaded', function () {

    const socket = io();

    socket.on('connect', () => {
        console.log('Socket connected');
        socket.emit('requestRandomization');
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randomString = (length) => [...Array(length)].map(() => Math.random().toString(36)[2]).join('');

    let assignedARIDs = [];
    let idsAssigned = false;

    let variables = [
        'speedValARID', 'speedInfoARID', 'drivingModeARID', 'batteryValARID',
        'batteryInfoARID', 'weatherValARID', 'weatherInfoARID', 'indicatorValARID',
        'storageValARID', 'engineValARID', 'standValARID', 'reverseValARID', 'cruiseValARID'
    ];

    const body = document.body;

    let powerOnTimeoutId = null;

    let maxSpeed = 200;
    let speedGlobal = 0;
    let batteryGlobal = 100;
    let lightToggle = false;
    let leftLightToggle = false;
    let rightLightToggle = false;

    const circle2 = document.getElementById('circle2').querySelector('p:nth-of-type(1)');
    const circle2SpeedContent = document.getElementById('circle2_speedContent');
    const circle2MaxEco = document.getElementById('circle2_maxspeed_eco');
    const circle2MaxSport = document.getElementById('circle2_maxspeed_sport');
    const circle2CurrentSpeedLabel = document.getElementById('circle2_currentSpeedLabel');
    const circle1 = document.getElementById('circle1').querySelector('p:nth-of-type(1)');
    const circle1Border = document.getElementById('circle1');
    const circle3 = document.getElementById('circle3').querySelector('p:nth-of-type(1)');
    const circle3Text = document.getElementById('circle3').querySelector('.weather');
    const circle3ImgSrc = document.getElementById('circle3').querySelector('.weatherIcon');
    const leftTriangle = document.getElementById('left-triangle');
    const rightTriangle = document.getElementById('right-triangle');
    let circle2Value = parseInt(circle2.textContent);
    let circle1Value = parseInt(circle1.textContent);
    let increaseInterval, decreaseInterval;
    let batteryInterval;

    const baseSpeed = 50;
    const baseDepletionRate = 0.1 / 60;
    const latitude = '18.56151385141765';
    const longitude = '73.78524063908985';

    const modeToggle = document.getElementById('mode-toggle');
    const modeCircle = document.querySelector('.mode-circle');
    const modeText = document.querySelector('.mode-text');
    modeToggle.addEventListener('click', toggleMode);
    let modeVal = 'eco';

    const engineToggle = document.getElementById('engine-toggle');
    engineToggle.addEventListener('click', toggleEngine);
    const engineCircle = document.getElementById('engine_img');
    const engineText = document.querySelector('.engine-text');
    let engineVal = false;
    document.getElementById("scooter").src = 'img/scooter_os.png'
    const ecuImage = document.getElementById('ecu_img');

    const standToggle = document.getElementById('stand-toggle');
    standToggle.addEventListener('click', toggleStand);
    const standCircle = document.getElementById('stand_img');
    const standLight = document.getElementById('sideStand');
    const standText = document.querySelector('.stand-text');
    let standVal = true;

    const cruiseToggle = document.getElementById('cruise-toggle');
    cruiseToggle.addEventListener('click', toggleCruise);
    const cruiseCircle = document.getElementById('cruise_img');
    const cruiseLight = document.getElementById('sideCruise');
    const cruiseText = document.querySelector('.cruise-text');
    let cruiseVal = false;

    const reverseToggle = document.getElementById('reverse-toggle');
    reverseToggle.addEventListener('click', toggleReverse);
    const reverseCircle = document.getElementById('reverse_img');
    const reverseText = document.querySelector('.reverse-text');
    let reverseVal = false;

    const storageToggle = document.getElementById('storage-toggle');
    storageToggle.addEventListener('click', toggleStorage);
    const storageCircle = document.getElementById('storage_img')
    const storageText = document.querySelector('.storage-text');
    let storageVal = true;

    function toggleMode() {
        if (standVal == true) {
            standShake();
        } else {
            if (modeVal == 'eco') {
                modeCircle.src = 'img/power_mode.png';
                document.querySelector('.clustering').style.background = 'radial-gradient(circle, #600b04, black)';
                modeText.textContent = 'Power Mode';
                circle2MaxEco.style.display = 'none';
                circle2MaxSport.style.display = 'block';
                modeVal = 'sport';
                maxSpeed = 300;
                if (circle2Value > 0) {
                    document.getElementById("scooter").src = 'img/scooter_pm.gif'
                }
                else {
                    document.getElementById("scooter").src = 'img/scooter_ps.png'
                }
                sendCANMessage(window['drivingModeARID'], 'P');
            } else {
                modeCircle.src = 'img/eco_mode.png';
                document.querySelector('.clustering').style.background = 'radial-gradient(circle, #008000, black)';
                modeText.textContent = 'Eco Mode';
                circle2MaxEco.style.display = 'block';
                circle2MaxSport.style.display = 'none';
                modeVal = 'eco';
                maxSpeed = 200;
                sendCANMessage(window['drivingModeARID'], 'E');
                if (circle2Value > 0) {
                    document.getElementById("scooter").src = 'img/scooter_em.gif'
                }
                else {
                    document.getElementById("scooter").src = 'img/scooter_es.png'
                }
            }
        }
    }

    function toggleStorage() {
        if (storageVal == true) {
            storageCircle.src = 'img/seat_unlock.png';
            storageText.textContent = 'Seat UNLCK';
            storageVal = false;
            sendCANMessage(window['storageValARID'], 'U');
        } else {
            storageCircle.src = 'img/seat_lock.png';
            storageText.textContent = 'Seat LOCK';
            storageVal = true;
            sendCANMessage(window['storageValARID'], 'L');
        }
    }

    function toggleEngine() {
        if (engineVal == true) {
            engineCircle.src = 'img/engine_off.png';
            engineText.textContent = 'Engine OFF';11
            engineVal = false;
            document.getElementById("scooter").src = 'img/scooter_os.png'
            ecuImage.src = 'img/ecu.png';
            sendCANMessage(window['engineValARID'], 'F');

            powerOffHMI();
        } else {
            if (standVal == true) {
                standShake();
            } else {
                engineCircle.src = 'img/engine_on.png';
                engineText.textContent = 'Engine ON';
                engineVal = true;
                ecuImage.src = 'img/ecu.gif';
                sendCANMessage(window['engineValARID'], 'N');
                if (modeVal == 'eco') {
                    document.getElementById("scooter").src = 'img/scooter_es.png'
                }
                else {
                    document.getElementById("scooter").src = 'img/scooter_ps.png'
                }

                powerOnHMI();
            }
        }
    }

    function toggleStand() {
        if (standVal == true) {
            standCircle.src = 'img/stand_off.png';
            standText.textContent = 'Stand OFF';
            standVal = false;
            standLight.src = 'img/stand_off.png';
            sendCANMessage(window['standValARID'], 'C');
        } else {
            engineVal = false;
            standCircle.src = 'img/stand_on.png';
            standText.textContent = 'Stand ON';
            standVal = true;
            standLight.src = 'img/stand_on.png';
            ecuImage.src = 'img/ecu.png';
            sendCANMessage(window['standValARID'], 'O');
            document.getElementById("scooter").src = 'img/scooter_os.png'
            stopIncrease();
            decreaseValue();

            engineCircle.src = 'img/engine_off.png';
            engineText.textContent = 'Engine OFF';

            cruiseCircle.src = 'img/cruise_off.png';
            cruiseText.textContent = 'Cruise OFF';
            cruiseLight.src = 'img/cruise_off.png';
            cruiseVal = false;
            sendCANMessage(window['cruiseValARID'], 'M');
            stopIncrease();

            powerOffHMI();
        }
    }

    function toggleCruise() {
        if (standVal == true) {
            standShake();
        } else {
            if (cruiseVal == true) {
                cruiseCircle.src = 'img/cruise_off.png';
                cruiseText.textContent = 'Cruise OFF';
                cruiseLight.src = 'img/cruise_off.png';
                cruiseVal = false;
                sendCANMessage(window['cruiseValARID'], 'M');
                stopIncrease();
            } else {
                cruiseCircle.src = 'img/cruise_on.png';
                cruiseText.textContent = 'Cruise ON';
                cruiseLight.src = 'img/cruise_on.png';
                cruiseVal = true;
                sendCANMessage(window['cruiseValARID'], 'C');
            }
        }

    }

    function toggleReverse() {
        if (standVal == true) {
            standShake();
        } else {
            if (reverseVal == false) {
                reverseVal = true;
                reverseText.textContent = 'Reverse ON';
                reverseCircle.src = 'img/reverse_on.png';
                stopIncrease();

                circle2SpeedContent.textContent = '0 KM/H';
                circle2Value = 0;
                video.src = 'img/road_reverse.mp4';

                document.getElementById('circle2').style.borderColor = 'red';
                circle2MaxEco.style.display = 'none';
                circle2MaxSport.style.display = 'none'

                document.getElementById('reverseImg').style.display = 'block';
                document.getElementById('reverseBorderImg').style.display = 'block';

                sendCANMessage(window['reverseValARID'], 'R');

                document.getElementById('weather-val').style.display = 'none';
                document.getElementById('weather-icon').style.display = 'none';
                circle2SpeedContent.style.transform = 'translateX(116%) translateY(-50%)';
                circle2SpeedContent.style.fontSize = '30px';
                circle2CurrentSpeedLabel.style.transform = 'translateX(200%) translateY(-10%)';
            }
            else {
                reverseVal = false;
                reverseText.textContent = 'Reverse OFF';
                reverseCircle.src = 'img/reverse_off.png';

                circle2SpeedContent.textContent = '0 KM/H';
                circle2Value = 0;
                video.src = 'img/road.mp4';

                document.getElementById('circle2').style.borderColor = 'white';

                if (modeVal == 'eco') {
                    circle2MaxEco.style.display = 'block';
                }
                else {
                    circle2MaxSport.style.display = 'block';
                }

                document.getElementById('reverseImg').style.display = 'none';
                document.getElementById('reverseBorderImg').style.display = 'none';

                sendCANMessage(window['reverseValARID'], 'F');

                document.getElementById('weather-val').style.display = 'block';
                document.getElementById('weather-icon').style.display = 'block';
                circle2SpeedContent.style.transform = 'translateX(0%) translateY(0%)';
                circle2SpeedContent.style.fontSize = '40px';
                circle2CurrentSpeedLabel.style.transform = 'translateX(0%) translateY(0%)';
            }
        }
    }

    function sendCANMessage(id, data, type = 'string') {
        if (!idsAssigned) {
            return
        }

        if (!engineVal && id != 1761) {
            return
        }

        let dataStr;

        if (type === 'int') {
            dataStr = (data).toString(16).toUpperCase();
            dataStr = dataStr.padStart(Math.ceil(dataStr.length / 2) * 2, '0');

        }
        else {

            dataStr = Array.from(data)
                .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('');
        }

        socket.emit('sendCANMessage', { id, data: dataStr });
    }

    function increaseValue() {
        if (standVal == false && engineVal == true) {
            const video = document.getElementById("video");
            if (circle2Value == 0) {
                video.play();
                if (modeVal == 'eco') {
                    document.getElementById("scooter").src = 'img/scooter_em.gif'
                }
                else {
                    document.getElementById("scooter").src = 'img/scooter_pm.gif'
                }
            }
            if (!increaseInterval && batteryGlobal > 0) {
                increaseInterval = setInterval(() => {
                    if (circle2Value <= maxSpeed) {
                        circle2Value += 1;
                        speedGlobal = parseInt(circle2Value);
                        circle2.textContent = `${circle2Value} KM/H`;
                        sendCANMessage(window['speedValARID'], (parseInt(circle2Value) + 300), 'int');

                        video.playbackRate = circle2Value / 200 * 5;
                    } else {
                        circle2.textContent = "Speed limit reached!";
                        circle2SpeedContent.style.marginTop = 0;
                        circle2MaxEco.style.display = 'none';
                        circle2MaxSport.style.display = 'none';
                        circle2CurrentSpeedLabel.style.display = 'none';
                        sendCANMessage(window['speedInfoARID'], 'OVERMAX');
                    }
                }, 100);
            }
        }
    }

    function decreaseValue() {
        const video = document.getElementById("video");
        if (!decreaseInterval && cruiseVal == false) {
            decreaseInterval = setInterval(() => {
                if (circle2Value > 0) {
                    circle2Value -= 1;
                    speedGlobal = parseInt(circle2Value);
                    circle2.textContent = `${circle2Value} KM/H`;
                    sendCANMessage(window['speedValARID'], (parseInt(circle2Value) + 300), 'int');

                    video.playbackRate = circle2Value / 200 * 5;
                } else {

                    video.pause();
                    if (engineVal == false) {
                        document.getElementById("scooter").src = 'img/scooter_os.png'
                    }
                    else {
                        if (modeVal === 'eco') {
                            document.getElementById("scooter").src = 'img/scooter_es.png'
                        }
                        else {
                            document.getElementById("scooter").src = 'img/scooter_ps.png'
                        }
                    }
                    clearInterval(decreaseInterval);
                    decreaseInterval = null;
                    sendCANMessage(window['speedInfoARID'], 'ZERO');
                }

                if (standVal == true) {
                    cruiseCircle.src = 'img/cruise_off.png';
                    cruiseText.textContent = 'Cruise OFF';
                    cruiseLight.src = 'img/cruise_off.png';
                    cruiseVal = false;
                    sendCANMessage(window['cruiseValARID'], 'M');
                    stopIncrease();
                }
                if (cruiseVal == true) {
                    clearInterval(decreaseInterval);
                    decreaseInterval = null;
                }
            }, 100);
        }
    }

    function stopIncrease() {
        clearInterval(increaseInterval);
        increaseInterval = null;
        decreaseValue();
    }

    function stopDecrease() {
        clearInterval(decreaseInterval);
        decreaseInterval = null;
    }

    function updateBattery() {

        batteryInterval = setInterval(() => {
            const speed = parseInt(speedGlobal);
            const depletionRate = baseDepletionRate * (speed / baseSpeed) * 10;

            if (circle1Value > 0) {
                circle1Value -= depletionRate;

                batteryGlobal = parseInt(circle1Value);

                circle1.textContent = `${Math.max(0, circle1Value.toFixed(0))}%`;

                let hue = ((circle1Value * 120 / 100));
                circle1Border.style.borderColor = `hsl(${hue}, 100%, 50%)`;

                sendCANMessage(window['batteryValARID'], (batteryGlobal + 285), 'int');

                if (circle1Value <= 20 && circle1Value > 10) {
                    sendCANMessage(window['batteryInfoARID'], 'LOW');
                } else if (circle1Value <= 10) {
                    sendCANMessage(window['batteryInfoARID'], 'CRITICAL');
                }
            } else {
                clearInterval(batteryInterval);
                sendCANMessage(window['batteryInfoARID'], 'DEAD');
            }
        }, 100);
    }

    async function updateWeather() {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const data = await response.json();
            const temp = data.current_weather.temperature;
            const weather = data.current_weather.weathercode;
            circle3.textContent = `${Math.round(temp)}°C`;

            sendCANMessage(window['weatherValARID'], `${Math.round(temp)}`);

            if (temp >= 10 && temp <= 20) {
                circle3ImgSrc.src = "img/rainyicon.png";
                sendCANMessage(window['weatherInfoARID'], 'RAIN');
            } else if (temp >= 21 && temp < 30) {
                circle3ImgSrc.src = "img/overcasticon.png";
                sendCANMessage(window['weatherInfoARID'], 'OVER');
            } else if (temp >= 30) {
                circle3ImgSrc.src = "img/sunnyicon.png";
                sendCANMessage(window['weatherInfoARID'], 'SUN');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            sendCANMessage(window['weatherValARID'], 'ERR');
        }
    }

    setInterval(updateWeather, 60000);
    updateBattery();

    updateWeather();

    function standShake() {
        document.getElementById('stand-toggle').style.animation = 'shake 0.1s linear 2';
    }

    document.getElementById('stand-toggle').addEventListener('animationend', () => {
        document.getElementById('stand-toggle').style.animation = '';
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') {
            if (standVal === false) {
                stopDecrease();
                increaseValue();
                if (engineVal == false) {
                    engineCircle.src = 'img/engine_on.png';
                    engineText.textContent = 'Engine ON';
                    engineVal = true;
                    ecuImage.src = 'img/ecu.gif';
                    sendCANMessage(window['engineValARID'], 'BURN');
                    if (modeVal == 'eco') {
                        document.getElementById("scooter").src = 'img/scooter_es.png'
                    }
                    else {
                        document.getElementById("scooter").src = 'img/scooter_ps.png'
                    }

                    powerOnHMI();
                }
            }
            else {
                standShake();
            }
        }

    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            if (leftLightToggle) {
                leftTriangle.style.display = 'none';
                sendCANMessage(window['indicatorValARID'], '01', 'int');
                leftLightToggle = false;
                lightToggle = false;
            } else {
                leftTriangle.style.display = 'block';
                sendCANMessage(window['indicatorValARID'], '11', 'int');
                leftLightToggle = true;
            }
        }
        else if (event.key === 'ArrowRight') {
            if (rightLightToggle) {
                rightTriangle.style.display = 'none';
                sendCANMessage(window['indicatorValARID'], '02', 'int');
                rightLightToggle = false;
                lightToggle = false;
            } else {
                rightTriangle.style.display = 'block';
                sendCANMessage(window['indicatorValARID'], '12', 'int');
                rightLightToggle = true;
            }
        }
        else if (event.key === 'Shift') {
            if (leftLightToggle | rightLightToggle) {
                if (lightToggle) {
                    leftTriangle.style.display = 'none';
                    rightTriangle.style.display = 'none';
                    sendCANMessage(window['indicatorValARID'], '03', 'int');
                    leftLightToggle = false;
                    rightLightToggle = false;
                    lightToggle = false;
                }
                else {
                    leftTriangle.style.display = 'block';
                    rightTriangle.style.display = 'block';
                    sendCANMessage(window['indicatorValARID'], '13', 'int');
                    rightLightToggle = true;
                    rightLightToggle = true;
                    lightToggle = true;
                }
            } else {
                if (lightToggle) {
                    leftTriangle.style.display = 'none';
                    rightTriangle.style.display = 'none';
                    sendCANMessage(window['indicatorValARID'], '03', 'int');
                    leftLightToggle = false;
                    rightLightToggle = false;
                    lightToggle = false;
                }
                else {
                    leftTriangle.style.display = 'block';
                    rightTriangle.style.display = 'block';
                    sendCANMessage(window['indicatorValARID'], '13', 'int');
                    leftLightToggle = true;
                    rightLightToggle = true;
                    lightToggle = true;
                }
            }
        }
        else if (event.key.toLowerCase() === 'e') {
            if (engineVal == true) {
                engineCircle.src = 'img/engine_off.png';
                engineText.textContent = 'Engine OFF';
                sendCANMessage(window['engineValARID'], 'F');
                engineVal = false;
                document.getElementById("scooter").src = 'img/scooter_os.png'
                ecuImage.src = 'img/ecu.png';

                powerOffHMI();
            } else {
                if (standVal == true) {
                    standShake();
                } else {
                    engineCircle.src = 'img/engine_on.png';
                    engineText.textContent = 'Engine ON';
                    engineVal = true;
                    ecuImage.src = 'img/ecu.gif';
                    sendCANMessage(window['engineValARID'], 'N');
                    if (modeVal == 'eco') {
                        document.getElementById("scooter").src = 'img/scooter_es.png'
                    }
                    else {
                        document.getElementById("scooter").src = 'img/scooter_ps.png'
                    }

                    powerOnHMI();
                }
            }
        }
        else if (event.key.toLowerCase() === 'l') {
            if (storageVal == true) {
                storageCircle.src = 'img/seat_unlock.png';
                storageText.textContent = 'Seat UNLCK';
                storageVal = false;
                sendCANMessage(window['storageValARID'], 'U');
            } else {
                storageCircle.src = 'img/seat_lock.png';
                storageText.textContent = 'Seat LOCK';
                storageVal = true;
                sendCANMessage(window['storageValARID'], 'L');
            }
        }
        else if (event.key.toLowerCase() === 'm') {
            if (standVal == true) {
                standShake();
            } else {
                if (modeVal == 'eco') {
                    if (engineVal == false) {
                        document.getElementById("scooter").src = 'img/scooter_os.png'
                    }
                    else {
                        if (circle2Value == 0) {
                            document.getElementById("scooter").src = 'img/scooter_ps.png'
                        }
                        else {
                            document.getElementById("scooter").src = 'img/scooter_pm.gif'
                        }
                    }
                    modeCircle.src = 'img/power_mode.png';

                    document.querySelector('.clustering').style.background = 'radial-gradient(circle, #600b04, black)';
                    modeText.textContent = 'Power Mode';
                    circle2MaxEco.style.display = 'none';
                    circle2MaxSport.style.display = 'block';
                    modeVal = 'sport';
                    maxSpeed = 300;
                    sendCANMessage(window['drivingModeARID'], 'P');
                } else {
                    if (engineVal == false) {
                        document.getElementById("scooter").src = 'img/scooter_os.png'
                    }
                    else {
                        if (circle2Value == 0) {
                            document.getElementById("scooter").src = 'img/scooter_es.png'
                        }
                        else {
                            document.getElementById("scooter").src = 'img/scooter_em.gif'
                        }
                    }

                    modeCircle.src = 'img/eco_mode.png';

                    document.querySelector('.clustering').style.background = 'radial-gradient(circle, #008000, black)';
                    modeText.textContent = 'Eco Mode';
                    circle2MaxEco.style.display = 'block';
                    circle2MaxSport.style.display = 'none';
                    modeVal = 'eco';
                    maxSpeed = 200;
                    sendCANMessage(window['drivingModeARID'], 'E');
                }
            }
        } else if (event.key.toLowerCase() === 's') {
            if (standVal == true) {
                standCircle.src = 'img/stand_off.png';
                standText.textContent = 'Stand OFF';
                standVal = false;
                standLight.src = 'img/stand_off.png';
                sendCANMessage(window['standValARID'], 'C');
            } else {
                engineVal = false;
                standCircle.src = 'img/stand_on.png';
                standText.textContent = 'Stand ON';
                standVal = true;
                standLight.src = 'img/stand_on.png';
                ecuImage.src = 'img/ecu.png';
                sendCANMessage(window['standValARID'], 'O');
                document.getElementById("scooter").src = 'img/scooter_os.png'
                stopIncrease();
                decreaseValue();

                engineCircle.src = 'img/engine_off.png';
                engineText.textContent = 'Engine OFF';

                cruiseCircle.src = 'img/cruise_off.png';
                cruiseText.textContent = 'Cruise OFF';
                cruiseLight.src = 'img/cruise_off.png';
                cruiseVal = false;
                sendCANMessage(window['cruiseValARID'], 'M');
                stopIncrease();

                powerOffHMI();
            }
        } else if (event.key.toLowerCase() === 'r') {
            if (standVal == true) {
                standShake();
            } else {
                if (reverseVal == false) {
                    reverseVal = true;
                    reverseText.textContent = 'Reverse ON';
                    reverseCircle.src = 'img/reverse_on.png';
                    stopIncrease();

                    circle2SpeedContent.textContent = '0 KM/H';
                    circle2Value = 0;
                    video.src = 'img/road_reverse.mp4';

                    document.getElementById('circle2').style.borderColor = 'red';

                    circle2MaxEco.style.display = 'none';
                    circle2MaxSport.style.display = 'none';

                    document.getElementById('reverseImg').style.display = 'block';
                    document.getElementById('reverseBorderImg').style.display = 'block';

                    sendCANMessage(window['reverseValARID'], 'R');

                    document.getElementById('weather-val').style.display = 'none';
                    document.getElementById('weather-icon').style.display = 'none';
                    circle2SpeedContent.style.transform = 'translateX(116%) translateY(-50%)';
                    circle2SpeedContent.style.fontSize = '30px';
                    circle2CurrentSpeedLabel.style.transform = 'translateX(200%) translateY(-10%)';
                }
                else {
                    reverseVal = false;
                    reverseText.textContent = 'Reverse OFF';
                    reverseCircle.src = 'img/reverse_off.png';

                    circle2SpeedContent.textContent = '0 KM/H';
                    circle2Value = 0;
                    video.src = 'img/road.mp4';

                    document.getElementById('circle2').style.borderColor = 'white';
                    circle2SpeedContent.style.display = 'block';
                    circle2CurrentSpeedLabel.style.display = 'block';

                    if (modeVal == 'eco') {
                        circle2MaxEco.style.display = 'block';
                    }
                    else {
                        circle2MaxSport.style.display = 'block';
                    }

                    document.getElementById('reverseImg').style.display = 'none';
                    document.getElementById('reverseBorderImg').style.display = 'none';

                    sendCANMessage(window['reverseValARID'], 'F');

                    document.getElementById('weather-val').style.display = 'block';
                    document.getElementById('weather-icon').style.display = 'block';
                    circle2SpeedContent.style.transform = 'translateX(0%) translateY(0%)';
                    circle2SpeedContent.style.fontSize = '40px';
                    circle2CurrentSpeedLabel.style.transform = 'translateX(0%) translateY(0%)';
                }
            }
        } else if (event.key.toLowerCase() === 'c') {
            if (standVal == true) {
                standShake();
            } else {
                if (cruiseVal == true) {
                    cruiseCircle.src = 'img/cruise_off.png';
                    cruiseText.textContent = 'Cruise OFF';
                    cruiseLight.src = 'img/cruise_off.png';
                    cruiseVal = false;
                    sendCANMessage(window['cruiseValARID'], 'M');
                    stopIncrease();
                } else {
                    cruiseCircle.src = 'img/cruise_on.png';
                    cruiseText.textContent = 'Cruise ON';
                    cruiseVal = true;
                    cruiseLight.src = 'img/cruise_on.png';
                    sendCANMessage(window['cruiseValARID'], 'C');
                }
            }
        }


    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowUp') {
            stopIncrease();
        }

    });


    socket.on('canMessage', handleCANMessage);

    function handleCANMessage(message) {

        let data = message.data;

        let stringID = parseInt(message.id, 16);

        switch (stringID) {
            case window['speedValARID']:
                updateSpeedReceive(data);
                break;
            case window['batteryValARID']:
                updateBatteryReceive(data);
                break;
            case window['weatherValARID']:
                updateTemperature(data);
                break;
            case window['weatherInfoARID']:
                updateWeatherCondition(data);
                break;
            case window['indicatorValARID']:
                updateLightIndicators(data);
                break;
            case window['drivingModeARID']:
                updateMode(data);
                break;
            case window['storageValARID']:
                updateStorage(data);
                break;
            case window['engineValARID']:
                updateEngine(data);
                break;
            case window['standValARID']:
                updateStand(data);
                break;
            case window['reverseValARID']:
                updateReverse(data);
                break;
            case window['cruiseValARID']:
                updateCruise(data);
                break;
            default:
                break;
        }
    }

    socket.on('randomizeIds', (data) => {
        const randomize = data.randomize;
        sessionStorage.setItem('randomize', randomize);
        assignIDs();
    });

    function assignIDs() {

        const doRandom = sessionStorage.getItem('randomize');

        if (doRandom == 'true') {
            variables.forEach((variableName) => {
                let randomValue;

                do {
                    randomValue = randomInt(1, 2047);
                } while (assignedARIDs.includes(randomValue));

                assignedARIDs.push(randomValue.toString());

                window[variableName] = randomValue.toString();
            });

            idsAssigned = true;

        } else {
            let fixedValues = [
                121, 122, 731, 175, 176, 231, 232, 591, 879, 1335, 1761, 1899, 444
            ];

            variables.forEach((variableName, index) => {
                let fixedValue = fixedValues[index];

                assignedARIDs.push(fixedValue);

                window[variableName] = fixedValue;
            });

            idsAssigned = true;

        }
    }

    function updateSpeedReceive(data) {
        const speed = parseInt(data, 16) - 300;

        if (speed >= 0 && speed < 301) {
            circle2Value = speed;
            speedGlobal = speed;
            circle2.textContent = `${speed} KM/H`;

            circle2SpeedContent.style.marginTop = '';
            circle2CurrentSpeedLabel.style.display = 'block';

            if (modeVal === 'eco') {
                circle2MaxEco.style.display = 'block';
                circle2MaxSport.style.display = 'none';
            } else {
                circle2MaxEco.style.display = 'none';
                circle2MaxSport.style.display = 'block';
            }
        } else if (speed == 301) {
            circle2.textContent = "Speed limit reached!";
            circle2SpeedContent.style.marginTop = 0;
            circle2MaxEco.style.display = 'none';
            circle2MaxSport.style.display = 'none';
            circle2CurrentSpeedLabel.style.display = 'none';
        } else if (data === 'ZERO') {
            circle2.textContent = "0 KM/H";
            speedGlobal = 0;
        }
    }

    function updateBatteryReceive(data) {
        const battery = parseInt(data, 16) - 285;

        if (!isNaN(battery) && battery >= 0 && battery <= 100) {
            circle1Value = battery;
            batteryGlobal = battery;
            circle1.textContent = `${Math.max(0, battery)}%`;


            let hue = (battery * 120 / 100);
            circle1Border.style.borderColor = `hsl(${hue}, 100%, 50%)`;
        }
    }

    function updateTemperature(data) {
        const temp = parseInt(data, 16);
        if (!isNaN(temp)) {
            circle3.textContent = `${temp}°C`;
        }
    }

    function updateWeatherCondition(data) {
        switch (data) {
            case 'RAIN':
                circle3Text.textContent = "Rainy";
                circle3ImgSrc.src = "img/rainyicon.png";
                break;
            case 'OVER':
                circle3Text.textContent = "Overcast";
                circle3ImgSrc.src = "img/overcasticon.png";
                break;
            case 'SUN':
                circle3Text.textContent = "Sunny";
                circle3ImgSrc.src = "img/sunnyicon.png";
                break;
            case 'ERR':
                circle3Text.textContent = "Error";
                circle3ImgSrc.src = "img/erroricon.png";
                break;
        }
    }

    function updateLightIndicators(data) {
        const code = data;

        if (code.startsWith('1')) {
            if (code === '11') {
                leftTriangle.style.display = 'block';
                leftLightToggle = true;
            } else if (code === '12') {
                rightTriangle.style.display = 'block';
                rightLightToggle = true;
            } else if (code === '13') {
                leftTriangle.style.display = 'block';
                rightTriangle.style.display = 'block';
                leftLightToggle = true;
                rightLightToggle = true;
            }
        } else if (code.startsWith('0')) {
            if (code === '01') {
                leftTriangle.style.display = 'none';
                leftLightToggle = false;
            } else if (code === '02') {
                rightTriangle.style.display = 'none';
                rightLightToggle = false;
            } else if (code === '03') {
                leftTriangle.style.display = 'none';
                rightTriangle.style.display = 'none';
                leftLightToggle = false;
                rightLightToggle = false;
            }
        }
    }

    function updateMode(data) {
        if (standVal == true) {
            standShake();
        } else {
            if (data === '50') {
                modeCircle.src = 'img/power_mode.png';
                document.querySelector('.clustering').style.background = 'radial-gradient(circle, #600b04, black)';
                modeText.textContent = 'Power Mode';
                circle2MaxEco.style.display = 'none';
                circle2MaxSport.style.display = 'block';
                modeVal = 'sport';
                maxSpeed = 300;
                if (engineVal == false) {
                    document.getElementById("scooter").src = 'img/scooter_os.png'
                }
                else {
                    if (circle2Value == 0) {
                        document.getElementById("scooter").src = 'img/scooter_ps.png'
                    }
                    else {
                        document.getElementById("scooter").src = 'img/scooter_pm.gif'
                    }
                }
            } else if (data === '45') {
                modeCircle.src = 'img/eco_mode.png';
                document.querySelector('.clustering').style.background = 'radial-gradient(circle, #008000, black)';
                modeText.textContent = 'Eco Mode';
                circle2MaxEco.style.display = 'block';
                circle2MaxSport.style.display = 'none';
                modeVal = 'eco';
                maxSpeed = 200;
                if (engineVal == false) {
                    document.getElementById("scooter").src = 'img/scooter_os.png'
                }
                else {
                    if (circle2Value == 0) {
                        document.getElementById("scooter").src = 'img/scooter_ps.png'
                    }
                    else {
                        document.getElementById("scooter").src = 'img/scooter_pm.gif'
                    }
                }
            }
        }
    }

    function updateStorage(data) {
        if (data === '55') {
            storageCircle.src = 'img/seat_unlock.png';
            storageText.textContent = 'Seat UNLCK';
            storageVal = false;
        } else if (data === '4c') {
            storageCircle.src = 'img/seat_lock.png';
            storageText.textContent = 'Seat LOCK';
            storageVal = true;
        }
    }

    function updateEngine(data) {
        
        // Just an extra check component added to make sure that the HMI is really OFF if engine is off (due to the high volume of fuzzing messages) )
        if (engineVal == false) {
            powerOffHMI();
        }

        if (standVal == true) {
            standShake();
        } else {
            if (data === '46') {
                engineCircle.src = 'img/engine_off.png';
                engineText.textContent = 'Engine OFF';
                engineVal = false;
                document.getElementById("scooter").src = 'img/scooter_os.png'
                ecuImage.src = 'img/ecu.png';

                powerOffHMI();
            } else if (data === '4e') {
                engineCircle.src = 'img/engine_on.png';
                engineText.textContent = 'Engine ON';
                engineVal = true;
                ecuImage.src = 'img/ecu.gif';
                if (modeVal == 'eco') {
                    document.getElementById("scooter").src = 'img/scooter_es.png'
                }
                else {
                    document.getElementById("scooter").src = 'img/scooter_ps.png'
                }

                powerOnHMI();
            }
        }
    }

    function updateStand(data) {
        if (data === '43') {
            standCircle.src = 'img/stand_off.png';
            standText.textContent = 'Stand OFF';
            standVal = false;
            standLight.src = 'img/stand_off.png';
        }
        else if (data === '4f') {
            engineVal = false;
            standCircle.src = 'img/stand_on.png';
            standText.textContent = 'Stand ON';
            standVal = true;
            standLight.src = 'img/stand_on.png';
            ecuImage.src = 'img/ecu.png';
            document.getElementById("scooter").src = 'img/scooter_os.png'
            stopIncrease();
            decreaseValue();

            engineCircle.src = 'img/engine_off.png';
            engineText.textContent = 'Engine OFF';

            cruiseCircle.src = 'img/cruise_off.png';
            cruiseText.textContent = 'Cruise OFF';
            cruiseLight.src = 'img/cruise_off.png';
            cruiseVal = false;
            sendCANMessage(window['cruiseValARID'], 'M');
            stopIncrease();

            powerOffHMI();
        }
    }
    function updateCruise(data) {

        if (standVal == true) {
            standShake();
        } else {
            if (data === '4d') {
                cruiseCircle.src = 'img/cruise_off.png';
                cruiseText.textContent = 'Cruise OFF';
                cruiseLight.src = 'img/cruise_off.png';
                cruiseVal = false;
                stopIncrease();
            } else if (data === '43') {
                cruiseCircle.src = 'img/cruise_on.png';
                cruiseText.textContent = 'Cruise ON';
                cruiseVal = true;
                cruiseLight.src = 'img/cruise_on.png';
            }
        }
    }

    function updateReverse(data) {
        if (standVal == true) {
            standShake();
        } else {
            if (data === '52') {
                reverseVal = true;
                reverseText.textContent = 'Reverse ON';
                reverseCircle.src = 'img/reverse_on.png';
                stopIncrease();

                circle2SpeedContent.textContent = '0 KM/H';
                circle2Value = 0;
                video.src = 'img/road_reverse.mp4';

                document.getElementById('circle2').style.borderColor = 'red';
                circle2MaxEco.style.display = 'none';
                circle2MaxSport.style.display = 'none';

                document.getElementById('reverseImg').style.display = 'block';
                document.getElementById('reverseBorderImg').style.display = 'block';

                document.getElementById('weather-val').style.display = 'none';
                document.getElementById('weather-icon').style.display = 'none';
                circle2SpeedContent.style.transform = 'translateX(116%) translateY(-50%)';
                circle2SpeedContent.style.fontSize = '30px';
                circle2CurrentSpeedLabel.style.transform = 'translateX(200%) translateY(-10%)';

            }
            else if (data === '46') {
                reverseVal = false;
                reverseText.textContent = 'Reverse OFF';
                reverseCircle.src = 'img/reverse_off.png';

                circle2SpeedContent.textContent = '0 KM/H';
                circle2Value = 0;
                video.src = 'img/road.mp4';

                document.getElementById('circle2').style.borderColor = 'white';
                circle2SpeedContent.style.display = 'block';
                circle2CurrentSpeedLabel.style.display = 'block';

                if (modeVal == 'eco') {
                    circle2MaxEco.style.display = 'block';
                }
                else {
                    circle2MaxSport.style.display = 'block';
                }

                document.getElementById('reverseImg').style.display = 'none';
                document.getElementById('reverseBorderImg').style.display = 'none';

                document.getElementById('weather-val').style.display = 'block';
                document.getElementById('weather-icon').style.display = 'block';
                circle2SpeedContent.style.transform = 'translateX(0%) translateY(0%)';
                circle2SpeedContent.style.fontSize = '40px';
                circle2CurrentSpeedLabel.style.transform = 'translateX(0%) translateY(0%)';
            }
        }
    }

    function updateCANBusy() {
        const garbageID = randomInt(1, 2047);
        if (!assignedARIDs.includes(garbageID) && idsAssigned == true && engineVal == true) {
            const garbageLength = randomInt(1, 8);
            const garbageValue = randomString(garbageLength);
            sendCANMessage(garbageID.toString(), garbageValue);
        }
    }

    function powerOnHMI() {
        const anim0 = document.getElementById("clusterAnim0");
        const anim1 = document.getElementById("clusterAnim1");
        
        void anim1.offsetWidth;
        anim1.classList.add("fade-in");

        powerOnTimeoutId = setTimeout(() => {
            anim0.style.display = "none";
            anim1.style.display = "none";
            anim1.classList.remove("fade-in");
            powerOnTimeoutId = null;
        }, 2000);
    }
    
    function powerOffHMI() {
        const anim0 = document.getElementById("clusterAnim0");
        const anim1 = document.getElementById("clusterAnim1");

        if (powerOnTimeoutId !== null) {
            clearTimeout(powerOnTimeoutId);
            powerOnTimeoutId = null;
        }
        
        anim0.style.display = "block";
        anim1.style.opacity = '0';
        anim1.style.display = "block";
        anim1.classList.remove("fade-in");
    }

    setInterval(updateCANBusy, 100);
});