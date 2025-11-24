// ==UserScript==
// @name         FACEIT Demo Downloader (FIX)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Добавляет кнопку прямой скачки демо (минуя баги сайта)
// @author       xennony
// @match        https://www.faceit.com/*/cs2/room/*
// @match        https://www.faceit.com/*/csgo/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faceit.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Функция для получения ID матча из URL
    function getMatchId() {
        const urlParts = window.location.pathname.split('/');
        // Обычно ID матча идет после 'room/'
        const roomIndex = urlParts.indexOf('room');
        if (roomIndex !== -1 && urlParts[roomIndex + 1]) {
            return urlParts[roomIndex + 1];
        }
        return null;
    }

    // Функция скачивания
    async function handleDownload() {
        const matchId = getMatchId();
        if (!matchId) {
            alert('Не удалось найти ID матча!');
            return;
        }

        const btn = document.getElementById('my-custom-download-btn');
        const originalText = btn.innerText;
        btn.innerText = 'Поиск ссылки...';

        try {
            // Используем публичное API Faceit для получения данных матча
            const response = await fetch(`https://api.faceit.com/match/v2/match/${matchId}`);
            if (!response.ok) throw new Error('Ошибка API');
            
            const data = await response.json();
            
            // Ищем ссылки на демо
            let demoUrl = null;
            
            if (data.payload && data.payload.demo_url && data.payload.demo_url.length > 0) {
                demoUrl = data.payload.demo_url[0];
            }

            if (demoUrl) {
                // Если ссылка найдена — открываем её
                btn.innerText = 'Скачивание...';
                window.location.href = demoUrl;
                setTimeout(() => btn.innerText = originalText, 2000);
            } else {
                alert('Демка еще не готова или уже удалена (прошло >30 дней).');
                btn.innerText = originalText;
            }

        } catch (e) {
            console.error(e);
            alert('Ошибка при получении ссылки. Проверьте консоль (F12).');
            btn.innerText = originalText;
        }
    }

    // Функция добавления кнопки
    function addCustomButton() {
        // Проверяем, не добавили ли мы уже кнопку
        if (document.getElementById('my-custom-download-btn')) return;

        // Ищем оригинальную кнопку "Смотреть демо" или "Watch Demo"
        // Так как классы меняются, ищем по тексту внутри span
        const buttons = document.querySelectorAll('button');
        let targetButton = null;

        buttons.forEach(btn => {
            if (btn.innerText.includes('Смотреть демо') || btn.innerText.includes('Watch Demo') || btn.innerText.includes('GO TV')) {
                targetButton = btn;
            }
        });

        // Если нашли оригинальную кнопку, вставляем нашу рядом
        if (targetButton && targetButton.parentNode) {
            const myBtn = document.createElement('button');
            myBtn.id = 'my-custom-download-btn';
            myBtn.innerText = 'СКАЧАТЬ .DEM (FIX)';
            
            // Стилизуем кнопку, чтобы была заметной (Оранжевая)
            myBtn.style.backgroundColor = '#ff5500';
            myBtn.style.color = 'white';
            myBtn.style.fontWeight = 'bold';
            myBtn.style.border = 'none';
            myBtn.style.borderRadius = '4px';
            myBtn.style.padding = '10px 20px';
            myBtn.style.marginLeft = '10px';
            myBtn.style.cursor = 'pointer';
            myBtn.style.fontFamily = 'Play, sans-serif';
            myBtn.style.fontSize = '14px';
            myBtn.style.textTransform = 'uppercase';

            myBtn.onclick = handleDownload;

            // Вставляем после оригинальной кнопки
            targetButton.parentNode.insertBefore(myBtn, targetButton.nextSibling);
        }
    }

    // FACEIT — это SPA (Single Page Application), страница не перезагружается полностью.
    // Поэтому запускаем таймер, который каждые 2 секунды проверяет наличие кнопки.
    setInterval(addCustomButton, 2000);

})();
