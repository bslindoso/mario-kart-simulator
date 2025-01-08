const readline = require('readline')
const characters = [
  {
    NAME: "Mario",
    SPEED: 4,
    MANEUVERABILITY: 3,
    POWER: 3,
    POINTS: 0
  },
  {
    NAME: "Luigi",
    SPEED: 3,
    MANEUVERABILITY: 4,
    POWER: 4,
    POINTS: 0
  },
  {
    NAME: "Peach",
    SPEED: 3,
    MANEUVERABILITY: 4,
    POWER: 2,
    POINTS: 0
  },
  {
    NAME: "Yoshi",
    SPEED: 2,
    MANEUVERABILITY: 4,
    POWER: 3,
    POINTS: 0
  },
  {
    NAME: "Bowser",
    SPEED: 5,
    MANEUVERABILITY: 2,
    POWER: 5,
    POINTS: 0
  },
  {
    NAME: "Donkey Kong",
    SPEED: 2,
    MANEUVERABILITY: 2,
    POWER: 5,
    POINTS: 0
  }
]

async function getRandomCharacter() {
  const randomIndex = Math.floor(Math.random() * characters.length)
  const selectedCharacter = characters[randomIndex]
  characters.splice(randomIndex, 1)
  return selectedCharacter
}

async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.33:
      result = "RETA"
      break;
    case random < 0.66:
      result = "CURVA"
      break;
    case random > 0.66:
      result = "CONFRONTO"
      break;
    default:
      result = "CONFRONTO"
  }
  return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
  console.log(`${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`);
}

async function playRaceEngine(character1, character2) {

  for (let round = 1; round <= 5; round++) {
    generateHeader(`🏁 RODADA ${round}`, '-', 20)

    // sort block
    let block = await getRandomBlock();
    console.log(`Bloco: ${block}`);

    // roll dice
    let diceResult1 = await rollDice();
    let diceResult2 = await rollDice();

    // skill test
    let totalSkillTest1 = 0;
    let totalSkillTest2 = 0;

    if (block === "RETA") {
      totalSkillTest1 = diceResult1 + character1.SPEED;
      totalSkillTest2 = diceResult2 + character2.SPEED;

      await logRollResult(character1.NAME, "velocidade", diceResult1, character1.SPEED);
      await logRollResult(character2.NAME, "velocidade", diceResult2, character2.SPEED);
    }

    if (block === "CURVA") {
      totalSkillTest1 = diceResult1 + character1.MANEUVERABILITY;
      totalSkillTest2 = diceResult2 + character2.MANEUVERABILITY;

      await logRollResult(character1.NAME, "manobrabilidade", diceResult1, character1.MANEUVERABILITY);
      await logRollResult(character2.NAME, "manobrabilidade", diceResult2, character2.MANEUVERABILITY);

    }

    if (block === "CONFRONTO") {
      let powerResult1 = diceResult1 + character1.POWER;
      let powerResult2 = diceResult2 + character2.POWER;

      console.log(`${character1.NAME} confrontou com ${character2.NAME}! 🥊`);
      await logRollResult(character1.NAME, "poder", diceResult1, character1.POWER);
      await logRollResult(character2.NAME, "poder", diceResult2, character2.POWER);

      const confrontType = defineConfrontType()
      const confrontEmoji = (confrontType === `casco`) ? `🐢` : `💣`
      let confrontPointsLost = 1

      if ((powerResult1 > powerResult2) && (character2.POINTS === 0)) {
        console.log(`${character1.NAME} venceu o confronto! ${confrontEmoji} ${character2.NAME} não tinha pontos a perder`);
        rollTurboBonus(character1)
      }

      if ((powerResult2 > powerResult1) && (character1.POINTS === 0)) {
        console.log(`${character2.NAME} venceu o confronto! ${confrontEmoji} ${character1.NAME} não tinha pontos a perder`);
        rollTurboBonus(character2)

      }

      if ((powerResult1 > powerResult2) && (character2.POINTS > 0)) {
        if (confrontType === `casco`) { character2.POINTS--; }
        else {
          character2.POINTS--;
          if (character2.POINTS > 0) { character2.POINTS--; confrontPointsLost++ }
        }
        console.log(`${character1.NAME} venceu o confronto! ${confrontEmoji} ${character2.NAME} perdeu ${confrontPointsLost} ponto(s).`);
        rollTurboBonus(character1)
      }

      if ((powerResult2 > powerResult1) && (character1.POINTS > 0)) {
        if (confrontType === `casco`) { character1.POINTS--; }
        else {
          character1.POINTS--;
          if (character1.POINTS > 0) { character1.POINTS--; confrontPointsLost++ }
        }
        console.log(`${character2.NAME} venceu o confronto! ${confrontEmoji} ${character1.NAME} perdeu ${confrontPointsLost} ponto(s).`);
        rollTurboBonus(character2)
      }

      if ((powerResult1 === powerResult2)) {
        console.log(`Confronto empatado! ${confrontEmoji} Nenhum ponto perdido.`)
      }
    }

    // check winner
    if (totalSkillTest1 > totalSkillTest2) {
      console.log(`${character1.NAME} marcou um ponto!`);
      character1.POINTS++;
    } else if (totalSkillTest2 > totalSkillTest1) {
      console.log(`${character2.NAME} marcou um ponto!`);
      character2.POINTS++;
    } else {
      if (block != "CONFRONTO") console.log(`Deu empate! Ninguém marcou ponto.`);
    }

    // pause game
    await pauseForKeypress()
  }
}

function defineConfrontType() {
  return (Math.random() <= 0.5) ? `casco` : `bomba`
}

function rollTurboBonus(character) {
  const gotTurbo = (Math.random() <= 0.3) ? true : false
  if (gotTurbo) {
    character.POINTS++;
    console.log(`🚀 ${character.NAME} achou um turbo e ganhou 1 ponto!`)
  }
}

async function declareWinner(character1, character2) {
  generateHeader('Resultado final', '-', 20)
  console.log(`${character1.NAME}: ${character1.POINTS} ponto(s)`);
  console.log(`${character2.NAME}: ${character2.POINTS} ponto(s)`);

  if (character1.POINTS > character2.POINTS)
    console.log(`\n${character1.NAME} venceu a corrida! Parabéns! 🏆`);
  else if (character2.POINTS > character1.POINTS)
    console.log(`\n${character2.NAME} venceu a corrida! Parabéns! 🏆`);
  else
    console.log(`A corrida terminou em empate`);
}

async function pauseForKeypress() {
  console.log('\nPressione qualquer tecla para continuar...')
  return new Promise(resolve => {
    process.stdin.setRawMode(true)
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false)
      resolve()
    })
  })
}

function generateHeader(text, char = '-', width = 50) {
  const line = char.repeat(width)
  const paddedText = text.padStart((width + text.length) / 2).padEnd(width)
  console.log(`\n` + line)
  console.log(paddedText)
  console.log(line)
}

(async function main() {
  const player1 = await getRandomCharacter();
  const player2 = await getRandomCharacter();

  generateHeader(`🏁🚨 Corrida entre ${player1.NAME} e ${player2.NAME} começou...`)
  // pause game
  await pauseForKeypress()

  await playRaceEngine(player1, player2);
  await declareWinner(player1, player2);

  process.exit(0)
})()