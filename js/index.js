//~ Block console.info
//~ console.info = function() {}

/*** 
 * THOT | This HTML Orgasmic Turntable
 * Dual deck audio player with crossfader and dual 7 bands Equalizer
 * Find songs in many local folders to organize a random playlist
 * Full keyboard controls
 ***
 *  Nico KraZhtest | 2017 | ponyhacks.com
 ***
 * Keyboard events (Azerty):
 * ------------------------*
 * Space bar: Play random track with fader automation
 *-- 
 * [Ctrl+Enter]:  Open deckA file manager 
 * [Shift+Enter]: Open deckB file manager
 *--
 * [,]: Random track on both decks
 * [;]: Random Track deck A 
 * [:]: Random Track deck B
 * [!]: Copy deckA track to deckB
 *--
 * [a/z]: Slider track automations with delays
 *--
 * [Ctrl+!]:  Copy deckA track to deckB
 * [Shift+!]: Copy deckB track to deckA
 *--
 * [Ctrl+Left/Right]: Main Slider left/right 
 * [Alt+Up/Down]:     Main Slider switch
 * [Ctrl+Up/Down]:    Ratio slider up/down 
 * [Alt+Up/Down]:     Ratio slider switch
 *--
 ***
 * Basic usage from js:
 * Check the current playlist tracks array
 * list
 * 
 * Or for the third track:
 * list[2]
 * 
 * Add track to playlist. 
 * (Accept both local, network, or blub url)
 * list.push("")
 * 
 * Check the current playlist index 
 * playlist
 * 
 * Random tracks
 * trackRandom()
 * trackRandomA()
 * trackRandomB()
 * 
 * Play the playlist numbered 13 on deckA:
 * deckA.src = list[13]
 * 
 * Fade automation from the deck B to A in 35 seconds 
 * autoDeckA(350)
 * 
 * Show the Equalizer:
 * showEq("off")
 * showEq("on")
 * 
 * Poster animation pause:
 * posterPause("on")
 * posterPause("off")
 * 
 * */
'use strict'

// We need to create a container to hold
let sp = document.createElement("SPAN")

// Our audio player
let a = document.createElement("audio")

// They will need some buttons to evolve in the playlist
let deckAnext = document.createElement("button")
let deckAlast = document.createElement("button")
let deckBnext = document.createElement("button")
let deckBlast = document.createElement("button")
deckAnext.className = "deckplaylist deckAnext"
deckAlast.className = "deckplaylist deckAlast"
deckBnext.className = "deckplaylist deckBnext"
deckBlast.className = "deckplaylist deckBlast"

// Give user control power
a.setAttribute("controls", "")

// Random track on track end
a.setAttribute("onended", "trackRandomA()")

// Random track if error
a.setAttribute("onerror", "trackRandomA()")

// We need an attribute container for the title
a.setAttribute("data-track", "")

// When datas are loaded, display the track title, then start the player
a.setAttribute("onloadeddata", "trackNameA()")
a.setAttribute("ondurationchange", "trackNameA()")

// Allow tracks to be dropped
a.setAttribute("ondrop", "drop(event)")
a.setAttribute("ondragover", "allowDrop(event)")

// Blink a led if a track is a playing
a.setAttribute("onplaying", "ledAcheck();notifTrack(deckA.src)")

// Check blink state in case of seeking 
a.setAttribute("onseeked", "ledAcheck()")
a.setAttribute("ontimeupdate", "ledAcheck()")

// If paused stop the led 
a.setAttribute("onpause", "ledA.className = 'led_off'")

// Now let's name our nice audio object, to later call him
a.id = "deckA"

// A css class, to style both players
a.className = "dropzone"

// Yeah! We need two players to make pony mixes!
// So let's create another one:
let deckB = document.createElement("audio")
    deckB.setAttribute("controls", "")
    deckB.setAttribute("onerror", "trackRandomB()")
    deckB.setAttribute("onended", "trackRandomB()")
    deckB.setAttribute("data-track", "")
    deckB.setAttribute("onloadeddata", "trackNameB()")
    deckB.setAttribute("ondurationchange", "trackNameB()")
    deckB.setAttribute("ondrop", "drop(event)")
    deckB.setAttribute("ondragover", "allowDrop(event)")
    deckB.setAttribute("onplaying", "ledBcheck();notifTrack(deckB.src)")
    deckB.setAttribute("onseeked", "ledBcheck()")
    deckB.setAttribute("ontimeupdate", "ledBcheck()")
    deckB.setAttribute("onpause", "ledB.className = 'led_off'")
    deckB.className = "dropzone"
    deckB.id = "deckB"

// Now we need to inject our players in the document
// Let's focus anywhere, like the first html <div>
let target = document.getElementsByTagName("div")[0]

