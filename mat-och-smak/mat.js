console.log("mat.js fungerar!");
const erbjudanden = [
    {
        id: 1,
        namn: "Chokladprovning",
        beskrivning: "Smaka olika sorters choklad.",
        pris: 250
    },
    {
        id: 2,
        namn: "Pizzabakning",
        beskrivning: "Lär dig baka pizza från grunden.",
        pris: 300
    },
    {
        id: 3,
        namn: "Matlagningskurs",
        beskrivning: "Laga mat tillsammans med en kock.",
        pris: 350
    }
];
let valtErbjudande = null;
const erbjudandeLista = document.getElementById("erbjudande-lista");
const erbjudandeFel = document.getElementById("erbjudande-fel");
erbjudanden.forEach(function (erbjudande) {
    const kort = document.createElement("article");
    const rubrik = document.createElement("h3");
    rubrik.textContent = erbjudande.namn;
    const beskrivning = document.createElement("p");
    beskrivning.textContent = erbjudande.beskrivning;
    const pris = document.createElement("p");
    pris.textContent = erbjudande.pris + "kr / person";
    kort.appendChild(rubrik);
    kort.appendChild(beskrivning);
    kort.appendChild(pris);
    const knapp = document.createElement("button");
    knapp.textContent = "valj erbjudande";
    knapp.type = "button";

    knapp.addEventListener("click", function () {
        valtErbjudande = erbjudande;
        erbjudandeFel.textContent = "";
        console.log("valt erbjudande:", valtErbjudande.namn);
        uppdateravaldaErbjudanden();
        uppdateraPris();
    });
    kort.appendChild(knapp);
    erbjudandeLista.appendChild(kort);
});

function uppdateravaldaErbjudanden() {
    const allakort = erbjudandeLista.querySelectorAll("article");
    allakort.forEach(function (kort, index) {
        const erbjudande = erbjudanden[index];
        const knapp = kort.querySelector("button");
        if (erbjudande.id === valtErbjudande.id) {
            knapp.textContent = "✓ Valt erbjudande";
            kort.classList.add("valt");
        } else {
            knapp.textContent = "Välj erbjudande";
            kort.classList.remove("valt");
        }
    });
}
const antalInput = document.getElementById("antal");
const totalpris = document.getElementById("totalpris");
function uppdateraPris() {

    if (!valtErbjudande) {


        totalpris.textContent = "Välj ett erbjudande först.";
        return;
    }
    const antal = Number(antalInput.value);
    if (antal < 1 || antal > 5) {
        totalpris.textContent = "Antal personer måste vara mellan 1 och 5.";
        return;
    }
    const summa = valtErbjudande.pris * antal;
    totalpris.textContent = "totalpris: " + summa + " kr";
}
antalInput.addEventListener("input", uppdateraPris);

const bokningsform = document.getElementById("bokningsform");

const namnInput = document.getElementById("namn");
const emailInput = document.getElementById("email");
const antal = document.getElementById("antal");
const namnFel = document.getElementById("namn-fel");
const emailFel = document.getElementById("email-fel");
const antalFel = document.getElementById("antal-fel");


function valideraNamn() {
    if (namnInput.value.trim() === "") {
        namnFel.textContent = "Du måste fylla i ditt namn.";
        return false;
    }
    namnFel.textContent = "";
    return true;
}

function valideraEmail() {

    const email = emailInput.value.trim();

    const delar = email.split("@");

    if (

        email === "" ||

        /\s/.test(email) ||

        delar.length !== 2 ||

        delar[0] === "" ||

        !delar[1].includes(".") ||

        delar[1].startsWith(".") ||

        delar[1].endsWith(".") ||

        delar[1].split(".").some(del => del === "")

    ) {

        emailFel.textContent = "Ange en giltig e-postadress.";

        return false;

    }

    emailFel.textContent = "";

    return true;

} emailInput.addEventListener("input", valideraEmail);


namnInput.addEventListener("input", valideraNamn);

antalInput.addEventListener("input", valideraAntal);

function valideraAntal() {
    const antal = Number(antalInput.value);
    if (
        antalInput.value.trim() === "" ||
        !Number.isInteger(antal) ||
        antal < 1 ||
        antal > 5
    ) {
        antalFel.textContent =
            "Ange ett heltal mellan 1 och 5.";
        return false;
    }
    antalFel.textContent = "";
    return true;
}

bokningsform.addEventListener("submit", function (event) {
    event.preventDefault();
    const giltigtNamn = valideraNamn();
    const giltigtEmail = valideraEmail();
    const giltigtAntal = valideraAntal();
    if (!valtErbjudande) {
        erbjudandeFel.textContent = "Välj ett erbjudande först.";
    } else {
        erbjudandeFel.textContent = "";
    }
    if (!valtErbjudande || !giltigtNamn || !giltigtEmail || !giltigtAntal) {
        return;
    }
    const bekraftelse = document.getElementById("bekräftelse");
    bekraftelse.hidden = false;
    bekraftelse.innerHTML = `
<h3>Bokning bekräftad</h3>
<p>Namn: ${namnInput.value}</p>
<p>E-post: ${emailInput.value}</p>
<p>Erbjudande: ${valtErbjudande.namn}</p>
<p>Antal personer: ${antalInput.value}</p>
<p>Totalpris: ${valtErbjudande.pris * Number(antalInput.value)} kr</p>
   `;
    namnInput.disabled = true;
    emailInput.disabled = true;
    antalInput.disabled = true;
    document.querySelectorAll("#erbjudande-lista button")
        .forEach(function (knapp) {
            knapp.disabled = true;
        });
});
const resetKnapp = document.querySelector('button[type ="reset"]');
resetKnapp.addEventListener("click", function () {
    namnInput.disabled = false;
    emailInput.disabled = false;
    antalInput.disabled = false;
    document.querySelectorAll("#erbjudande-lista button")
        .forEach(function (knapp) {
            knapp.disabled = false;
        });
    valtErbjudande = null;
    document.querySelectorAll("article").forEach(function (kort) {
        kort.classList.remove("valt");
        const knapp = kort.querySelector("button");
        knapp.textContent = "Välj erbjudande";
    });
    totalpris.textContent = "Välj ett erbjudande först.";
    namnFel.textContent = "";
    emailFel.textContent = "";
    antalFel.textContent = "";
    const bekraftelse = document.getElementById("bekräftelse");
    bekraftelse.hidden = true;
    bekraftelse.innerHTML = "";
});

