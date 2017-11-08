function getCurrentTab(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    //var url = tab.url;
    //console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(tab);
  });
}

function displayData(d) {
  $("#data").empty();
  let data = d[0];
  for (let nodeInd = 0; nodeInd < data.length; nodeInd++) {
    let node = data[nodeInd];
    let nodeEl = $("#data").append(`<p class="nodeId">` + node.nodeId + `</p>`);
    for (let brInd = 0; brInd < node.browsers.length; brInd++) {
      let br = node.browsers[brInd];
      $(nodeEl).append(`<p class="browserData">` + br.name + `(` + br.busy + `/` + br.total + `)` + `</p>`);
    }
  }
}

function injectScripts(scripts, scriptCallback, injectionCallback) {
  if(scripts.length) {
    var script = scripts.shift();
    chrome.tabs.executeScript({
      file: script
    }, function(d) {
      if (typeof scriptCallback === "function" && scripts.length == 0) {
        scriptCallback(d);
      }
      if(chrome.runtime.lastError && typeof injectionCallback === "function") {
        injectionCallback(false); // Injection failed
      }
      injectScripts(scripts, scriptCallback, injectionCallback);
    });
  } else {
    if(typeof injectionCallback === "function") {
      injectionCallback(true);
    }
  }
}

function updateStats() {
  injectScripts(["node_modules/jquery/dist/jquery.min.js", "work.js"], displayData, null);
}

function refreshCurrentPage() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (arrayOfTabs) => {
    chrome.tabs.reload(arrayOfTabs[0].id, {}, updateStats);
  });
}

let currentTabId;

function getCurrentTabId(callback) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (arrayOfTabs) => {
	callback(arrayOfTabs[0].id);
  });
}



chrome.tabs.onUpdated.addListener()

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabId((id) => {
    currentTabId = id;
  });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    updateStats();
  })
  getCurrentTab((tab) => {
	let refreshAndUpdateBtn = document.getElementById('refreshAndUpdateBtn');
	refreshAndUpdateBtn.addEventListener('click', () => {
      refreshCurrentPage();
    });
  });
});
