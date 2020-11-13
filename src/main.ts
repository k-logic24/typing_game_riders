import { riders } from  './constants'
type RiderProps = typeof riders
type RiderNameProps = {
  ja: string
  en: string
}
const intro = document.querySelector('.intro')
const start = document.querySelector('.start')
const finished = document.querySelector('.finished')
const score = document.getElementById('score')
const miss = document.getElementById('miss')
const timer = document.getElementById('timer')
const startBtn = document.getElementById('start-btn')
const resetBtn = document.getElementById('reset-btn')
const nameEn = document.getElementById('riderNameEn')
const nameJp = document.getElementById('riderNameJp')
const imageArea = document.getElementById('riderImg') as HTMLImageElement

class GameState {
  private readonly riders: RiderProps
  protected selectedRiderName: RiderNameProps
  protected selectedRiderImg: string
  protected score: number = 0
  protected miss: number = 0
  protected limitTimer: number = 60

  protected constructor(riders) {
    this.riders = riders
  }

  get getRiders() {
    return this.riders
  }

  protected printData() {
    nameEn.innerText = this.selectedRiderName.en
    nameJp.innerText = this.selectedRiderName.ja
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
    const copyRider = JSON.parse(JSON.stringify(this.getRiders))
    const rnd = Math.floor(Math.random() * copyRider.length)
    const selectRider = copyRider[rnd]
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
  typing(key: string) {
    const splitRiderName = this.selectedRiderName.en.split('')

    if (key === splitRiderName[0]) {
      this.score++
      this.selectedRiderName.en = splitRiderName.slice(1).join('')
      nameEn.innerText = this.selectedRiderName.en
      if (!this.selectedRiderName.en) {
        this.init()
      }
      return
    }
    this.miss++
  }
  reset() {
    this.score = 0
    this.miss = 0
    this.limitTimer = 60
    this.init()
  }
}
const gameAction = GameAction.getInstance()
gameAction.init()

startBtn.addEventListener('click', () => {
  gameAction.start()
  GameAction.switchPhase('start')
})
document.addEventListener('keypress',  function(event) {
  gameAction.typing(event.key)
})
resetBtn.addEventListener('click', () => {
  gameAction.reset()
  GameAction.switchPhase('restart')
})
