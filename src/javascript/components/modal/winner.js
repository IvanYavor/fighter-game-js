import { showModal } from './modal';

export function showWinnerModal(fighter) {
  // call showModal function

  const winnerInfo = {
    title: '...And The WINNER!',
    bodyElement: fighter.name,
  };

  showModal(winnerInfo);
}
