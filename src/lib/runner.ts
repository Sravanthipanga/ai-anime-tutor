/** Run JavaScript-flavoured exercise code in the browser and capture
 *  console.log output. Uses a Function call with a captured console —
 *  no server execution, no eval of anything except the user's own code
 *  in their own browser tab. */
export function runJavaScript(code: string): { output: string[]; error: string | null } {
  const output: string[] = [];
  const fakeConsole = {
    log: (...args: unknown[]) => output.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
  };
  try {
    const fn = new Function("console", `"use strict";\n${code}`);
    fn(fakeConsole);
    return { output, error: null };
  } catch (err) {
    return { output, error: err instanceof Error ? err.message : String(err) };
  }
}
