export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { log } = await import("./lib/logger");
    const { createConsoleMethod } = await import("./lib/logger/utils/console");

    console.error = createConsoleMethod(log, "error");
    console.log = createConsoleMethod(log, "log");
    console.info = createConsoleMethod(log, "info");
    console.warn = createConsoleMethod(log, "warn");
    console.debug = createConsoleMethod(log, "debug");
  }
}