let mixer = document.createElement("div")
mixer.innerHTML = `
<div class="mixer" draggable>
 <!-- Deck A -->
 <div class="left">
<form>
    <input type="range" id="lowGainKnob" class="mix" value="50" step="1"
     min="0" max="100" oninput="changeGain(this.value, 'lowGain');" />
    <input type="range" id="lowGain02Knob" class="mix" value="50" step="1"
     min="0" max="100" oninput="changeGain(this.value, 'lowGain02');" />
    <input type="range" id="lowGain03Knob" class="mix" value="50" step="1"
     min="0" max="100" oninput="changeGain(this.value, 'lowGain03');" />
    <input id="mid" type="range" value="0" class="mix" step="0.1" min="3"
     max="7" oninput="changeGain(this.value, 'midGain');" />
    <input type="range" id="highGain05Knob" class="mix" value="50" step="1"
     min="0" max="100" oninput="changeGain(this.value, 'highGain05');" />
    <input type="range" id="highGain06Knob" class="mix" value="50" step="1"
     min="0" max="100" oninput="changeGain(this.value, 'highGain06');" />
    <input type="range" id="highGainKnob" class="mix" value="50" step="1"
     min="0" max="100" oninput="changeGain(this.value, 'highGain');" />
</form>
 </div>

 <!-- Deck B -->
 <div>
     
 <form class="mixRight">
    <!-- <label>Low Gain</label> -->
    <input type="range" id="lowGainKnob_deckB" class="mixreversed" value="50"
     step="1" min="0" max="100" oninput="changeGaindeckb(this.value, 'lowGain');" />
    <input type="range" id="lowGain02Knob_deckB" class="mixreversed" value="50"
     step="1" min="0" max="100" oninput="changeGaindeckb(this.value, 'lowGain02');" />
    <input type="range" id="lowGain03Knob_deckB" class="mixreversed" value="50"
     step="1" min="0" max="100" oninput="changeGaindeckb(this.value, 'lowGain03');" />
    <input id="mid_deckB" type="range" value="400" class="mixreversed" step="5"
     min="1" max="600" oninput="changeGaindeckb(this.value, 'midGain');" />
    <input type="range" id="highGain05Knob_deckB" class="mixreversed" value="50"
     step="1" min="0" max="400" oninput="changeGaindeckb(this.value, 'highGain05');" />
    <input type="range" id="highGain06Knob_deckB" class="mixreversed" value="50"
     step="1" min="0" max="400" oninput="changeGaindeckb(this.value, 'highGain06');" />
    <input type="range" id="highGainKnob_deckB" class="mixreversed" value="50"
     step="1" min="0" max="400" oninput="changeGaindeckb(this.value, 'highGain');" />
</form>
  </div>
    </div>
<!-- Dice button -->
<button type="button" id="dice" onclick="return trackRandom();">🂱</button>
 <br>
   <br>
<div class="ctrlBlock"></div>
<!-- Slider -->
<form class="slider" id="sliderForm">
 <input type="range" id="sliderTracks" name="slidertracks" 
   oninput="fadeTracks()" oncontextmenu="clearAutomation();return false" title="Right click to reset all automation" value="0" step="1" min="1" max="99" />
 <input type="range" id="sliderTracksRatio" 
  value="5" step="5" min="5" max="400" />
</form>
<div class="files">
 <form id="userfiles" method="POST" enctype="multipart/form-data" onchange="pwnColor()">
 <input type="file" id="aud" name="trcka"  onchange="poster()" webkitdirectory />
 <input type="file" id="audB" name="trckb" accept="audio/*" oninput="poster()" webkitdirectory />
</form>
 </div>
<div class="filesBlock">
 <span id="trackA" class=""></span> 
 <span id="trackB" class=""></span> 
<br>
</div>
<button type="button" class="ctrlBa" onclick="return changeGain('5', 'midGain');">
 Reset notch</button>
<button type="button" class="ctrlBb" onclick="return resetAll();">&#7360;</button>
<button type="button" class="buttonshoweq" value="on" 
onclick="if(this.value=='off'){this.value='on'}else{this.value='off'};showEq(this.value);">
&#128335;</button>
<button type="button" id="buttonNotif" class="active" value="on" 
onclick="if(this.value=='off'){this.value='on';this.className='active'}else{this.value='off';this.className=''}" title="Toggle notifications">&#9748;</button>

<!-- Files inputs-->
<ul id="listing" oninput="pwnColor()"></ul>
<ul id="listingB" oninput="pwnColor()"></ul>

<form onchange="localStorage.setItem('baseColor', color.value)">
    <input type="color" type="text" name="color" value="#FFFFFF" id="pwnClr" 
    oninput="pwnColor()" />
</form>
 </div>
<div class="poster" id="posterblock" onmouseleave="posterPause('off')">
 <span id="posterA" class="filesblock" onmouseover="posterPause('on')"></span> 
 <span id="posterB" class="filesblockright"></span> 
 </div>

<!--
 Firefox bug playbackRate and web audio api won't work
https://bugzilla.mozilla.org/show_bug.cgi?id=966247
-->
<form id="rateControls">
    <span id="pitchAlab">1.000</span>
    <span id="pitchBlab">1.000</span>
    
    <input type="range" value="500" step="0.1" min="250" max="2000" id="pitchA"
     oninput="pitchAlab.innerHTML=(this.value/500).toFixed(3);\
     deckA.playbackRate=pitchAlab.innerHTML" oncontextmenu="javascript:this.value='500';\
     pitchAlab.innerHTML=(this.value/500).toFixed(3);\
     deckA.playbackRate=pitchAlab.innerHTML;return false;" 
     title="Deck A playback Rate | Right click to reset">
    <input type="range" value="500" step="0.1" min="250" max="2000" id="pitchB"
    oninput="pitchBlab.innerHTML=(this.value/500).toFixed(3);\
    deckB.playbackRate=pitchBlab.innerHTML" oncontextmenu="javascript:this.value='500';\
    pitchBlab.innerHTML=(this.value/500).toFixed(3);\
    deckB.playbackRate=pitchBlab.innerHTML;return false;"
    title="Deck B playback Rate | Right click to reset">
</form>

<span class="bonjour" title="Toggle fullscreen">
    <b>𝄞</b>
</span>

<span id="ledA" onclick="lyrics(deckA)"></span>
<span id="ledB" onclick="lyrics(deckB)"></span>


<div id="artist">yo</div>
<span id="closelyrics" onclick="document.documentElement.style.cssText += ' ;transform:translateY(0px)';fixScroll()">X</span>

`
// Construct the DOM by injecting the playlist buttons 
    target.appendChild(deckAnext)
    target.appendChild(deckAlast)
    target.appendChild(deckBnext)
    target.appendChild(deckBlast)
    target.appendChild(sp)
    target.appendChild(mixer)

// And insert both audio players as childrens
// This way our parents buttons can gently ask stuffs to their player childrens
    sp.appendChild(a)
    sp.appendChild(deckB)

// This childs sometimes brings mp3 crap at home 
// ...We need to connect them to the web audio api...
let context = new AudioContext()
// We connect the bad son player A first
let mediaElement = a
let sourceNode = context.createMediaElementSource(mediaElement)
//~ var node = context.createScriptProcessor(1024, 1, 1);
//~ node.onaudioprocess = function (e) {
  //~ var output = e.outputBuffer.getChannelData(0);
  //~ for (var i = 0; i < output.length; i++) {
    //~ output[i] = Math.random();
  //~ }
