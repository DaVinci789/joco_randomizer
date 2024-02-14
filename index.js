var viewpoint_buttons = []

var ranges = {}
var die_tags = {}
var laws = new Array(21)
laws.fill(null)

const LAYOUT = {
    "standing": [1170, 190],
    "debt": [829, 375],
    "balance": [75, 1586],
    "turn": [458, 350],
    "social": [642, 185],
    "share": [642, 282],
    "shipping": [587, 380],
    "manufacturing": [695, 380],
    "votes": [3208, 830],
    "+2": [700, 1188],
    "+3": [700, 1188],
    "dot_treasury": [1010, 1345],
    "shipping_treasury": [1310, 1345],
    "madras_treasury": [1885, 1345],
    "bengal_treasury": [2300, 1345],
    "bombay_treasury": [2715, 1345],
    "bombay_army": [1550, 120],
    "madras_army": [1550, 540],
    "bengal_army": [1550, 960],
    "punjab": [1920, 115],
    "bombay": [2150, 680],
    "delhi": [2660, 86],
    "maratha": [2457, 270],
    "hyderabad": [2330, 700],
    "mysore": [2210, 960],
    "madras": [2485, 1140],
    "bengal": [2990, 280],
    "punjab_flag": [1920, 115],
    "bombay_flag": [2150, 680],
    "delhi_flag": [2660, 86],
    "maratha_flag": [2457, 270],
    "hyderabad_flag": [2330, 700],
    "mysore_flag": [2210, 960],
    "madras_flag": [2485, 1140],
    "bengal_flag": [2990, 280],
    "punjab_o0": [2082, 99],
    "bombay_o0": [2128, 246],
    "bombay_o1": [2094, 562],
    "bombay_o2": [2222, 424],
    "mysore_o0": [2346, 925],
    "mysore_o1": [2265, 801],
    "madras_o0": [2550, 919],
    "madras_o1": [2482, 1030],
    "hyderabad_o0": [2517, 707],
    "maratha_o0": [2713, 528],
    "maratha_o1": [2385, 430],
    "maratha_o2": [2599, 288],
    "delhi_o0": [2308, 184],
    "delhi_o1": [2579, 154],
    "delhi_o2": [2376, 80],
    "bengal_o1": [2828, 298],
    "bengal_o0": [3043, 421],
    "punjab_unrest": [1897, 181],
    "bombay_unrest": [1990, 360],
    "mysore_unrest": [2315, 1040],
    "madras_unrest": [2449, 845],
    "hyderabad_unrest": [2380, 605],
    "maratha_unrest": [2584, 410],
    "delhi_unrest": [2465, 70],
    "bengal_unrest": [2905, 170],
}

