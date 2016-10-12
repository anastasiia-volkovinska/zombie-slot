import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';
import { parsers } from 'components/parsers/parsers';

export let init = (function () {

    let config;
    const defaultConfig = {
        device: 'mobile',
        mode: 'normal',
        userID: 1,
        casinoID: 1
    };

    // qo2 - двери, qo5 - фри-спины, qos - стандартный режим
    const mode = {
        normal: 'snail3',
        fsBonus: 'snail4',
        bonus: 'qo2'
    };

    const savedFS = {};
    const savedBonus = {};

    function start(configObj) {
        config = configObj || defaultConfig;
        storage.write('device', config.device);
    }

    function checkPlayerState(state) {
        if (!state.Saved) {
            // Если нет сохраненных сесий
            storage.changeState('mode', 'normal');
        } else if (state.Saved.ResultType === 'Freespin') {
            // Обработка оборванных фри-спинов
            savedFS.count = state.Saved.RemainSpins;
            savedFS.multi = state.Saved.Multiplier.MultiplierValue;
            savedFS.level = state.Saved.Multiplier.MultiplierStep;
            savedFS.currentWinCoins = state.Saved.CurrentTotalWinCoins;
            savedFS.currentWinCents = state.Saved.CurrentTotalWinCents;

            storage.changeState('mode', 'fsBonus');
            storage.write('savedFS', savedFS);
        } else if (state.Saved.ResultType === 'MultiplierBonus') {
            // Обработка оборванных бонусов

            storage.changeState('mode', 'bonus');
            storage.write('savedBonus', savedBonus);
        }
    }

    function checkCasinoData(store) {
        if (store.getItem('userID')) {
            config.userID = store.getItem('userID');
        }
        if (store.getItem('casinoID')) {
            config.casinoID = store.getItem('casinoID');
        }
    }

    function login() {

        // Проверяем есть ли сохранненные данные от казино
        checkCasinoData(localStorage);

        // Отправляем запрос на инициализацию
        utils.request('_Initialise', `/${config.userID}/${config.casinoID}/${mode[config.mode]}`)
            .then(initData => {

                // Сохраняем необходимые данные
                const wheelsString = initData.SlotWheels.filter(obj => obj.Mode === 'root')[0].WheelsContent;
                const fsWheelsString = initData.SlotWheels.filter(obj => obj.Mode === 'fsBonus')[0].WheelsContent;
                const linesString = initData.Lines;
                const lines = parsers.lines(linesString);
                const linesCoords = parsers.linesCoords(lines);

                // Записываем данные в Storage
                storage.write('initData', initData);
                storage.write('initState', initData.PlayerState);
                storage.write('sessionID', initData.SessionID);
                storage.write('wheels', parsers.wheels(wheelsString));
                storage.write('fsWheels', parsers.wheels(fsWheelsString));
                storage.write('lines', lines);
                storage.write('linesCoords', linesCoords);

                // Заканчиваем инициализацию
                storage.changeState('inited', true);
                events.trigger('init:inited');

                // Проверяем наличие сохранненых сесий
                checkPlayerState(initData.PlayerState);

                // Цепляем Logout к закрытию вкладки
                $(window).unload(function () {
                    utils.request('_Logout/', storage.read('sessionID'))
                    .then((response) => {
                        events.trigger('init:logout');
                        console.log('Logout response:', response);
                    });
                });
            })
            .catch(error => console.error(error));
    }

    return {
        start,
        login
    };
})();
