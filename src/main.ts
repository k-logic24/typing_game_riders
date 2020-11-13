import { riders } from  './constants'
type RiderProps = typeof riders
const intro = document.querySelector('.intro')
const start = document.querySelector('.start')
const finished = document.querySelector('.finished')
const score = document.getElementById('score')
const miss = document.getElementById('miss')
const timer = document.getElementById('timer')
const startBtn = document.getElementById('start-btn')
const resetBtn = document.getElementById('reset-btn')
const nameArea = document.getElementById('riderName')
const imageArea = document.getElementById('riderImg') as HTMLImageElement

class GameState {
  private readonly riders: RiderProps
  protected selectedRiderName = ''
  protected selectedRiderImg = ''
  protected score = 0
  protected miss = 0
  protected limitTimer = 10

  protected constructor(riders) {
    this.riders = riders
  }

  get getRiders() {
    return this.riders
  }

  protected printData() {
    nameArea.innerText = this.selectedRiderName
    imageArea.src = this.selectedRiderImg
  }

  protected printTimer() {
    timer.innerText = String(this.limitTimer)
  }

  protected printScore() {
    score.innerText = String(this.score)
    miss.innerText = String(this.miss)
  }
}

class GameAction extends GameState {
  private static instance: GameAction
  static getInstance() {
    if (!GameAction.instance) {
      GameAction.instance = new GameAction(riders)
    }
    return GameAction.instance
  }
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
  init() {
    const rnd = Math.floor(Math.random() * this.getRiders.length)
    const selectRider = riders[rnd]
    this.selectedRiderName = selectRider.name
    this.selectedRiderImg = selectRider.src
    this.printData()
    this.printTimer()
  }
  start() {
    const countDown = setInterval(() => {
      this.limitTimer--
      this.printTimer()
      if (!this.limitTimer) {
        this.printScore()
        GameAction.switchPhase('finished')
        clearInterval(countDown)
        return
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
    this.score = 0
    this.miss = 0
    this.limitTimer = 10
    this.init()
  }
}

const gameAction = GameAction.getInstance()
gameAction.init()
startBtn.addEventListener('click', () => {
  // 初期化
  gameAction.init()
  // start
  gameAction.start()
  // フェーズ変更
  GameAction.switchPhase('start')
})
// typing
document.addEventListener('keypress',  function(event) {
  gameAction.typing(event.key)
})
// reset
resetBtn.addEventListener('click', () => {
  gameAction.reset()
  // フェーズ変更
  GameAction.switchPhase('restart')
})
