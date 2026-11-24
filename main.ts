// Make the AI Judge Laugh: the Office Joke Open.
//
// Writes one office joke to /output/entry.txt.
// Deterministic: no network, no randomness, no input.
// The joke must be a single line of 1-200 characters and contain
// no leading or trailing whitespace, per the bounty gate.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/** The entry text. Must stay byte-identical: do not edit the string. */
const OFFICE_JOKE =
  "The printer ran out of toner, so it printed a 40-page error report explaining why it can't print.";

const MAX_ENTRY_CHARS = 200;
const DEFAULT_OUTPUT_PATH = "/output/entry.txt";

/** Resolve the output path, overridable for local runs via OUTPUT_PATH. */
function resolveOutputPath(): string {
  return process.env.OUTPUT_PATH ?? DEFAULT_OUTPUT_PATH;
}

/** Fail with a message and a non-zero exit code. */
function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

/** Check the joke is non-empty and not only whitespace. */
function validateNonEmpty(text: string): void {
  if (text.length === 0 || text.trim().length === 0) {
    fail("joke is empty or only whitespace");
  }
}

/** Check the joke fits the 1-200 character gate. */
function validateLength(text: string): void {
  if (text.length > MAX_ENTRY_CHARS) {
    fail(
      `joke is ${text.length} characters, over the ${MAX_ENTRY_CHARS} limit`,
    );
  }
}

/** Check the joke is exactly one line with no stray whitespace. */
function validateSingleLine(text: string): void {
  if (text.includes("\n")) {
    fail("joke must be a single line");
  }
  if (text !== text.trim()) {
    fail("joke must not start or end with whitespace");
  }
}

/** Run every gate check on the entry text before writing anything. */
function validateEntry(text: string): void {
  validateNonEmpty(text);
  validateLength(text);
  validateSingleLine(text);
}

/** Write the joke to disk, creating the parent directory if needed. */
function writeEntry(text: string, outPath: string): void {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, text, "utf8");
}

/** Read the file back and confirm it holds exactly the joke, byte for byte. */
function verifyWritten(text: string, outPath: string): void {
  const written = readFileSync(outPath, "utf8");
  if (written !== text) {
    fail("written file does not match the joke exactly");
  }
}

function main(): void {
  validateEntry(OFFICE_JOKE);

  const outPath = resolveOutputPath();
  writeEntry(OFFICE_JOKE, outPath);
  verifyWritten(OFFICE_JOKE, outPath);

  console.log(`wrote ${OFFICE_JOKE.length} characters to ${outPath}`);
}

main();
