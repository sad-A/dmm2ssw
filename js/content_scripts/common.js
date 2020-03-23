(function () {
  var link_list = [];
  var copy_list = [];
  var open_next_tab;
  var initialize;
  var send_detail_message;
  var send_to_parse;
  var url;
  var output;
  var self = false;
  var is_renban = false;
  var is_director = false;
  var is_ignore_limited = false;
  var is_ignore_dod = false;
  var is_search_wiki = false;
  var is_search_release_with_wiki = false;
  var is_first_product = false;
  var title = "";
  var service = "";
  var duration = "";
  var release = "";
  var broadcast_release = "";
  var director = "----";
  var label = "";
  var maker = "";
  var series = "";
  var cast = "";
  var anothername = "";
  var threesize = "";
  var genre = [];
  var hinban = "";
  var prefix = "";
  var number = 0;
  var sougouwikipage = "";
  var wiki_label = "";
  var wiki_series = "";
  var smallimg = "";
  var largeimg = "";
  var is_omnibus = false;
  var is_iv = false;
  var is_vr = false;
  var is_adultsite = false;
  var is_exbroadcast = false;
  var is_limited = false;
  var is_dod = false;
  var is_title_fixed = false;
  var title_list = [];
  var baseurl_dmm = "dmm.co.jp";
  var baseurl_mgs = "mgstage.com";
  var baseurl_perfectg = "g-area.org";
  var baseurl_mywife = "mywife.cc";
  var baseurl_realfile = "r-file.com";
  var baseurl_carib = "caribbeancom.com";
  var baseurl_pondotv = "1pondo.tv";
  var baseurl_ssw = "sougouwiki.com";
  var url_details = "-/detail/=/cid=";
  var url_list = "-/list/=/";
  var url_actress = "article=actress";
  var url_label = "article=label";
  var url_maker = "article=maker";
  var url_keyword = "article=keyword";
  var url_search = "-/search/=/";
  var mgsurl_detail = "product_detail";
  var mgsurl_search = "search/search.php";
  var perfectgurl_detail = "sample_pg";
  var mywifeurl_detail = "teigaku/model";
  var realfileurl_teigaku_detail = "teigaku/item";
  var realfileurl_tanpin_detail = "tanpin/item";
  var cariburl_detail = "moviepages";
  var cariburl_search = "search";
  var cariburl_searchact = "search_act";
  var cariburl_list = "listpages";
  var pondotvurl_detail = "movies";
  var pondotvurl_search = "search";
  var pondotvurl_list = "list";
 
  var servicedic = {
    "dvd": "mono/dvd",
    "rental": "rental",
    "video": "digital/video",
    "ama": "digital/videoc"
  }
  chrome.runtime.onMessage.addListener(function (msg, sender) {
    // exportボタンクリック時
    if (msg.type == "export") {
      initialize();
      url = msg.url;
      console.log("url: " + url);
      output = msg.output;
      is_renban = msg.is_renban;
      is_director = msg.is_director;
      is_ignore_limited = msg.is_ignore_limited;
      is_ignore_dod = msg.is_ignore_dod;
      is_search_wiki = msg.is_search_wiki;
      is_first_product = true;
      console.log("output: " + output);
      console.log("is_search_wiki: " + is_search_wiki);
      var adddiv = "<div id='dmm2ssw'></div>";
      // FANZAの場合
      if(url.indexOf(baseurl_dmm) != -1)
      {
        $("body").find("td#mu").prepend(adddiv);
      }
      //MGSの場合
      else if(url.indexOf(baseurl_mgs) != -1)
      {
        $("body").find("ul.Bread_crumb").prepend(adddiv);
        $("body").find("ul.Bread_crumb").removeClass().addClass("Bread_crumb");
      }
      // Perfect-Gの場合
      else if(url.indexOf(baseurl_perfectg) != -1)
      {
        // 個別ページのみ対応
        if(url.indexOf(perfectgurl_detail) != -1)
        {
          // 女優まとめページのみ対応
          if(output == "actress")
          {
            $("body").find("div.co_ww").first().prepend(adddiv);
          }
        }
      }
      // 舞ワイフの場合
      else if(url.indexOf(baseurl_mywife) != -1)
      {
        // 個別ページのみ対応
        if(url.indexOf(mywifeurl_detail) != -1)
        {
          // 女優まとめページのみ対応
          if(output == "actress")
          {
            $("body").find("div.model01").first().prepend(adddiv);
            $("body").find("div.model01").first().attr("style", "color: white");
          }
        }
      }
      // RealFileの場合
      else if(url.indexOf(baseurl_realfile) != -1)
      {
        // 個別ページのみ対応
        if(url.indexOf(realfileurl_teigaku_detail) != -1 || url.indexOf(realfileurl_tanpin_detail) != -1)
        {
          // 女優まとめページのみ対応
          if(output == "actress")
          {
            $("body").find("div#gallery_girl_intro").prepend(adddiv);
          }
        }
      }
      // カリビアンコムの場合
      else if(url.indexOf(baseurl_carib) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          $("body").find("div#main").prepend(adddiv);
        }
      }
      // 一本道の場合
      else if(url.indexOf(baseurl_pondotv) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          $("body").find("div.contents").first().prepend(adddiv);
        }
      }
      if (output == "label") {
        var labelmatome = "{| class=\"edit\"\n<br>|~NO|PHOTO|TITLE|ACTRESS|DIRECTOR|RELEASE|NOTE|\n<br>";
        if (!is_director) {
          labelmatome = "{| class=\"edit\"\n<br>|~NO|PHOTO|TITLE|ACTRESS|RELEASE|NOTE|\n<br>";
        }
        $("body").find("div#dmm2ssw").append(labelmatome);
        var basicdiv = '<div id="basic_works"></div>';
        $("body").find("div#dmm2ssw").append(basicdiv);
        var enddiv = "|}\n<br>";
        $("body").find("div#dmm2ssw").append(enddiv);
      } else if (output == "actress") {
        var basicdiv = '<div id="basic_works"></div>';
        var vrdiv = '<div id="vr_works" style="visibility:hidden">----\n<br>**VR作品\n<br></div>';
        var ivdiv = '<div id="iv_works" style="visibility:hidden">----\n<br>**イメージ作品\n<br></div>';
        var omnidiv = '<div id="omni_works" style="visibility:hidden">----\n<br>**総集編作品\n<br></div>';
        var adultsitediv = '<div id="adultsite_works" style="visibility:hidden">----\n<br>**アダルトサイト\n<br></div>';
        var exbroadcastdiv = '<div id="exbroadcast_works" style="visibility:hidden">----\n<br>**その他作品(配信系)\n<br></div>';
        // カリビアンコムと一本道の場合は「その他作品(配信系)」のみ
        if(url.indexOf(baseurl_carib) != -1 || url.indexOf(baseurl_pondotv) != -1)
        {
          $("body").find("div#dmm2ssw").append(exbroadcastdiv);
        }
        // MGSとPerfect-Gと舞ワイフの場合は「アダルトサイト」のみ
        else if(url.indexOf(baseurl_mgs) != -1 || url.indexOf(baseurl_perfectg) != -1 || url.indexOf(baseurl_mywife) != -1 || url.indexOf(baseurl_realfile) != -1)
        {
          $("body").find("div#dmm2ssw").append(adultsitediv);
        }
        // FANZAの場合
        else if(url.indexOf(baseurl_dmm) != -1)
        {
          $("body").find("div#dmm2ssw").append(basicdiv);
          $("body").find("div#dmm2ssw").append(vrdiv);
          $("body").find("div#dmm2ssw").append(ivdiv);
          $("body").find("div#dmm2ssw").append(omnidiv);
          $("body").find("div#dmm2ssw").append(adultsitediv);
        }
      }
      // FANZAの場合
      if (url.indexOf(baseurl_dmm) != -1) {
        // detail
        if (url.indexOf(url_details) != -1) {
          send_to_parse();
          return true;
        }
        // list search
        else if (url.indexOf(url_list) != -1 || url.indexOf(url_search) != -1) {
          $("p.tmb").each(function () {
            var href = $(this).find("a").attr("href");
            console.log(href);
            if(output == "label")
            {
              // 下を最新にするために、配列の先頭に追加
              link_list.unshift(href);
            }
            else
            {
              // 上を最新にするために、配列の先頭に追加
              link_list.push(href);
            }
          });
        }
      }
      // MGS動画の場合
      else if(url.indexOf(baseurl_mgs) != -1)
      {
        // detail
        if(url.indexOf(mgsurl_detail) != -1)
        {
          send_to_parse();
          return true;
        }
        // list
        else if(url.indexOf(mgsurl_search) != -1)
        {
          $("div.search_list").find("li").each( function() {
            var href = $(this).children("a").attr("href");
            if(href.indexOf(mgsurl_detail) != -1)
            {
              href = "https://www.mgstage.com/" + href;
              if(output == "label")
              {
                link_list.unshift(href);
              }
              else
              {
                link_list.push(href);
              }
            }
          });
        }
      }
      // Perfect-Gの場合
      else if(url.indexOf(baseurl_perfectg) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // 個別ページのみ対応
          if(url.indexOf(perfectgurl_detail) != -1)
          {
            is_search_release_with_wiki = true;
            send_to_parse();
            return true;
          }
        }
      }
      // 舞ワイフの場合
      else if(url.indexOf(baseurl_mywife) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // 個別ページのみ対応
          if(url.indexOf(mywifeurl_detail) != -1)
          {
            is_search_release_with_wiki = true;
            send_to_parse();
            return true;
          }
        }
      }
      // RealFileの場合
      else if(url.indexOf(baseurl_realfile) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // 個別ページのみ対応
          if(url.indexOf(realfileurl_teigaku_detail) != -1 || url.indexOf(realfileurl_tanpin_detail) != -1)
          {
            is_search_release_with_wiki = true;
            send_to_parse();
            return true;
          }
        }
      }
      // カリビアンコムの場合
      else if(url.indexOf(baseurl_carib) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(cariburl_detail) != -1)
          {
            send_to_parse();
            return true;
          }
          // list search searchact
          else if(url.indexOf(cariburl_list) != -1 || url.indexOf(cariburl_search) != -1 || url.indexOf(cariburl_searchact) != -1)
          {
            $("div.grid-item").find("div.meta-title").each( function() {
              var href = $(this).children("a").attr("href");
              if(href.indexOf(cariburl_detail) != -1)
              {
                href = "https://www.caribbeancom.com" + href;
                link_list.push(href);
              }
            });
          }
        }
      }
      // 一本道の場合
      else if(url.indexOf(baseurl_pondotv) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(pondotvurl_detail) != -1)
          {
            send_to_parse();
            return true;
          }
          // list search
          else if(url.indexOf(pondotvurl_list) != -1 || url.indexOf(pondotvurl_search) != -1)
          {
            $("div.grid-item").find("a.entry").each( function() {
              var href = $(this).attr("href");
              if(href.indexOf(pondotvurl_detail) != -1)
              {
                href = "https://www.1pondo.tv" + href;
                link_list.push(href);
              }
            });
          }
        }
      }
      open_next_tab();
      return true;
    }
    // 作品ページを解析
    else if (msg.type == "parse_detail") {
      url = msg.url;
      console.log("url: " + url);
      output = msg.output;
      is_search_wiki = msg.is_search_wiki;
      is_search_release_with_wiki = msg.is_search_release_with_wiki;
      wiki_label = "";
      wiki_series = "";
      // FANZAの場合
      if (url.indexOf(baseurl_dmm) != -1) {
        var cutoff = url.indexOf("?");
        if (cutoff != -1) {
          url = url.substr(0, cutoff);
        }
                                       
        // 指定されたページは見つかりませんの場合
        if($("title").text().indexOf("指定されたページが見つかりません") != -1)
        {
            window.close();
            return;
        }
        // タイトル取得
        title = $("h1#title").text();
        if(title == "")
        {
          title = $("meta[property='og:title'").attr("content");
        }
        is_title_fixed = false;
        for(var i = 2; i < msg._CENSORED_WORDS.length; i+= 2) {
          if(title.indexOf(msg._CENSORED_WORDS[i]) != -1)
          {
            title = title.replace(msg._CENSORED_WORDS[i], "<font color='red'>" + msg._CENSORED_WORDS[i + 1] + "</font>");
            is_title_fixed = true;
            i -= 2;
          }
        }
        console.log("title: " + title);
        // アダルトサイトチェック
        is_adultsite = false;
        if (url.indexOf("videoc") != -1 || url.indexOf("videoa") != -1) {
          is_adultsite = true;
        }
        for (var i = 0; i < msg._OMITWORDS.length; i += 2) {
          title = title.replace(msg._OMITWORDS[i], '');
        }
        for (var i = 0; i < msg._OMNI_PREFIX.length; i += 2) {
          // 総集編チェック
          is_omnibus = false;
          if (url.indexOf(msg._OMNI_PREFIX[i]) != -1) {
            is_omnibus = true;
            console.log("omni prefix:" + msg._OMNI_PREFIX[i]);
            break;
          }
        }
        var urlformer = url.substr(0, url.indexOf("=/"));
        var urllatter = url.substr(url.indexOf("/=/"));
        var use_ajax = false;
        if (url.indexOf("mono/dvd") != -1) {
          use_ajax = true;
        }
        var ajax_url = urlformer + "performer" + urllatter;
        $("script").each(function () {
          var text = $(this).text();
          if (text.indexOf("ajax-performer") != -1) {
            text = text.substr(text.indexOf("url: ") + 6);
            text = text.substr(0, text.indexOf("',"));
            ajax_url = "https://www.dmm.co.jp" + text;
            use_ajax = true;
            console.log(ajax_url);
          }
        });
        // imgを取得
        smallimg = $("img.tdmm").attr("src");
        largeimg = $("a.crs_full").attr("href");
        // たまにfullがない場合がある
        if (!largeimg) {
          largeimg = smallimg;
          // たまにsmallimgにjp.jpgが使われている
          if (smallimg.indexOf("jp.jpg") != -1) {
            smallimg = smallimg.replace("jp.jpg", "js.jpg");
          }
          console.log("smallimg: " + smallimg);
          console.log("largeimg: " + largeimg);
        }
        var more_cast = false;
        console.log("url: " + url);
        console.log("title: " + title);
        // 各種情報チェック
        $("td.nw").each(function () {
          var text = $(this).text();
          if (text.length > 0) {
            console.log("text:" + text);
            // 発売日
            if (text.indexOf("発売日") != -1) {
              release = $(this).next().text();
              release = release.replace(/\r?\n/g, '');
              console.log("release: " + release);
            // 配信開始日（発売日が存在しない場合はこちらを採用）
            } else if (text.indexOf("配信開始日") != -1) {
              broadcast_release = $(this).next().text();
              broadcast_release = broadcast_release.replace(/\r?\n/g, '');
              console.log("broadcast_release: " + broadcast_release);
            // 収録時間
            } else if (text.indexOf("収録時間") != -1) {
              duration = $(this).next().text();
              duration = duration.replace(/\r?\n/g, '');
              console.log("duration: " + duration);
            // ジャンル
            } else if (text.indexOf("ジャンル") != -1) {
              genre = $(this).next().text();
              genre = genre.replace(/\r?\n/g, '');
              genre = genre.replace(/\u00a0/g, ',');
              genre = genre.replace(/,,/g, ',');
              if (genre.lastIndexOf(",") == genre.length - 1) {
                genre = genre.substr(0, genre.length - 1);
              }
              // 総集編ジャンルチェック
              is_omnibus = false;
              for (var i = 3; i < msg._GENRE_OMNI.length; i += 2) {
                if (genre.indexOf(msg._GENRE_OMNI[i]) != -1) {
                  is_omnibus = true;
                  console.log("is omnibus");
                  break;
                }
              }
              // イメージビデオジャンルチェック
              is_iv = false;
              for (var i = 3; i < msg._GENRE_IV.length; i += 2) {
                if (genre.indexOf(msg._GENRE_IV[i]) != -1) {
                  is_iv = true;
                  console.log("is iv");
                  break;
                }
              }
              // VR作品ジャンルチェック
              is_vr = false;
              for (var i = 3; i < msg._GENRE_VR.length; i += 2) {
                if (genre.indexOf(msg._GENRE_VR[i]) != -1) {
                  is_vr = true;
                  console.log("is vr");
                  break;
                }
              }
              // 限定盤ジャンルチェック
              is_limited = false;
              for (var i = 3; i < msg._GENRE_LIMITED.length; i += 2) {
                if (genre.indexOf(msg._GENRE_LIMITED[i]) != -1) {
                  is_limited = true;
                  console.log("is limited: " + is_limited);
                  break;
                }
              }
              // DODジャンルチェック
              is_dod = false;
              for (var i = 3; i < msg._GENRE_DOD.length; i += 2) {
                if (genre.indexOf(msg._GENRE_DOD[i]) != -1) {
                  is_dod = true;
                  console.log("is dod: " + is_dod);
                  break;
                }
              }
              genre = genre.split(',');
              console.log("genre: " + genre);
            // 監督
            } else if (text.indexOf("監督") != -1) {
              director = $(this).next().text();
              director = director.replace(/\r?\n/g, '');
              console.log("director: " + director);
            // レーベル
            } else if (text.indexOf("レーベル") != -1) {
              label = $(this).next().text();
              label = label.replace(/\r?\n/g, '');
              label = label.replace("（", "／");
              label = label.replace("）", "");
              for (var i = 3; i < msg._OMIT_LABEL.length; i += 2) {
                // 総集編レーベル判定
                if (series.indexOf(msg._OMIT_LABEL[i]) != -1) {
                  is_omnibus = true;
                  console.log("omni label:" + msg._OMIT_LABEL[i]);
                  break;
                }
              }
              console.log("label: " + label);
            // メーカー
            } else if (text.indexOf("メーカー") != -1) {
              maker = $(this).next().text();
              maker = maker.replace(/\r?\n/g, '');
              console.log("maker: " + maker);
            // シリーズ
            } else if (text.indexOf("シリーズ") != -1) {
              series = $(this).next().text();
              series = series.replace(/\r?\n/g, '');
              for (var i = 1; i < msg._OMIT_SERIES.length; i += 2) {
                // 総集編シリーズ判定
                if (series.indexOf(msg._OMIT_SERIES[i]) != -1) {
                  is_omnibus = true;
                  console.log("omni series:" + msg._OMIT_SERIES[i]);
                  break;
                }
              }
              console.log("series: " + series);
            // 出演者
            } else if (text.indexOf("出演者") != -1) {
              cast = $(this).next().text();
              cast = cast.replace('\n', '');
              cast = cast.replace('\t', '');
              // 「▼すべてを表示」など、出演者探索ができるものはajaxで取得
              if (use_ajax) {
                $.ajax({
                  type: "GET",
                  url: ajax_url,
                  success: function (msg) {
                    cast = msg;
                    cast = cast.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
                    // 女優の別名表記を削除
                    while(cast.indexOf("（") != -1)
                    {
                      cast = cast.substr(0, cast.indexOf("（")) + cast.substr(cast.indexOf("）") + 1);
                    }
                    cast = "[[" + cast + "]]";
                    cast = cast.replace(/\r?\n/g, "]]／[[");
                    cast = cast.replace("[[]]／[[", "[[");
                    cast = cast.replace("]]／[[]]", "]]");
                    console.log("cast: " + cast);
                    if(label == "----")
                    {
                       label = maker;
                    }
                    var suburl = "";
                    send_detail_message(is_search_wiki, baseurl_dmm);
                  }
                });
              } else {
                cast = cast.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
                cast = "[[" + cast + "]]";
                cast = cast.replace(/\r?\n/g, "]]／[[");
                cast = cast.replace("[[]]／[[", "[[");
                cast = cast.replace("]]／[[]]", "]]");
                console.log("cast: " + cast);
              }
            // 名前
            } else if (text.indexOf("名前") != -1) {
              anothername = $(this).next().text();
              anothername = anothername.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
              anothername = anothername.replace(/\u200B/g, '');
              anothername = anothername.replace(/\u000a/g, '');
              anothername = anothername.replace(/\u00a0/g, '');
              console.log("anothername: " + anothername);
            // スリーサイズ
            } else if (text.indexOf("サイズ") != -1) {
              threesize = $(this).next().text();
              threesize = threesize.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
              console.log("threesize: " + threesize);
            // 品番
            } else if (text.indexOf("品番") != -1) {
              hinban = $(this).next().text();
              if (hinban.length - 2 == hinban.lastIndexOf("so")) {
                hinban = hinban.substr(0, hinban.length - 2);
              }
              // 青空ソフトの場合、一旦最後のZを取る
              if(hinban.indexOf("aoz") != -1)
              {
                hinban = hinban.substr(0, hinban.length - 1);
              }
              hinban = hinban.replace('\n', '').toUpperCase();
              var numb = 0;
              var latterhalf = hinban;
              while (numb >= 0) {
                latterhalf = latterhalf.substr(numb + 1);
                numb = latterhalf.search(/[A-Z]/g);
              }
              prefix = hinban.substr(0, hinban.length - latterhalf.length);
              if (latterhalf.length > 3) {
                latterhalf = latterhalf.substr(2);
              }
              var numbers_in_prefix = false;
              // プレフィックスに数字が含まれるもの
              for (var i = 0; i < msg._NUMBERS_IN_PREFIX.length; i += 2) {
                if (msg._NUMBERS_IN_PREFIX[i] == "**id") {
                  if (prefix.search(/[0-9]{2}ID/) != -1) {
                    prefix = prefix.substr(prefix.indexOf("ID") - 2);
                    numbers_in_prefix = true;
                    break;
                  }
                } else if (prefix.indexOf(msg._NUMBERS_IN_PREFIX[i]) != -1) {
                  prefix = msg._NUMBERS_IN_PREFIX[i + 1];
                  numbers_in_prefix = true;
                  break;
                }
              }
              // プレフィックスに数字が入っていないものは、数字や、h_を消す
              if (!numbers_in_prefix) {
                prefix = prefix.replace(/H_/, '');
                prefix = prefix.replace(/[0-9]/g, '');
              }
              // 青空ソフトの場合、最後にZを足す
              if(prefix == "AOZ")
              {
                latterhalf = latterhalf + "Z";
              }
              hinban = prefix + "-" + latterhalf;
              number = parseInt(latterhalf);
              console.log("hinban: " + hinban);
              console.log("prefix: " + prefix);
              console.log("number: " + number);
            } else if (text.indexOf("種類") != 1) {
              service = $(this).next().text();
              service = service.replace(/\r?\n/g, '');
              console.log("service: " + service);
            }
          }
        });
        // 出演者探索ができないとき
        if (!use_ajax) {
          var suburl = "";
          // 女優の別名表記を削除
          while(cast.indexOf("（") != -1)
          {
            cast = cast.substr(0, cast.indexOf("（")) + cast.substr(cast.indexOf("）") + 1);
          }
          send_detail_message(is_search_wiki, baseurl_dmm);
        }
      }
      // MGSの場合
      else if(url.indexOf(baseurl_mgs) != -1)
      {
        title = $("title").text();
        title = title.substr(title.indexOf("「") + 1);
        title = title.substr(0, title.indexOf("」"));
        console.log("title: " + title);
        is_adultsite = true;
        is_exbroadcast = false;
        is_omnibus = false;
        smallimg = $("img.enlarge_image").attr("src");
        // 画像が大きい場合は小さいものに差し替え
        if(smallimg.indexOf("pb_p_") != -1)
        {
          smallimg = smallimg.replace("pb_p_", "pb_t1_");
        }
        largeimg = $("a#EnlargeImage").attr("href");
        $("th").each( function() {
          var text = $(this).text();
          if(text.indexOf("出演") != -1)
          {
            anothername = $(this).next().text();
            anothername = anothername.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
            cast = "[[ ]]";
          }
          else if(text.indexOf("メーカー") != -1)
          {
            maker = $(this).next().text();
            maker = maker.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
            maker = maker.replace(/\u000a/g, '');
            maker = maker.replace(/\u0020/g, '');
//            console.log("uni:" + maker.codePointAt(0).toString(16));
            console.log("maker: " + maker);
          }
          else if(text.indexOf("収録時間") != -1)
          {
            duration = parseInt($(this).next().text());
            console.log("duration: " + duration);
          }
          else if(text.indexOf("品番") != -1)
          {
            hinban = $(this).next().text();
            console.log("hinban: " + duration);
            prefix = hinban.substr(0, hinban.indexOf("-"));
            var latterhalf = hinban.substr(hinban.indexOf("-") + 1);
            number = parseInt(latterhalf);
            console.log("prefix: " + prefix);
            console.log("number: " + number);
          }
          else if(text.indexOf("配信開始日") != -1)
          {
            release = $(this).next().text();
            release = release.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
            broadcast_release = release;
            console.log("release: " + release);
          }
          else if(text.indexOf("商品発売日") != -1)
          {
          
          }
          else if(text.indexOf("シリーズ") != -1)
          {
            series = $(this).next().text();
            series = series.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
            series = series.replace(/\u000a/g, '');
            series = series.replace(/\u0020/g, '');
            console.log("series: " + series);
          }
          else if(text.indexOf("レーベル") != -1)
          {
            label = $(this).next().text();
            label = label.replace(/\u000a/g, '');
            label = label.replace(/\u0020/g, '');
            label = label.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
            console.log("label: " + label);
          }
          else if(text.indexOf("ジャンル") != -1)
          {
            genre = $(this).next().text();
            genre = genre.replace(/\r?\n/g, '');
            genre = genre.replace(/\u0020/g, ",");
            genre = genre.replace(/,+/g, ",");
            if (genre.indexOf(",") == 0) {
              genre = genre.substr(1);
            }
            if (genre.lastIndexOf(",") == genre.length - 1) {
              genre = genre.substr(0, genre.length - 1);
            }
//            console.log("uni:" + genre.codePointAt(0).toString(16));
            is_vr = false;
            is_iv = false;
            if(genre.indexOf("VR") != -1)
            {
              is_vr = true;
            }
            else if(genre.indexOf("イメージビデオ") != -1)
            {
              is_iv = true;
            }
            genre = genre.split(',');
            console.log("genre: " + genre);
          }
        });
        var suburl = "";
        threesize = "";
        director = "";
        service = "";
        is_limited = false;
        is_dod = false;
        is_title_fixed = false;
        send_detail_message(is_search_wiki, baseurl_mgs);
      }
      // Perfect-Gの場合
      else if(url.indexOf(baseurl_perfectg) != -1)
      {
        var age = 0;
        $("div.prof_dat").children("div").each( function() {
          var classname = $(this).attr("class");
          if(classname == "p_name")
          {
            title = $(this).text();
            title = title.substr(0, title.indexOf("-"));
            title = title.replace(/\u0020/g, "");
            hinban = title;
            number = parseInt(title.substr(0, title.search(/[a-z]/)));
            console.log("title: " + title);
            console.log("number: " + number);
            prefix = title.replace(/[0-9]/g, "");
            anothername = $(this).children("span").text();
            anothername = anothername.replace(/-/g, "");
            console.log("anothername: " + anothername);
          }
          else if(classname == "p_age")
          {
            var agetext = $(this).text();
            var ageremove = $(this).children("span").text();
            agetext = agetext.replace(ageremove, "");
            age = parseInt(agetext);
            console.log("agetext: " + agetext);
            console.log("age: " + age);
          }
          else if(classname == "p_prf")
          {
            threesize = $(this).text();
            var threesizeremove = $(this).children("span").text();
            threesize = threesize.replace(threesizeremove, "");
            console.log("3size: " + threesize);
          }
          else if(classname == "p_mov")
          {
            var dlist = $(this).text();
            var dlistremove = $(this).children("span").text();
            dlist = dlist.replace(dlistremove, "");
            dlist = dlist.replace("全", "");
            dlist = dlist.replace("分", ":");
            dlist = dlist.replace("秒", "");
            dlist = dlist.split(":");
            console.log("dlist: " + dlist);
            duration = 0;
            for(var i = 0; i < dlist.length; i++)
            {
              if(i == 0)
              {
                duration += parseInt(dlist[i]);
              }
              else if(i == 1)
              {
                // 秒数は四捨五入
                if(parseInt(dlist[i]) >= 30)
                {
                  duration += 1;
                }
              }
            }
            console.log("duration: " + duration);
          }
        });
        anothername += " " + age + "歳 " + threesize;
        smallimg = "http://www.g-area.com/pg_info_thumb/pg_info_" + prefix + "150_100.jpg";
        largeimg = "http://www.g-area.com/img/main/" + prefix + "_320_180.jpg";
        label = "Perfect-G";
        maker = "";
        series = "";
        genre = "";
        is_adultsite = true;
        is_exbroadcast = false;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        cast = "";
        send_detail_message(is_search_wiki, baseurl_mgs);
      }
      // 舞ワイフの場合
      else if(url.indexOf(baseurl_mywife) != -1)
      {
        title = $("div.modelwaku").first().find("img").attr("alt");
        title = title.replace(" ", "");
        console.log("title: " + title);
        var numbertext = $("div.modelsample_photowaku").first().find("img").attr("src");
        if(numbertext.indexOf("girl/") != -1 && numbertext.indexOf("/01.jpg") != -1)
        {
          numbertext = numbertext.substr(numbertext.indexOf("girl/") + 5);
          numbertext = numbertext.substr(0, numbertext.indexOf("/01.jpg"));
          number = parseInt(numbertext);
          console.log("number: " + number);
        }
        anothername = title;
        var text = $("div.modelsamplephototop").first().text();
        if(text.indexOf("年齢") != -1 && text.indexOf("歳") != -1)
        {
          var agetext = text.substr(text.indexOf("年齢") + 3);
          var agetext = agetext.substr(0, agetext.indexOf("歳"));
          var age = parseInt(agetext);
          if(age > 0)
          {
            anothername += " " + String(age) + "歳";
          }
        }
        
        if(text.indexOf("T:") != -1 && text.indexOf("【出演理由】") != -1)
        {
          threesize = text.substr(text.indexOf("T:"));
          threesize = threesize.substr(0, threesize.indexOf("【出演理由】") - 1);
          threesize = threesize.replace(/\u0020/g, "");
          anothername += " " + threesize;
          console.log("3size: " + threesize);
        }
        console.log("anothername: " + anothername);
        
        var num = parseInt(url.substr(url.lastIndexOf("/") + 1));
        
        
        largeimg = "http://p02.mywife.cc/girl/0" + num + "/thumb.jpg";
        smallimg = "&ref(" + largeimg + ", 147)";
        
        label = "舞ワイフ";
        maker = "";
        series = "";
        genre = "";
        is_adultsite = true;
        is_exbroadcast = false;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        cast = "";
        duration = 0;
        send_detail_message(is_search_wiki, baseurl_mywife);
      }
      // RealFileの場合
      else if(url.indexOf(baseurl_realfile) != -1)
      {
        var text = $("div#gallery_girl_profile").find("p").text();
        text = text.replace(/\u0020/g, "");
        text = text.replace(/\u3000/g, "");
        text = text.replace(/\u0009/g, "");
        text = text.replace(/\u000a/g, ",");
        if(text.indexOf("名前") != -1)
        {
          title = text.substr(text.indexOf("名前") + 3);
          title = title.substr(title.indexOf(","));
          console.log("title: " + title);
          anothername = title;
        }
        
        if(text.indexOf("年齢") != -1)
        {
          var agetext = text.substr(text.indexOf("年齢") + 3);
          agetext = agetext.substr(agetext.indexOf(","));
          age = parseInt(agetext);
          if(age > 0)
          {
            console.log("age: " + age);
            anothername += " " + age + "歳";
          }
        }
        var tall = "";
        if(text.indexOf("身長") != -1)
        {
          tall = text.substr(text.indexOf("身長") + 3);
          tall = tall.substr(tall.indexOf(","));
          tall = "T" + tall;
          console.log("tall: " + tall);
        }
        if(text.indexOf("サイズ") != -1)
        {
          threesize = text.substr(text.indexOf("サイズ") + 4);
          threesize = threesize.substr(threesize.indexOf(","));
          if(tall.length > 0)
          {
           threesize = tall + threesize;
          }
          console.log("3size: " + threesize);
          anothername += " " + threesize;
        }
        console.log("anothername: " + anothername);
        
        largeimg = "http://p02.mywife.cc/girl/0" + num + "/thumb.jpg";
        smallimg = "&ref(" + largeimg + ", 147)";
        
        label = "舞ワイフ";
        maker = "";
        series = "";
        genre = "";
        is_adultsite = true;
        is_exbroadcast = false;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        cast = "";
        duration = 0;
        send_detail_message(is_search_wiki, baseurl_mywife);

      }
      // カリビアンコムの場合
      else if(url.indexOf(baseurl_carib) != -1)
      {
        $("h1").each( function() {
          if($(this).attr("itemprop") == "name")
          {
            title = $(this).text();
          }
        });
        console.log("title: " + title);
        is_adultsite = false;
        is_exbroadcast = true;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        if($("div.movie-tag").find("div.is-vr").length > 0)
        {
          is_vr = true;
        }
        
        largeimg = url.replace("index.html", "l_l.jpg");
        smallimg = "&ref(" + largeimg + ",200)";
        
        $("li.movie-spec").each( function() {
          var text = $(this).children("span.spec-title").text();
          if(text.indexOf("出演") != -1)
          {
            cast = $(this).children("span.spec-content").text();
            cast = cast.replace(/\u0009/g, "");
            cast = cast.replace(/\u000a/g, "]]／[[");
            cast = "[[" + cast + "]]";
            cast = cast.replace("[[]]／[[", "[[");
            cast = cast.replace("]]／[[]]", "]]");
            console.log("cast: " + cast);
          }
          else if(text.indexOf("配信日") != -1)
          {
            release = $(this).children("span.spec-content").text();
            broadcast_release = release;
            console.log("release: " + release);
          }
          else if(text.indexOf("再生時間") != -1)
          {
            var dlist = $(this).children("span.spec-content").text();
            dlist = dlist.split(":");
            duration = 0;
            for(var i = 0; i < dlist.length; i++)
            {
              var num = parseInt(dlist[i]);
              if(i == 0)
              {
                duration += num * 60;
              }
              else if(i == 1)
              {
                duration += num;
              }
              else if(i == 2)
              {
                // 秒数は四捨五入
                if(num >= 30)
                {
                  duration += 1;
                }
              }
            }
            console.log("duration: " + duration);
          }
          else if(text.indexOf("シリーズ") != -1)
          {
            series = $(this).children("span.spec-content").text();
            console.log("series: " + series);
          }
          else if(text.indexOf("タグ") != -1)
          {
            genre = $(this).children("span.spec-content").text();
            genre = genre.replace(/\u000a/g, "");
            genre = genre.replace(/\u0009/g, ",");
            genre = genre.replace(/,+/g, ",");
            if (genre.indexOf(",") == 0) {
              genre = genre.substr(1);
            }
            if (genre.lastIndexOf(",") == genre.length - 1) {
              genre = genre.substr(0, genre.length - 1);
            }
//            console.log("uni:" + genre.codePointAt(0).toString(16));
            if(genre.indexOf("ベスト/オムニバス") != -1)
            {
              is_omnibus = true;
            }
            genre = genre.split(",");
            console.log("genre: " + genre);
          }
        });
        var suburl = "";
        label = "カリビアンコム";
        maker = "カリビアンコム";
        threesize = "";
        director = "";
        service = "";
        hinban = "";
        prefix = "";
        number = 0;
        anothername = "";
        is_limited = false;
        is_dod = false;
        is_title_fixed = false;
        // カリビアンコムの場合はwikiを探さない
        send_detail_message(false, baseurl_carib);
      }
      // 一本道の場合
      else if(url.indexOf(baseurl_pondotv) != -1)
      {
        var movie_id = url.replace("https://www.1pondo.tv/movies/", "");
        movie_id = movie_id.replace("/", "");
        var ajax_url = "https://www.1pondo.tv/dyn/phpauto/movie_details/movie_id/" + movie_id + ".json";
        $.ajax({
          type: "GET",
          url: ajax_url,
          success: function (msg) {
            console.log(msg);
            title = msg.Title;
            console.log("title: " + title);
            cast = "[[";
            for(var i = 0; i < msg.ActressesJa.length; i++)
            {
              if(i != 0)
              {
                cast += "]]／[[";
              }
              cast += msg.ActressesJa[i];
            }
            cast += "]]";
            console.log("cast: " + cast);
            
            duration = Math.round(msg.Duration / 60);
            console.log("duration: " + duration);
            smallimg = msg.MovieThumb;
            largeimg = msg.ThumbHigh;
            release = msg.Release;
            release = release.replace(/-/g, "/");
            broadcast_release = release;
            console.log("release: " + release);
            series = msg.Series;
            console.log("series: " + series);
            maker = "一本道";
            label = maker;
            genre = msg.UCNAME;
            console.log("genre: " + genre);
            threesize = "";
            director = "";
            service = "";
            hinban = "";
            prefix = "";
            number = 0;
            anothername = "";
            is_omnibus = false;
            is_iv = false;
            is_vr = false;
            is_limited = false;
            is_dod = false;
            is_adultsite = false;
            is_exbroadcast = true;
            is_title_fixed = false;
            send_detail_message(false, baseurl_pondotv);
          }
        });
      }
      return true;
    }
    // レーベル・シリーズが判明済
    else if (msg.type == "found_page_list") {
      if(msg.release.length > 0)
      {
        release = msg.release;
      }
      if(msg.cast.length > 0)
      {
        cast = msg.cast;
      }
      wiki_label = msg.wiki_label;
      wiki_series = msg.wiki_series;
      console.log("wiki label: " + wiki_label);
      send_detail_message(false, "");
      return true;
    // 次の作品を開く
    } else if (msg.type == "next_tab") {
      open_next_tab();
      console.log("next_tab");
      return true;
    }
    // 結果表示
    else if (msg.type == "result") {
      if (!self && is_ignore_limited) {
        if (msg.is_limited) {
          console.log("ignore limited product");
          return true;
        }
      }
      if (!self && is_ignore_dod) {
        if (msg.is_dod) {
          console.log("ignore DOD product");
          return true;
        }
      }
      var matometitle = msg.title;
      var matomerelease = msg.release;
      if (msg.release == "") {
        matomerelease = msg.broadcast_release;
      }
      // 女優まとめページ用出力
      if (output == "actress") {
        console.log("msg.wiki_label: " + msg.wiki_label);
        console.log("msg.wiki_series: " + msg.wiki_series);
        if (msg.wiki_label.length > 0) {
          wiki_label = "　[[(レーベル一覧)>" + msg.wiki_label + "]]";
        }
        if (msg.wiki_series.length > 0) {
          wiki_series = "　[[(シリーズ一覧)>" + msg.wiki_series + "]]";
        }
        var cast_list = "";
        if (msg.cast.indexOf("／") != -1) {
          cast_list = "出演者：" + msg.cast + "\n<br>";
        }
        matomerelease = matomerelease.replace(/\u002f/g, '.');
        
        var matomelabel = "";
        var matomehinban = " " + msg.hinban;
        if(msg.label == "")
        {
          if(msg.maker == "")
          {
          
          }
          else
          {
            matomelabel = msg.maker;
          }
        }
        else if(msg.label != "----")
        {
          matomelabel = msg.label;
        }
        // FANZAの素人動画の場合
        if (msg.url.indexOf("videoc") != -1 && msg.is_adultsite) {
          if(matomelabel.length > 0)
          {
            matomelabel += " ";
          }
          // タイトルに「レーベル名 名前 スリーサイズ」を表記
          matometitle = matomelabel +  msg.anothername + " " + msg.threesize;
          matomelabel = "";
        }
        // MGSの場合
        else if(msg.url.indexOf(baseurl_mgs) != -1)
        {
          // タイトルに「MGS タイトル 名義」を表記
          matometitle = "MGS " + matometitle + anothername;
        }
        // Perfect-Gの場合
        else if(msg.url.indexOf(baseurl_perfectg) != -1)
        {
          matometitle = "G-AREA Perfect-G " + anothername;
          matomelabel = "";
          matomehinban = "";
          cast_list = "<font color='red'>女優名：" + cast + "</font>";
        }
        // 舞ワイフの場合
        else if(msg.url.indexOf(baseurl_mywife) != -1)
        {
          matometitle = "舞ワイフ No." + number + " " + anothername;
          matomelabel = "";
          matomehinban = "";
          cast_list = "<font color='red'>女優名：" + cast + "</font>";
        }
        
        if(matomelabel.length > 0)
        {
          matomelabel = "（" + matomelabel + "）";
        }
        
        var joyumatome = "//" + matomerelease + matomehinban + "\n<br>" + "[[" + matometitle + matomelabel + ">" + msg.url + "]]" + wiki_label + wiki_series + "\n<br>" + "[[" + msg.smallimg + ">" + msg.largeimg + "]]" + "\n<br>" + cast_list + "\n<br>";
        // アダルトサイトと配信系は、総集編／VR／IV／であっても、それぞれのカテゴリに表示
        if (msg.is_adultsite) {
          $("body").find("div#adultsite_works").attr("style", "visibility:visible");
          $("body").find("div#adultsite_works").append(joyumatome);
        } else if (msg.is_exbroadcast) {
          joyumatome = "//" + matomerelease + "\n<br>" + "[[" + matometitle + matomelabel + ">" + msg.url + "]]" + "\n<br>" + cast_list;
          $("body").find("div#exbroadcast_works").attr("style", "visibility:visible");
          $("body").find("div#exbroadcast_works").append(joyumatome);
        } else if (msg.is_omnibus) {
          $("body").find("div#omni_works").attr("style", "visibility:visible");
          $("body").find("div#omni_works").append(joyumatome);
        } else if (msg.is_iv) {
          $("body").find("div#iv_works").attr("style", "visibility:visible");
          $("body").find("div#iv_works").append(joyumatome);
        } else if (msg.is_vr) {
          $("body").find("div#vr_works").attr("style", "visibility:visible");
          $("body").find("div#vr_works").append(joyumatome);
        } else {
          $("body").find("div#basic_works").append(joyumatome);
        }
      }
      // レーベルまとめページ用出力
      else {
        var matomecast = msg.cast;
        // 出演者情報なしの場合
        if (matomecast == "") {
          // 別名があるとき
          if (msg.anothername.length > 0) {
            matomecast = msg.anothername.replace(/\(/g, '');
            matomecast = matomecast.replace(/\)/g, '');
            matomecast = matomecast.replace(/[0-9]/g, '');
            matomecast = "(" + matomecast.replace("＆", ")／(") + ")";
          }
        }
        // 誰も情報がない場合
        else if (matomecast == "[[----]]") {
          matomecast = "[[ ]]";
        }
        matomerelease = matomerelease.replace(/\u002f/g, '-');
        if (url.indexOf(baseurl_dmm) != -1 && msg.is_adultsite) {
          matometitle = msg.anothername + "~~" + msg.threesize;
        }
        var omnibus = "";
        if (msg.is_omnibus) {
          omnibus = "総集編作品";
        }
        var labelmatome = "";
        // 連番出力の場合は、連番の抜けを埋める
        if(!is_first_product && is_renban && msg.number != NaN)
        {
          var sum = 1;
          // 番号が同じか低い場合はスキップ
          if(number + sum > msg.number)
          {
            console.log("ignore this product: " + msg.hinban);
            return true;
          }
          while(number + sum < msg.number)
          {
            console.log("insert: "+ msg.prefix + "-" + String(number + sum));
            var labelmatome = "|" + msg.prefix + "-" + String(number + sum) + "|||||欠番|\n<br>";
            if (is_director) {
              labelmatome = "|" + msg.prefix + "-" + String(number + sum) + "||||||欠番|\n<br>";
            }
            $("body").find("div#basic_works").append(labelmatome);
            sum++;
          }
        }
        labelmatome = "";
        number = msg.number;
        // 10連番ごとに見出し行を挿入
        if(!is_first_product && msg.number%10 == 1)
        {
          if (!is_director) {
            labelmatome = "|~NO|PHOTO|TITLE|ACTRESS|RELEASE|NOTE|\n<br>";
          }
          else
          {
            labelmatome += "|~NO|PHOTO|TITLE|ACTRESS|DIRECTOR|RELEASE|NOTE|\n<br>";
          }
        }
        is_first_product = false;
        if (!is_director) {
          labelmatome += "|[[" + msg.hinban + ">" + msg.url + "]]|[[" + msg.smallimg + ">" + msg.largeimg + "]]|" + msg.title + "|" + matomecast + "|" + matomerelease + "|" + omnibus + "|\n<br>";
        }
        else
        {
          labelmatome += "|[[" + msg.hinban + ">" + msg.url + "]]|[[" + msg.smallimg + ">" + msg.largeimg + "]]|" + matometitle + "|" + matomecast + "|" + msg.director + "|" + matomerelease + "|" + omnibus + "|\n<br>";
        }
        $("body").find("div#basic_works").append(labelmatome);
      }
      if(msg.is_title_fixed)
      {
        var alert = $("div#title_fix_alert");
        if(alert.length == 0)
        {
          console.log("add alert");
          var adddiv = "<div id='title_fix_alert'><font color='red'>※ 赤字のタイトルは伏字を予測解除しています。コピペする際は注意してください。</font></div>";
          if(url.indexOf(baseurl_dmm) != -1)
          {
            $("body").find("td#mu").prepend(adddiv);
            console.log("add alert");
          }
          else if(url.indexOf(baseurl_mgs) != -1)
          {
            $("body").find("ul.Bread_crumb").prepend(adddiv);
            console.log("add alert");
          }
        }
      }
      console.log("result: " + msg.hinban);
      return true;
    }
    return true;
  });
 
  open_next_tab = function () {
    if (link_list.length > 0) {
      console.log("send message: open_detail");
      chrome.runtime.sendMessage({
        type: "open_detail",
        url: url,
        link: link_list[0],
        output: output,
        is_search_wiki: is_search_wiki,
        is_search_release_with_wiki: is_search_release_with_wiki
      });
      link_list.splice(0, 1);
    }
  };
 
  initialize = function() {
    link_list = [];
    copy_list = [];
    url = "";
    output = "";
    self = false;
    is_renban = false;
    is_director = false;
    is_ignore_limited = false;
    is_ignore_dod = false;
    is_search_wiki = false;
    is_search_release_with_wiki = false;
    is_first_product = false;
    title = "";
    service = "";
    duration = "";
    release = "";
    broadcast_release = "";
    director = "----";
    label = "";
    maker = "";
    series = "";
    cast = "";
    anothername = "";
    threesize = "";
    genre = [];
    hinban = "";
    prefix = "";
    number = 0;
    sougouwikipage = "";
    wiki_label = "";
    wiki_series = "";
    smallimg = "";
    largeimg = "";
    is_omnibus = false;
    is_iv = false;
    is_vr = false;
    is_adultsite = false;
    is_exbroadcast = false;
    is_limited = false;
    is_dod = false;
    is_title_fixed = false;
    title_list = [];
  };
 
  send_to_parse = function() {
    self = true;
    console.log("send message: to_parse");
    chrome.runtime.sendMessage({
      type: "to_parse",
      url: url,
      link: url,
      output: output,
      is_search_wiki: is_search_wiki,
      is_search_release_with_wiki: is_search_release_with_wiki
    });
  };
 
  send_detail_message = function(send_wiki, searchurl) {
    console.log("is_search_wiki:" + send_wiki);
    if (send_wiki && output == "actress") {
      var suburl = url;
      var pos = suburl.indexOf(searchurl);
      if (pos != -1) {
        suburl = suburl.substr(pos);
      }
      console.log("send message: open_next_wiki");
      chrome.runtime.sendMessage({
        type: "open_next_wiki",
        url: url,
        link: suburl,
        label: label,
        maker: maker,
        series: series,
        prefix: prefix,
        output: output,
        is_search_wiki: is_search_wiki,
        is_search_release_with_wiki: is_search_release_with_wiki
      }, function (response) {
        if (response.close && !self) {
          window.close();
        }
        console.log("response received");
      });
    } else {
      console.log("send message: send_detail");
      console.log("send wiki label: " + wiki_label);
      chrome.runtime.sendMessage({
        type: "send_detail",
        url: url,
        title: title,
        cast: cast,
        anothername: anothername,
        threesize: threesize,
        director: director,
        label: label,
        maker: maker,
        series: series,
        wiki_label: wiki_label,
        wiki_series: wiki_series,
        hinban: hinban,
        prefix: prefix,
        smallimg: smallimg,
        largeimg: largeimg,
        release: release,
        broadcast_release: broadcast_release,
        duration: duration,
        genre: genre,
        service: service,
        is_omnibus: is_omnibus,
        is_iv: is_iv,
        is_vr: is_vr,
        is_adultsite: is_adultsite,
        is_exbroadcast: is_exbroadcast,
        is_limited: is_limited,
        is_dod: is_dod,
        output: output,
        is_search_wiki: is_search_wiki,
        is_search_release_with_wiki: is_search_release_with_wiki,
        is_title_fixed: is_title_fixed
      }, function (response) {
        if (!self) {
          window.close();
        }
        console.log("response received");
      });
    }
  };
}).call(this);
