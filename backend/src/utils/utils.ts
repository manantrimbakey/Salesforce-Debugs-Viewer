import { URL } from "url";
import path from "path";
import stripAnsi from "strip-ansi";

/**
 * Resolves the path to an HTML file based on the current environment
 *
 * @param {string} htmlFileName - The name of the HTML file to resolve
 * @returns {string} The resolved URL path to the HTML file
 * - In development: Returns a localhost URL with the specified port (default 1212)
 * - In production: Returns a file:// URL pointing to the renderer directory
 */
export function resolveHtmlPath(htmlFileName: string): string {
    if (process.env.NODE_ENV === "development") {
        const port = process.env.PORT || 1212;
        const url = new URL(`http://localhost:${port}`);
        url.pathname = htmlFileName;
        return url.href;
    }
    return `file://${path.resolve(__dirname, "../renderer/", htmlFileName)}`;
}

/**
 * Removes ANSI escape codes from a string
 *
 * @param {string} str - The input string containing ANSI escape codes
 * @returns {string} The cleaned string with all ANSI escape codes removed
 * @description ANSI escape codes are used for terminal text formatting and colors.
 * This function strips them out to get plain text.
 */
export function removeAnsiCodes(str: string): string {
    return stripAnsi(str);
}
