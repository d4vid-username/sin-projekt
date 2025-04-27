const prace_s_body = {
    body: [
        // prvni je hodnota, druhy je cas, treti je typ
        [0, 4, 0],
        [100, 3, 1],
        [50, 2, 0]
    ],
    //sirka/2, vyska/2, vyska - 150, sirka - 100, sirka, vyska
    pozice_grafu: [0, 0, 0, 0],
    aktualni: 0,
    graf: [],
    typ_grafu: "v/t",
    prehrava: false,
    zapis_bodu: function (time, value, typ) {
        this.body.push([time, value, typ])
    },
    smazani_bodu: function (bod) {
        if (bod < prace_s_body.body.length) { prace_s_body.body[bod][0] = prace_s_body.body[bod + 1][0]; }
        prace_s_body.body[bod][1] = 0;
    },
    linearni: function (pps, i) {
        let usek = (this.body[i + 1][0] - this.body[i][0]);
        for (let j = 0; j < pps; j++) {
            this.graf.push(this.body[i][0] + usek*j/pps/**1.00557878974*/);
        }
    },
    kvadraticka: function (pps, i) {
        let usek = (this.body[i + 1][0] - this.body[i][0]);
        //graf.push(0);
        for (let j = 1; j < pps; j++) {
            this.graf.push(this.body[i][0] /*+ graf[j-1][0] */+ usek*j**2/pps/pps/**1.00557878974*/);
        }
        this.graf.push(this.body[i + 1][0]);
    },
    kvadraticka_inverzni: function (pps, i) {
        let pomocny_graf = []
        let usek = (this.body[i + 1][0] - this.body[i][0]);
        //pomocny_graf.push(0);
        for (let j = 0; j < pps; j++) {
            pomocny_graf.push(this.body[i + 1][0] /*+ graf[j-1][0] */- usek*j**2/pps/pps/**1.00557878974*/);
        }
        this.graf.push(this.body[i][0]);
        for (let j = 1; j <= pomocny_graf.length; j++) {
            this.graf.push(pomocny_graf[pomocny_graf.length - j]);
        }
        this.graf.pop();
    },
    vygenerovat_graf: function () {
        this.graf = [];
        for (let a = 0; a < this.body.length - 1; a++) {
            if (this.body[a][1] > 0) {
                switch (this.body[a][2]) {
                    case 0:
                        this.linearni(this.body[a][1] * 60, a);
                        break;
                    case 1:
                        this.kvadraticka(this.body[a][1] * 60, a);
                        break;
                    case 2:
                        this.kvadraticka_inverzni(this.body[a][1] * 60, a);
                        break;
                }
            }
        }
    },
    vykreslit_graf: function () {
        vykresli_graf(this.graf, this.pozice_grafu[0], this.pozice_grafu[1], this.pozice_grafu[2], this.pozice_grafu[3], this.graf.length, 1, 0, this.typ_grafu)
    },
    prepocet_na_onko: function (bod) {
        cas = 0;
        for (let i = 0; i < this.body.length - 1; i++) { cas += this.body[i][1]; }
        let max = this.body[0][0];
        this.body.forEach(element => {
            if (element[0] > max) { max = element[0]; }
        });
        //sirka/2, vyska/2, vyska - 100, sirka - 100
        meritko_x = (this.pozice_grafu[3])/cas;
        meritko_y = (this.pozice_grafu[2])/max;
        let idk = 0;
        for (let i = 0; i < bod; i++) {
            idk += this.body[i][1];
        }
        x = idk*meritko_x + this.pozice_grafu[0] - this.pozice_grafu[3]/2;
        y = (max - this.body[bod][0])*meritko_y + this.pozice_grafu[1] - this.pozice_grafu[2]/2;
        return [x, y]
    },
    prepocet_na_body: function (bod, x, y) {
        // asi to shelfnu
        cas = 0;
        for (let i = 0; i < this.body.length - 1; i++) { cas += this.body[i][1]; }
        let max = this.body[0][0];
        this.body.forEach(element => {
            if (element[0] > max) { max = element[0]; }
        });
        //sirka/2, vyska/2, vyska - 100, sirka - 100
        meritko_x = (sirka - 100)/cas;
        meritko_y = (vyska - 150)/max;
        let a = x/(meritko_x + 50);
        let b = y/(meritko_y + 75);
        let hodnota = max - b;
        let idk = 0;
        for (let i = 0; i < bod - 1; i++) {
            idk += this.body[i][1];
        }
        let interval = a - idk;
        this.body[bod][0] = hodnota;
        this.body[bod][1] = interval;
    }
    // shelved (the last one)
}

