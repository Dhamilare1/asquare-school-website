// Creates (or updates the password of) a teacher account.
//
// Usage:
//   node src/seed.js "Mrs Adebayo" teacher@asquare.edu.ng SomeStrongPassword123
//
// or, without arguments, it will ask you the questions interactively.

require("dotenv").config();
const readline = require("readline");
const bcrypt = require("bcryptjs");
const db = require("./db");

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => {
    rl.close();
    resolve(answer);
  }));
}

async function main() {
  let [, , fullName, email, password] = process.argv;

  if (!fullName) fullName = await ask("Teacher's full name: ");
  if (!email) email = await ask("Teacher's email (used to log in): ");
  if (!password) password = await ask("Password for this teacher: ");

  email = email.trim().toLowerCase();
  const passwordHash = bcrypt.hashSync(password, 10);

  const existing = db.prepare("SELECT id FROM teachers WHERE email = ?").get(email);

  if (existing) {
    db.prepare("UPDATE teachers SET full_name = ?, password_hash = ? WHERE id = ?").run(
      fullName,
      passwordHash,
      existing.id
    );
    console.log(`\nUpdated existing teacher account: ${email}`);
  } else {
    db.prepare("INSERT INTO teachers (full_name, email, password_hash, role) VALUES (?, ?, ?, 'admin')").run(
      fullName,
      email,
      passwordHash
    );
    console.log(`\nCreated ADMIN account: ${email}`);
  }

  console.log(
    "They can now log in on the Teacher Login page with that email and password.\n" +
      "(Accounts created with this command-line tool are always admins — use the\n" +
      " 'Manage Teacher Accounts' page after logging in to add regular teacher accounts.)\n"
  );
}

main();
