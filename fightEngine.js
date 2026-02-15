const WEIGHTS = {
  strength: 0.14,
  speed: 0.14,
  durability: 0.14,
  intelligence: 0.10,
  auraCapacity: 0.16,
  auraControl: 0.16,
  experience: 0.16,
};

const PHYSICAL = ["strength", "speed", "durability"];
const NEN = ["intelligence", "auraCapacity", "auraControl", "experience"];

const NEN_RING = [
  "Enhancer",
  "Transmuter",
  "Conjurer",
  "Specialist",
  "Manipulator",
  "Emitter",
];

function normalize(stat) {
  return stat / 100;
}

function getRingDistance(a, b) {
  const i1 = NEN_RING.indexOf(a);
  const i2 = NEN_RING.indexOf(b);
  const diff = Math.abs(i1 - i2);
  return Math.min(diff, NEN_RING.length - diff);
}

function getNenMultiplier(typeA, typeB) {
  const d = getRingDistance(typeA, typeB);
  if (d === 0) return 1.0;
  if (d === 1) return 1.03;
  if (d === 2) return 1.01;
  return 0.98;
}

function scoreFighter(fighter, opponentType) {
  let explanation = [];
  let physicalScore = 0;
  let nenScore = 0;

  explanation.push(`Fighter: ${fighter.name}`);
  explanation.push("1) Normalized stats:");

  for (let key in WEIGHTS) {
    const normalized = normalize(fighter.baseStats[key]);
    explanation.push(`   ${key}: ${fighter.baseStats[key]} → ${normalized.toFixed(2)}`);
  }

  explanation.push("2) Physical Score Calculation:");

  PHYSICAL.forEach(stat => {
    const part = WEIGHTS[stat] * normalize(fighter.baseStats[stat]);
    physicalScore += part;
    explanation.push(`   ${stat}: ${part.toFixed(4)}`);
  });

  explanation.push("3) Nen Score Calculation:");

  NEN.forEach(stat => {
    const part = WEIGHTS[stat] * normalize(fighter.baseStats[stat]);
    nenScore += part;
    explanation.push(`   ${stat}: ${part.toFixed(4)}`);
  });

  const multiplier = getNenMultiplier(fighter.nenType, opponentType);

  explanation.push(`4) Nen Multiplier: ${multiplier}`);
  explanation.push("5) Final Score = physical + (nen × multiplier)");

  const finalScore = physicalScore + (nenScore * multiplier);

  explanation.push(`   Final Score: ${finalScore.toFixed(4)}`);

  return {
    finalScore,
    multiplier,
    explanation,
  };
}

function simulateFight(fighterA, fighterB) {
  const A = scoreFighter(fighterA, fighterB.nenType);
  const B = scoreFighter(fighterB, fighterA.nenType);

  let winner = "Too close to call";
  if (Math.abs(A.finalScore - B.finalScore) >= 0.01) {
    winner = A.finalScore > B.finalScore ? fighterA.name : fighterB.name;
  }

  return {
    fighterA: A,
    fighterB: B,
    winner,
  };
}

module.exports = { simulateFight };