//~ };
//~ node.connect(context.destination);
// We need gain control 
let gainDb = -40.0
// And band pass filter to some more humans bands 290hz, 360hz, 432hz...
// We are going to build a 7 band equalizer
let bandSplit = [290, 360, 432, 932, 1728, 3600, 3600]
// Define the lower band to filter down (lowpass)
let hBand = context.createBiquadFilter()
    hBand.type = "lowshelf"
    hBand.frequency.value = bandSplit[0]
    hBand.gain.value = gainDb
// And an amplifier to give gain on this band if needed
let hInvert = context.createGain()
    hInvert.gain.value = -20.23
// Second band lowpass filter
let hBand06 = context.createBiquadFilter()
    hBand06.type = "lowshelf"
    hBand06.frequency.value = bandSplit[1]
    hBand06.gain.value = gainDb
// And his amplifier
let hInvert06 = context.createGain()
    hInvert06.gain.value = -20.23
// Third band
let hBand05 = context.createBiquadFilter()
    hBand05.type = "lowshelf"
    hBand05.frequency.value = bandSplit[2]
    hBand05.gain.value = gainDb
// Third band lowpass filter
let hInvert05 = context.createGain()
    hInvert05.gain.value = -20.23
// Middle band amplifier
let mBand = context.createGain()
// Lower band lowpass filter
let lBand02 = context.createBiquadFilter()
    lBand02.type = "highshelf"
    lBand02.frequency.value = bandSplit[3]
    lBand02.gain.value = gainDb

let lInvert02 = context.createGain()
    lInvert02.gain.value = -20.23

let lBand03 = context.createBiquadFilter()
    lBand03.type = "highshelf"
    lBand03.frequency.value = bandSplit[4]
    lBand03.gain.value = gainDb

let lInvert03 = context.createGain()
    lInvert03.gain.value = -20.23

let lBand = context.createBiquadFilter()
    lBand.type = "highshelf"
    lBand.frequency.value = bandSplit[1]
    lBand.gain.value = gainDb

let lInvert = context.createGain()
    lInvert.gain.value = -20.23

// Connect sources and filters
    sourceNode.connect(lBand)
    sourceNode.connect(lBand02)
    sourceNode.connect(lBand03)
    sourceNode.connect(mBand)
    sourceNode.connect(hBand05)
    sourceNode.connect(hBand06)
    sourceNode.connect(hBand)

// connect filters to their amplifier nodes
    hBand.connect(hInvert)
    hBand05.connect(lInvert02)
    hBand06.connect(lInvert03)
    lBand03.connect(hInvert06)
    lBand02.connect(hInvert05)
    lBand.connect(lInvert)

// High pass
    hInvert.connect(mBand)
    hInvert06.connect(mBand)
    hInvert05.connect(mBand)
    lInvert03.connect(mBand)
    lInvert02.connect(mBand)
    lInvert.connect(mBand)

// Create gain node for amplifiers
let lGain = context.createGain(),
    lGain02 = context.createGain(),
    lGain03 = context.createGain(),
    mGain = context.createGain(),
    hGain05 = context.createGain(),
    hGain06 = context.createGain(),
    hGain = context.createGain()

// Cnnect amplifiers nodes to gain
    lBand.connect(lGain)
    lBand02.connect(hGain06)
    lBand03.connect(hGain05)
    mBand.connect(mGain)
    hBand05.connect(lGain03)
    hBand06.connect(lGain02)
    hBand.connect(hGain)

// Create a gain node to receive the main stream 
let sum = context.createGain()
// Connect each lowpasses nodes to the main gain
    lGain.connect(sum)
    lGain02.connect(sum)
    lGain03.connect(sum)
    mGain.connect(sum)
    hGain05.connect(sum)
    hGain06.connect(sum)
    hGain.connect(sum)
// Connect the audio player deck A to the speakers
    sum.connect(context.destination)

/* Deck B EQualizer
 * 
 *                                                                  */
// Connect the players to the web audio api
let contextdeckb = context,
    mediaElementdeckB = deckB,
    sourceNodedeckb = contextdeckb.createMediaElementSource(mediaElementdeckB),
    gainDbdeckb = 0.01

// EQ Properties

let hBanddeckb = contextdeckb.createBiquadFilter()
    hBanddeckb.type = "lowshelf"
    hBanddeckb.frequency.value = bandSplit[0]
    hBanddeckb.gain.value = gainDbdeckb

let hInvertdeckb = contextdeckb.createGain()
    hInvertdeckb.gain.value = -40.23

let hBand06deckb = contextdeckb.createBiquadFilter()
    hBand06deckb.type = "lowshelf"
    hBand06deckb.frequency.value = bandSplit[1]
    hBand06deckb.gain.value = gainDbdeckb

let hInvert06deckb = contextdeckb.createGain()
    hInvert06deckb.gain.value = -40.23

let hBand05deckb = contextdeckb.createBiquadFilter()
    hBand05deckb.type = "lowshelf"
    hBand05deckb.frequency.value = bandSplit[2]
    hBand05deckb.gain.value = gainDbdeckb

let hInvert05deckb = contextdeckb.createGain()
    hInvert05deckb.gain.value = -40.23

let mBanddeckb = contextdeckb.createGain()
    mBanddeckb.gain.value = -0.01

let lBand02deckb = contextdeckb.createBiquadFilter()
    lBand02deckb.type = "highshelf"
    lBand02deckb.frequency.value = bandSplit[3]
    lBand02deckb.gain.value = gainDbdeckb

let lInvert02deckb = contextdeckb.createGain()
    lInvert02deckb.gain.valuedeckb = -40.23

let lBand03deckb = contextdeckb.createBiquadFilter()
    lBand03deckb.type = "highshelf"
    lBand03deckb.frequency.value = bandSplit[4]
    lBand03deckb.gain.value = gainDbdeckb

let lInvert03deckb = contextdeckb.createGain()
    lInvert03deckb.gain.value = -60.23

let lBanddeckb = contextdeckb.createBiquadFilter()
    lBanddeckb.type = "highshelf"
    lBanddeckb.frequency.value = bandSplit[0]
    lBanddeckb.gain.value = gainDbdeckb

