let assetsSettings = {
    "background": "assets/images/default.png",
    "outfit": {
        "url": "assets/images/empty.png",
        "posX": 950,
        "posY": 0
    },
    "first": {
        "url": "assets/images/empty.png",
        "posX": 22,
        "posY": 615
    },
    "second": {
        "url": "assets/images/empty.png",
        "posX": 240,
        "posY": 615
    },
    "third": {
        "url": "assets/images/empty.png",
        "posX": 465,
        "posY": 615
    },
    "fourth": {
        "url": "assets/images/empty.png",
        "posX": 690,
        "posY": 615
    }
}

function changePosition(imageType, orientation, direction) {
    if (direction == "plus") {
        assetsSettings[imageType][`pos${orientation}`] += 5;
    } else if (direction == "minus") {
        assetsSettings[imageType][`pos${orientation}`] -= 5;
    }
    loadCanvas();
}



async function loadFont() {
    var Burbank = new FontFace('Burbank', 'url(assets/fonts/BurbankBigCondensed-Black.otf)');
    return Burbank.load().then((font) => {
        document.fonts.add(font);
    });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
}

async function loadCanvas() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');

    // Canvas tényleges mérete (felbontás)
    canvas.width = 1920;   // Valódi felbontás szélesség
    canvas.height = 1080;  // Valódi felbontás magasság

    // HTMl elemek kiszedése
    txtName = document.getElementById("txtName").value;

    try {
        // Képek betöltése párhuzamosan
        let [bgImage, templateImage, outfitImage, firstImage, secondImage, thirdImage, fourthImage] = await Promise.all([
            loadImage(assetsSettings.background),
            loadImage('assets/images/template.png'),

            loadImage(assetsSettings.outfit.url),
            
            loadImage(assetsSettings.first.url),
            loadImage(assetsSettings.second.url),
            loadImage(assetsSettings.third.url),
            loadImage(assetsSettings.fourth.url)
        ]);

        // Képek kirajzolása
        ctx.drawImage(bgImage, 0, 0, 1920, 1080); // Háttér
        ctx.drawImage(templateImage, 0, 0, 1920, 1080); // Sablon

        ctx.drawImage(outfitImage, assetsSettings.outfit.posX, assetsSettings.outfit.posY, 1080, 1080); // Outfit kép

        ctx.drawImage(firstImage, assetsSettings.first.posX, assetsSettings.first.posY, 330, 330); // Első kép
        ctx.drawImage(secondImage, assetsSettings.second.posX, assetsSettings.second.posY, 330, 330); // Második kép
        ctx.drawImage(thirdImage, assetsSettings.third.posX, assetsSettings.third.posY, 330, 330); // Harmadik kép
        ctx.drawImage(fourthImage, assetsSettings.fourth.posX, assetsSettings.fourth.posY, 330, 330); // Negyedik kép

        // Betűtípus betöltése
        await loadFont();

        //#region NÉV POZÍCIONÁLÁSA 
        // Szöveg és koordináták
        let text = txtName;
        let x1 = 75;  // Kezdő koordináta
        let x2 = 960;  // Vég koordináta
        let y1 = 125;   // Kezdő Y koordináta
        let y2 = 575;  // Végső Y koordináta
        let maxWidth = x2 - x1;  // Két pont közötti távolság (maximális szélesség)

        // Kezdő betűméret
        let fontSize = 10;  
        let maxFontSize = 1000;  // Felső határ a kereséshez
        let finalFontSize = fontSize;

        // Betűméret növelése, amíg el nem érjük a maximális szélességet
        while (fontSize < maxFontSize) {
            ctx.font = fontSize + "px Arial";  // Betűméret beállítása
            let textWidth = ctx.measureText(text).width;  // Szöveg szélességének mérése

            if (textWidth > maxWidth) {
                break;  // Ha a szöveg szélesebb, mint a rendelkezésre álló hely, álljunk meg
            }

            finalFontSize = fontSize;  // Frissítjük a végleges méretet
            fontSize++;  // Növeljük a betűméretet
        }

        // Végső betűméret alkalmazása és kirajzolás
        ctx.font = finalFontSize + "px Burbank";
        ctx.fillStyle = "white"

        let textWidth = ctx.measureText(text).width;

        // Középpont kiszámítása a két koordináta között
        let centerX = (x1 + x2) / 2;

        // Szöveg kezdő pozíciójának kiszámítása (hogy középre kerüljön)
        let textX = centerX - (textWidth / 2);

        // Középpont kiszámítása Y tengelyen
        let centerY = (y1 + y2) / 2;

        // Szöveg magasságának becslése
        let textHeight = finalFontSize;  // A betűméret nagyjából megegyezik a szöveg magasságával
        let textY = centerY + (textHeight / 2);  // Vertikálisan középre helyezés Y tengelyen

        //#endregion 

        // Szöveg kirajzolása a két koordináta között, középre igazítva
        ctx.fillText(txtName, textX, textY); // Szöveg kirajzolása
    } catch (error) {
        console.error("Hiba történt a betöltés során:", error);
    }
}



function downloadImage() {
    let canvas = document.getElementById("canvas");
    let canvasUrl = canvas.toDataURL("image/jpeg");  // Kép mentése PNG formátumban
        
    // Dinamikus <a> elem létrehozása
    let createEl = document.createElement("a");
    createEl.href = canvasUrl;
    createEl.download = "LockerBundleImage.png";  // Fájlnév beállítása
    
    // Kattintás szimulálása
    createEl.click();
}