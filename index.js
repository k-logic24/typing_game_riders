const riders = [
  {
    'name': 'kuga',
    'src': 'http://placehold.it/500x250/?text=kuga'
  },
  {
    'name': 'agito',
    'src': 'http://placehold.it/500x250/?text=agito'
  }
]
let gameState = {
  riderName: '',
  score: 0,
  miss: 0,
  timer: 10
}
const intro = document.querySelector('.intro')
const start = document.querySelector('.start')
const finished = document.querySelector('.finished')
const score = document.getElementById('score')
const miss = document.getElementById('miss')
const startBtn = document.getElementById('start-btn')
const resetBtn = document.getElementById('reset-btn')
const nameArea = document.getElementById('riderName')
const imageArea = document.getElementById('riderImg')
function switchPhase(phase) {
  switch (phase) {
    case 'start':
      intro.classList.add('hidden')
      start.classList.remove('hidden')
      break
    case 'finished':
      start.classList.add('hidden')
      finished.classList.remove('hidden')
      break
    case 'restart':
      finished.classList.add('hidden')
      intro.classList.remove('hidden')
  }
}
function init() {
  const rnd = Math.floor(Math.random() * riders.length)
  const { name, src } = riders[rnd]
  gameState.riderName = name
  nameArea.innerText = name
  imageArea.src = src
}
init()
// start
startBtn.addEventListener('click', () => {
  switchPhase('start')
  const countDown = setInterval(() => {
    gameState.timer--
    console.log(gameState)

    if (gameState.timer === 0) {
      // 結果反映
      score.innerText = gameState.score
      miss.innerText = gameState.miss
      switchPhase('finished')
      clearInterval(countDown)
      console.log(gameState)
    }
  }, 1000)
})
// reset
resetBtn.addEventListener('click', () => {
  // TODO: スマートじゃない
  gameState = {
    riderName: '',
    score: 0,
    miss: 0,
    timer: 10
  }
  init()
  switchPhase('restart')
})
// typing
function typingAction(event) {
  const key = event.key
  const splitRiderName = gameState.riderName.split('')
  if (key === splitRiderName[0]) {
    gameState.score++
    gameState.riderName = splitRiderName.slice(1).join('')
    // textに注入
    nameArea.innerText = gameState.riderName
    if (!gameState.riderName) {
      init()
    }
    return
  }
  gameState.miss++
}
document.addEventListener('keypress',  typingAction)