let lInvertdeckb = contextdeckb.createGain()
    lInvertdeckb.gain.value = -60.23
    
    sourceNodedeckb.connect(lBanddeckb)
    sourceNodedeckb.connect(lBand02deckb)
    sourceNodedeckb.connect(lBand03deckb)
    sourceNodedeckb.connect(mBanddeckb)
    sourceNodedeckb.connect(hBand05deckb)
    sourceNodedeckb.connect(hBand06deckb)
    sourceNodedeckb.connect(hBanddeckb)
    
    hBanddeckb.connect(hInvertdeckb)
    hBand05deckb.connect(lInvert02deckb)
    hBand06deckb.connect(lInvert03deckb)
    lBand03deckb.connect(hInvert06deckb)
    lBand02deckb.connect(hInvert05deckb)
    lBanddeckb.connect(lInvertdeckb)
    
    hInvertdeckb.connect(mBanddeckb)
    hInvert06deckb.connect(mBanddeckb)
    hInvert05deckb.connect(mBanddeckb)
    lInvert03deckb.connect(mBanddeckb)
    lInvert02deckb.connect(mBanddeckb)
    lInvertdeckb.connect(mBanddeckb)

let lGaindeckb = contextdeckb.createGain()
let lGain02deckb = contextdeckb.createGain()
let lGain03deckb = contextdeckb.createGain()
let mGaindeckb = contextdeckb.createGain()
let hGain05deckb = contextdeckb.createGain()
let hGain06deckb = contextdeckb.createGain()
let hGaindeckb = contextdeckb.createGain()


    mGaindeckb.gain.value = -0.001

    lBanddeckb.connect(lGaindeckb)
    lBand02deckb.connect(hGain06deckb)
    lBand03deckb.connect(hGain05deckb)
    mBanddeckb.connect(mGaindeckb)
    hBand05deckb.connect(lGain03deckb)
    hBand06deckb.connect(lGain02deckb)
    hBanddeckb.connect(hGaindeckb)
    
    let sumdeckb = contextdeckb.createGain()
    lGaindeckb.connect(sumdeckb)
    lGain02deckb.connect(sumdeckb)
    lGain03deckb.connect(sumdeckb)
    mGaindeckb.connect(sumdeckb)
    hGain05deckb.connect(sumdeckb)
    hGain06deckb.connect(sumdeckb)
    hGaindeckb.connect(sumdeckb)

    sumdeckb.gain.value = 0.1

//~ sumdeckb.connect(contextdeckb.destination)
    sumdeckb.connect(context.destination)

// Array of tracks for the base playlist
let list = ["05seventheclipse.mp3",
  "//ponyhacks.com/img/www/medias/fw/perfect-blind-passing-the-veil.mp3",
  "//ponyhacks.com/img/www/medias/fw/man-of-no-ego-celestial-medicine.mp3",
  "//ponyhacks.com/img/www/medias/fw/ursus-formation.mp3"
] //,"http://www.ektoplazm.com/mp3/phillax-chaos-theory.mp3"]
//^|^|^
// This include the track number 0, for a total of 4 tracks_______^^|^
let listLength = list.length 

// Initiate the playlist track number
let playlist = "0";

// Text for the buttons
    deckAnext.innerHTML = "↶";
    deckAlast.innerHTML = "↷";
    deckBnext.innerHTML = "↶";
    deckBlast.innerHTML = "↷";

// Give needed attributes to the audio player
    deckB.src = list[0];

// Listen for a click event on the first FOO button
deckAnext.onclick = function() {
  // if playlist number in range
  if (playlist >= 1) {
    // decrement  
    playlist--;
    // Change the player source and reload
    deckA.src = list[playlist];
    deckA.load();
    // Avoid collision
    return false;
  } // Else jump to last track
  else {
    playlist = list.length;
    deckA.src = list[list.length];
    deckA.load();
    console.info("This is the last track: " + playlist);
    // Important to avoid collision 
    return false;
  }
}

// Similar actions for the forward BAR button
deckAlast.onclick = function() {
  if (playlist < list.length) {
    playlist++;
    deckA.src = list[playlist];
    deckA.load();
    // Avoid collision
    return false;
  } else {
    playlist = 0;
    deckA.src = list[playlist];
    deckA.load();
    console.info("Now coming back to the first track");
    return false;
  }
}

deckBnext.onclick = function() {
  // if playlist number in range
  if (playlist >= 1) {
    // decrement  
    playlist--;
    // Change the player source and reload
    deckB.src = list[playlist];
    deckB.load();
    // Avoid collision
    return false;
  } // Else jump to last track
  else {
    playlist = list.length;
    deckB.src = list[list.length];
    deckB.load();
    console.info("This is the last track: " + playlist);
    // Important to avoid collision 
    return false;
  }
}

// Similar actions for the forward BAR button
deckBlast.onclick = function() {
  if (playlist < list.length) {
    playlist++;
    deckB.src = list[playlist];
    deckB.load();
    // Avoid collision
    return false;
  } else {
    playlist = 0;
    deckB.src = list[playlist];
    deckB.load();
    console.info("Now coming back to the first track");
    return false;
  }
}

