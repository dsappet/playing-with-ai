interface planet {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface gravity {
  pull: number; // The amount of pull from 0-1
  center: {
    x: number;
    y: number;
  };
}

const FUDGE_FACTOR = 10;

function findCenter(planet): { x: number; y: number } {
  return {
    x: planet.width / 2 + planet.x,
    y: planet.height / 2 + planet.y,
  };
}

export function findGravity({
  planets,
  galaxySize,
}: {
  planets: planet[];
  galaxySize: { width: number; height: number };
}): gravity {
  // We are just going to deal with the gravity of 1 planet, the first planet
  const planet = planets[0];

  // Figure out the "mass" of the planet and the galaxy
  const galaxyMass = galaxySize.width * galaxySize.height;

  const planetMass = planet.height * planet.width;

  // Based on mass, what is the gravity of the planet? How much of the galaxy is it?

  const gravityPull = planetMass / galaxyMass;

  return {
    pull: gravityPull * FUDGE_FACTOR,
    center: findCenter(planet),
  };
}
