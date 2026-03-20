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
{src:"images/lightning.jpg", answer:"Lightning"},
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

/* CANADA */

const canadaMap = new Image()
canadaMap.src = "images/canada.jpg"

let provinces = [
{name:"British Columbia", points:[[25,180],[85,160],[145,210],[130,260],[90,300],[60,260]]},
{name:"Alberta", points:[[140,190],[185,190],[195,270],[185,320],[140,320]]},
{name:"Saskatchewan", points:[[190,190],[245,190],[255,270],[245,320],[195,320]]},
{name:"Manitoba", points:[[255,190],[305,190],[315,270],[305,320],[260,320]]},
{name:"Ontario", points:[[315,210],[385,200],[445,235],[455,290],[395,345],[330,310]]},
{name:"Quebec", points:[[420,190],[520,190],[580,250],[530,310],[470,285],[430,250],[420,220]]},
{name:"New Brunswick", points:[[520,300],[545,300],[565,330],[540,340],[520,325]]},
{name:"Nova Scotia", points:[[545,335],[585,350],[610,375],[590,390],[560,375],[545,350]]},
{name:"Prince Edward Island", points:[[558,296],[578,296],[582,308],[565,308]]},
{name:"Newfoundland and Labrador", points:[[575,170],[638,170],[690,220],[660,250],[620,235],[590,210]]}
]

let currentProvince = null
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

} else if(gameMode === "canada"){

submitCanadaGuess()

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

/* force full image draw so it doesn't glitch */
ctx.imageSmoothingEnabled = true
ctx.clearRect(0,0,canvas.width,canvas.height)
ctx.drawImage(img,0,0,canvas.width,canvas.height)

/* show answer before moving on */
showAnswer()

round++

setTimeout(startRound,500)

} else if(gameMode === "canada"){

round++

startCanadaRound()

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

startTime = performance.now() - ((20 - timeLeft)*1000)

animationFrame = requestAnimationFrame(animate)

}

}

/* START CANADA GAME */

function startCanadaGame(){

gameMode = "canada"
totalRounds = provinces.length

document.getElementById("startScreen").style.display = "none"
document.getElementById("gameScreen").style.display = "block"

document.querySelector("h1").innerText = "Guess The Province"

round = 0
score = 0

document.getElementById("score").innerText = score

startCanadaRound()

}

/* CANADA ROUND */

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

let randomIndex = Math.floor(Math.random() * provinces.length)
currentProvince = provinces[randomIndex]

drawCanada()

startTime = performance.now()
timeLeft = 15
document.getElementById("timer").innerText = timeLeft

animationFrame = requestAnimationFrame(canadaAnimate)

}

/* CANADA ANIMATE */

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

/* DRAW CANADA */

function drawCanada(){

if (!canadaMap.complete || canadaMap.naturalWidth === 0) return

ctx.clearRect(0,0,canvas.width,canvas.height)

let mapRatio = canadaMap.naturalWidth / canadaMap.naturalHeight
let canvasRatio = canvas.width / canvas.height
let drawWidth, drawHeight, offsetX=0, offsetY=0

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

ctx.fillStyle = "rgba(255,0,0,0.4)"
ctx.strokeStyle = "red"
ctx.lineWidth = 2

let pts = currentProvince.points
ctx.beginPath()
ctx.moveTo(pts[0][0]*scaleX + offsetX, pts[0][1]*scaleY + offsetY)
for(let i=1;i<pts.length;i++){
ctx.lineTo(pts[i][0]*scaleX + offsetX, pts[i][1]*scaleY + offsetY)
}
ctx.closePath()
ctx.fill()
ctx.stroke()

ctx.fillStyle = "black"
ctx.font = `${30 * scaleX}px Arial`
ctx.fillText("Guess this province", 20*scaleX + offsetX, 40*scaleY + offsetY)

}

/* CANADA GUESS */

function submitCanadaGuess(){

let guess = document.getElementById("guess").value.toLowerCase().trim()
let correct = currentProvince.name.toLowerCase().trim()

if(guess === correct){

let points = Math.max(10, timeLeft * 5)
score += points
document.getElementById("score").innerText = score

showCanadaAnswer()

alert("Correct! +" + points)

}else{

alert("Wrong!")

}

document.getElementById("guess").value = ""

}

/* CANADA ANSWER */

function showCanadaAnswer(){

cancelAnimationFrame(animationFrame)

let el = document.getElementById("answer")
el.innerText = currentProvince.name
el.classList.remove("hidden")

setTimeout(() => {
round++
startCanadaRound()
}, 2000)

}

/* INIT */

preloadImages(()=>{

document.getElementById("loading").style.display = "none"
document.getElementById("startScreen").style.display = "block"

})