// Components 

function nodeComponent(id, browserComponents) {
  return `
    <div class="node-info-container">
      asdf asfd asd fasf asd fadsf asdf adf adf sdf sdf sdf sdf sdf sdf s fsd f
    </div>
    <div class="node-browsers">
      ${browserComponents.join("")}
    </div>
  `;
}

function browserComponent(name, img, ver, busyCount, totalCount) {
  return `
    <div class="browser-data">
      <div class="browser-icon-container">
        <img class="browser-img" src='node_modules/browser-logos/src/${name}/${name}_128x128.png' alt="${name}asdfasdfasadfasdfasdfasdf"/>
      </div>  
      ${name} (${busyCount}/${totalCount})
      <span>version: ${ver}</span>
    </div>
  `;
}

function getCurrentTab(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  p.tabs.query(queryInfo, (tabs) => {
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
    let brComps = [];
    for (let brInd = 0; brInd < node.browsers.length; brInd++) {
      let br = node.browsers[brInd];
      brComps.push(browserComponent(br.name, "", "", br.busy, br.total));
    }
    $("#data").append(nodeComponent(node.nodeId, brComps));
  }
}

function injectScripts(scripts, scriptCallback, injectionCallback) {
  if(scripts.length) {
    var script = scripts.shift();
    p.tabs.executeScript({
      file: script
    }, function(d) {
      //if (d && typeof scriptCallback === "function" && scripts.length == 0) {
        console.log("d: " + d);
        scriptCallback(d);
      //}
      if(p.runtime.lastError && typeof injectionCallback === "function") {
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
  let fakeData = [{
    nodeId: 'id : http://192.168.50.199:4444, OS : WIN10',
    browsers: [{
      name: 'chrome',
      busy: 5,
      total: 10
    },{
      name: 'firefox',
      busy: 15,
      total: 20
    },{
      name: 'ie',
      busy: 5,
      total: 20
    },{
      name: 'opera',
      busy: 5,
      total: 20
    },{
      name: 'edge',
      busy: 5,
      total: 20
    }]
  },{
    nodeId: 'id : http://192.168.50.199:4445, OS : WIN10',
    browsers: [{
      name: 'chrome',
      busy: 6,
      total: 10
    },{
      name: 'firefox',
      busy: 11,
      total: 20
    },{
      name: 'ie',
      busy: 7,
      total: 20
    }]
  },{
    nodeId: 'id : http://192.168.50.199:4446, OS : WIN10',
    browsers: [{
      name: 'chrome',
      busy: 6,
      total: 10
    }]
  }];

  injectScripts(["node_modules/jquery/dist/jquery.min.js", "work.js"], (d) => {
    displayData([fakeData]);
  }, null);
}

let p;
function refreshCurrentPage() {
  p.tabs.query({
    active: true,
    currentWindow: true
  }, (arrayOfTabs) => {
    p.tabs.reload(arrayOfTabs[0].id, {}, updateStats);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  p = chrome || browser;
  refreshCurrentPage();

  p.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    updateStats();
  })
  getCurrentTab((tab) => {
    let refreshAndUpdateBtn = document.getElementById('refreshAndUpdateBtn');
    refreshAndUpdateBtn.addEventListener('click', () => {
        refreshCurrentPage();
      });
  });
});
