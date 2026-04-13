const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const canadaMap = new Image()
const tempCanvas = document.createElement("canvas")
const tempCtx = tempCanvas.getContext("2d")

let provinces = [
{name:"British Columbia", points:[[47,155],[208,204],[164,287],[164,287],[205,356],[103,337]]},
{name:"Alberta", points:[[208,204],[300,224],[257,363],[212,356],[166,288]]},
{name:"Saskatchewan", points:[[303,221],[377,233],[373,294],[366,373],[261,365]]},
{name:"Manitoba", points:[[380,232],[454,231],[515,270],[451,327],[451,378],[372,372]]},
{name:"Ontario", points:[[518,273],[591,288],[639,338],[663,390],[723,401],[634,453],[593,410],[454,378],[451,328]]},
{name:"Quebec", points:[[871,290],[889,259],[782,288],[761,251],[789,243],[738,191],[685,190],[604,188],[643,331],[662,387],[725,397],[774,392],[801,317]]},
{name:"New Brunswick", points:[[798,350],[840,340],[840,350],[859,359],[843,375],[826,378]]},
{name:"Nova Scotia", points:[[863,361],[887,355],[894,347],[895,334],[904,334],[904,338],[918,341],[910,348],[902,356],[906,356],[871,377],[866,389],[859,394],[848,392]]},
{name:"PEI", points:[[852,347],[862,350],[869,350],[883,345],[887,350],[880,354],[852,355]]},
{name:"Newfoundland", points:[[741,185],[818,223],[822,233],[894,249],[894,258],[816,278],[802,270],[809,291],[785,286],[769,283],[760,253],[788,249]]},
{name:"Yukon", points:[[148,45],[171,63],[148,80],[159,89],[152,99],[150,123],[157,131],[148,153],[159,175],[173,184],[170,194],[120,178],[47,150],[45,140],[32,134]]},
{name:"NWT", points:[[173,195],[250,213],[300,221],[377,232],[380,178],[289,136],[284,126],[308,106],[261,78],[185,56],[170,63],[166,61],[148,79],[148,119],[147,147]]},
{name:"Nunavut", points:[[380,230],[452,230],[491,191],[444,176],[493,180],[556,194],[570,186],[653,164],[683,169],[707,170],[700,101],[533,52],[403,49],[366,50],[349,92],[298,89],[307,111],[286,123],[287,136],[382,178]]}
]

let remainingProvinces = []
let currentProvince = null
let round = 0
let score = 0
let totalRounds = provinces.length
let startTime
let animationFrame
let timeLeft = 15
let isPaused = false

canadaMap.src = "../images/canada.jpg"

function preloadMap(callback){
    let loaded = 0
    canadaMap.onload = function(){
        loaded++
        if(loaded === 1) callback()
    }
    canadaMap.onerror = function(){
        console.error("Failed to load Canada map")
        callback()
    }
}

function startGame(){
    remainingProvinces = [...provinces]
    round = 0
    score = 0
    totalRounds = remainingProvinces.length
    document.getElementById("startScreen").style.display = "none"
    document.getElementById("gameScreen").style.display = "block"
    document.querySelector("h1").innerText = "Guess The Province"
    document.getElementById("score").innerText = score
    startCanadaRound()
}

function startCanadaRound(){
    if(round >= totalRounds){
        endGame()
        return
    }
    document.getElementById("round").innerText = round + 1
    let answerEl = document.getElementById("answer")
    answerEl.innerText = ""
    answerEl.classList.add("hidden")
    document.getElementById("guess").value = ""

    let randomIndex = Math.floor(Math.random() * remainingProvinces.length)
    currentProvince = remainingProvinces.splice(randomIndex, 1)[0]

    drawCanada()
    startTime = performance.now()
    timeLeft = 15
    document.getElementById("timer").innerText = timeLeft
    animationFrame = requestAnimationFrame(canadaAnimate)
}

function canadaAnimate(){
    let elapsed = performance.now() - startTime
    timeLeft = Math.max(0, 15 - Math.floor(elapsed / 1000))
    document.getElementById("timer").innerText = timeLeft

    if(timeLeft <= 0){
        showCanadaAnswer()
        return
    }

    animationFrame = requestAnimationFrame(canadaAnimate)
}

function drawCanada(){
    if (!canadaMap.complete || canadaMap.naturalWidth === 0) return
    ctx.clearRect(0,0,canvas.width,canvas.height)

    let mapRatio = canadaMap.naturalWidth / canadaMap.naturalHeight
    let canvasRatio = canvas.width / canvas.height
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0

    if(canvasRatio > mapRatio){
        drawHeight = canvas.height
        drawWidth = mapRatio * drawHeight
        offsetX = (canvas.width - drawWidth)/2
    } else {
        drawWidth = canvas.width
        drawHeight = drawWidth / mapRatio
        offsetY = (canvas.height - drawHeight)/2
    }

    ctx.drawImage(canadaMap, offsetX, offsetY, drawWidth, drawHeight)

    let scaleX = drawWidth / 1000
    let scaleY = drawHeight / 500
    let pts = currentProvince.points

    ctx.fillStyle = "rgba(255,0,0,0.4)"
    ctx.strokeStyle = "red"
    ctx.lineWidth = 2

    ctx.beginPath()
    ctx.moveTo(pts[0][0]*scaleX + offsetX, pts[0][1]*scaleY + offsetY)
    for(let i = 1; i < pts.length; i++){
        ctx.lineTo(pts[i][0]*scaleX + offsetX, pts[i][1]*scaleY + offsetY)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = "black"
    ctx.shadowColor = "yellow"
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    ctx.font = `${16 * Math.min(scaleX, scaleY)}px Arial`
    ctx.fillText("Guess the province or territory", 20, 28)
    ctx.shadowColor = "transparent"
}

function submitGuess(){
    let guess = document.getElementById("guess").value.toLowerCase().trim()
    let correct = currentProvince.name.toLowerCase().trim()

    if(guess === correct){
        let points = Math.max(10, timeLeft * 5)
        score += points
        document.getElementById("score").innerText = score
        alert("Correct! +" + points)
    } else {
        alert("Wrong!")
    }

    document.getElementById("guess").value = ""
    showCanadaAnswer()
}

function showCanadaAnswer(){
    cancelAnimationFrame(animationFrame)
    let el = document.getElementById("answer")
    el.innerText = currentProvince.name
    el.classList.remove("hidden")
    round++
    setTimeout(startCanadaRound, 2000)
}

function nextRound(){
    cancelAnimationFrame(animationFrame)
    if(currentProvince){
        showCanadaAnswer()
    }
}

function togglePause(){
    if(!isPaused){
        cancelAnimationFrame(animationFrame)
        isPaused = true
        document.getElementById("pauseButton").innerText = "Resume"
    } else {
        isPaused = false
        document.getElementById("pauseButton").innerText = "Pause"
        startTime = performance.now() - ((15 - timeLeft) * 1000)
        animationFrame = requestAnimationFrame(canadaAnimate)
    }
}

function restartGame(){
    document.getElementById("endScreen").style.display = "none"
    document.getElementById("startScreen").style.display = "block"
}

function goHome(){
    window.location.href = "../index.html"
}

preloadMap(() => {
    document.getElementById("loading").style.display = "none"
    document.getElementById("startScreen").style.display = "block"
})

setTimeout(() => {
    if(document.getElementById("loading").style.display !== "none"){
        document.getElementById("loading").style.display = "none"
        document.getElementById("startScreen").style.display = "block"
    }
}, 5000)

const guessInput = document.getElementById("guess")
guessInput.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        submitGuess()
    }
})