let targetPokemon = null;
let guessesLeft = 10;
const maxGuesses = 10;

async function startGame() {
  guessesLeft = maxGuesses;

  document.getElementById("results").innerHTML = "";
  document.getElementById("message").innerText = "";
  document.getElementById("guessesLeft").innerText = guessesLeft;
  document.getElementById("game").classList.remove("hidden");

  const gen = document.getElementById("generation").value;
  let max = gen === "1" ? 151 : 1025;

  const randomId = Math.floor(Math.random() * max) + 1;

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  targetPokemon = await res.json();

  console.log("Target:", targetPokemon.name);
}

async function submitGuess() {
  if (!targetPokemon || guessesLeft <= 0) return;

  const input = document.getElementById("guessInput");
  const guessName = input.value.toLowerCase().trim();
  input.value = "";

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${guessName}`);
    const guess = await res.json();
    evaluateGuess(guess);
  } catch {
    alert("Pokémon not found!");
  }
}

function evaluateGuess(guess) {
  guessesLeft--;
  document.getElementById("guessesLeft").innerText = guessesLeft;

  const row = document.createElement("div");
  row.className = "guess-row";

  const guessGen = getGeneration(guess.id);
  const targetGen = getGeneration(targetPokemon.id);

  const guessTypes = guess.types.map(t => t.type.name);
  const targetTypes = targetPokemon.types.map(t => t.type.name);

  row.appendChild(makeBox(guessGen, compareExact(guessGen, targetGen)));
  row.appendChild(makeBox(
    guessTypes[0] || "-",
    compareExact(guessTypes[0], targetTypes[0])
  ));
  row.appendChild(makeBox(
    guessTypes[1] || "-",
    compareExact(guessTypes[1], targetTypes[1])
  ));
  row.appendChild(makeBox(
    formatNumber(guess.height, targetPokemon.height),
    compareNumber(guess.height, targetPokemon.height)
  ));
  row.appendChild(makeBox(
    formatNumber(guess.weight, targetPokemon.weight),
    compareNumber(guess.weight, targetPokemon.weight)
  ));

  document.getElementById("results").appendChild(row);

  if (guess.name === targetPokemon.name) {
    document.getElementById("message").innerText = "You Won!";
    guessesLeft = 0;
  } else if (guessesLeft === 0) {
    document.getElementById("message").innerText =
      "You Lost! It was " + targetPokemon.name;
  }
}

function makeBox(text, state) {
  const div = document.createElement("div");
  div.className = "box " + state;
  div.innerText = text;
  return div;
}

function compareExact(a, b) {
  return a === b ? "correct" : "wrong";
}

function compareNumber(guess, target) {
  if (guess === target) return "correct";
  if (guess < target) return "partial"; // too small
  return "wrong"; // too large
}

function formatNumber(guess, target) {
  if (guess === target) return guess;
  if (guess < target) return guess + " ↑";
  return guess + " ↓";
}

function getGeneration(id) {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  return 9;
}