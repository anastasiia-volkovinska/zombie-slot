// import CreateJS
// import TimelineMax
import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';

export let bg = (function () {

    let config;
    const defaultConfig = {
        bottomLineHeight: 30,
        topLineHeight: 40
    };

    const c = createjs;
    const w = utils.width;
    const h = utils.height;

    function start(configObj) {
        config = configObj || defaultConfig;
    }

    function drawBG() {
        const stage = storage.read('stage');
        const loader = storage.read('loadResult');

        const bgContainer = new c.Container().set({name: 'bgContainer'});
        const mainContainer = new c.Container().set({
            name: 'mainContainer',
            x: -30
        });
        if (storage.read('device') === 'desktop') {
            mainContainer.scaleX = mainContainer.scaleY = 0.86;
            mainContainer.x = mainContainer.x + 130;
        }
        const mainBG = new c.Bitmap(loader.getResult('mainBG')).set({name: 'mainBG'});
        const mainBGsecond = mainBG.clone().set({name: 'mainBGsecond', x: -1280});

        let tl = new TimelineMax({repeat: -1});
        tl.to(mainBG, 50, {x: 1280, ease: Power0.easeNone})
            .to(mainBG, 0, {x: -1280})
            .to(mainBG, 50, {x: 0, ease: Power0.easeNone})
            .to(mainBGsecond, 100, {x: 1280, ease: Power0.easeNone}, 0)
            .to(mainBGsecond, 0, {x: -1280});

        const gameBG = new c.Bitmap(loader.getResult('gameBG')).set({
            name: 'gameBG',
            x: 98, // Magic Numbers
            y: 78 // Magic Numbers
        });
        const gameMachine = new c.Bitmap(loader.getResult('gameMachine')).set({
            name: 'gameMachine',
            x: 60, // Magic Numbers
            y: 5 // Magic Numbers
        });

        bgContainer.addChild(mainBG, mainBGsecond);
        mainContainer.addChild(gameBG, gameMachine);
        stage.addChildAt(bgContainer, mainContainer, 0);


        storage.changeState('bgDraw', 'main');
        events.trigger('bg:main');
        if (storage.read('device') === 'desktop') {
            storage.changeState('side', 'right');
            events.trigger('bg:changeSide', 'right');
        } else {
            storage.changeState('side', 'left');
            events.trigger('bg:changeSide', 'left');
        }
    }

    // function addCloud() {
    //     const loader = storage.read('loadResult');
    //     const newCloud = new c.Bitmap(loader.getResult('cloud')).set({
    //         name: 'newCloud',
    //         y: 90
    //     });
    //     utils.getCenterPoint(newCloud);
    //
    //     let side = Math.round(Math.random()) ? 'left' : 'right';
    //     const time = 30 + Math.random() * 15 - 7.5;
    //     let delta;
    //     newCloud.y = newCloud.y + Math.random() * 100 - 50;
    //     newCloud.scaleX = newCloud.scaleY = Math.random() * 0.5 + 0.5;
    //     if (side === 'left') {
    //         newCloud.x = -420;
    //         delta = 1280 + 420;
    //     } else {
    //         newCloud.x = 1280 + 420;
    //         delta = -420;
    //     }
    //
    //     const stage = storage.read('stage');
    //     const bgContainer = stage.getChildByName('bgContainer');
    //     const greyBGGradient = bgContainer.getChildByName('greyBGGradient');
    //
    //     bgContainer.addChildAt(newCloud, bgContainer.getChildIndex(greyBGGradient));
    //
    //     TweenMax.to(newCloud, time, {x: delta,
    //         onComplete: function () {
    //             bgContainer.removeChild(newCloud);
    //             addCloud();
    //         }
    //     });
    // }
    //
    // function addPole() {
    //     const loader = storage.read('loadResult');
    //     const pole = new c.Sprite(loader.getResult('pole')).set({
    //         name: 'pole',
    //         y: 580
    //     });
    //     utils.getCenterPoint(pole);
    //     pole.play();
    //
    //     let side = Math.round(Math.random()) ? 'left' : 'right';
    //     let time = 15 + Math.random() * 15 - 7.5;
    //     let delta;
    //
    //     if (side === 'left') {
    //         pole.x = -420;
    //         delta = 1280 + 420;
    //     } else {
    //         pole.x = 1280 + 420;
    //         pole.skewY = 180;
    //         delta = -420;
    //     }
    //
    //     const stage = storage.read('stage');
    //     const bgContainer = stage.getChildByName('bgContainer');
    //     bgContainer.addChild(pole);
    //
    //     TweenMax.to(pole, time, {x: delta,
    //         onComplete: function () {
    //             bgContainer.removeChild(pole);
    //             addPole();
    //         }
    //     });
    // }

    function changeSide(side) {
        const stage = storage.read('stage');
        const mainContainer = stage.getChildByName('mainContainer');
    }

    return {
        start,
        drawBG,
        changeSide
    };

})();
