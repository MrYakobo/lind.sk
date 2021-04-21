PANEL = "panel-1078-body"

A_HDMI_4 = "tallybutton-1051"
AUDIO_HDMI_4 = "tallybutton-1040"
AUDIO_LINE = "tallybutton-1041"
BKGD = "tallybutton-1622"

AUDIO_LINE_CH_ON = "menubutton-1239"
AUDIO_HDMI_4_CH_ON = "menubutton-1225"
AUTO_TRANS = "tallybutton-1643"

AUDIO_HDMI_4_PANEL_IDX = 11
AUDIO_LINE_PANEL_IDX = 12

function click(id) {
    document.getElementById(id).click()
    return new Promise(res => setTimeout(res, 100))
}

function is_active(id){
    //white = disabled, other color = active
    var b = document.getElementById(id)
    var bg = b.style.backgroundColor
    if (bg != "")
        return bg != "rgb(230, 230, 230)"

    var active_class = b.classList.contains("x-swui-button-operation-on")
    return active_class
}
function curr_panel_idx(){
    var child = document.querySelector("#"+PANEL+">*:not(.x-hidden-offsets)")
    var parent = document.getElementById(PANEL)
    var idx = Array.prototype.indexOf.call(parent.children, child)
    return idx
}

async function play() {
    await click(A_HDMI_4)

    // we need to have this area active to read the state
    if (curr_panel_idx() != AUDIO_HDMI_4_PANEL_IDX) {
        await click(AUDIO_HDMI_4)
    }

    // if audio on hdmi 4 not active, activate it
    if (!is_active(AUDIO_HDMI_4_CH_ON)) {
        await click(AUDIO_HDMI_4_CH_ON)
    }

    // now, line output
    await click(AUDIO_LINE)
    if (is_active(AUDIO_LINE_CH_ON)) {
        await click(AUDIO_LINE_CH_ON)
    }
}
async function stop(){
    await click(BKGD)

    // we need to have this area active to read the state
    if (curr_panel_idx() != AUDIO_HDMI_4_PANEL_IDX) {
        await click(AUDIO_HDMI_4)
    }

    // if audio on hdmi 4 active, disable it
    if (is_active(AUDIO_HDMI_4_CH_ON)) {
        await click(AUDIO_HDMI_4_CH_ON)
    }

    // now, line output on
    await click(AUDIO_LINE)
    if (!is_active(AUDIO_LINE_CH_ON)) {
        await click(AUDIO_LINE_CH_ON)
    }

    // autotrans
    await click(AUTO_TRANS)
}

/**
När man spelar upp ett videoklipp i Caspar. Gör en grupp som automatiserar:
- Byt till HDMI 4 (A_HDMI_4)
    A_HDMI_4()
- Slå på HDMI 4 ljud
    if AUDIO_HDMI_4_IS_OFF: AUDIO_HDMI_4_TOGGLE()
- Stäng av salsljudet, alternativt fade out
    if LINE_OUTPUT_IS_ON: LINE_OUTPUT_TOGGLE()

STATE:
    AUDIO_4 ON
    AUDIO_LINE OFF

    HDMI_4 ON

När man tar bort videoklippet. Automatisera:
- Aktivera "Background Mode"
    BKGD()
- Auto-Trans (rätt kamera måste vara markerad av bildprod)
    AUTO_TRANS()
- Stäng av HDMI 4 ljud
    if AUDIO_HDMI_4_IS_ON: AUDIO_HDMI_4_TOGGLE()
- Aktivera salsljud på max output
    if LINE_OUTPUT_IS_OFF: LINE_OUTPUT_TOGGLE()

STATE:
    AUDIO_4 OFF
    AUDIO_LINE ON
*/
