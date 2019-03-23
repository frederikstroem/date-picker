/**
 * Make a prompt to make text copyable.
 * @param {string} text - Text to clipboard.
 * Source: https://stackoverflow.com/a/6055620
*/
function copyToClipboard(text) {
  window.prompt("Copy to clipboard", text);
}
