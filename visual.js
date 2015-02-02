// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    pageDB.open(refreshVisual);
});

// Refresh page once a second
window.setInterval(function(){
    pageDB.open(refreshVisual);
}, 2500);

var task = "&#8984J to make a new task!";

chrome.extension.onRequest.addListener(
  function(request, sender) {
    if (request['task']) {
      task = request['task'];
    }
  });

// Update the list of todo items.
function refreshVisual() {  
  pageDB.fetchTabs(function(tabs) {
    document.getElementById('currentTask').innerHTML = "My current task: " + task;

    var tabList1 = document.getElementById('high-priority');
    tabList1.innerHTML = '';
    var tabList2 = document.getElementById('medium-priority');
    tabList2.innerHTML = '';
    var tabList3 = document.getElementById('low-priority');
    tabList3.innerHTML = '';

    for(var i = 0; i < tabs.length; i++) {
      // Read the tab items backwards (most recent first).
      var tab = tabs[tabs.length - i - 1];

      var a = document.createElement('a');
      if (tab.importance == 1) a.id = 'tabone-' + tab.timestamp;
      else if (tab.importance == 2) a.id = 'tabtwo-' + tab.timestamp;
      else if (tab.importance == 3) a.id = 'tabthree-' + tab.timestamp;
      a.className = "list-group-item";

      var info = document.createElement('a');
      info.innerHTML = tab.title + " || task: " + tab.task;
      info.href = tab.url;
      info.target = "_blank";

      a.appendChild(info);

      var space = document.createElement('span')
      space.innerHTML = '&nbsp;&nbsp;'

      a.appendChild(space);

      var x = document.createElement('button');
      x.setAttribute("class", 'close');
      x.innerHTML = 'Delete';
      x.setAttribute("data-id", tab.timestamp);

      a.appendChild(x);

      if (tab.importance == 1) tabList1.appendChild(a);
      else if (tab.importance == 2) tabList2.appendChild(a);
      else if (tab.importance == 3) tabList3.appendChild(a);

      x.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));
        pageDB.deleteTab(id, refreshVisual);
      });

    }

  });
}


