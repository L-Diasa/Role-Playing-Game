import characterData from './data.js'
import Character from './Character.js'

let monstersArray
let isWaiting
let wizard
let monster
startGame()

document.body.addEventListener('click', function (e) {
    if(e.target) {
        if(e.target.id == 'restart-button') {
            startGame()
        }
        else if(e.target.id == 'attack-button') {
            attack()
        }
    }
})

function startGame() {
    monstersArray = ["orc", "demon", "goblin"]
    wizard = new Character(characterData.hero)
    monster = getNewMonster()
    isWaiting = false
    render()
}

function endGame() {
    isWaiting = true
    const endMessage = wizard.health === 0 && monster.health === 0 ?
        "No victors - all creatures are dead" :
        wizard.health > 0 ? "The Wizard Wins" :
            "The monsters are Victorious"

    const endEmoji = wizard.health > 0 ? "🔮" : "☠️"
        setTimeout(()=>{
            document.body.innerHTML = `
                <div class="end-game">
                    <h2>Game Over</h2> 
                    <h3>${endMessage}</h3>
                    <p class="end-emoji">${endEmoji}</p>
                    <section id="actions">
                        <button id="restart-button">Play Again</button>
                    </section>
                </div>
                `
        }, 1500)
}

function render() {
    document.body.innerHTML = `
        <main>
            <div id="hero"> 
                ${wizard.getCharacterHtml()}             
            </div>
            <div id="monster">
                ${monster.getCharacterHtml()} 
            </div>    
        </main>
        <section id="actions">
            <button id="attack-button">Attack</button>
        </section>
    `
}

function attack() {
    if(!isWaiting){
        wizard.setDiceHtml()
        monster.setDiceHtml()
        wizard.takeDamage(monster.currentDiceScore)
        monster.takeDamage(wizard.currentDiceScore)
        render()
        
        if(wizard.dead){
            endGame()
        }
        else if(monster.dead){
            isWaiting = true
            if(monstersArray.length > 0){
                setTimeout(()=>{
                    monster = getNewMonster()
                    render()
                    isWaiting = false
                },1500)
            }
            else{
                endGame()
            }
        }    
    }
}

function getNewMonster() {
    const nextMonsterData = characterData[monstersArray.shift()]
    return nextMonsterData ? new Character(nextMonsterData) : {}
}