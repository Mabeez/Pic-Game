const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const img = new Image()
const tempCanvas = document.createElement("canvas")
const tempCtx = tempCanvas.getContext("2d")

/* QUESTIONS */

let questions = [
{src:"../images/butterfly.jpg", answer:"Butterfly"},
{src:"../images/chateau.jpg", answer:"Chateau"},
{src:"../images/ddo.jpg", answer:"DDO"},
{src:"../images/fire.jpg", answer:"Fire"},
{src:"../images/fortnite.jpg", answer:"Fortnite"},
{src:"../images/helicopter.jpg", answer:"Helicopter"},
{src:"../images/lightning.jpg", answer:"Lightning"},
{src:"../images/lion.jpg", answer:"Lion"},
{src:"../images/luffy.jpg", answer:"Luffy"},
{src:"../images/maki.webp", answer:"Maki"},
{src:"../images/mickeymouse.jpg", answer:"Mickey Mouse"},
{src:"../images/moose.jpg", answer:"Moose"},
{src:"../images/mountains.jpg", answer:"Mountains"},
{src:"../images/naruto.jpg", answer:"Naruto"},
{src:"../images/rainbow.jpg", answer:"Rainbow"},
{src:"../images/rocket.jpg", answer:"Rocket League"},
{src:"../images/spider.jpg", answer:"Spider"},
{src:"../images/TaylorSwift.jpg", answer:"Taylor Swift"},
{src:"../images/thor.jpg", answer:"Thor"},
{src:"../images/tiger.jpg", answer:"Tiger"},
{src:"../images/turtle.jpg", answer:"Turtle"},
{src:"../images/volcano.jpg", answer:"Volcano"},
{src:"../images/waterfall.jpg", answer:"Waterfall"},
{src:"../images/yuji.jpg", answer:"Yuji"}
];

let loadedImages = []
let gameMode = "image"

/* GAME STATE */

let round = 0
let score = 0
let totalRounds = questions.length

let totalRevealTime = 15000
let startTime
let animationFrame
let timeLeft = 15
let isPaused = false

/* PRELOAD */

function preloadImages(callback){

let loaded = 0

questions.forEach((q,i)=>{

let image = new Image()

image.onload = function(){
loaded++
loadedImages[i] = image
if(loaded === questions.length) callback()
}

image.onerror = () => {
console.log("Failed:", q.src)
loaded++
if(loaded === questions.length) callback()
}

image.src = q.src

})

}

/* SHUFFLE */

function shuffle(){

for(let i = questions.length - 1; i > 0; i--){

const j = Math.floor(Math.random() * (i + 1))

/* swap questions */
let tempQ = questions[i]
questions[i] = questions[j]
questions[j] = tempQ

/* swap images */
let tempImg = loadedImages[i]
loadedImages[i] = loadedImages[j]
loadedImages[j] = tempImg

}

}

/* START GAME */

function startGame(){

gameMode = "image"
totalRounds = questions.length

document.getElementById("startScreen").style.display = "none"
document.getElementById("gameScreen").style.display = "block"

document.querySelector("h1").innerText = "Guess The Picture"

round = 0
score = 0

document.getElementById("score").innerText = score

shuffle()
startRound()

}

/* ROUND */

function startRound(){

if(round >= totalRounds){
endGame()
return
}

document.getElementById("round").innerText = round + 1

let answerEl = document.getElementById("answer")
answerEl.innerText = ""
answerEl.classList.add("hidden")

document.getElementById("guess").value = ""

img.src = loadedImages[round].src



startTime = performance.now()
timeLeft = 15
document.getElementById("timer").innerText = timeLeft

animationFrame = requestAnimationFrame(animate)

}

/* ANIMATION */

function animate(){

if(isPaused) return

let elapsed = performance.now() - startTime
timeLeft = Math.max(0, 15 - Math.floor(elapsed / 1000))
document.getElementById("timer").innerText = timeLeft

// 🎯 PIXEL SIZE (big → small over time)
let progress = Math.min(1, elapsed / totalRevealTime)

// ease-out curve (fast at start, slow at end)
let eased = 1 - Math.pow(1 - progress, 3)
let pixelSize = 2 + (60 * (1 - eased))

drawPixelated(pixelSize)
if(progress > 0.85){
ctx.imageSmoothingEnabled = true
ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
}
if(timeLeft <= 0){
showAnswer()
return
}

animationFrame = requestAnimationFrame(animate)

}


function drawPixelated(pixelSize){

let w = Math.ceil(canvas.width / pixelSize)
let h = Math.ceil(canvas.height / pixelSize)

if(tempCanvas.width !== w) tempCanvas.width = w
if(tempCanvas.height !== h) tempCanvas.height = h

// draw tiny version
tempCtx.clearRect(0,0,w,h)
tempCtx.drawImage(img, 0, 0, w, h)

// draw scaled up smoothly
ctx.clearRect(0,0,canvas.width,canvas.height)

// slight fade effect (smooth transition)
ctx.globalAlpha = 0.9

ctx.imageSmoothingEnabled = false
ctx.drawImage(tempCanvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height)

ctx.globalAlpha = 1
}

/* GUESS */

function submitGuess(){

if(gameMode === "image"){

let guess = document.getElementById("guess").value.toLowerCase().trim()
let correct = questions[round].answer.toLowerCase().trim()

if(guess === correct){

let points = Math.max(10, timeLeft * 5)

score += points
document.getElementById("score").innerText = score

showAnswer()

alert("Correct! +" + points)


}else{

alert("Wrong!")

}

document.getElementById("guess").value = ""

}

}

/* ANSWER */

function showAnswer(){

let el = document.getElementById("answer")
el.innerText = questions[round].answer
el.classList.remove("hidden")

}

/* NEXT */

function nextRound(){

if(gameMode === "image"){

cancelAnimationFrame(animationFrame)

/* show answer before moving on */
showAnswer()

round++

setTimeout(startRound,500)

}

}

/* PAUSE */

function togglePause(){

if(!isPaused){

cancelAnimationFrame(animationFrame)
isPaused = true
document.getElementById("pauseButton").innerText = "Resume"

}else{

isPaused = false
document.getElementById("pauseButton").innerText = "Pause"

startTime = performance.now() - ((15 - timeLeft)*1000)

animationFrame = requestAnimationFrame(animate)

}

}

/* INIT */

preloadImages(()=>{

document.getElementById("loading").style.display = "none"
document.getElementById("startScreen").style.display = "block"

})



// Fallback in case images take too long
setTimeout(() => {
if(document.getElementById("loading").style.display !== "none"){
document.getElementById("loading").style.display = "none"
document.getElementById("startScreen").style.display = "block"
console.log("Fallback: showing start screen")
}
}, 5000)

function endGame(){

cancelAnimationFrame(animationFrame)

document.getElementById("gameScreen").style.display = "none"

const endScreen = document.getElementById("endScreen")
endScreen.style.display = "block"

setTimeout(() => {
    endScreen.classList.add("show")
}, 10)

document.getElementById("finalScore").innerText = "Score: " + score

}

const guessInput = document.getElementById("guess")

guessInput.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        submitGuess()
    }
})