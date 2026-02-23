export interface Challenge {
  id: string;
  language: "python" | "sql" | "cpp";
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  codeTemplate: string;
  answer: string;
  hint: string;
  damage: number;
}

export const challenges: Challenge[] = [
  // Python Easy
  { id: "py-e1", language: "python", difficulty: "easy", prompt: "Print 'Hello World'", codeTemplate: "___('Hello World')", answer: "print", hint: "Use the print() function", damage: 15 },
  { id: "py-e2", language: "python", difficulty: "easy", prompt: "Create a list with 1, 2, 3", codeTemplate: "nums = ___", answer: "[1, 2, 3]", hint: "Use square brackets", damage: 15 },
  { id: "py-e3", language: "python", difficulty: "easy", prompt: "Get the length of a list", codeTemplate: "size = ___(my_list)", answer: "len", hint: "Use the len() function", damage: 15 },
  // Python Medium
  { id: "py-m1", language: "python", difficulty: "medium", prompt: "Loop through a list", codeTemplate: "___ item in items:", answer: "for", hint: "Use a for loop", damage: 20 },
  { id: "py-m2", language: "python", difficulty: "medium", prompt: "Define a function called attack", codeTemplate: "___ attack():", answer: "def", hint: "Use the def keyword", damage: 20 },
  { id: "py-m3", language: "python", difficulty: "medium", prompt: "Check if x is greater than 10", codeTemplate: "if x ___ 10:", answer: ">", hint: "Use comparison operator", damage: 20 },
  // Python Hard
  { id: "py-h1", language: "python", difficulty: "hard", prompt: "List comprehension: squares of 1-5", codeTemplate: "[x**2 ___ x in range(1,6)]", answer: "for", hint: "Think about list comprehension syntax", damage: 30 },
  { id: "py-h2", language: "python", difficulty: "hard", prompt: "Handle an exception", codeTemplate: "try:\n  risky()\n___:\n  pass", answer: "except", hint: "Use try/except", damage: 30 },
  // SQL Easy
  { id: "sq-e1", language: "sql", difficulty: "easy", prompt: "Select all columns from users", codeTemplate: "SELECT ___ FROM users;", answer: "*", hint: "Use the wildcard character", damage: 15 },
  { id: "sq-e2", language: "sql", difficulty: "easy", prompt: "Filter where age > 18", codeTemplate: "SELECT * FROM users ___ age > 18;", answer: "WHERE", hint: "Use the WHERE clause", damage: 15 },
  // SQL Medium
  { id: "sq-m1", language: "sql", difficulty: "medium", prompt: "Sort results by name ascending", codeTemplate: "SELECT * FROM users ___ name ASC;", answer: "ORDER BY", hint: "Use ORDER BY", damage: 20 },
  { id: "sq-m2", language: "sql", difficulty: "medium", prompt: "Count all rows in a table", codeTemplate: "SELECT ___(*)  FROM users;", answer: "COUNT", hint: "Use an aggregate function", damage: 20 },
  // SQL Hard
  { id: "sq-h1", language: "sql", difficulty: "hard", prompt: "Join users with orders", codeTemplate: "SELECT * FROM users ___ orders ON users.id = orders.user_id;", answer: "JOIN", hint: "Use a JOIN", damage: 30 },
  // C++ Easy
  { id: "cp-e1", language: "cpp", difficulty: "easy", prompt: "Output text to console", codeTemplate: "std::___ << \"Attack!\";", answer: "cout", hint: "Use cout for output", damage: 15 },
  { id: "cp-e2", language: "cpp", difficulty: "easy", prompt: "Declare an integer variable", codeTemplate: "___ health = 100;", answer: "int", hint: "Use the int type", damage: 15 },
  // C++ Medium
  { id: "cp-m1", language: "cpp", difficulty: "medium", prompt: "Create a for loop from 0 to 9", codeTemplate: "for(int i=0; i<10; ___)", answer: "i++", hint: "Increment the counter", damage: 20 },
  { id: "cp-m2", language: "cpp", difficulty: "medium", prompt: "Include the iostream header", codeTemplate: "#___ <iostream>", answer: "include", hint: "Use the include directive", damage: 20 },
  // C++ Hard
  { id: "cp-h1", language: "cpp", difficulty: "hard", prompt: "Create a vector of integers", codeTemplate: "std::___<int> nums;", answer: "vector", hint: "Use the vector container", damage: 30 },
];

export function getRandomChallenge(language: string, difficulty: string): Challenge {
  const filtered = challenges.filter(c => c.language === language && c.difficulty === difficulty);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export const stolenCodeRewards: Record<string, string[]> = {
  python: [
    "for enemy in enemies:",
    "attack()",
    "def shield(hp):",
    "while alive:",
    "import battle_ai",
  ],
  sql: [
    "SELECT * FROM arsenal;",
    "DELETE FROM enemies;",
    "UPDATE health SET hp=100;",
    "INSERT INTO skills VALUES('fire');",
  ],
  cpp: [
    "vector<int> targets;",
    "avoid_damage();",
    "class Robot {};",
    "auto power = max_level;",
  ],
};
