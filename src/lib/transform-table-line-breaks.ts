/**
 * Transforms markdown so that newlines within table cells are preserved.
 *
 * GFM tables treat each line as a row, so a literal newline breaks the table.
 * This preprocessor merges "continuation" lines (lines that don't start with |)
 * into the previous cell, replacing the newline with <br>.
 *
 * Example input:
 *   | Col1 | Col2 |
 *   |------|------|
 *   | Line 1
 *   Line 2 | B    |
 *
 * Becomes:
 *   | Col1 | Col2 |
 *   |------|------|
 *   | Line 1<br>Line 2 | B    |
 */
export function transformTableLineBreaks(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let inTable = false;
  let tableSeparatorSeen = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimStart();
    const isTableRow = trimmed.startsWith('|') && trimmed.endsWith('|');
    const isSeparator = isTableRow && /^\|[\s\-:]+\|/.test(trimmed);

    if (isTableRow && !inTable) {
      inTable = true;
      tableSeparatorSeen = false;
    }

    if (inTable) {
      if (isSeparator) {
        tableSeparatorSeen = true;
        result.push(line);
        continue;
      }

      if (isTableRow) {
        result.push(line);
        continue;
      }

      // Continuation line: doesn't start with |, but we're in a table body
      if (!trimmed.startsWith('|') && tableSeparatorSeen && result.length > 0) {
        const prevLine = result.pop()!;
        const firstPipeIdx = line.indexOf('|');

        if (firstPipeIdx === -1) {
          // Whole line is continuation of first cell
          result.push(prevLine + '<br>' + line.trim());
        } else {
          const cellContent = line.slice(0, firstPipeIdx).trimEnd();
          const rest = line.slice(firstPipeIdx); // "| cell2 | ..."
          result.push(prevLine + '<br>' + cellContent + rest);
        }
        continue;
      }

      // Not a table row - we've left the table
      inTable = false;
      tableSeparatorSeen = false;
    }

    result.push(line);
  }

  return result.join('\n');
}
