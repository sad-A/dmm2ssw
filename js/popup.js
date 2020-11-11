 (function () {
  var match = false;
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.runtime.getManifest().content_scripts.forEach(function(cs) {
      cs.matches.forEach(function(url){
        url = url.replace("http://", "");
        url = url.replace("https://", "");
        url = url.replace("*.", "");
        url = url.replace(/\*/g, "");
        if(tabs[0].url.indexOf(url) != -1)
        {
          match = true;
          console.log("match: " + match);
        }
      });
    });
    if(!match)
    {
//      $('input').prop("disabled", true);
//      $('button').prop("disabled", true);
    }
    console.log("url: " + tabs[0].url);
  });
  var background = chrome.extension.getBackgroundPage();
  chrome.storage.sync.get(["out"], function(res){
    setTimeout(function() {
      if(match)
      {
        $("input[value='" + res.out + "']").prop("checked", true);
        if ($('input[name="radio"]:checked').val() == "label") {
          $('input[name="checkbox_renban"]').prop("disabled", false);
          $('input[name="checkbox_director"]').prop("disabled", false);
          $('input[name="checkbox_wiki"]').prop("disabled", true);
        } else if ($('input[name="radio"]:checked').val() == "actress") {
          $('input[name="checkbox_renban"]').prop("disabled", true);
          $('input[name="checkbox_director"]').prop("disabled", true);
          $('input[name="checkbox_wiki"]').prop("disabled", false);
        }
      }
    }, 10);
  });
  chrome.storage.sync.get(["is_renban"], function(res){
    $("input[name='checkbox_renban']").prop("checked", res.is_renban);
  });
  chrome.storage.sync.get(["is_director"], function(res){
    $("input[name='checkbox_director']").prop("checked", res.is_director);
  });
  chrome.storage.sync.get(["is_ignore_limited"], function(res){
    $("input[name='checkbox_ignore_limited']").prop("checked", res.is_ignore_limited);
  });
  chrome.storage.sync.get(["is_ignore_dod"], function(res){
    $("input[name='checkbox_ignore_dod']").prop("checked", res.is_ignore_dod);
  });
  chrome.storage.sync.get(["is_search_wiki"], function(res){
    $("input[name='checkbox_wiki']").prop("checked", res.is_search_wiki);
  });
  window.addEventListener("unload", function(event) {
    var out = $('input[name="radio"]:checked').val();
    var is_director = false;
    var is_ignore_limited = false;
    var is_ignore_dod = false;
    var is_search_wiki = false;
    var is_renban = false;
    is_renban = $('input[name="checkbox_renban"]').prop("checked");
    is_director = $('input[name="checkbox_director"]').prop("checked");
    is_ignore_limited = $('input[name="checkbox_ignore_limited"]').prop("checked");
    is_ignore_dod = $('input[name="checkbox_ignore_dod"]').prop("checked");
    is_search_wiki = $('input[name="checkbox_wiki"]').prop("checked");
    var store = {
      out: out,
      is_director: is_director,
      is_ignore_limited: is_ignore_limited,
      is_ignore_dod: is_ignore_dod,
      is_search_wiki: is_search_wiki,
      is_renban: is_renban
    };
    if(match)
    {
      background.chrome.storage.sync.set(store, function(){});
    }
  });
   $("#check").on("click", () => {
     chrome.tabs.query({
       active: true,
       currentWindow: true
     }, function (tabs) {
       var out = $('input[name="radio"]:checked').val();
       var is_director = false;
       var is_ignore_limited = false;
       var is_ignore_dod = false;
       var is_search_wiki = false;
       var is_renban = false;
       if (out == "label") {
         is_director = $('input[name="checkbox_director"]').prop("checked");
         is_renban = $('input[name="checkbox_renban"]').prop("checked");
       }
       is_ignore_limited = $('input[name="checkbox_ignore_limited"]').prop("checked");
       is_ignore_dod = $('input[name="checkbox_ignore_dod"]').prop("checked");
       if (out == "actress") {
         is_search_wiki = $('input[name="checkbox_wiki"]').prop("checked");
       }
       chrome.tabs.sendMessage(tabs[0].id, {
         type: "export",
         url: tabs[0].url,
         output: out,
         is_director: is_director,
         is_ignore_limited: is_ignore_limited,
         is_ignore_dod: is_ignore_dod,
         is_search_wiki: is_search_wiki,
         is_renban: is_renban
       });
       window.close();
     });
   });
   $("a").on("click", function() {
     var href = $(this).attr("href");
     chrome.tabs.create({
       active: true,
       url: href
     });
   });
   $('input[name="radio"]').change(function () {
     if(match)
     {
       if ($('input[name="radio"]:checked').val() == "label") {
         $('input[name="checkbox_renban"]').prop("disabled", false);
         $('input[name="checkbox_director"]').prop("disabled", false);
         $('input[name="checkbox_wiki"]').prop("disabled", true);
       } else if ($('input[name="radio"]:checked').val() == "actress") {
         $('input[name="checkbox_renban"]').prop("disabled", true);
         $('input[name="checkbox_director"]').prop("disabled", true);
         $('input[name="checkbox_wiki"]').prop("disabled", false);
       }
     }
   });
 }).call(this);