function prepis_textu(a) {
    let text = "Tvar: ";
    switch (a) {
        case 0:
            text += "přímka";
            break;
        case 1:
            text += "parabola";
            break;
        case 2:
            text += "obrácená parabola";
            break;
    }
    return text;
}

const edit_bodu = {
    add_point: document.getElementById("novy_bod"),
    remove_point: document.getElementById("smazat_bod"),
    bod: document.getElementById("bod"),
    casova_hodnota: document.getElementById("time"),
    hodnota_v_grafu: document.getElementById("value"),
    typ_funkce: document.getElementById("typ_funkce"),
    seznam_ovladani: document.getElementsByClassName("edit_bodu"),
    aktualizace: function () {
        this.bod.innerHTML = "Bod: " + prace_s_body.aktualni;
        this.typ_funkce.innerHTML = prepis_textu(prace_s_body.body[prace_s_body.aktualni][2]);
        this.hodnota_v_grafu.value = prace_s_body.body[prace_s_body.aktualni][0];
        this.casova_hodnota.value = prace_s_body.body[prace_s_body.aktualni][1];
    },
    intilaziation: function () {
        this.add_point.onclick = () => {
            prace_s_body.zapis_bodu(100, 1, 0);
            prace_s_body.vygenerovat_graf();
        }
        this.remove_point.onclick = () => {
            prace_s_body.smazani_bodu(prace_s_body.aktualni);
            prace_s_body.vygenerovat_graf();
        }
        this.bod.onclick = () => {
            if (prace_s_body.aktualni != undefined) {
                prace_s_body.aktualni += 1;
                if (prace_s_body.aktualni == prace_s_body.body.length) { prace_s_body.aktualni = 0; }
                this.bod.innerHTML = "Bod: " + prace_s_body.aktualni;
                this.aktualizace();
            }
        }
        this.typ_funkce.onclick = () => {
            if (prace_s_body.aktualni != undefined) {
                prace_s_body.body[prace_s_body.aktualni][2] += 1;
                if (prace_s_body.body[prace_s_body.aktualni][2] == 3) { prace_s_body.body[prace_s_body.aktualni][2] = 0; }
                this.typ_funkce.innerHTML = prepis_textu(prace_s_body.body[prace_s_body.aktualni][2]);
                prace_s_body.vygenerovat_graf();
            }
        }
        this.hodnota_v_grafu.addEventListener("change", (event) => {
            prace_s_body.body[prace_s_body.aktualni][0] = event.target.value*1;
            prace_s_body.vygenerovat_graf();
        });
        this.casova_hodnota.addEventListener("change", (event) => {
            prace_s_body.body[prace_s_body.aktualni][1] = event.target.value;
            prace_s_body.vygenerovat_graf()
        });
        for (let i = 0; i < this.seznam_ovladani.length; i++) {
            this.seznam_ovladani[i].style.visibility = "hidden";
        }
        this.hodnota_v_grafu.value = prace_s_body.body[prace_s_body.aktualni][0];
        this.casova_hodnota.value = prace_s_body.body[prace_s_body.aktualni][1];
    }
}

function je_v_kruznici(x, y, r, a, b) {
    if ((x - a)**2 + (y - b)**2 <= r**2) {
        return true;
    } else {
        return false;
    }
}
