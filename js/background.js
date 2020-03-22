// Generated by CoffeeScript 1.8.0
(function () {
  var main_tab_id;
  var ids = [];
  var wiki_ids = [];
  var copy_list = [];
  var detail_info = {};
  var wiki_msg = {};
  var result;
  var output;
  var valnames = ["_IGNORE_PERFORMERS", "_FORCE_CHK_SALE_SR", "_FORCE_CHK_SALE_MK", "_RENTAL_PRECEDES", "_HIDE_NAMES", "_GENRE_LIMITED", "_GENRE_DOD", "_GENRE_BD", "_GENRE_VR", "_GENRE_IV", "_GENRE_OMNI", "_OMIT_LABEL", "_OMIT_SERIES", "_OMIT_SUSS_4H", "_OMNI_PREFIX", "_OMITWORDS", "_ROOKIES", "_IV_PREFIX", "_REDIRECTS", "_NUMBERS_IN_PREFIX", "_CENSORED_WORDS"];
  var vals = {};

  function readSpreadSheet(pagename) {
    var ssurl = "https://script.google.com/macros/s/AKfycbyTDD_fXl3r9zENl0nXRXW4G10wss97dyFIukOe8A/exec?name=" + pagename;
    var x = new XMLHttpRequest();
    x.open('GET', ssurl);
    x.onload = function () {
      var val = x.response.split(',');
      console.log("pagename: " + pagename);
      console.log("getcell: " + val);
      if (val[0] == pagename) {
        for (var i = 2; i < val.length; i++) {
          console.log("val[" + i + "]:" + val[i]);
        }
      }
      vals[pagename] = val;
    }
    x.send();
  }
  for (var i = 0; i < valnames.length; i++) {
    readSpreadSheet(valnames[i]);
  }

  function searchSougouWiki(sender, url) {
    var x = new XMLHttpRequest();
    x.open('GET', url);
    x.onload = function () {
      var html = $.parseHTML(x.response);
      var result = 0;
      var text = $(html).find("div#main").text();
      if (text.length > 0) {
        if (text.indexOf("該当するページは見つかりませんでした") != -1) {
          console.log("not found");
          result = 0;
        } else {
          $(html).find("div.result-box p.title strong").each(function () {
            var text = $(this).text();
            console.log("text: " + text);
            if (text.indexOf("dmm.co.jp") != -1) {} else {
              result = parseInt(text, 10);
            }
          });
        }
      }
      console.log("result: " + result);
      var found = false;
      var label_list = "";
      var series_list = "";
      if (result == 0) {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: "found_page_list",
          label: label_list,
          series: series_list
        });
        return;
      }
      console.log("wiki_msg: " + wiki_msg.label);
      $(html).find("h3.keyword").each(function () {
        var text = $(this).text();
        console.log("text: " + text);
        text = text.replace(/\r?\n/g, '');
        if (text.length > 0) {
          console.log("found_label: " + text);
          // ページ名にレーベル名を含む場合はレーベルリストへ
          if (wiki_msg.label != "----" && text.indexOf(wiki_msg.label) != -1) {
            label_list = text;
            found = true;
            console.log("is include label");
          }
          // ページ名にメーカー名を含む場合はレーベルリストへ
          else if (wiki_msg.maker != "----" && text.indexOf(wiki_msg.maker) != -1) {
            label_list = text;
            found = true;
            console.log("is include maker");
          }
          // ページ名にプレフィックスを含む場合はレーベルリストへ
          else if (text.indexOf(wiki_msg.prefix) != -1) {
            label_list = text;
            found = true;
            console.log("is include prefix");
          }
          // ページ名にシリーズ名を含む場合はシリーズリストへ
          else if (wiki_msg.series != "----" && text.indexOf(wiki_msg.series) != -1) {
            series_list = text;
            found = true;
            console.log("is include series");
          }
        }
      });
      if (found) {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: "found_page_list",
          label: label_list,
          series: series_list
        });
        return;
      } else {
        // 次のページがあれば、次のページを開く
        var next_url = $(html).find("div.paging-top a:last").attr("href");
        if (next_url && next_url.length > 0 && next_url.indexOf(baseurl_ssw) != -1) {
          searchSougouWiki(sender, next_url);
          return;
        }
      }
    }
    x.send();
  }
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("message received: " + message.type);
    if (message.type == "to_parse") {
      main_tab_id = sender.tab.id;
      output = message.output;
      is_search_wiki = message.is_search_wiki;
      console.log("send message: parse_detail to: " + sender.tab.id);
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "parse_detail",
        output: output,
        is_search_wiki: is_search_wiki,
        url: message.url,
        _OMITWORDS: vals["_OMITWORDS"],
        _OMNI_PREFIX: vals["_OMNI_PREFIX"],
        _OMIT_SERIES: vals["_OMIT_SERIES"],
        _OMIT_LABEL: vals["_OMIT_LABEL"],
        _GENRE_LIMITED: vals["_GENRE_LIMITED"],
        _GENRE_DOD: vals["_GENRE_DOD"],
        _GENRE_BD: vals["_GENRE_BD"],
        _GENRE_IV: vals["_GENRE_IV"],
        _GENRE_VR: vals["_GENRE_VR"],
        _GENRE_OMNI: vals["_GENRE_OMNI"],
        _IGNORE_PERFORMERS: vals["_IGNORE_PERFORMERS"],
        _NUMBERS_IN_PREFIX: vals["_NUMBERS_IN_PREFIX"],
        _CENSORED_WORDS: vals["_CENSORED_WORDS"]
      });
      return true;
    } else if (message.type == "open_detail") {
      main_tab_id = sender.tab.id;
      output = message.output;
      is_search_wiki = message.is_search_wiki;
      // 作品のページを新しいタブで開く
      chrome.tabs.create({
        active: false,
        url: message.link
      }, function (tab) {
        ids.push(tab.id);
        console.log("tab id: " + tab.id);
      });
      return true;
    } else if (message.type == "open_next_wiki") {
      // 女優まとめページのときはwikiからレーベル／シリーズまとめページを検索
      if (output.indexOf("actress") != -1) {
        wiki_msg = message;
        var res = searchSougouWiki(sender, message.link);
        console.log("send response: " + message.type + " to: " + sender.tab.id);
        sendResponse({
          close: false
        });
      } else {
        console.log("send response: " + message.type + " to: " + sender.tab.id);
        sendResponse({
          close: true
        });
      }
      return true;
    }
    // シリーズ一覧を取得済
    else if (message.type == "send_detail") {
      console.log("send message: result to: " + main_tab_id);
      chrome.tabs.sendMessage(main_tab_id, {
        type: "result",
        output: message.output,
        is_search_wiki: message.is_search_wiki,
        url: message.url,
        title: message.title,
        cast: message.cast,
        anothername: message.anothername,
        threesize: message.threesize,
        director: message.director,
        label: message.label,
        maker: message.maker,
        series: message.series,
        wiki_label: message.wiki_label,
        wiki_series: message.wiki_series,
        hinban: message.hinban,
        prefix: message.prefix,
        number: message.number,
        smallimg: message.smallimg,
        largeimg: message.largeimg,
        release: message.release,
        broadcast_release: message.broadcast_release,
        duration: message.duration,
        genre: message.genre,
        service: message.service,
        is_omnibus: message.is_omnibus,
        is_iv: message.is_iv,
        is_vr: message.is_vr,
        is_adultsite: message.is_adultsite,
        is_limited: message.is_limited,
        is_dod: message.is_dod,
        is_title_fixed: message.is_title_fixed
      });
      
      console.log("send response: " + message.type + " to: " + sender.tab.id);
      sendResponse();
      return true;
    }
  });
  chrome.tabs.onUpdated.addListener(function (tabid, info, tab) {
    if (info.status == "complete") {
      // 新しい作品ページの読み込み完了時はtab_openとnext_tabを送信
      for (var i = 0; i < ids.length; i++) {
        if (tabid == ids[i]) {
          console.log("send message: parse_detail to: " + tabid);
          chrome.tabs.sendMessage(tabid, {
            type: "parse_detail",
            output: output,
            is_search_wiki: is_search_wiki,
            url: tab.url,
            _OMITWORDS: vals["_OMITWORDS"],
            _OMNI_PREFIX: vals["_OMNI_PREFIX"],
            _OMIT_SERIES: vals["_OMIT_SERIES"],
            _OMIT_LABEL: vals["_OMIT_LABEL"],
            _GENRE_LIMITED: vals["_GENRE_LIMITED"],
            _GENRE_DOD: vals["_GENRE_DOD"],
            _GENRE_BD: vals["_GENRE_BD"],
            _GENRE_IV: vals["_GENRE_IV"],
            _GENRE_VR: vals["_GENRE_VR"],
            _GENRE_OMNI: vals["_GENRE_OMNI"],
            _IGNORE_PERFORMERS: vals["_IGNORE_PERFORMERS"],
            _NUMBERS_IN_PREFIX: vals["_NUMBERS_IN_PREFIX"],
            _CENSORED_WORDS: vals["_CENSORED_WORDS"]
          });
          console.log("send message: next_tab to: " + main_tab_id);
          chrome.tabs.sendMessage(main_tab_id, {
            type: "next_tab",
            output: output,
            url: tab.url
          });
          console.log("tab open");
          ids.splice(i, 1);
        }
      }
    }
    return true;
  });
  chrome.alarms.onAlarm.addListener(function (alarm) {
    if (copy_list.length > 0) {
      saveToClipboard(copy_list[0]);
      copy_list.splice(0, 1);
    }
    return true;
  });

  function saveToClipboard(str) {
    // copy 用に textareaを作る
    var textArea = document.createElement("textarea");
    textArea.style.cssText = "position:absolute;left:-100%";
    document.body.appendChild(textArea);
    textArea.value = str;
    textArea.select();
    console.log("copy: " + str);
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
}).call(this);
