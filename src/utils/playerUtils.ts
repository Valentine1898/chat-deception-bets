const adjectives = [
  "Swift", "Clever", "Wise", "Bright", "Sharp", "Quick", "Bold", "Keen", 
  "Smart", "Agile", "Witty", "Astute", "Shrewd", "Nimble", "Adept"
];

const scientists = [
  "Turing", "Einstein", "Curie", "Newton", "Tesla", "Bohr", "Hawking",
  "Feynman", "Lovelace", "Darwin", "Planck", "Heisenberg", "Schrödinger"
];

export const generateAlias = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const scientist = scientists[Math.floor(Math.random() * scientists.length)];
  return `${adjective} ${scientist}`;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};