for (const [key, value] of Object.entries(LAYOUT)) {
    var elt = document.getElementById(key)
    elt.style.left = `${value[0]}px`
    elt.style.top = `${value[1]}px`
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// random number in range inclusive
function rand_range(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rand_id_range(id) {
    return rand_range(ranges[id][0], ranges[id][1])
}

function dieclicked(die) {
    let die_number = parseInt(die.className.split(" ")[0].charAt(4))
    if (die_number == 1 && die_tags[die.parentElement.parentElement.id] == 1) {
        die_tags[die.parentElement.parentElement.id] = 0
        die.parentElement.getElementsByClassName("die")[0].style.backgroundColor = "";
        return
    }

    die_tags[die.parentElement.parentElement.id] = die_number
    for (let elt of die.parentElement.getElementsByClassName("die")) {
        elt.style.backgroundColor = "";
    }
    for (let elt of Array.from(die.parentElement.getElementsByClassName("die")).slice(0, die_number)) {
        elt.style.backgroundColor = "LightGreen"
    }
}

function rand_bool_die(id) {
    return rand_range(1, 6) <= die_tags[id]
}

function addlaw(law_id) {
    let law = document.createElement("div")
    law.className = "card law" + law_id
    document.getElementById("card_panel").appendChild(law)
    laws[law_id] = law
}

function reset() {

    var ships = document.getElementsByClassName("ship")
    while (ships[0])
        ships[0].parentNode.removeChild(ships[0])

    var regiments = document.getElementsByClassName("regiment")
    while (regiments[0])
        regiments[0].parentNode.removeChild(regiments[0])

    var unrest = document.getElementsByClassName("unrest")
    while (unrest[0])
        unrest[0].parentNode.removeChild(unrest[0])

    for (let elm of document.getElementsByClassName("closed"))
        elm.hidden = true

    let regions = ["punjab_flag", "bombay_flag", "delhi_flag", "maratha_flag", "hyderabad_flag", "mysore_flag", "madras_flag", "bengal_flag"]
    for (let region of regions) {
        //let flag_div = document.getElementById(`${region}_flag`)
        let flag_div = document.getElementById(region)
        flag_div.hidden = true
    }


    let order_pool = regions

    for (let order of order_pool)
        document.getElementById(order).hidden = true

    for (let law of laws)
        if (law != null) law.remove()
    laws = new Array(21)
    laws.fill(null)
}

function random_number_of_adjacents(region) {
    let adjacent = []
    switch (region) {
        case "punjab":
            adjacent = ["bombay", "delhi"]
            break;
        case "bombay":
            adjacent = ["punjab", "delhi", "maratha", "hyderabad", "mysore"]
            break;
        case "mysore":
            adjacent = ["bombay", "hyderabad", "madras"]
            break;
        case "madras":
            adjacent = ["mysore", "hyderabad"]
            break;
        case "hyderabad":
            adjacent = ["madras", "mysore", "bombay", "maratha"]
            break;
        case "maratha":
            adjacent = ["hyderabad", "bombay", "delhi", "bengal"]
            break;
        case "delhi":
            adjacent = ["punjab", "bombay", "maratha", "bengal"]
            break;
        case "bengal":
            adjacent = ["delhi", "maratha"]
            break;
    }
    shuffleArray(adjacent)
    let end = rand_range(1, 3)
    return adjacent.slice(0, end == adjacent.length ? 1 : end)
}

function randomize(evt) {
    for (let button of viewpoint_buttons)
        button.classList.toggle("selected", button === evt.target)

    reset()

    // Initial Standing Range
    let init_mod = rand_id_range("initrange")
    let standing_pawn = document.getElementById("standing")
    standing_pawn.style.left = `${LAYOUT["standing"][0] + (85 * init_mod)}px`

    // Initial Debt Range
    let debt_mod = rand_id_range("debtrange")
    let debt_pawn = document.getElementById("debt")
    debt_pawn.style.left = `${LAYOUT["debt"][0] + (75 * debt_mod)}px`

    // Initial Balance Range
    let bal_mod = rand_id_range("balrange")
    let bal_pawn = document.getElementById("balance")
    bal_pawn.style.left = `${LAYOUT["balance"][0] + (75 * bal_mod)}px`

    // Company Treasury Pool
    let treasury_pool = rand_id_range("treasuryrange")
    let treasuries = [0, 0, 0, 0, 0]
    if (treasury_pool > 4) {
        treasuries.fill(Math.floor(treasury_pool / 5))
        for (let i = 0; i < treasury_pool % 5; i++) {
            treasuries[rand_range(0, 5)] += 1
        }
    }
    else {
        for (let i = 0; i < treasury_pool; i++)
            treasuries[rand_range(0, 5)] += 1
    }
    document.getElementById("dot_treasury").firstChild.innerHTML = treasuries[0].toString() + "£"
    document.getElementById("shipping_treasury").firstChild.innerHTML = treasuries[1].toString() + "£"
    document.getElementById("bombay_treasury").firstChild.innerHTML = treasuries[2].toString() + "£"
    document.getElementById("madras_treasury").firstChild.innerHTML = treasuries[3].toString() + "£"
    document.getElementById("bengal_treasury").firstChild.innerHTML = treasuries[4].toString()  + "£"

    // Start Deregulation
    let start_dereg = rand_bool_die("start_dereg")
    if (start_dereg) {
        let law = document.createElement("div")
        law.className = "card deregulation"
        laws.push(law)
        document.getElementById("card_panel").appendChild(law)
    }

    // Allow Deregulation
    if (rand_bool_die("allow_dereg")) {}

    if (start_dereg) {
        if (rand_bool_die("2share_prob")) {
            document.getElementById("+2").hidden = false
            if (rand_bool_die("3share_prob")) {
                document.getElementById("+3").hidden = false
            }
        }
    }

    // Regiments
    let regiments = rand_id_range("regrange")
    let armies = ["bombay_army", "madras_army", "bengal_army"]
    for (let i = 0; i < regiments; i++) {
        let regiment = document.createElement("img")
        regiment.src = "images/regiment.png"
        regiment.className = "regiment"
        document.getElementById(armies[rand_range(0, 2)]).appendChild(regiment)
    }

    //// China

    if (rand_bool_die("china_office"))
        document.getElementById("china").hidden = false

    //// India
    // Ships
    let ship_count = rand_id_range("shiprange")
    for (let i = 0; i < ship_count; i++) {
        let ship = document.createElement("img")
        ship.src = `images/s${i}.png`
        ship.className = "ship"
        ship.style.position = "absolute"
        ship.style.width = "75px"
        ship.style.height = "67px"

        let seazone = rand_range(0, 2)
        switch (seazone) {
            case 0: {
                let the_zone = document.getElementById("bombay_seazone")
                let prior_ships = the_zone.childElementCount
                let radius = 300;
                let circle_x = 2250;
                let circle_y = 810;
                let ship_x = (circle_x - 250) + (prior_ships * 75)

                ship.style.left = `${ship_x}px`
                ship.style.top = `${
                    circle_y + Math.sqrt(Math.pow(radius, 2) - Math.pow(ship_x - circle_x, 2))
                }px`
                the_zone.appendChild(ship)
                break;
            }
            case 1: {
                let the_zone = document.getElementById("madras_seazone")
                let prior_ships = the_zone.childElementCount
                let radius = 300;
                let circle_x = 2700;
                let circle_y = 856;
                let ship_x = (circle_x + 70) + (prior_ships * 75)

                ship.style.left = `${ship_x}px`
                ship.style.top = `${
                    circle_y + Math.sqrt(Math.pow(radius, 2) - Math.pow(ship_x - circle_x, 2))
                }px`
                the_zone.appendChild(ship)
                break;
            }
            case 2: {
                let the_zone = document.getElementById("bengal_seazone")
                let prior_ships = the_zone.childElementCount
                let radius = 300;
                let circle_x = 2700;
                let circle_y = 477;
                let ship_x = (circle_x + 250) - (prior_ships * 75)

                ship.style.left = `${ship_x}px`
                ship.style.top = `${
                    circle_y + Math.sqrt(Math.pow(radius, 2) - Math.pow(ship_x - circle_x, 2))
                }px`
                the_zone.appendChild(ship)
                break;
            }
        }
    }

    let ships = document.getElementsByClassName("ship")
    for (let ship of ships) {
        if (rand_bool_die("company_ships")) {
            ship.src = `images/company.png`
        }
    }

    let india_pool = ["punjab", "bombay", "delhi", "maratha", "hyderabad", "mysore", "madras", "bengal"]
    shuffleArray(india_pool)

    // Towers
    for (let region of india_pool) {
        document.getElementById(region).className = `piece tower${rand_range(0, 3)}`
    }

    // Empires
    india_pool = ["punjab", "bombay", "delhi", "maratha", "hyderabad", "mysore", "madras", "bengal"]
    shuffleArray(india_pool)
    let empire_colors = ["silver", "bronze", "gold"]
    let empires = rand_id_range("empirerange")
    let capitals = []
    let taken_dominated = []
    for (let i = 0; i < empires; i++) {
        capitals.push(india_pool.pop())
        let region_div = document.getElementById(`${capitals[capitals.length - 1]}_flag`)
        region_div.hidden = false
        region_div.children[0].className = `piece capital ${empire_colors[i]}`
        region_div.getElementsByClassName("outlinecapital")[0].hidden = false
        region_div.getElementsByClassName("outlinedominated")[0].hidden = true
    }

    for (let [index, capital] of capitals.entries()) {
        let subservient = random_number_of_adjacents(capital)
        subservient = subservient.filter(region => !taken_dominated.includes(region))
        subservient = subservient.filter(region => !capitals.includes(region))
        let capital_div = document.getElementById(`${capital}_flag`)
        let color = empire_colors[index]
        for (let region of subservient) {
            let region_div = document.getElementById(`${region}_flag`)
            region_div.hidden = false
            region_div.children[0].className = `piece capital ${color}`
            region_div.getElementsByClassName("outlinecapital")[0].hidden = true
            region_div.getElementsByClassName("outlinedominated")[0].hidden = false
        }
        taken_dominated.concat(subservient)
    }

    // Governors
    let governors = india_pool.slice(0, rand_id_range("govrange"))
    india_pool = india_pool.filter(n => !governors.includes(n))
    for (let governor of governors) {
        document.getElementById(governor).className = `piece gov_${governor}`
    }

    // Unrest
    let unrest_amount = rand_id_range("unrestrange")
    let unrest_zones = governors.map(zone => zone + "_unrest")
    for (let u = 0; u < unrest_amount; u++) {
        let unrest = document.createElement("div")
        unrest.className = "piece unrest"
        unrest.style.backgroundImage = 'url("images/unrest.svg")'
        let zone = unrest_zones[rand_range(0, unrest_zones.length - 1)]
        let region = document.getElementById(zone)

        region.appendChild(unrest)
    }

    // Orders
    let order_pool = ["punjab_o0", "bombay_o0", "bombay_o1", "bombay_o2", "mysore_o0", "mysore_o1", "madras_o0", "madras_o1", "hyderabad_o0", "maratha_o0", "maratha_o1", "maratha_o2", "delhi_o0", "delhi_o1", "delhi_o2", "bengal_o0", "bengal_o1"]
    shuffleArray(order_pool)
    order_pool = order_pool.slice(0, rand_id_range("closedrange"))
    for (let order of order_pool)
        document.getElementById(order).hidden = false

    //// Laws
    let law_max = rand_id_range("lawrange")
    for (let i = 0; i < law_max; i++) {
        let law_id = rand_range(0, 19)
        while (laws[law_id] != null)
            law_id = rand_range(0, 19) // HACK: Make this into some set thing.
        addlaw(law_id)
    }
}

document.getElementById("board").onclick = function (evt) {
    var rect = evt.target.getBoundingClientRect()
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    x = Math.floor(x)
    y = Math.floor(y)
    document.getElementById("coords").innerText = "(" + x + ", " + y + ")"
    navigator.clipboard.writeText("left: " + x + "px; " + "top: " + y + "px; z-index: 1")
}

let prob_input = document.getElementById("prob_input_template")
for (let elt of document.getElementsByClassName("uses_prob_input")) {
    elt.appendChild(prob_input.content.cloneNode(true))
    die_tags[elt.id] = 0
}

function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
    ranges[fromInput.parentElement.parentElement.parentElement.id][0] = fromInput.value
}

function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
    ranges[toInput.parentElement.parentElement.parentElement.id][1] = toInput.value
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromInput.value = from;
    }
    ranges[fromSlider.parentElement.parentElement.parentElement.id][0] = fromSlider.value
}

