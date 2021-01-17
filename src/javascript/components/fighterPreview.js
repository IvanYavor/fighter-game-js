import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  // todo: show fighter info (image, name, health, etc.)
  const { attack, defense, health, name, source } = fighter;

  const imageElement = createFighterImage({ source, name });

  const fighterInfoElement = createElement({
    tagName: 'div',
    className: 'fighter-preview___info',
  });

  fighterInfoElement.innerHTML = `
  <p>Name: ${name}</p>
  <p>Attack: ${attack}</p>
  <p>Defense: ${defense}</p>
  <p>health: ${health}</p>
  `;

  fighterElement.append(imageElement, fighterInfoElement);

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name,
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
