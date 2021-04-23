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

//PSW_INPUT = "textfield-2503-inputEl"
LOGIN_BTN = "button-2504"
//<a class="x-btn x-unselectable x-abs-layout-item x-window-item x-btn-default-small x-item-disabled x-btn-disabled" hidefocus="on" unselectable="on" role="button" aria-hidden="false" aria-disabled="true" id="button-2504" data-componentid="button-2504">
 

//<span id="button-2504-btnWrap" data-ref="btnWrap" role="presentation" unselectable="on" style="table-layout:fixed;" class="x-btn-wrap x-btn-wrap-default-small "><span id="button-2504-btnEl" data-ref="btnEl" role="presentation" unselectable="on" style="height:auto;" class="x-btn-button x-btn-button-default-small x-btn-text    x-btn-button-center "><span id="button-2504-btnIconEl" data-ref="btnIconEl" role="presentation" unselectable="on" class="x-btn-icon-el x-btn-icon-el-default-small  " style=""></span><span id="button-2504-btnInnerEl" data-ref="btnInnerEl" unselectable="on" class="x-btn-inner x-btn-inner-default-small">Log In</span></span></span></a>


// DEFAULT: När man laddar = NEXT eller Play, så visas videon
// alltså börjar vi med att spela videon

var IS_PLAYING = true

function authenticate(){
    //document.getElementById(PSW_INPUT).value = "Password1!" //supersecret
    var p = document.querySelector("input[type='password']")
    p.value = "Password1!"
    setTimeout(()=>{
        var event = new Event('input', {
            'bubbles': true,
            'cancelable': true
        })
        p.dispatchEvent(event)

        setTimeout(()=>{
            var attrs = ["hidefocus", "unselectable", "aria-hidden", "aria-disabled"]
            var btn = document.getElementById(LOGIN_BTN)
            attrs.forEach(a=>{btn.removeAttribute(a)})
            btn.classList.remove("x-btn-disabled", "x-item-disabled", "x-unselectable")
            click(LOGIN_BTN)
        }, 100)
    }, 100)
}

(function(){
    var x = setInterval(function(){
        if(document.querySelector("input[type='password']") != null) {
            authenticate()
            clearInterval(x)
        }
    }, 100)
})()

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
    IS_PLAYING = true
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
    IS_PLAYING = false
}

function next(){
    play()
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
