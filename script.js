let APIData = null;

let currentCosmeticType = "outfit";
let currentImageType = "outfit"

let currentIndex = 0;
let itemsPerStep = 50;

let isFilterEnabled = false;
let filteredData = null;

let helplist = ["backpack", "pickaxe", "glider", "wrap", "emote", "loadingscreen", "music", "contrail"];

let colors = {
    'Common': '#B1B1B1',
    'Uncommon': '#5BFD00',
    'Rare': '#00FFF6',
    'Epic': '#D505FF',
    'Legendary': '#F68B20',
    'Mythic': '#FFDE61',
    'Transcendent': '#00B5F6',
    'CUBESeries': '#ff138e', 
    'DCUSeries': '#0031e0',
    'FrozenSeries': '#afd7ff',
    'CreatorCollabSeries': '#1be2e4',
    'Series_Lamborghini': '#DDD7ED',
    'LavaSeries': '#f39d09',
    'MarvelSeries': '#d70204',
    'Series_McLaren': '#7f200d',
    'PlatformSeries': '#3730FF',
    'ShadowSeries': '#ffffff',
    'SlurpSeries': '#03f1ed',
    'ColumbusSeries': '#ffaf00'
}


loadPage("outfit");


function loadPage(cosmeticType) {
    document.getElementById("searchBar").value = "";
    document.getElementById("rarityFilter").value = "none";
    //document.getElementById("loadMoreBtn").style.display = "block";

    currentCosmeticType = cosmeticType;
    currentIndex = 0;
    clearCosmetics();

    if (cosmeticType != "outfit") {
        clearStyleFromSelected("cosmetic");        
        document.getElementsByClassName("typeSelectorBtn")[helplist.indexOf(cosmeticType)].classList.add("selectorSelectedOption");
    }

    fetch(`https://fortnite-api.com/v2/cosmetics/br/search/all?type=${cosmeticType}`)
    .then(res => res.json())
    .then(data => {
        data = data.data.filter(x => !x.id.toLowerCase().includes("npc"));

        APIData = data;        
        loadCosmetics(data);
    })

    loadCanvas();
}

function loadCosmetics(dataParam) {
    let elem = document.querySelector("button#loadMoreBtn");
    if (elem) {
        elem.remove();
    }

    let startIndex = currentIndex;
    let endIndex = currentIndex + itemsPerStep;

    let data;
    if (dataParam) {
        data = dataParam;
    } else {
        data = APIData;
    }

    let slicedObjects = data.slice(startIndex, endIndex);

    slicedObjects.forEach(element => {
        document.getElementById("cosmetics").innerHTML +=
        `
            <img class="${Object.keys(element).includes("series") ? element.series.backendValue : element.rarity.displayValue}" src="${Object.keys(element.images).includes("featured") ? element.images.featured : Object.keys(element.images).includes("icon") ? element.images.icon : element.images.smallIcon}" onclick="selectCosmeticImage(this)"/>
        `
    });

    currentIndex += itemsPerStep;

    if (currentIndex < data.length) {
        document.getElementById("cosmetics").innerHTML += 
        `
            <button type="button" id="loadMoreBtn" onclick="loadMore()">Load More</button>
        `;
    }
}

function clearCosmetics() {
    let cosmetics = document.getElementById("cosmetics");

    while (cosmetics.firstChild) {
        cosmetics.firstChild.remove();
    }
}

function loadMore() {
    isFilterEnabled ? loadCosmetics(filteredData) : loadCosmetics(null);
}

function filterHandle() {
    let searchTerm = document.getElementById("searchBar").value.trim().toLowerCase();
    let selectedRarityValue = document.getElementById("rarityFilter").value == "none" ? null : document.getElementById("rarityFilter").value;
    
    isFilterEnabled = selectedRarityValue == "none" ? false : true;

    currentIndex = 0;
    clearCosmetics();

    let data = APIData;
    data = data.filter(x => x.name.toLowerCase().includes(searchTerm) || x.id.toLowerCase().includes(searchTerm));

    if (selectedRarityValue) {
        let selectedRarityMethod = selectedRarityValue.split("-")[0];
        let selectedRaritySubKey = selectedRarityValue.split("-")[0] == "rarity" ? "displayValue" : "backendValue";
        let selectedRarity = selectedRarityValue.split("-")[1];

        data = data.filter(x => 
            (Object.keys(x).includes("series") && selectedRarityMethod == "series" && x[selectedRarityMethod][selectedRaritySubKey].toLowerCase() == selectedRarity.toLowerCase()) ||
            (Object.keys(x).includes("rarity") && selectedRarityMethod == "rarity" && x[selectedRarityMethod][selectedRaritySubKey].toLowerCase() == selectedRarity.toLowerCase())
        );
    }
    
    filteredData = data;
    loadCosmetics(data);
}

function clearStyleFromSelected(type) {
    let elements = type == "image" ? document.querySelectorAll("div#imageSelector > div.selectorSelectedOption") : document.querySelectorAll("div#typeSelector > div.selectorSelectedOption");

    elements.forEach(element => {
        element.classList.remove("selectorSelectedOption");
    });
}

function changeImageType(imageType, el) {
    document.getElementById("searchBar").value = "";
    document.getElementById("rarityFilter").value = "none";
    //document.getElementById("loadMoreBtn").style.display = "block";

    currentImageType = imageType;

    clearStyleFromSelected("image");
    el.classList.add("selectorSelectedOption");

    let cosmeticTypeSelector = document.getElementById("typeSelector");

    if (imageType == "outfit") {
        cosmeticTypeSelector.style.display = "none";
    }
    else {
        cosmeticTypeSelector.style.display = "flex";
        
        if (currentCosmeticType != "outfit") { return; }
        else { loadPage("backpack"); }
    }
}

function selectCosmeticImage(el) {
    assetsSettings[currentImageType]['url'] = el.src;
    loadCanvas();
}

function selectBackground(el) {
    assetsSettings.background = `assets/images/backgrounds/${el.src.split("=")[1]}.png`;
    loadCanvas();
}

function toggleContent(divNumber) {
    let contentDiv;
    let contentTitle;

    if (divNumber == 1) {
        contentDiv = document.getElementById(`settingsContainer`);
        contentTitle = document.getElementById(`settingsText`);
    } else if (divNumber == 2) {
        contentDiv = document.getElementById(`cosmeticsContainer`);
        contentTitle = document.getElementById(`cosmeticsText`);
    } else if (divNumber == 3) {
        contentDiv = document.getElementById(`controllContainer`);
        contentTitle = document.getElementById(`controllText`);
    }
    

    if (contentDiv.style.display === 'none') {
        divNumber == 1 || divNumber == 2 ? contentDiv.style.display = 'block' : contentDiv.style.display = 'flex';
        contentTitle.innerHTML = contentTitle.innerHTML.split(" ▶")[0]
        contentTitle.innerHTML = contentTitle.innerHTML += " ▼"
    } else {
        contentDiv.style.display = 'none';
        contentTitle.innerHTML = contentTitle.innerHTML.split(" ▼")[0]
        contentTitle.innerHTML = contentTitle.innerHTML += " ▶"
    }
}
