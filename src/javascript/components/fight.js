import { controls } from '../../constants/controls';
import { createElement } from '../helpers/domHelper';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over

    const healthBarsContainer = document.getElementsByClassName('arena___health-bar');
    const healthBars = [...healthBarsContainer];
    const statusViewContainer = document.getElementsByClassName('arena___health-indicator');
    const statusViews = [...statusViewContainer];
    const statusInfo = {
      block: false,
      currentHealth: 100,
      timeOfCrit: Date.now(),
      criticalInput: [],
    };

    const playerOne = {
      ...firstFighter,
      ...statusInfo,
      healthBar: healthBars[0],
      statusView: statusViews[0],
      position: 'left',
    };

    const playerTwo = {
      ...secondFighter,
      ...statusInfo,
      healthBar: healthBars[1],
      statusView: statusViews[1],
      position: 'right',
    };

    function showStatus(fighter, text) {
      if (document.getElementById(`${fighter.position}-status-marker`)) {
        document.getElementById(`${fighter.position}-status-marker`).remove();
      }

      const statusMarker = createElement({
        tagName: 'div',
        className: 'arena___status-marker',
        attributes: { id: `${fighter.position}-status-marker` },
      });
      statusMarker.innerText = text;
      statusMarker.style.opacity = '1';
      fighter.statusView.append(statusMarker);
      setInterval(() => {
        if (statusMarker.style.opacity > 0) {
          statusMarker.style.opacity = statusMarker.style.opacity - 0.01;
        } else {
          statusMarker.remove();
        }
      }, 20);
    }

    function attackRelease(attacker, defender) {
      if (attacker.block) {
        showStatus(attacker, 'Why are you blockin`?');
        return void 0;
      }

      if (defender.block) {
        showStatus(defender, 'Blocked!');
        return void 0;
      }

      const totalDamage = getDamage(attacker, defender);

      if (!totalDamage) {
        showStatus(attacker, 'Missed!');
        return void 0;
      }

      if (attacker.critInput.length === 3) {
        showStatus(attacker, 'Critical hit!');
      }

      showStatus(defender, `-${totalDamage.toFixed(1)}`);
      defender.currentHealth = defender.currentHealth - (totalDamage / defender.health) * 100;
      if (defender.currentHealth <= 0) {
        document.removeEventListener('keydown', onDown);
        document.removeEventListener('keyup', onUp);
        resolve(attacker);
      }

      defender.healthBar.style.width = `${defender.currentHealth}%`;
    }

    function critHandler(fighter) {
      const currentTime = Date.now();

      if (currentTime - fighter.timeOfCrit < 10000) {
        return false;
      }

      if (!fighter.critInput.includes(event.code)) {
        fighter.critInput.push(event.code);
      }

      if (fighter.critInput.length === 3) {
        fighter.timeOfCrit = currentTime;
        return true;
      }
    }

    function onDown(event) {
      if (!event.repeat) {
        switch (event.code) {
          case controls.PlayerOneAttack: {
            attackRelease(playerOne, playerTwo);
            break;
          }

          case controls.PlayerTwoAttack: {
            attackRelease(playerTwo, playerOne);
            break;
          }

          case controls.PlayerOneBlock: {
            playerOne.block = true;
            break;
          }

          case controls.PlayerTwoBlock: {
            playerTwo.block = true;
            break;
          }
        }

        if (controls.PlayerOneCriticalHitCombination.includes(event.code)) {
          critHandler(playerOne) ? attackRelease(playerOne, playerTwo) : null;
        }

        if (controls.PlayerTwoCriticalHitCombination.includes(event.code)) {
          critHandler(playerTwo) ? attackRelease(playerTwo, playerOne) : null;
        }
      }
    }

    function onUp(event) {
      switch (event.code) {
        case controls.PlayerOneBlock:
          playerOne.block = false;
          break;
        case controls.PlayerTwoBlock:
          playerTwo.block = false;
          break;
      }

      if (playerOne.critInput.includes(event.code)) {
        playerOne.critInput.splice(playerOne.critInput.indexOf(event.code), 1);
      }

      if (playerTwo.critInput.includes(event.code)) {
        playerTwo.critInput.splice(playerTwo.critInput.indexOf(event.code), 1);
      }
    }

    document.addEventListener('keydown', onDown);
    document.addEventListener('keyup', onUp);
  });
}

export function getDamage(attacker, defender) {
  // return damage
  const demage = getHitPower(attacker) - getBlockPower(defender);
  return demage > 0 ? demage : 0;
}

export function getHitPower(fighter) {
  // return hit power
  const criticalChance = fighter.criticalInput === 3 ? 2 : Math.random() + 1;
  return fighter.attack * criticalChance;
}

export function getBlockPower(fighter) {
  // return block power
  return fighter.defence * Math.random() + 1;
}
