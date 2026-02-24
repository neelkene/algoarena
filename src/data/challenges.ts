import { supabase } from "@/integrations/supabase/client";

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

/* ---- Static fallback pool (expanded) ---- */
const fallbackChallenges: Challenge[] = [
  // Python Easy
  { id: "py-e1", language: "python", difficulty: "easy", prompt: "Print 'Hello World'", codeTemplate: "___('Hello World')", answer: "print", hint: "Use the print() function", damage: 15 },
  { id: "py-e2", language: "python", difficulty: "easy", prompt: "Create a list with 1, 2, 3", codeTemplate: "nums = ___", answer: "[1, 2, 3]", hint: "Use square brackets", damage: 15 },
  { id: "py-e3", language: "python", difficulty: "easy", prompt: "Get the length of a list", codeTemplate: "size = ___(my_list)", answer: "len", hint: "Use the len() function", damage: 15 },
  { id: "py-e4", language: "python", difficulty: "easy", prompt: "Convert to string", codeTemplate: "text = ___(42)", answer: "str", hint: "Use the str() function", damage: 15 },
  { id: "py-e5", language: "python", difficulty: "easy", prompt: "Get max value from list", codeTemplate: "biggest = ___([3,7,1])", answer: "max", hint: "Use the max() function", damage: 15 },
  // Python Medium
  { id: "py-m1", language: "python", difficulty: "medium", prompt: "Loop through a list", codeTemplate: "___ item in items:", answer: "for", hint: "Use a for loop", damage: 20 },
  { id: "py-m2", language: "python", difficulty: "medium", prompt: "Define a function called attack", codeTemplate: "___ attack():", answer: "def", hint: "Use the def keyword", damage: 20 },
  { id: "py-m3", language: "python", difficulty: "medium", prompt: "Check if x is greater than 10", codeTemplate: "if x ___ 10:", answer: ">", hint: "Use comparison operator", damage: 20 },
  { id: "py-m4", language: "python", difficulty: "medium", prompt: "Import the os module", codeTemplate: "___ os", answer: "import", hint: "Use the import keyword", damage: 20 },
  { id: "py-m5", language: "python", difficulty: "medium", prompt: "Add item to end of list", codeTemplate: "items.___(42)", answer: "append", hint: "Use the append method", damage: 20 },
  // Python Hard
  { id: "py-h1", language: "python", difficulty: "hard", prompt: "List comprehension: squares of 1-5", codeTemplate: "[x**2 ___ x in range(1,6)]", answer: "for", hint: "List comprehension syntax", damage: 30 },
  { id: "py-h2", language: "python", difficulty: "hard", prompt: "Handle an exception", codeTemplate: "try:\n  risky()\n___:\n  pass", answer: "except", hint: "Use try/except", damage: 30 },
  { id: "py-h3", language: "python", difficulty: "hard", prompt: "Create a lambda that doubles x", codeTemplate: "double = ___ x: x*2", answer: "lambda", hint: "Use the lambda keyword", damage: 30 },
  { id: "py-h4", language: "python", difficulty: "hard", prompt: "Open a file for reading", codeTemplate: "f = ___('data.txt', 'r')", answer: "open", hint: "Use the open() function", damage: 30 },
  // SQL Easy
  { id: "sq-e1", language: "sql", difficulty: "easy", prompt: "Select all columns from users", codeTemplate: "SELECT ___ FROM users;", answer: "*", hint: "Use the wildcard character", damage: 15 },
  { id: "sq-e2", language: "sql", difficulty: "easy", prompt: "Filter where age > 18", codeTemplate: "SELECT * FROM users ___ age > 18;", answer: "WHERE", hint: "Use the WHERE clause", damage: 15 },
  { id: "sq-e3", language: "sql", difficulty: "easy", prompt: "Add a new row to the table", codeTemplate: "___ INTO users VALUES (1, 'Ada');", answer: "INSERT", hint: "Use INSERT INTO", damage: 15 },
  { id: "sq-e4", language: "sql", difficulty: "easy", prompt: "Remove rows from a table", codeTemplate: "___ FROM users WHERE id = 5;", answer: "DELETE", hint: "Use DELETE FROM", damage: 15 },
  // SQL Medium
  { id: "sq-m1", language: "sql", difficulty: "medium", prompt: "Sort results by name ascending", codeTemplate: "SELECT * FROM users ___ name ASC;", answer: "ORDER BY", hint: "Use ORDER BY", damage: 20 },
  { id: "sq-m2", language: "sql", difficulty: "medium", prompt: "Count all rows in a table", codeTemplate: "SELECT ___(*) FROM users;", answer: "COUNT", hint: "Use an aggregate function", damage: 20 },
  { id: "sq-m3", language: "sql", difficulty: "medium", prompt: "Get unique values only", codeTemplate: "SELECT ___ name FROM users;", answer: "DISTINCT", hint: "Use DISTINCT keyword", damage: 20 },
  { id: "sq-m4", language: "sql", difficulty: "medium", prompt: "Limit results to 10 rows", codeTemplate: "SELECT * FROM users ___ 10;", answer: "LIMIT", hint: "Use the LIMIT clause", damage: 20 },
  // SQL Hard
  { id: "sq-h1", language: "sql", difficulty: "hard", prompt: "Join users with orders", codeTemplate: "SELECT * FROM users ___ orders ON users.id = orders.user_id;", answer: "JOIN", hint: "Use a JOIN", damage: 30 },
  { id: "sq-h2", language: "sql", difficulty: "hard", prompt: "Group results and filter groups", codeTemplate: "SELECT city, COUNT(*) FROM users GROUP BY city ___ COUNT(*) > 5;", answer: "HAVING", hint: "Use the HAVING clause", damage: 30 },
  { id: "sq-h3", language: "sql", difficulty: "hard", prompt: "Create a subquery", codeTemplate: "SELECT * FROM users WHERE id ___ (SELECT user_id FROM orders);", answer: "IN", hint: "Use the IN operator", damage: 30 },
  // C++ Easy
  { id: "cp-e1", language: "cpp", difficulty: "easy", prompt: "Output text to console", codeTemplate: "std::___ << \"Attack!\";", answer: "cout", hint: "Use cout for output", damage: 15 },
  { id: "cp-e2", language: "cpp", difficulty: "easy", prompt: "Declare an integer variable", codeTemplate: "___ health = 100;", answer: "int", hint: "Use the int type", damage: 15 },
  { id: "cp-e3", language: "cpp", difficulty: "easy", prompt: "Read input from user", codeTemplate: "std::___ >> name;", answer: "cin", hint: "Use cin for input", damage: 15 },
  { id: "cp-e4", language: "cpp", difficulty: "easy", prompt: "Return from main function", codeTemplate: "___ 0;", answer: "return", hint: "Use return statement", damage: 15 },
  // C++ Medium
  { id: "cp-m1", language: "cpp", difficulty: "medium", prompt: "Create a for loop from 0 to 9", codeTemplate: "for(int i=0; i<10; ___)", answer: "i++", hint: "Increment the counter", damage: 20 },
  { id: "cp-m2", language: "cpp", difficulty: "medium", prompt: "Include the iostream header", codeTemplate: "#___ <iostream>", answer: "include", hint: "Use the include directive", damage: 20 },
  { id: "cp-m3", language: "cpp", difficulty: "medium", prompt: "Declare a string variable", codeTemplate: "std::___ name = \"robot\";", answer: "string", hint: "Use the string type", damage: 20 },
  { id: "cp-m4", language: "cpp", difficulty: "medium", prompt: "Access element at index 0", codeTemplate: "int first = arr___0];", answer: "[", hint: "Use bracket notation", damage: 20 },
  // C++ Hard
  { id: "cp-h1", language: "cpp", difficulty: "hard", prompt: "Create a vector of integers", codeTemplate: "std::___<int> nums;", answer: "vector", hint: "Use the vector container", damage: 30 },
  { id: "cp-h2", language: "cpp", difficulty: "hard", prompt: "Create a pointer to an integer", codeTemplate: "int___ ptr = &value;", answer: "*", hint: "Use the dereference operator", damage: 30 },
  { id: "cp-h3", language: "cpp", difficulty: "hard", prompt: "Use a range-based for loop", codeTemplate: "for(auto& item ___ vec)", answer: ":", hint: "Use the colon in range-for", damage: 30 },
];

/* ---- AI-powered challenge generation ---- */
export async function getAIChallenge(language: string, difficulty: string): Promise<Challenge> {
  try {
    const { data, error } = await supabase.functions.invoke("generate-challenge", {
      body: { language, difficulty },
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);

    return data as Challenge;
  } catch (e) {
    console.warn("AI challenge failed, using fallback:", e);
    return getRandomChallenge(language, difficulty);
  }
}

/* ---- Static fallback ---- */
export function getRandomChallenge(language: string, difficulty: string): Challenge {
  const filtered = fallbackChallenges.filter(c => c.language === language && c.difficulty === difficulty);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export const challenges = fallbackChallenges;

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