function controlToSlider(fromSlider, toSlider, toInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    setToggleAccessible(toSlider);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
        toSlider.value = from;
    }
    ranges[toSlider.parentElement.parentElement.parentElement.id][1] = toSlider.value
}

function getParsed(currentFrom, currentTo) {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max - to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
      ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
      ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
    var toSlider = currentTarget.parentElement.parentElement.getElementsByClassName("toSlider")[0]
    if (toSlider.value == currentTarget.value && toSlider.value == toSlider.min) {
        toSlider.style.zIndex = 2;
    } else {
        toSlider.style.zIndex = 0;
    }
}

let dual_range = document.getElementById("dual_range")
for (let elt of document.getElementsByClassName("uses_dual_range")) {
    let classes = elt.className.split(" ")
    let dual_range_index = classes.findIndex((element) => element == "uses_dual_range")

    let default_input = classes[dual_range_index + 1]
    let min_input = classes[dual_range_index + 2]
    let max_input = classes[dual_range_index + 3]

    ranges[elt.id] = [default_input, default_input]

    elt.appendChild(dual_range.content.cloneNode(true))
    let dual_range_node = elt.getElementsByClassName("range_container")[0]

    const fromSlider = dual_range_node.getElementsByClassName("fromSlider")[0]
    const toSlider = dual_range_node.getElementsByClassName("toSlider")[0]
    const fromInput = dual_range_node.getElementsByClassName("fromInput")[0]
    const toInput = dual_range_node.getElementsByClassName("toInput")[0]

    fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
    toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
    fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
    toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);

    fromSlider.max = max_input
    fromSlider.min = min_input
    fromSlider.value = default_input
    toSlider.max = max_input
    toSlider.min = min_input
    toSlider.value = default_input

    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    if (toSlider.value == fromSlider.value) {
        toSlider.style.zIndex = 2;
    }

    for (let ui of elt.getElementsByClassName("form_control_container__time__input")) {
        ui.max = max_input
        ui.min = min_input
        ui.value = default_input
    }
    die_tags[elt.id] = 0
}