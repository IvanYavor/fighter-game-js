import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
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
