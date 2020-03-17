(function () {
  var link_list = [];
  var copy_list = [];
  var open_next_tab;
  var url;
  var output;
  var self = false;
  var is_director = false;
  var is_ignore_same = false;
  var is_search_wiki = false;
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
  var sougouwikipage = "";
  var smallimg = "";
  var largeimg = "";
  var is_omnibus = false;
  var is_iv = false;
  var is_vr = false;
  var is_adultsite = false;
  var is_limited = false;
  var title_list = [];
  var baseurl_dmm = "dmm.co.jp";
  var baseurl_ssw = "sougouwiki.com";
  var url_details = "-/detail/=/cid=";
  var url_list = "-/list/=/";
  var url_actress = "article=actress";
  var url_label = "article=label";
  var url_maker = "article=maker";
  var url_keyword = "article=keyword";
  var url_search = "-/search/=/";
  var servicedic = {
    "dvd": "mono/dvd",
    "rental": "rental",
    "video": "digital/video",
    "ama": "digital/videoc"
  }
  chrome.runtime.onMessage.addListener(function (msg, sender) {
    // exportボタンクリック時
    if (msg.type == "export") {
      url = msg.url;
      output = msg.output;
      is_director = msg.is_director;
      is_ignore_same = msg.is_ignore_same;
      is_search_wiki = msg.is_search_wiki;
      is_first_product = true;
      console.log("output: " + output);
      console.log("is_search_wiki: " + is_search_wiki);
      var adddiv = "<div id='dmm2ssw'></div>";
      $("body").find("td#mu").prepend(adddiv);
      if (output == "label") {
        var labelmatome = "{| class=\"edit\"\n<br>|~NO|PHOTO|TITLE|ACTRESS|DIRECTOR|RELEASE|NOTE|\n<br>";
        if (!is_director) {
          labelmatome = "{| class=\"edit\"\n<br>|~NO|PHOTO|TITLE|ACTRESS|RELEASE|NOTE|\n<br>";
        }
        $("body").find("div#dmm2ssw").append(labelmatome);
        var basicdiv = '<div id="basic_works"></div>'
        $("body").find("div#dmm2ssw").append(basicdiv);
        var enddiv = "|}\n<br>";
        $("body").find("div#dmm2ssw").append(enddiv);
      } else if (output == "actress") {
        var basicdiv = '<div id="basic_works"></div>'
        var vrdiv = '<div id="vr_works" style="visibility:hidden">----\n<br>**VR作品\n<br></div>'
        var ivdiv = '<div id="iv_works" style="visibility:hidden">----\n<br>**イメージ作品\n<br></div>'
        var omnidiv = '<div id="omni_works" style="visibility:hidden">----\n<br>**総集編作品\n<br></div>'
        var adultsitediv = '<div id="adultsite_works" style="visibility:hidden">----\n<br>**アダルトサイト\n<br></div>'
        $("body").find("div#dmm2ssw").append(basicdiv);
        $("body").find("div#dmm2ssw").append(vrdiv);
        $("body").find("div#dmm2ssw").append(ivdiv);
        $("body").find("div#dmm2ssw").append(omnidiv);
        $("body").find("div#dmm2ssw").append(adultsitediv);
      }
      if (url.indexOf(baseurl_dmm) != -1) {
        // detail
        if (url.indexOf(url_details) != -1) {
          self = true;
          chrome.runtime.sendMessage({
            type: "to_parse",
            url: url,
            link: url,
            output: output,
            is_search_wiki: is_search_wiki
          }, function (response) {});
        }
        // list
        else if (url.indexOf(url_list) != -1) {
          // actress
          if (url.indexOf(url_actress) != -1) {}
        }
        // label
        else if (url.indexOf(url_label) != -1) {} else {}
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
      open_next_tab();
    }
    // 作品ページを解析
    else if (msg.type == "parse_detail") {
      url = msg.url;
      output = msg.output;
      is_search_wiki = msg.is_search_wiki;
      if (url.indexOf("dmm.co.jp") != -1) {
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
        // アダルトサイトチェック
        is_adultsite = false;
        if (url.indexOf("videoc") != -1) {
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
              releasse = release.replace(/\r?\n/g, '');
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
                console.log("limited word: " + msg._GENRE_LIMITED[i]);
                if (genre.indexOf(msg._GENRE_LIMITED[i]) != -1) {
                  is_limited = true;
                  console.log("is limited: " + is_limited);
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
                    console.log("is_search_wiki:" + is_search_wiki);
                    if (is_search_wiki && output == "actress") {
                      var suburl = url;
                      var pos = suburl.indexOf("dmm.co.jp");
                      if (pos != -1) {
                        suburl = suburl.substr(pos);
                      }
                      suburl = "http://sougouwiki.com/search?keywords=" + suburl;
                      chrome.runtime.sendMessage({
                        type: "open_next_wiki",
                        url: url,
                        link: suburl,
                        label: label,
                        maker: maker,
                        series: series,
                        prefix: prefix,
                        output: output,
                        is_search_wiki: is_search_wiki
                      }, function (response) {
                        if (response.close && !self) {
                          window.close();
                        }
                      });
                      console.log("open_next_wiki");
                    } else {
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
                        wiki_label: "",
                        wiki_series: "",
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
                        is_limited: is_limited,
                        output: output,
                        is_search_wiki: is_search_wiki
                      }, function (response) {
                        if (!self) {
                          window.close();
                        }
                      });
                      console.log("send_detail");
                    }
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
              if (!numbers_in_prefix) {
                prefix = prefix.replace(/H_/, '');
                prefix = prefix.replace(/[0-9]/g, '');
              }
              hinban = prefix + "-" + latterhalf;
              console.log("hinban: " + hinban);
              console.log("prefix: " + prefix);
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
          console.log("is_search_wiki:" + is_search_wiki);
          if (is_search_wiki && output == "actress") {
            var suburl = url;
            var pos = suburl.indexOf("dmm.co.jp");
            if (pos != -1) {
              suburl = suburl.substr(pos);
            }
            suburl = "http://sougouwiki.com/search?keywords=" + suburl;
            chrome.runtime.sendMessage({
              type: "open_next_wiki",
              url: url,
              link: suburl,
              label: label,
              maker: maker,
              series: series,
              prefix: prefix,
              output: output,
              is_search_wiki: is_search_wiki
            }, function (response) {
              if (response.close && !self) {
                window.close();
              }
            });
            console.log("open_next_wiki");
          } else {
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
              wiki_label: "",
              wiki_series: "",
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
              is_limited: is_limited,
              output: output,
              is_search_wiki: is_search_wiki
            }, function (response) {
              if (!self) {
                window.close();
              }
            });
            console.log("send_detail");
          }
        }
      }
      return;
    }
    // レーベル・シリーズが判明済
    else if (msg.type == "found_page_list") {
      console.log("found_page_list");
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
        wiki_label: msg.label,
        wiki_series: msg.series,
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
        is_limited: is_limited,
        output: output,
        is_search_wiki: is_search_wiki
      }, function (response) {
        if (!self) {
          window.close();
        }
      });
    // 次の作品を開く
    } else if (msg.type == "next_tab") {
      open_next_tab();
      console.log("next_tab");
    }
    // 結果表示
    else if (msg.type == "result") {
      if (!self && is_ignore_same) {
        if (msg.is_limited) {
          console.log("ignore limited product");
          return;
        }
      }
      var matometitle = msg.title;
      var matomerelease = msg.release;
      if (msg.release == "") {
        matomerelease = msg.broadcast_release;
      }
      // 女優まとめページ用出力
      if (output == "actress") {
        var wiki_label = "";
        var wiki_series = "";
        if (msg.wiki_label.length > 0) {
          wiki_label = "　[[(レーベル一覧)>" + msg.wiki_label + "]]";
        } else if (msg.wiki_series.length > 0) {
          wiki_series = "　[[(シリーズ一覧)>" + msg.wiki_series + "]]";
        }
        var cast_list = "";
        if (msg.cast.indexOf("／") != -1) {
          cast_list = "出演者：" + msg.cast + "<br>";
        }
        matomerelease = matomerelease.replace(/\u002f/g, '.');
        if (msg.is_adultsite) {
          matometitle = msg.anothername + " " + msg.threesize;
        }
                                       
        var matomelabel = "";
        if(msg.label != "----")
        {
          matomelabel = "（" + msg.label + "）";
        }
        var joyumatome = "//" + matomerelease + " " + msg.hinban + "<br>" + "[[" + matometitle + matomelabel + ">" + msg.url + "]]" + wiki_label + wiki_series + "<br>" + "[[" + msg.smallimg + ">" + msg.largeimg + "]]" + "<br>" + cast_list + "\n<br>";
        if (msg.is_omnibus) {
          $("body").find("div#omni_works").attr("style", "visibility:visible");
          $("body").find("div#omni_works").append(joyumatome);
        } else if (msg.is_iv) {
          $("body").find("div#iv_works").attr("style", "visibility:visible");
          $("body").find("div#iv_works").append(joyumatome);
        } else if (msg.is_vr) {
          $("body").find("div#vr_works").attr("style", "visibility:visible");
          $("body").find("div#vr_works").append(joyumatome);
        } else if (msg.is_adultsite) {
          $("body").find("div#adultsite_works").attr("style", "visibility:visible");
          $("body").find("div#adultsite_works").append(joyumatome);
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
        if (msg.is_adultsite) {
          matometitle = msg.anothername + "~~" + msg.threesize;
        }
        var omnibus = "";
        if (msg.is_omnibus) {
          omnibus = "総集編作品";
        }
        if (msg.is_adultsite) {
          matometitle = msg.anothername + "~~" + msg.threesize;
        }
        var labelmatome = "";
        // 10連番ごとに
        if(!is_first_product && parseInt(msg.hinban.charAt(msg.hinban.length - 1)) == 1)
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
      console.log("result");
    }
    return true;
  });
  open_next_tab = function () {
    if (link_list.length > 0) {
      chrome.runtime.sendMessage({
        type: "open_detail",
        url: url,
        link: link_list[0],
        output: output,
        is_search_wiki: is_search_wiki
      }, function (response) {});
      link_list.splice(0, 1);
    }
  };
  open_next_wiki = function () {};
}).call(this);
