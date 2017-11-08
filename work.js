stats = [];
node = $("div[type='browsers']");
for (let nodeInd = 0; nodeInd < node.length; nodeInd++) { 
    let nodeId = $(node[nodeInd]).closest("div.proxy").find("p.proxyid").text();
    let stat = {
        nodeId: nodeId,
        browsers: []
    };
    //console.log(stat);
    let browsersByType = $(node[nodeInd]).find('p:not(.protocol)');
    for (let brTypeInd = 0; brTypeInd < browsersByType.length; brTypeInd++ ) {
        let allBrowsers = $(browsersByType[brTypeInd]).find("img");
        let busyBrowsers = $(browsersByType[brTypeInd]).find("img.busy");
        //let browserName = ($(allBrowsers[0]).attr("title")).match(/browserName=(.*?),/)[1]
		let browserName = ($(allBrowsers[0]).prop("currentSrc")).match(/.*\/(\w*)/)[1]
        let browser = {
            name: browserName,
            busy: busyBrowsers.length,
            total: allBrowsers.length
        };
        //console.log(browser);            
        stat.browsers.push(browser);
    }
    stats.push(stat);
}
//console.log(stats);
stats