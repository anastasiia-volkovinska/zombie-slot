// import CreateJS
// import TweenMax
import { storage } from 'components/storage/storage';

// Модуль утилит
export let utils = (function () {

    const serviceUrl = 'http://gameservice.bossgs.org/devslot/SlotService.svc/';
    const canvasWidth = 1280;
    const canvasHeight = 720;
    const gameWidth = 960;
    const gameHeight = 540;
    const elementHeight = 180;
    const elementWidth = 192;

    createjs.Ticker.on('tick', () => {
        const fps = createjs.Ticker.getMeasuredFPS();
        if (fps < 15) {
            console.info('Current FPS:', fps);
        }
    });

    function request(name, path) {
        console.log(`Request: ${serviceUrl}${name}${path}`);
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: `${serviceUrl}${name}${path}`,
                dataType: 'JSONP',
                type: 'GET',
                success: resolve,
                error: reject
            });
        });
    }

    function getCenterPoint(element) {
        const bounds = element.getBounds();
        element.regX = bounds.width / 2;
        element.regY = bounds.height / 2;
    }

    function setInCenterOf(element, width) {
        element.x = width / 2;
    }

    function showPopup(text) {
        const stage = storage.read('stage');
        const loader = storage.read('loadResult');
        const popupContainer = new createjs.Container().set({name: 'popupContainer'});
        const popup = new createjs.Bitmap(loader.getResult('popup')).set({
            name: 'popup',
            x: utils.width / 2,
            y: utils.height / 2
        });
        getCenterPoint(popup);
        const popupText = new createjs.Text(text, '50px Helvetica', '#fff').set({
            x: utils.width / 2,
            y: utils.height / 2,
            textAlign: 'center',
            textBaseline: 'middle'
        });
        popupContainer.addChild(popup, popupText);
        stage.addChild(popupContainer);
        popupContainer.on('click', () => {
            TweenMax.to(popupContainer, 0.5, {alpha: 0, onComplete: () => {
                stage.removeChild(popupContainer);
            }});
        });
    }

    function lowBalance() {
        return storage.read('currentBalance').betSum > storage.read('currentBalance').coinsSum;
    }

    function findObject(id) {
        $(window).off('keydown');
        window.searchObject = id;
        let stage = storage.read('stage');
        // console.log(stage);
        stage.on('click', (event) => {
            // console.log('i am here');
            let x = event.rawX;
            let y = event.rawY;
            let objects = stage.getObjectsUnderPoint(x, y, 0);
            let myObj = objects.filter((obj) => {
                if (obj.name === window.searchObject) {
                    console.warn('Object checked!');
                    $(window).on('keydown', (event) => {
                        switch (event.keyCode) {
                            case 40: // Down
                                obj.y += 1;
                                console.warn(`${obj.name} coords: ${obj.x}, ${obj.y}`);
                                break;
                            case 38: // Up
                                obj.y -= 1;
                                console.warn(`${obj.name} coords: ${obj.x}, ${obj.y}`);
                                break;
                            case 37: // Left
                                obj.x -= 1;
                                console.warn(`${obj.name} coords: ${obj.x}, ${obj.y}`);
                                break;
                            case 39: // Left
                                obj.x += 1;
                                console.warn(`${obj.name} coords: ${obj.x}, ${obj.y}`);
                                break;
                        }
                    });
                }
            // console.warn('Stage objects:', stage.getObjectsUnderPoint(x, y, 2));
            });
        });
    }

    return {
        request,
        showPopup,
        getCenterPoint,
        setInCenterOf,
        width: canvasWidth,
        height: canvasHeight,
        gameWidth,
        gameHeight,
        elementWidth,
        elementHeight,
        lowBalance,
        findObject
    };
})();