// Reset Eq on load
resetAll();
// Watch for user file input on deck a playlist
document.getElementById("aud").addEventListener("change", function(event) {

  let output = document.getElementById("listing")
  let files = event.target.files;
  let URL = window.URL || window.webkitURL
for (let i = 0; i < files.length; i++) {
   if (files[i].type === "audio/mpeg" ||
       files[i].type === "audio/mp3"  ||
       files[i].type === "audio/flac" ||
       files[i].type === "image/jpeg" ||
       files[i].type === "video/ogg") {
    let item = document.createElement("li")
    let elemSrc = URL.createObjectURL(files[i])
    let elemPath = files[i].webkitRelativePath.replace(/["']/g, "")

    item.innerHTML += 
    "<a class='moonlist' onclick=\"deckB.src='"+
        elemSrc+"';autoDeckB(sliderTracksRatio.value);deckB.play();deckB.dataset.track='"+
        elemPath+"';this.className='mark'\">⮣</a> \
    <a class='moonlist' onclick=\"deckA.src='"+elemSrc+
        "';autoDeckA(sliderTracksRatio.value);this.className='mark';deckA.dataset.track='"+
        elemPath+"';deckA.play()\">⮢</a> \
    <a class='drag' draggable='true' ondragstart='drag(event)' data-track='"+
        elemPath+"' onclick=\"document.getElementsByTagName('audio')[0].src='" + 
        elemSrc + "';this.className='mark';deckA.dataset.track='"+elemPath+
        "'\">" + elemPath + "</a>"

    list.push(elemSrc)
    
    if (files[i].type === "image/jpeg"){
        item.style.display="none"
    }

    item.dataset.track = elemPath;
    item.children[2].id = elemSrc;

    output.appendChild(item)
    
    let j = i
    let f = files.length
    console.log(j+" "+f)

    let tag = setTimeout(function(){
        id3(files[i], function(err, tags) {
                    console.log(err, tags);
                     console.log(i+" "+files.length)
            item.dataset.tags = Object.entries(tags)
                             window.clearInterval(tag)

                }); }, 5000)

}}
    (function(){
    setTimeout(function(){ poster() }, 10000)
    })()
}, false)

// Watch for user file input on deck a playlist
document.getElementById("audB").addEventListener("change", function(event) {

  let output = document.getElementById("listingB")
  let files = event.target.files
  let URL = window.URL || window.webkitURL

  for (let i = 0; i < files.length; i++) {
      
   if (files[i].type == "audio/mpeg" ||
       files[i].type === "audio/mp3" ||
       files[i].type == "audio/flac" ||
       files[i].type == "image/jpeg" ||
       files[i].type == "video/ogg") {
    let item = document.createElement("li");
    let elemSrc = URL.createObjectURL(files[i])
    let elemPath = files[i].webkitRelativePath.replace(/["']/g, "")
    item.innerHTML = "<a class='moonlist' onclick=\"deckA.src='"+elemSrc+
        "';autoDeckA(sliderTracksRatio.value);deckA.dataset.track='"+elemPath+
        "';this.className='mark';deckA.play()\">⮢</a> \
        <a class='moonlist' onclick=\"deckB.src='"+elemSrc+
        "';autoDeckB(sliderTracksRatio.value);deckB.play();deckB.dataset.track='"+
        elemPath+"';this.className='mark'\">⮣</a> | \
        <a class='drag' draggable='true' ondragstart='drag(event)' data-track='"+
        elemPath+"' onclick=\"document.getElementsByTagName('audio')[1].src='" + 
        elemSrc + "';this.className='mark';\
        deckB.dataset.track='"+elemPath+"'\">" + elemPath + "</a>"
    
    list.push(elemSrc)
    
    if (files[i].type == "image/jpeg"){
        item.style.display="none"
    }
    item.dataset.track = elemPath
    item.children[2].id = elemSrc
    
    let j = i
    let f = files.length
    console.log(j+" "+f)

    let tag = setTimeout(function(){
        id3(files[i], function(err, tags) {
                    console.log(err, tags);
                     console.log(i+" "+files.length)
            item.dataset.tags = Object.entries(tags)
                             window.clearInterval(tag)

                }); }, 1000)
    
    output.appendChild(item)
}}
    (function(){
    setTimeout(function(){ poster() }, 10000)
    })()

}, false)

function lyrics(deck) {

let w = window.innerHeight,
    me = deck.src
    artist.innerHTML = "<small><i>Fetching lyrics...</i></small>"
    artist.style.cssText += " ;transform:translateY(-"+w*0.5+"px)"
    document.documentElement.style.cssText += " ;transform:translateY("+w*0.918+"px)"
    document.documentElement.style.cssText += " height:"+window.innerHeight+"px"
    ajax(me)
}

function ajax(me){

try {    
let aId3 = document.getElementById(me).parentNode.dataset.tags
let aId3title = aId3.split(',', 2)[1]
let aId3artist = aId3.split(',', 6)[5]
let lyrics = new XMLHttpRequest()
    lyrics.onreadystatechange = function() {
      if (lyrics.readyState == XMLHttpRequest.DONE) {
            console.log(lyrics.responseText)
            artist.innerHTML = lyrics.responseText || "<small><i>No lyrics</i></small>" 
        }}
    lyrics.open('GET', 'https://ponyhacks.com/open/api/lyrics/?title=' + aId3title + '&artist=' + aId3artist , true)
    lyrics.send(null)
    }
catch (nope) {artist.innerHTML = "<small><i>Id3 tags are missing.</i></small>"}
}

// Automix Random track
function trackRandom() {

  playlist = list.length;
  deckA.src = list[Math.floor((Math.random() * playlist) + 1)]
  deckB.src = list[Math.floor((Math.random() * playlist) + 1)]
  deckA.play()
  deckB.play()
 if (deckA.paused){
  deckA.pause()
 }
 if (deckB.paused) { 
  deckB.pause()
 }
}

function trackRandomA() {

  playlist = list.length;
  deckA.src = list[Math.floor((Math.random() * playlist) + 1)];
  deckA.play()
}

function trackRandomB() {

  playlist = list.length;
  deckB.src = list[Math.floor((Math.random() * playlist) + 1)];
  deckB.play()
}

function fadeTracks() {

deckB.volume =
  ((document.getElementById("sliderTracks").value *0.05 ) / sliderTracksRatio.value).toFixed(2)
deckA.volume =
  Math.abs(1 - ((document.getElementById("sliderTracks").value *0.05) / sliderTracksRatio.value)).toFixed(2)
}

// Autoplay if specified in url hash: #autoplay
if (window.location.hash.substr(1) === "autoplay"){
    deckA.setAttribute("autoplay", "")
    deckB.setAttribute("autoplay", "")
}

function autoDeckB(ms){
let i = 0
let j = 100
let timer_automation = setInterval(function(){ mix_AB() }, ms)
let timer_automation_stop = setInterval(function(){ mix_stop() },20000) // Break after 20s in any case
let timer_holder = document.getElementById("sliderTracks").value
let ratioAB ="0.0073"
let ratioBA ="0.0083"
    function mix_AB() {
     let gate = i++
     let rate = (document.getElementById("sliderTracks").value * ratioBA) + gate
        document.getElementById("sliderTracks").value = (rate*0.88).toFixed(1)
        deckA.volume = 1- (gate * (ratioAB*0.88)) 
        deckB.volume = (gate * (ratioAB * 0.88))
        if (deckB.volume >= "0.99"){
           mix_stop()
        }}
        function mix_stop() {
        clearAutomation()
        console.info("Automation to deckB complete")
        console.table("DeckB: " + document.getElementById(deckA.src).dataset.track)
}}

function autoDeckA(ms){
let i = 0
let j = 100
let timer_automation = setInterval(function(){ mix_BA() }, ms)
let timer_holder = document.getElementById("sliderTracks").value
let ratioAB ="0.0073"
let ratioBA ="0.01"
    function mix_BA() {
        let gate = j--
        let rate = (document.getElementById("sliderTracks").value * ratioAB) + gate
        document.getElementById("sliderTracks").value = (rate*0.88).toFixed(1)
        deckA.volume =  1-(gate * (ratioBA*0.88)).toFixed(1)
        deckB.volume =  (gate * (ratioBA * 0.98)).toFixed(1)
        if (deckA.volume >= "0.99"){
         mixA_stop()
}}

function mixA_stop() {
    clearAutomation()
    console.info("Automation to deckA complete")
    console.table("DeckB: " + document.getElementById(deckA.src).dataset.track)
}}

// Posters
let max = 0

function poster(){

document.querySelectorAll(".drag").forEach(function(element) {

    let poster = document.createElement("img");
        poster.setAttribute("data-tracksrc",element.id)
// Max Posters Avoid lagging
 if (max <= "60"){
       if (element.dataset.track.includes("jpg")==true){
            poster.setAttribute("onerror","this.style.display='none'")
            poster.src = element.id;
            poster.className= "picalbum";
            poster.title = element.dataset.track;
            //~ console.info(element.dataset.track);
            posterA.appendChild(poster)
            max++;
            //~ console.info(max)

            setTimeout(function(){ 
                posterAnim((max*105)-window.innerWidth)

                // Block poster animation when inputs to avoid UI lags
                document.querySelectorAll('input').forEach(function(elem) {
                  elem.setAttribute("onmouseover","posterPause('on')")
                  elem.setAttribute("onmouseleave","posterPause('off')")
                })
            }, 10000);
        }
    }
})}

function posterAnim(margin){

    let inj = document.createElement('style');
    
    inj.innerHTML="\
            .poster {animation-play-state:paused}\
            .posteranim {animation-play-state:running}\
            @keyframes posteranimation {\
              0%   { transform: translateX(0px) }\
              50% { transform: translateX(-"+margin+"px) }\
              100% { transform: translateX(0px) }"
              
    document.body.appendChild(inj)
    document.getElementsByClassName("poster")[0].className += " posteranim"
}

function posterPause(toggle){

    if (toggle === "off"){
        document.getElementsByClassName("poster")[0].style.animationPlayState="running"
        //~ setTimeout(function(){ posterAnim()}, 3000);
        }
    if (toggle === "on"){
        document.getElementsByClassName("poster")[0].style.animationPlayState="paused"
        }
}

// Opposite color
function decimalToHex(decimal) {

  let hex = decimal.toString(16)
  if (hex.length == 1) hex = '0' + hex
  return hex
}

function hexToDecimal(hex) {

    return parseInt(hex,16)
}
 
function returnOpposite(colour) {
    
  return decimalToHex(255 - hexToDecimal(colour.substr(0,2))) 
    + decimalToHex(255 - hexToDecimal(colour.substr(2,2))) 
    + decimalToHex(255 -  hexToDecimal(colour.substr(4,2)));
}

function pwnColor() {

    document.body.parentElement.style.backgroundColor = document.getElementById('pwnClr').value
    document.body.style.color = 
    "#"+returnOpposite(document.getElementById('pwnClr').value.slice(1))
    document.querySelectorAll('a:not(.mark)').forEach(function(elem) {
      elem.style.color = 
      "#"+returnOpposite(document.getElementById('pwnClr').value.slice(1));
     })
}

// Fix for firefox position:fixed bug when using css transformation
if (!!window.chrome && !!window.chrome.webstore){

    document.body.setAttribute("onscroll","fixScroll()")
    document.body.setAttribute("onresize","fixScroll()")
    document.body.setAttribute("onresize","fixScroll()")
    document.getElementsByClassName("mixer")[0].style.margin = "380px 0px 0px 0px"
    document.getElementsByClassName("bonjour")[0].style.margin = "0 0 0 -2.8%"
    document.getElementsByClassName("left")[0].style.margin = "36px 0 0 -5%"
    document.getElementsByClassName("mixRight")[0].style.padding = ".9% 0 0 1%"
    rateControls.style.display = "block"
}

function fixScroll(){

    document.documentElement.style.cssText += " height:"+window.innerHeight+"px"
    posterblock.style.top= (window.innerHeight / 1.2) + window.scrollY+'px'
}

function showEq(showmebabe){

    let inj
    if (showmebabe == "off"){
        // Bitch
        inj = document.createElement('style');
        inj.innerHTML += 
            ".mixRight { opacity:0 }.left { opacity:0 } \
            #listing { top:16.5%;max-height:64%;max-width:36%;left:6%;margin:1% auto} \
            #listingB { top:16.5%;max-height:64%;max-width:36%;left:57%;margin: 0 0 0 -20px} \
            .files {position:block;width:100%;max-width:100%} \
            #audB{top:12%}\#aud{position:fixed\;top:12%\;left:0px} \
            .bonjour {display:none}#trackA {display:none } \
            #trackB {display:none }input[type='file'] {transform:rotate(0deg)"
        document.body.appendChild(inj);
    }
    if (showmebabe == "on"){
         // Bitch
        inj = document.createElement('style');
        inj.innerHTML += "\
            .mixRight {opacity:1  } \
            .left { opacity:1 } \
            #listing {top: unset;max-height: 49%;left:9%;max-width: 44% } \
            #listing { top:330px;max-height:49%;max-width:44%;margin:0 0 0 -20px} \
            #listingB { top:330px;max-height:49%;max-width:44%;left:56%;margin:0 0 0 -20px} \
            .files { position:fixed;width:102%;max-width:100%} \
            #audB{ position:block;top:50%;left:unset} \
            #aud{ position:block;top:50%;left:unset} \
            .bonjour { display:block} \
            #trackA { display:block} \
            #trackB { display:block } \
            input[type='file'] { transform:rotate(-90deg) } ";
        document.body.appendChild(inj);
    }   // >3
}

function ledAcheck(){

    if (deckA.paused){
        ledA.className = 'led_off'
    }
    if (!deckA.paused){
      if ((deckA.duration - deckA.currentTime) >= 30.3) {
            ledA.className = 'led_on'
        }
    // Allow 600ms    
      if ((deckA.duration - deckA.currentTime) < 20 && (deckA.duration - deckA.currentTime) >= 19.4) {
       // Avoid breaking a track  
        if (deckA.volume >= 0.9) {
            autoDeckB(60)
            console.warn("Automix 6 seconds to deck B")
        }}
      if ((deckA.duration - deckA.currentTime) <= 30.3) { 
        ledA.className = 'led_warning'
        console.info("DeckA: " + (deckA.duration - deckA.currentTime).toFixed(0) +"s till end")
    }}
}

function ledBcheck(){

    if (deckB.paused){
        ledB.className = 'led_off'
    }
    if (!deckB.paused){
     if ((deckB.duration - deckB.currentTime) >= 30.3) {
            ledB.className = 'led_on'
        }
     if ((deckB.duration - deckB.currentTime) < 20 && (deckB.duration - deckB.currentTime) >= 19.4) {
       // Avoid to break a track  
       if (deckB.volume >= 0.9) {
        autoDeckA(60)
        console.warn("Automix 6 seconds to deck A")
        }}
     if ((deckB.duration - deckB.currentTime) <= 30.3) { 
        ledB.className = 'led_warning'
        console.info("DeckB: " + (deckB.duration - deckB.currentTime).toFixed(0) +"s till end")        
    }}
}

function notifTrack(deck) {

    try {
     let t = document.getElementById(deck).parentNode.dataset.tags,
         title = t.split(',', 2)[1],
         artist = t.split(',', 6)[5]
         info(artist,title)
    }
    catch (nope) {info("Mind Blown","No id3 tags found")}
}

function trackNameA() {

    try {
     trackA.innerHTML = document.getElementById(deckA.src).dataset.track
     document.title = document.getElementById(deckA.src).dataset.track
     document.getElementById(deckA.src).style.cssText += " ;animation: ledblink 0.5s infinite"
     document.getElementById(deckA.src).parentElement.children[0].style.cssText += " ;animation: ledblink 0.5s infinite"

     console.warn("DeckB now playing: " + document.getElementById(deckA.src).dataset.track)
    }
    catch (nope) {info("Fucked","Error")}
    deckA.play()
}

function trackNameB() {

    try {
     trackB.innerHTML = document.getElementById(deckB.src).dataset.track
     document.title = document.getElementById(deckB.src).dataset.track
     document.getElementById(deckB.src).style.cssText += " ;animation: ledblink 0.5s infinite"
     document.getElementById(deckB.src).parentElement.children[1].style.cssText += " ;animation: ledblink 0.5s infinite"
     console.warn("DeckB now playing: " + document.getElementById(deckB.src).dataset.track)     
    }
    catch (nope) {}
    deckB.play()
}

function fullScreen() {

    if (!document.fullscreenElement &&
          !document.mozFullScreenElement && !document.webkitFullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
            } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
            } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        }
    }
}

function regularScreen() {  

    if (document.cancelFullScreen) {
          document.cancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
    }
}

// Deck B equalizer main function
function changeGaindeckb(string, type) {

  let value = parseFloat(string) / 100.0;
  switch (type) {
    case 'lowGain':
      lGaindeckb.gain.value = value;
      break;
    case 'lowGain02':
      lGain02deckb.gain.value = value;
      break;
    case 'lowGain03':
      lGain03deckb.gain.value = value;
      break;
    case 'midGain':
      mGaindeckb.gain.value = value;
      break;
    case 'highGain05':
      hGain06deckb.gain.value = value;
      break;
    case 'highGain06':
      hGain06deckb.gain.value = value;
      break;
    case 'highGain':
      hGaindeckb.gain.value = value;
      break;
  }
}

// Equalizer deck A main function
function changeGain(string, type) {

  let value = parseFloat(string) / 100.0;
  switch (type) {
    case 'lowGain':
      lGain.gain.value = value;
      break;
    case 'lowGain02':
      lGain02.gain.value = value;
      break;
    case 'lowGain03':
      lGain03.gain.value = value
      break
    case 'midGain':
      mGain.gain.value = value
      break;
    case 'highGain05':
      hGain06.gain.value = value
      break
    case 'highGain06':
      hGain06.gain.value = value
      break;
    case 'highGain':
      hGain.gain.value = value
      break
  }
}

// reset Eq deck A
function resetAll() {

  changeGain('50', 'lowGain')
  changeGain('50', 'lowGain02')
  changeGain('50', 'lowGain03')
  changeGain('50', 'highGain05')
  changeGain('50', 'highGain06')
  changeGain('50', 'highGain')
  changeGain('5', 'midGain')
  mid.value = "5"
  lowGainKnob.value = "50"
  lowGain02Knob.value = "50"
  lowGain03Knob.value = "50"
  highGain05Knob.value = "50"
  highGain06Knob.value = "50"
  highGainKnob.value = "50"
}

// Reset Eq deck B
function resetAll() {

  changeGain('50', 'lowGain')
  changeGain('50', 'lowGain02')
  changeGain('50', 'lowGain03')
  changeGain('50', 'highGain05')
  changeGain('50', 'highGain06')
  changeGain('50', 'highGain')
  changeGain('5', 'midGain')
  mid.value = "5";
  lowGainKnob.value = "50"
  lowGain02Knob.value = "50"
  lowGain03Knob.value = "50"
  highGain05Knob.value = "50"
  highGain06Knob.value = "50"
  highGainKnob.value = "50"
}

// Clear all automation
function clearAutomation(){

    var t = window.setTimeout(null,0);
    while (t--) { window.clearTimeout(t) }
    console.info("Automations canceled")
}

// drag drop
window.allowDrop = function(ev) {

    ev.preventDefault();
    if (ev.target.getAttribute("draggable") == "true")
        ev.dataTransfer.dropEffect = "none"; // dropping is not allowed
    else
        ev.dataTransfer.dropEffect = "all"; // drop it like it's hot
}

window.drag = function(ev) {

    ev.dataTransfer.setData("src", ev.target.id);
}

window.drop = function(ev) {

    ev.preventDefault()
    let blobsrc = ev.dataTransfer.getData("src")
    console.info(blobsrc)
    ev.target.src = blobsrc
    //~ dragged.className += " dropped";
}

// keyboard events
onkeyup = function(e){

    let yop =  e.key;console.info(yop)
    e.preventDefault();
    if(e.keyCode == 32){ e.preventDefault(); autoDeckA(300); console.info(E); autoDeckB(150) }
    if(e.key == ","){ e.preventDefault(); trackRandom() }
    if(e.key == ";"){ e.preventDefault(); trackRandomA() }
    if(e.key == ":"){ e.preventDefault(); trackRandomB() }
    if(e.key == "!"){ e.preventDefault(); deckB.src = deckA.src }
    if(e.key == "x"){ e.preventDefault(); autoDeckA(5000) }    
    if(e.key == "c"){ e.preventDefault(); autoDeckB(5000) }    
    if(e.key == "v"){ e.preventDefault(); autoDeckA(2000) }    
    if(e.key == "b"){ e.preventDefault(); autoDeckA(2000) }    
    if(e.key == "n"){ e.preventDefault(); autoDeckB(1000) }    
    if(e.key == "q"){ e.preventDefault(); autoDeckA(66) }    
    if(e.key == "s"){ e.preventDefault(); autoDeckB(100) }    
    if(e.key == "d"){ e.preventDefault(); autoDeckA(200) }
    if(e.key == "f"){ e.preventDefault(); autoDeckB(300) }
    if(e.key == "g"){ e.preventDefault(); autoDeckA(800) }
    if(e.key == "h"){ e.preventDefault(); autoDeckB(800) }
    if(e.key == "j"){ e.preventDefault(); autoDeckA(300) }
    if(e.key == "k"){ e.preventDefault(); autoDeckB(200) }
    if(e.key == "l"){ e.preventDefault(); autoDeckA(100) }
    if(e.key == "m"){ e.preventDefault(); autoDeckB(66) }
    if(e.key == "a"){ e.preventDefault(); autoDeckA(44) }
    if(e.key == "p"){ e.preventDefault(); autoDeckB(44) }
    if(e.key == "z"){ e.preventDefault(); autoDeckA(1111) }
    if(e.key == "o"){ e.preventDefault(); autoDeckB(1111) }
    if(e.key == "e"){ e.preventDefault(); autoDeckA(888) }
    if(e.key == "i"){ e.preventDefault(); autoDeckB(888) }
    if(e.key == "r"){ e.preventDefault(); autoDeckA(666) }
    if(e.key == "u"){ e.preventDefault(); autoDeckB(666) }
    if(e.key == "t"){ e.preventDefault(); autoDeckA(444) }
    if(e.key == "y"){ e.preventDefault(); autoDeckB(444) }
    if (e.key === 'Control') {return}
    if (e.ctrlKey) {
        if (e.key == "ArrowRight"){ e.preventDefault();
            sliderTracks.stepUp(20);
            fadeTracks()
        }
        if (e.key == "ArrowLeft"){ e.preventDefault();
            sliderTracks.stepDown(20);fadeTracks()
        }
        if (e.key == "ArrowUp"){ e.preventDefault();
            sliderTracksRatio.stepUp(2);
        }
        if (e.key == "ArrowDown"){ e.preventDefault();
            sliderTracksRatio.stepDown(2);
        }
        if (e.key == "Enter"){ e.preventDefault();
            aud.click()
        }
        if (e.key == "!"){ e.preventDefault();
            deckA.src = deckB.src
        }
    }
    if (e.shiftKey) {
        if (e.key == "ArrowRight"){ e.preventDefault();
            sliderTracks.stepUp(100);fadeTracks()
        }
        if (e.key == "ArrowLeft"){ e.preventDefault();
            sliderTracks.stepDown(100);fadeTracks()
        }
        if (e.key == "ArrowUp"){ e.preventDefault();
            sliderTracksRatio.stepUp(100);fadeTracks()
        }
        if (e.key == "ArrowDown"){ e.preventDefault();
            sliderTracksRatio.stepDown(100);fadeTracks()
        }
        if (e.key == "Enter"){ e.preventDefault();
            audB.click()
        }
    }
    if (e.altKey) {
        if (e.key == "!"){ e.preventDefault();
            deckB.src = deckA.src
        }
    }
}

/* Give Random color value onload*/
//~ onload = (function(){
  //~ pwnClr.value = '#'+Math.floor(Math.random()*16777215).toString(16);
//~ })()

// Nice color from the user html input on load
//~ pwnColor()

// The page is ready, let's prepare some more stuffs
onload = (function(){

    // Call back the page color set by user
    pwnClr.value = localStorage.getItem('baseColor') || "#FFFFFF"
    //~ document.body.setAttribute("onwheel","lyrics(deckA)")

    // Allow fullscreen by clicking the logo
    document.getElementsByClassName("bonjour")[0].setAttribute("data-fullscreen","off")
    document.getElementsByClassName("bonjour")[0].setAttribute("onclick","if(this.dataset.fullscreen =='off'){this.dataset.fullscreen='on';fullScreen()}else{this.dataset.fullscreen='off';regularScreen()}")

    // Insert new favicon
    var link = document.querySelector("link[rel*='icon']")  || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = 'favicon.png';
    document.getElementsByTagName('head')[0].appendChild(link)

    // Calculate and display colors based on user needs
    pwnColor()
})()


if ('serviceWorker' in navigator) {

  navigator.serviceWorker.register('sw.js', { scope: '' }).then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
};

function info(artist,track) {

 let notif = artist,
     dec = "128520"
 
  let options = {
      title: 'Thot:',
      body: track,
      icon: 'thot.png'
  }
  if (buttonNotif.value == "on") {
      let splash = new Notification(notif,options)
      setTimeout(function(){ splash.close() }, 1100)
}}

function askNotify() {

    Notification.requestPermission(function (permission) { })
}
askNotify()

function protocolHandler() {

    navigator.registerProtocolHandler("web+thot",
                              "https://ponyhacks.com/open/apps/player/#=%s",
                              "THoTplayer");
}protocolHandler() 
