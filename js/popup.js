 (function () {
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
