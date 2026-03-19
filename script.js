const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const img = new Image()

/* QUESTIONS */

let questions = [
{src:"images/butterfly.jpg", answer:"Butterfly"},
{src:"images/chateau.jpg", answer:"Chateau"},
{src:"images/ddo.jpg", answer:"DDO"},
{src:"images/fire.jpg", answer:"Fire"},
{src:"images/fortnite.jpg", answer:"Fortnite"},
{src:"images/helicopter.jpg", answer:"Helicopter"},
{src:"images/lightening.jpg", answer:"Lightening"},
{src:"images/lion.jpg", answer:"Lion"},
{src:"images/luffy.jpg", answer:"Luffy"},
{src:"images/maki.webp", answer:"Maki"},
{src:"images/mickeymouse.jpg", answer:"Mickey Mouse"},
{src:"images/moose.jpg", answer:"Moose"},
{src:"images/mountains.jpg", answer:"Mountains"},
{src:"images/naruto.jpg", answer:"Naruto"},
{src:"images/rainbow.jpg", answer:"Rainbow"},
{src:"images/rocket.jpg", answer:"Rocket League"},
{src:"images/spider.jpg", answer:"Spider"},
{src:"images/TaylorSwift.jpg", answer:"Taylor Swift"},
{src:"images/thor.jpg", answer:"Thor"},
{src:"images/tiger.jpg", answer:"Tiger"},
{src:"images/turtle.jpg", answer:"Turtle"},
{src:"images/volcano.jpg", answer:"Volcano"},
{src:"images/waterfall.jpg", answer:"Waterfall"},
{src:"images/yuji.jpg", answer:"Yuji"}
];

let loadedImages = []

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

image.onerror = () => console.log("Failed:", q.src)

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

document.getElementById("startScreen").style.display = "none"
document.getElementById("gameScreen").style.display = "block"

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

startTime = null
animationFrame = requestAnimationFrame(animate)

}

/* ANIMATION */

function animate(timestamp){

if(isPaused) return

if(!startTime) startTime = timestamp

let elapsed = timestamp - startTime
let progress = Math.min(elapsed / totalRevealTime,1)

/* pixel scale */
let scale = 0.005 + (0.30 * progress)

draw(scale)

/* timer */
timeLeft = Math.ceil((totalRevealTime - elapsed)/1000)
if(timeLeft < 0) timeLeft = 0

document.getElementById("timer").innerText = timeLeft

if(progress < 1){

animationFrame = requestAnimationFrame(animate)

}else{

ctx.imageSmoothingEnabled = true
ctx.clearRect(0,0,canvas.width,canvas.height)
ctx.drawImage(img,0,0,canvas.width,canvas.height)

showAnswer()

}

}

/* DRAW */

function draw(scale){

let w = canvas.width * scale
let h = canvas.height * scale

ctx.imageSmoothingEnabled = false

ctx.clearRect(0,0,canvas.width,canvas.height)

ctx.drawImage(img,0,0,w,h)

ctx.drawImage(canvas,0,0,w,h,0,0,canvas.width,canvas.height)

}

/* GUESS */

function submitGuess(){

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

/* ANSWER */

function showAnswer(){

let el = document.getElementById("answer")
el.innerText = questions[round].answer
el.classList.remove("hidden")

}

/* NEXT */

function nextRound(){

cancelAnimationFrame(animationFrame)

/* force full image draw so it doesn't glitch */
ctx.imageSmoothingEnabled = true
ctx.clearRect(0,0,canvas.width,canvas.height)
ctx.drawImage(img,0,0,canvas.width,canvas.height)

/* show answer before moving on */
showAnswer()

round++

setTimeout(startRound,500)

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

startTime = performance.now() - ((20 - timeLeft)*1000)

animationFrame = requestAnimationFrame(animate)

}

}

/* END GAME */

function endGame(){

let high = localStorage.getItem("highScore") || 0

if(score > high){
localStorage.setItem("highScore",score)
high = score
}

document.getElementById("finalScore").innerText = score
document.getElementById("highScore").innerText = high

document.getElementById("gameScreen").style.display = "none"
document.getElementById("endScreen").style.display = "block"

}

/* INIT */

preloadImages(()=>{

document.getElementById("loading").style.display = "none"
document.getElementById("startScreen").style.display = "block"

})