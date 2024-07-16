// ==UserScript==
// @name         Stake Statistics Enhancer
// @namespace    https://github.com/MrRaymondFish/Stake-Statistics-Enhancer
// @supportURL   https://github.com/MrRaymondFish/Stake-Statistics-Enhancer/issues
// @version      0.9.7
// @description  Adds options to hide elements in the Stake statistics window. Also calculates estimated RTP for each game in real-time.
// @author       RaymondFish (https://github.com/MrRaymondFish/)
// @supportURL   mrraymondfish@gmail.com
// @match        stake.com/*
// @match        stake.ac/*
// @match        stake.games/*
// @match        stake.bet/*
// @match        stake.pink/*
// @match        stake.mba/*
// @match        stake.jp/*
// @match        stake.bz/*
// @match        staketr.com/*
// @match        stake.ceo/*
// @match        stake.krd/*
// @match        stake.us/*
// @match        stake.uk.com/*
// @match        stake.ca/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stake.us
// @grant        GM_addStyle
// @compatible   chrome
// @compatible   firefox
// ==/UserScript==

var startRTP = null, svelteClass = "svelte-1myjzud";

const mutationObserver = new MutationObserver((mutations) => {
    if (document.querySelector("[data-testid='bets-stats-profit']")){
		if (document.querySelector("[data-testid='bets-stats-profit']").textContent != startRTP){
            startRTP = document.querySelector("[data-testid='bets-stats-profit']").textContent;
            document.querySelector(".rtp-container") ? (updateRTP(getGameProfit(), getGameWagered()), updateSpins(getTotalSpins(), getSpinWins())) : (insertRTP(), insertTotalSpins());
        }
    }
    if(document.querySelector(".graph-wrap")){
        document.querySelector(".graph-toggle") ? null : insertOptions();
    }
});

mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
});

function insertOptions(){
    var customOptions = document.createElement("div");
    customOptions.classList.add("custom-options");
    var customOptionsRow1 = document.createElement("div");
    customOptionsRow1.classList.add("custom-options-row");
    var customOptionsRow2 = document.createElement("div");
    customOptionsRow2.classList.add("custom-options-row");

    var toggleTextRace = document.createElement("span");
    toggleTextRace.textContent = "Race?";
    toggleTextRace.classList.add("toggle-text-race", "weight-semibold", "line-height-default", "align-left", "size-default", "text-size-default", "variant-subtle", "with-icon-space", svelteClass);

    var toggleTextGraph = document.createElement("span");
    toggleTextGraph.textContent = "Graph?";
    toggleTextGraph.classList.add("toggle-text-graph", "weight-semibold", "line-height-default", "align-left", "size-default", "text-size-default", "variant-subtle", "with-icon-space", svelteClass);

    var labelRaceToggle = document.createElement("label");
    labelRaceToggle.classList.add("race-toggle");

    var labelGraphToggle = document.createElement("label");
    labelGraphToggle.classList.add("graph-toggle");

    var raceInput = document.createElement("input");
    raceInput.type = "checkbox";
    raceInput.id = "raceToggle";
    raceInput.checked = true;
    raceInput.classList.add("raceToggle__input");

    var graphInput = document.createElement("input");
    graphInput.type = "checkbox";
    graphInput.id = "graphToggle";
    graphInput.checked = true;
    graphInput.classList.add("graphToggle__input");

    var raceFill = document.createElement("div");
    raceFill.classList.add("raceToggle__fill");

    var graphFill = document.createElement("div");
    graphFill.classList.add("graphToggle__fill");

    labelRaceToggle.appendChild(raceInput);
    labelRaceToggle.appendChild(raceFill);
    labelGraphToggle.appendChild(graphInput);
    labelGraphToggle.appendChild(graphFill);

    customOptionsRow1.appendChild(toggleTextRace);
    customOptionsRow1.appendChild(labelRaceToggle);
    customOptionsRow2.appendChild(toggleTextGraph);
    customOptionsRow2.appendChild(labelGraphToggle);

    customOptions.appendChild(customOptionsRow1);
    customOptions.appendChild(customOptionsRow2);

    document.querySelector(".draggable-stats-content").prepend(customOptions);

    document.querySelector("#graphToggle").addEventListener("change", toggleGraph);
    document.querySelector("#raceToggle").addEventListener("change", toggleRace);
}

