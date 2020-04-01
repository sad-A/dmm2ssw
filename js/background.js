// Generated by CoffeeScript 1.8.0
(function () {
  var main_tab_id;
  var ids = [];
  var wiki_ids = [];
  var copy_list = [];
  var detail_info = {};
  var wiki_msg = {};
  var result;
  var is_search_wiki;
  var is_search_release_with_wiki;
  var is_replace_http;
  var is_add_www;
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


  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log("message received: " + msg.type);
    if (msg.type == "to_parse") {
      main_tab_id = sender.tab.id;
      output = msg.output;
      is_search_wiki = msg.is_search_wiki;
      is_search_release_with_wiki = msg.is_search_release_with_wiki;
      parseDetail(sender.tab.id, msg.url);
      return true;
    } else if (msg.type == "open_detail") {
      main_tab_id = sender.tab.id;
      output = msg.output;
      is_search_wiki = msg.is_search_wiki;
      is_search_release_with_wiki = msg.is_search_release_with_wiki;
      is_replace_http = msg.is_replace_http;
      is_add_www: msg.is_add_www;
      // 作品のページを新しいタブで開く
      chrome.tabs.create({
        active: false,
        url: msg.link
      }, function (tab) {
        ids.push(tab.id);
        console.log("tab id: " + tab.id);
      });
      return true;
    } else if (msg.type == "open_next_wiki") {
      // 女優まとめページのときはwikiからレーベル／シリーズまとめページを検索
      if (output.indexOf("actress") != -1) {
        wiki_msg = msg;
        var res = searchSougouWiki(sender, msg.suburl);
        console.log("send response: " + msg.type + " to: " + sender.tab.id);
        sendResponse({
          close: false
        });
      } else {
        console.log("send response: " + msg.type + " to: " + sender.tab.id);
        sendResponse({
          close: true
        });
      }
      return true;
    }
    // シリーズ一覧を取得済
    else if (msg.type == "send_detail") {
      console.log("send message: result to: " + main_tab_id);
      chrome.tabs.sendMessage(main_tab_id, {
        type: "result",
        output: msg.output,
        is_search_wiki: msg.is_search_wiki,
        is_search_release_with_wiki: msg.is_search_release_with_wiki,
        url: msg.url,
        title: msg.title,
        cast: msg.cast,
        anothername: msg.anothername,
        threesize: msg.threesize,
        director: msg.director,
        label: msg.label,
        maker: msg.maker,
        series: msg.series,
        wiki_label: msg.wiki_label,
        wiki_series: msg.wiki_series,
        hinban: msg.hinban,
        prefix: msg.prefix,
        number: msg.number,
        smallimg: msg.smallimg,
        largeimg: msg.largeimg,
        release: msg.release,
        broadcast_release: msg.broadcast_release,
        duration: msg.duration,
        genre: msg.genre,
        service: msg.service,
        is_omnibus: msg.is_omnibus,
        is_iv: msg.is_iv,
        is_vr: msg.is_vr,
        is_adultsite: msg.is_adultsite,
        is_exdvd: msg.is_exdvd,
        is_exbroadcast: msg.is_exbroadcast,
        is_limited: msg.is_limited,
        is_dod: msg.is_dod,
        is_title_fixed: msg.is_title_fixed,
        is_replace_http: is_replace_http,
        is_add_www: is_add_www
      });
      
      console.log("send response: " + msg.type + " to: " + sender.tab.id);
      sendResponse();
      return true;
    }
    
    else if(msg.type == "upload_to_sougouwiki")
    {
       getUploadWikiLink(msg.cast, msg.castencoded, msg.classname);
    }
  });
  chrome.tabs.onUpdated.addListener(function (tabid, info, tab) {
    if (info.status == "complete") {
      // 新しい作品ページの読み込み完了時はtab_openとnext_tabを送信
      for (var i = 0; i < ids.length; i++) {
        if (tabid == ids[i]) {
          parseDetail(tabid, tab.url);
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
 
  function parseDetail(tabid, to_url)
  {
    console.log("send message: parse_detail to: " + tabid);
    chrome.tabs.sendMessage(tabid, {
      type: "parse_detail",
      output: output,
      is_search_wiki: is_search_wiki,
      is_search_release_with_wiki: is_search_release_with_wiki,
      is_replace_http: is_replace_http,
      is_add_www: is_add_www,
      url: to_url,
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
  }

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
 
  function searchSougouWiki(sender, url) {
    var x = new XMLHttpRequest();
    x.open('GET', "http://sougouwiki.com/search?keywords=" + url);
    x.onload = function () {
      var html = $.parseHTML(x.response);
      var result = 0;
      var text = $(html).find("div#main").text();
      if (text.length > 0) {
        if (text.indexOf("該当するページは見つかりませんでした") != -1) {
          console.log("not found: " + url);
          result = 0;
        } else {
          $(html).find("div.result-box p.title strong").each(function () {
            var text = $(this).text();
            console.log("text: " + text);
            if (text.indexOf(url) != -1) {} else {
              result = parseInt(text, 10);
            }
          });
        }
      }
      console.log("result: " + result);
      var found = false;
      var wiki_label = "";
      var wiki_series = "";
      var start_searching_release = false;
      if (result == 0) {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: "found_page_list",
          wiki_label: wiki_label,
          wiki_series: wiki_series,
          release: "",
          smallimg: "",
          largeimg: "",
          cast: []
        });
        return;
      }
      $(html).find("h3.keyword").each(function () {
        var text = $(this).text();
        console.log("text: " + text);
        text = text.replace(/\r?\n/g, '');
        if (text.length > 0) {
          // ページ名にレーベル名を含む場合はレーベルリストへ
          if (wiki_msg.label.length > 0 && wiki_msg.label != "----" && text.indexOf(wiki_msg.label) != -1) {
            wiki_label = text;
            found = true;
            console.log("is include label: " + wiki_label);
            // 日付を調べる場合
            if(is_search_release_with_wiki && !start_searching_release)
            {
              start_searching_release = true;
              var findurl = $(this).find("a").attr("href");
              console.log("let's find the release on " + findurl);
              findReleaseWithWiki(sender, findurl, url, wiki_label, wiki_series);
            }
          }
          // ページ名にメーカー名を含む場合はレーベルリストへ
          else if (wiki_msg.maker.length > 0 && wiki_msg.maker != "----" && text.indexOf(wiki_msg.maker) != -1) {
            wiki_label = text;
            found = true;
            console.log("is include maker: " + wiki_label);
            // 日付を調べる場合
            if(is_search_release_with_wiki && !start_searching_release)
            {
              start_searching_release = true;
              var findurl = $(this).find("a").attr("href");
              console.log("let's find the release on " + findurl);
              findReleaseWithWiki(sender, findurl, url, wiki_label, wiki_series);
            }
          }
          // ページ名にプレフィックスを含む場合はレーベルリストへ
          else if (wiki_msg.prefix.length > 0 && text.indexOf(wiki_msg.prefix) != -1) {
            wiki_label = text;
            found = true;
            console.log("is include prefix: " + wiki_label);
            // 日付を調べる場合
            if(is_search_release_with_wiki && !start_searching_release)
            {
              start_searching_release = true;
              var findurl = $(this).find("a").attr("href");
              console.log("let's find the release on " + findurl);
              findReleaseWithWiki(sender, findurl, url, wiki_label, wiki_series);
            }
          }
          // ページ名にシリーズ名を含む場合はシリーズリストへ
          else if (wiki_msg.series.length > 0 && wiki_msg.series != "----" && text.indexOf(wiki_msg.series) != -1) {
            wiki_series = text;
            found = true;
            console.log("is include series: " + wiki_series);
            // 日付を調べる場合
            if(is_search_release_with_wiki && !start_searching_release)
            {
              start_searching_release = true;
              var findurl = $(this).find("a").attr("href");
              console.log("let's find the release on " + findurl);
              findReleaseWithWiki(sender, findurl, url, wiki_label, wiki_series);
            }
          }
        }
      });
      if (found) {
        if(!start_searching_release)
        {
          console.log("send found_page_list to: " + sender.tab.id);
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "found_page_list",
            wiki_label: wiki_label,
            wiki_series: wiki_series,
            release: "",
            smallimg: "",
            largeimg: "",
            cast: []
          });
          return;
        }
      } else {
        // 次のページがあれば、次のページを開く
        var next_url = $(html).find("div.paging-top a:last").attr("href");
        if (next_url && next_url.length > 0 && next_url.indexOf(baseurl_ssw) != -1) {
          searchSougouWiki(sender, next_url);
          return;
        }
        // 次のページもない場合は、空でも良いのでそのまま送信
        else
        {
          console.log("send found_page_list to: " + sender.tab.id);
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "found_page_list",
            wiki_label: wiki_label,
            wiki_series: wiki_series,
            release: "",
            smallimg: "",
            largeimg: "",
            cast: []
          });
         return;
        }
      }
    }
    x.send();
  }
 
  function findReleaseWithWiki(sender, findurl, searchurl, wiki_label, wiki_series) {
    var x = new XMLHttpRequest();
    x.open('GET', findurl);
    x.onload = function () {
      var html = $.parseHTML(x.response);
      $(html).find("a").each( function() {
        var href = $(this).attr("href");
        var smallimg = "";
        var largeimg = "";
        if(href && href.indexOf(searchurl) != -1)
        {
          var release = $(this).parent().next().next().next().next().text();
          var cast = $(this).parent().next().next().next().text();
          // Perfect-Gの場合
          if(searchurl.indexOf("g-area") != -1)
          {
              // 直リンOK
//            largeimg = $(this).parent().next().find("img").attr("src");
//            smallimg = "&ref(" + largeimg + ", 147)";
          }
          // 舞ワイフの場合
          else if(searchurl.indexOf("mywife") != -1)
          {
            cast = $(this).parent().next().next().text();
          }
          // RealFileの場合
          else if(searchurl.indexOf("r-file") != -1)
          {
//            largeimg = $(this).parent().next().next().find("img").attr("src");
//            smallimg = "&ref(" + largeimg + ", 147)";
          }
          // HimeMixの場合
          else if(searchurl.indexOf("himemix") != -1)
          {
            release = ""; // releaseはサイトにあるので不要
          }
          // GIRL'S BLUEの場合
          else if(searchurl.indexOf("girls-blue") != -1)
          {
//            largeimg = $(this).parent().next().find("img").attr("src");
//            smallimg = "&ref(" + largeimg + ", 147)";
          }
          // Happy Fishの場合
          else if(searchurl.indexOf("h-fish") != -1)
          {
            release = $(this).parent().next().next().next().text();
            cast = $(this).parent().next().next().text();
          }
          else if(searchurl.indexOf("tokyo-247") != -1)
          {
            cast = $(this).parent().next().next().text();
          }
          cast = cast.replace(/\?/g, "");
          cast = cast.split(",");
          release = release.replace(/-/g, "/");
          release = release.replace(/^0-9\//g, "");
          console.log("found! release: " + release);
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "found_page_list",
            wiki_label: wiki_label,
            wiki_series: wiki_series,
            release: release,
            smallimg: smallimg,
            largeimg: largeimg,
            cast: cast
          });
          return;
        }
      });
    }
    x.send();
  }
 
  function getUploadWikiLink(cast, castencoded, classname)
  {
    var x = new XMLHttpRequest();
    var searchurl = "http://sougouwiki.com/search?search_target=page_name&keywords=" + castencoded;
    console.log(searchurl);
    x.open('GET', searchurl);
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
            if (text.indexOf(cast) != -1) {} else {
              result = parseInt(text, 10);
            }
          });
        }
      }
      console.log("upload finding wiki result: " + result);
      var found = false;
      if (result == 0) {
        return;
      }
      $(html).find("h3.keyword").each(function ()
      {
        var text = $(this).text();
        console.log("text: " + text);
        text = text.replace(/\r?\n/g, '');
        if (text.length > 0)
        {
          // ページ名に女優名を含む場合はそのページを解析
          if (cast.length > 0 && text.indexOf(cast) != -1)
          {
            var xx = new XMLHttpRequest();
            var findurl = $(this).find("a").attr("href");
            console.log("goto: " + findurl);
            xx.open('GET', findurl);
            xx.onload = function () {
              var html_inner = $.parseHTML(xx.response);
              var article_id = $(html_inner).find("ul#navigation-m").children("li.edit").children("a").attr("href");
              article_id = parseInt(article_id.substr(article_id.indexOf("id") + 3));
              console.log("article id: " + article_id);
              
              var uploadlink = "https://seesaawiki.jp/w/sougouwiki/e/attachment?id=" + article_id;
              console.log("send message: uploadlink to: " + main_tab_id);
              chrome.tabs.sendMessage(main_tab_id, {
                type: "uploadlink",
                uploadlink: uploadlink,
                classname: classname
              });
            }
            xx.send();
          }
        }
      });
    }
    x.send();
  }
}).call(this);
