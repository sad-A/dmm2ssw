 (function () {
  var background = chrome.extension.getBackgroundPage();
  chrome.storage.sync.get(["out"], function(res){
                          $("input[value='" + res.out + "']").prop("checked", true);
                          if ($('input[name="radio"]:checked').val() == "label") {
                            $('input[name="checkbox_director"]').prop("disabled", false);
                            $('input[name="checkbox_wiki"]').prop("disabled", true);
                          } else if ($('input[name="radio"]:checked').val() == "actress") {
                            $('input[name="checkbox_director"]').prop("disabled", true);
                            $('input[name="checkbox_wiki"]').prop("disabled", false);
                          }
                          });
   chrome.storage.sync.get(["is_director"], function(res){
                           $("input[name='checkbox_director']").prop("checked", res.is_director);
                           });
   chrome.storage.sync.get(["is_ignore_same"], function(res){
                           $("input[name='checkbox_ignore']").prop("checked", res.is_ignore_same);
                           });
   chrome.storage.sync.get(["is_search_wiki"], function(res){
                           $("input[name='checkbox_wiki']").prop("checked", res.is_search_wiki);
                           });
  window.addEventListener("unload", function(event) {
    var out = $('input[name="radio"]:checked').val();
    var is_director = false;
    var is_ignore_same = false;
    var is_search_wiki = false;
    is_director = $('input[name="checkbox_director"]').prop("checked");
    is_ignore_same = $('input[name="checkbox_ignore"]').prop("checked");
    is_search_wiki = $('input[name="checkbox_wiki"]').prop("checked");
    var store = {
      out: out,
      is_director: is_director,
      is_ignore_same: is_ignore_same,
      is_search_wiki: is_search_wiki
    };
    background.chrome.storage.sync.set(store, function(){});
  });
   $("#check").on("click", () => {
     chrome.tabs.query({
       active: true,
       currentWindow: true
     }, function (tabs) {
       var out = $('input[name="radio"]:checked').val();
       var is_director = false;
       var is_ignore_same = false;
       var is_search_wiki = false;
       if (out == "label") {
         is_director = $('input[name="checkbox_director"]').prop("checked");
       }
       is_ignore_same = $('input[name="checkbox_ignore"]').prop("checked");
       if (out == "actress") {
         is_search_wiki = $('input[name="checkbox_wiki"]').prop("checked");
       }
       chrome.tabs.sendMessage(tabs[0].id, {
         type: "export",
         url: tabs[0].url,
         output: out,
         is_director: is_director,
         is_ignore_same: is_ignore_same,
         is_search_wiki: is_search_wiki
       });
       window.close();
     });
   });
   $('input[name="radio"]').change(function () {
     if ($('input[name="radio"]:checked').val() == "label") {
       $('input[name="checkbox_director"]').prop("disabled", false);
       $('input[name="checkbox_wiki"]').prop("disabled", true);
     } else if ($('input[name="radio"]:checked').val() == "actress") {
       $('input[name="checkbox_director"]').prop("disabled", true);
       $('input[name="checkbox_wiki"]').prop("disabled", false);
     }
   });
 }).call(this);