function insertRTP(){
    if (document.querySelector(".rtp-container")) document.querySelector(".rtp-container").remove();
    var newNode = document.querySelector(".statistic-card").children[1].cloneNode(true);
    newNode.classList.add("rtp-container");
    newNode.children[0].textContent = "Est. RTP";
    newNode.children[1].children[0].children[0].textContent = `0%`;
    newNode.children[1].children[1].remove();
    document.querySelectorAll(".statistic-card")[0].appendChild(newNode);
}

function insertTotalSpins(){
    if (document.querySelector(".total-spins-container")) document.querySelector(".total-spins-container").remove();
    var newNode = document.querySelector(".statistic-card").children[1].cloneNode(true);
    newNode.classList.add("total-spins-container");
    newNode.children[0].textContent = "Spins (Win %)";
    newNode.children[1].children[0].children[0].textContent = `0`;
    newNode.children[1].children[1].remove();
    document.querySelectorAll(".statistic-card")[1].appendChild(newNode);
}

function toggleGraph(){
    if (document.querySelector(".graph-wrap")){
        document.querySelector(".graph-wrap").parentElement.classList.toggle("custom-hide");
    }else{
        document.querySelector("#graphToggle").checked = true;
    }
}

function toggleRace(){
    if (document.querySelector(".card.variant-default > .stack.x-stretch")){
        document.querySelector(".card.variant-default > .stack.x-stretch").parentElement.classList.toggle("custom-hide");
    }else{
        document.querySelector("#raceToggle").checked = true;
    }
}

function getGameProfit(){
    return parseFloat(document.querySelector("[data-testid='bets-stats-profit']").textContent.replace(/\,/g,'').replace(/[^0-9\.-]+/g,""), 10);
}

function getGameWagered(){
    return parseFloat(document.querySelector("[data-testid='bets-stats-wagered']").textContent.replace(/\,/g,'').replace(/[^0-9\.-]+/g,""), 10);
}

function getTotalSpins(){
    return parseInt(document.querySelector("[data-testid='bets-stats-wins']").textContent) + parseInt(document.querySelector("[data-testid='bets-stats-losses']").textContent);
}

function getSpinWins(){
    return parseInt(document.querySelector("[data-testid='bets-stats-wins']").textContent);
}

function updateRTP(profit, wagered){
    document.querySelector(".rtp-container").children[1].children[0].children[0].textContent = `${(((wagered + profit) / wagered) * 100).toFixed(1)}%`;
}

function updateSpins(spins, wins){
    document.querySelector(".total-spins-container").children[1].children[0].children[0].textContent = `${spins} (${((wins / spins) * 100).toFixed(1)}%)`;
}

function isElementVisible(element) {
    return element.offsetWidth || element.offsetHeight ? true : false;
}


GM_addStyle(`.graph-toggle,.race-toggle{--width:28px;--height:calc(var(--width) / 2);--border-radius:calc(var(--height) / 2);padding-top:0;display:inline-block;cursor:pointer;margin-right:10px}.custom-hide,.graphToggle__input,.raceToggle__input{display:none}.graphToggle__fill,.raceToggle__fill{position:relative;width:var(--width);height:var(--height);border-radius:var(--border-radius);background:#ddd;transition:background .2s}.graphToggle__fill::after,.raceToggle__fill::after{content:"";position:absolute;top:0;left:0;height:var(--height);width:var(--height);background:#fff;box-shadow:0 0 10px rgba(0,0,0,.25);border-radius:var(--border-radius);transition:transform .2s}.graphToggle__input:checked~.graphToggle__fill,.raceToggle__input:checked~.raceToggle__fill{background:#00e701}.graphToggle__input:checked~.graphToggle__fill::after,.raceToggle__input:checked~.raceToggle__fill::after{transform:translateX(var(--height))}.toggle-text-graph, .toggle-text-race{margin-left:auto;margin-right:5px}.custom-options{display:flex;flex-direction:row;justify-content:center;margin:-7px 0;}.custom-options-row{display:flex;align-items:center}.toggle-text-disabled{text-decoration:line-through;}`);
