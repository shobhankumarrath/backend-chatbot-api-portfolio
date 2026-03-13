import fs from "fs";
import path from "path";
export function loadKnowledge() {
  const filePath = path.join(process.cwd(), "knowledge", "resume.txt");

  return fs.readFileSync(filePath, "utf8");
}
