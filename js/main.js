const intro = document.querySelector('.intro')
const start = document.querySelector('.start')
const finished = document.querySelector('.finished')
const score = document.getElementById('score')
const miss = document.getElementById('miss')
const startBtn = document.getElementById('start-btn')
const resetBtn = document.getElementById('reset-btn')
const nameArea = document.getElementById('riderName')
const imageArea = document.getElementById('riderImg')
const riders = [
  {
    'name': 'kuuga',
    'src': 'images/hero.png'
  },
  {
    'name': 'agito',
    'src': 'http://placehold.it/500x250/?text=agito'
  }
]
class GameState {
  selectedRiderName = ''
  selectedRiderImg = ''
  score = 0
  miss = 0
  limitTimer = 10

  static switchPhase(phase) {
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

  printData() {
    nameArea.innerText = this.selectedRiderName
    imageArea.src = this.selectedRiderImg
  }

  printScore() {
    score.innerText = this.score
    miss.innerText = this.miss
  }
}

class GameAction extends GameState {
  init() {
    const rnd = Math.floor(Math.random() * riders.length)
    const selectRider = riders[rnd]
    this.selectedRiderName = selectRider.name
    this.selectedRiderImg = selectRider.src
    this.printData()
  }
  start() {
    const countDown = setInterval(() => {
      this.limitTimer--

      if (!this.limitTimer) {
        this.printScore()
        GameState.switchPhase('finished')
        clearInterval(countDown)
      }
    }, 1000)
  }
  typing(key) {
    const splitRiderName = this.selectedRiderName.split('')

    if (key === splitRiderName[0]) {
      this.score++
      // riderNameの最初の文字を切り取り表示
      this.selectedRiderName = splitRiderName.slice(1).join('')
      nameArea.innerText = this.selectedRiderName
      // タイピング終わったら初期化
      if (!this.selectedRiderName) {
        this.init()
      }
      return
    }
    this.miss++
  }
  reset() {
    this.riderName = ''
    this.score = 0
    this.miss = 0
    this.limitTimer = 10
    this.init()
  }
}

const gameAction = new GameAction()
startBtn.addEventListener('click', () => {
  // 初期化
  gameAction.init()
  // start
  gameAction.start()
  GameState.switchPhase('start')
})
// typing
document.addEventListener('keypress',  function(event) {
  gameAction.typing(event.key)
})
// reset
resetBtn.addEventListener('click', () => {
  gameAction.reset()
  GameState.switchPhase('restart')
})
