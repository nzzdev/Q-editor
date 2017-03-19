let keypressSerie = undefined;
let runningEggs = {};

export function registerEastereggs(eastereggConfig) {
  if (!eastereggConfig || !eastereggConfig.hasOwnProperty('sounds')) {
    return;
  }

  if (!eastereggConfig.sounds.hasOwnProperty('bondTheme') && !eastereggConfig.sounds.hasOwnProperty('q')) {
    return;
  }

  document.addEventListener('keydown', (event) => {
    if (event.keyCode === 16) {
      keypressSerie = [];
    }

    if (keypressSerie !== undefined) {
      if (event.keyCode === 48 || event.keyCode === 55 || event.keyCode === 81) {
        keypressSerie.push(event.keyCode);
      }
      if (eastereggConfig.sounds.hasOwnProperty('bondTheme')) {
        if (keypressSerie.join('-') === '48-48-55') {
          if (runningEggs.bond) {
            if (runningEggs.bond.paused) {
              runningEggs.bond.play();
            } else {
              runningEggs.bond.pause();
            }
          } else {
            let bond = new Audio(eastereggConfig.sounds.bondTheme);
            runningEggs.bond = bond;
            bond.play();
          }
        }
      }
      if (eastereggConfig.sounds.hasOwnProperty('q')) {
        if (keypressSerie.join('-') === '81') {
          if (runningEggs.q) {
            if (runningEggs.q.paused) {
              runningEggs.q.play();
            } else {
              runningEggs.q.pause();
            }
          } else {
            let q = new Audio(eastereggConfig.sounds.q);
            runningEggs.q = q;
            q.play();
          }
        }
      }
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.keyCode === 16) {
      keypressSerie = undefined;
    }
  });
}
