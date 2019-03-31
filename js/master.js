/*
  Using JSDoc style for code documentation.
  https://github.com/jsdoc3/jsdoc
*/

// Navbar toggle.
document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }

});

/**
 * Make a prompt to make text copyable.
 * @param {string} text - Text to clipboard.
 * Source: https://stackoverflow.com/a/6055620
*/
function copyToClipboard(text) {
  window.prompt("Copy to clipboard", text);
}

/*
  Storage.
  Using Web Storage API (localStorage) and stringified JSON.
*/
// Name of localStorage item.
var localStorageItem = "settings";

/**
 * Initializes browser local storage.
*/
function makeLocalStorageItem() {
  // If localStorageItem does not exist it will create the JSON layout.
  if (!localStorage.getItem(localStorageItem)) {
    var settings = [
      // Standard entries.
      {
        "name": "ISO8601 UTC time",
        "value": "%Y-%m-%dT%H:%M:%SZ",
        "timezone": {
          "changeTimezone": true,
          "timezone": "+0000"
        }
      },
      {
        "name": "ISO8601 UTC time (filename friendly)",
        "value": "%Y_%m_%dT%H_%M_%SZ",
        "timezone": {
          "changeTimezone": true,
          "timezone": "+0000"
        }
      },
      {
        "name": "ISO8601 local time",
        "value": "%Y-%m-%dT%H:%M:%S%:z",
        "timezone": {
          "changeTimezone": false,
          "timezone": "+0000"
        }
      },
      {
        "name": "ISO8601 local time (date only)",
        "value": "%Y-%m-%d",
        "timezone": {
          "changeTimezone": false,
          "timezone": "+0000"
        }
      }
    ]

    localStorage.setItem(localStorageItem, JSON.stringify(settings));
  }
}

/**
 * Returns all settings from local storage.
 * @returns {object}
 */
function getSettings() {
  // Check if item exists, else create it.
  if (!localStorage.getItem(localStorageItem)) {
    makeLocalStorageItem();
  }

  return JSON.parse(localStorage.getItem(localStorageItem));
}

/**
 * Set local storage settings.
 * @param {object} settings - New settings to be set in local storage.
 */
function setSettings (settings) {
  localStorage.setItem(localStorageItem, JSON.stringify(settings));
}

/**
 * Reset storage.
 */
function resetEverything() {
  localStorage.removeItem(localStorageItem);
  document.getElementById("entriesList").innerHTML = "";
  getSettings();
  updateEntries();
}

/**
 * Returns output for entry.
 * @param {object} entry - Entry setting.
 * @returns {object}
 */
function getEntryOutput(entry) {
  if (entry["timezone"]["changeTimezone"] == true) {
    var timezone = strftime.timezone(entry["timezone"]["timezone"]);
    return timezone(entry["value"]);
  } else {
    return strftime(entry["value"]);
  }
}

/**
 * Function called multiple times every second to update entries.
 */
function updateEntries() {
  var settings = getSettings();
  var entriesList = document.getElementById("entriesList");
  if (entriesList.innerHTML == "") {
    // If entries list is empty create elements.
    for (var i = 0; i < settings.length; i++) {
      var entry = document.createElement("div");
      entry.classList = "columns is-multiline is-mobile";
      entry.innerHTML =
        '<h1 class="column is-full is-size-4">' + settings[i]["name"] + "</h1>" +
        '<div class="column is-narrow" style="width: 36px;text-align: center;"><i class="fas fa-angle-up"></i><i class="far fa-clipboard"></i><i class="fas fa-angle-down"></i><i class="fas fa-times"></i></div>' +
        '<span class="column">' + getEntryOutput(settings[i]) + "</span>"
      ;
      entriesList.appendChild(entry);
    }
  } else {
    // If entries already created continue.
    var entriesListSpans = entriesList.querySelectorAll("span");
    for (var i = 0; i < settings.length; i++) {
      entriesListSpans[i].innerHTML = getEntryOutput(settings[i]);
    }
  }
}
// Init run.
updateEntries();

document.querySelector("#entriesList").addEventListener("click", entriesListEvent, false);
function entriesListEvent(e) {
  var settings = getSettings();

  child = e.target.parentElement.parentElement;
  var i = 0;
  while((child = child.previousSibling) != null) {
    i++;
  }

  if (e.target.classList.contains('fa-clipboard')) {
    var entriesList = document.getElementById("entriesList");
    var entriesListSpans = entriesList.querySelectorAll("span");
    copyToClipboard(entriesListSpans[i].innerHTML);
  } else if (e.target.classList.contains('fa-times')) {
    settings.splice(i, 1);
    document.getElementById("entriesList").innerHTML = "";
    setSettings(settings);
  }

  e.stopPropagation();
}

// Click.
document.getElementById("resetEverything").addEventListener("click", resetEverything);

// Update loop.
window.setInterval(function(){
  updateEntries();
}, 100);
