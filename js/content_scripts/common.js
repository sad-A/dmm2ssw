(function () {
  var link_list = [];
  var copy_list = [];
  var open_next_tab;
  var initialize;
  var send_detail_message;
  var send_to_parse;
  var url;
  var output;
  var div_to_add;
  var self = false;
  var is_replace_http = false;
  var is_add_www = false;
  var is_renban = false;
  var is_director = false;
  var is_ignore_limited = false;
  var is_ignore_dod = false;
  var is_search_wiki = false;
  var is_search_release_with_wiki = false;
  var is_first_product = false;
  var is_detail_page = false;
  var last_labelmatome = "";
  var dmm_label_name = "";
  var title = "";
  var service = "";
  var duration = "";
  var release = "";
  var broadcast_release = "";
  var director = "----";
  var label = "";
  var maker = "";
  var series = "";
  var cast = [];
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
  var is_exdvd = false;
  var is_exbroadcast = false;
  var is_limited = false;
  var is_dod = false;
  var is_title_fixed = false;
  var title_list = [];
  var baseurl_dmm = "dmm.co.jp";
  var baseurl_mgs = "mgstage.com";
  var baseurl_unext = "video.hnext.jp";
  var baseurl_faleno = "faleno.jp";
  var baseurl_perfectg = "g-area.org";
  var baseurl_mywife = "mywife.cc";
  var baseurl_realfile = "r-file.com";
  var baseurl_himemix = "himemix.com";
  var baseurl_girlsblue = "girls-blue.com";
  var baseurl_happyfish = "h-fish.com";
  var baseurl_tokyo247 = "tokyo-247.net";
  var baseurl_fc2 = "adult.contents.fc2.com/";
  var baseurl_digigra = "digi-gra.net/";
  var baseurl_lovepop = "lovepop.net/";
  var baseurl_iromegane = "iromegane.jp";
  var baseurl_scute = "s-cute.com";
  var baseurl_aventertainments = "aventertainments.com";
  var baseurl_carib = "caribbeancom.com";
  var baseurl_pondotv = "1pondo.tv";
  var baseurl_heyzo = "heyzo.com"
  var baseurl_tokyohot = "tokyo-hot.com";
  var baseurl_getchu = "dl.getchu.com";
  var baseurl_twitter = "twitter.com";
  var baseurl_sougouwiki = "sougouwiki.com";
  var baseurl_seesaa = "seesaawiki.jp";
  var url_details = "-/detail/=/cid=";
  var url_list = "-/list/=/";
  var url_actress = "article=actress";
  var url_label = "article=label";
  var url_maker = "article=maker";
  var url_keyword = "article=keyword";
  var url_search = "-/search/=/";
  var url_dvd = "mono/dvd";
  var mgsurl_detail = "product_detail";
  var mgsurl_search = "search/search.php";
  var unexturl_detail = "/title/";
  var unexturl_actress = "/browse/actor/";
  var unexturl_list = "/browse/";
  var falenourl_detail = "/works/";
  var falenourl_actress = "/actress/";
  var falenourl_list = "/work/";
  var perfectgurl_detail = "sample_pg";
  var mywifeurl_detail = "teigaku/model";
  var realfileurl_teigaku_detail = "teigaku/item";
  var realfileurl_tanpin_detail = "tanpin/item";
  var himemixurl_teigaku_detail = "teigaku/model";
  var himemixurl_tanpin_detail = "tanpin/model";
  var girlsblueurl_teigaku_detail = "teigaku/item";
  var girlsblueurl_tanpin_detail = "tanpin/item";
  var happyfishurl_teigaku_detail = "teigaku/item";
  var happyfishurl_tanpin_detail = "tanpin/item";
  var tokyo247url_detail = "/ms/";
  var fc2url_detail = "article";
  var digiloveurl_detail = "ppv/item";
  var digiloveurl_actress = "models/detail";
  var digiloveurl_monthly = "monthly/model";
  var digiloveurl_list = "ppv";
  var iromeganeurl_iro_detail = "iro_shousai";
  var iromeganeurl_faily_detail = "fairydollrebirth";
  var iromeganeurl_actress = "-top";
  var scuteurl_detail = "/contents/";
  var scuteurl_actress = "/girls/";
  var aventertainmentsurl_detail = "product_lists";
  var cariburl_detail = "moviepages";
  var cariburl_search = "search";
  var cariburl_searchact = "search_act";
  var cariburl_list = "listpages";
  var pondotvurl_detail = "movies";
  var pondotvurl_search = "search";
  var pondotvurl_list = "list";
  var heyzourl_detail = "moviepages";
  var heyzourl_search = "search";
  var heyzourl_list = "listpages";
  var tokyohoturl_detail = "product";
  var tokyohoturl_list = "product/?";
  var tokyohoturl_actress = "cast";
  var getchuurl_detail = "i/item";
 
  var servicedic = {
    "dvd": "mono/dvd",
    "rental": "rental",
    "video": "digital/video",
    "ama": "digital/videoc"
  }
  chrome.runtime.onMessage.addListener(function (msg, sender) {
    //================================================================================
    // exportボタンクリック時
    if (msg.type == "export") {
      initialize();
      // URL整形
      chrome.runtime.getManifest().content_scripts.forEach(function(cs) {
        cs.matches.forEach(function(url){
          var surl = url.replace("http://", "");
          surl = surl.replace("https://", "");
          surl = surl.replace("*.", "");
          surl = surl.replace(/\*/g, "");
          if(msg.url.indexOf(surl) != -1)
          {
            console.log("match: " + url);
            // httpsアクセスが可能なのに、httpアクセスしている場合、なるだけhttpsアクセスにする
            if(url.indexOf("https://") != -1 && msg.url.indexOf("http://") != -1)
            {
              is_replace_http = true;
              msg.url = msg.url.replace("http://", "https://");
              console.log("is_replace_http: " + is_replace_http);
            }
            
            // wwwがある場合もない場合もOKのときは、www有りを採用
            if(url.indexOf("*.") != -1 && msg.url.indexOf("www.") == -1)
            {
              is_add_www = true;
              msg.url = msg.url.replace("://", "://www.");
              console.log("is_add_www: " + is_add_www);
            }
          }
        });
      });
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
      var adddiv = "<div id='dmm2ssw' align='left'></div>";
      // FANZAの場合
      if(url.indexOf(baseurl_dmm) != -1)
      {
        div_to_add = $("body").find("td#mu");
        div_to_add.prepend(adddiv);
      }
      //MGSの場合
      else if(url.indexOf(baseurl_mgs) != -1)
      {
        div_to_add = $("body").find("ul.Bread_crumb").first();
        div_to_add.prepend(adddiv);
        div_to_add.removeClass().addClass("Bread_crumb");
      }
      // U-NEXTの場合
      else if(url.indexOf(baseurl_unext) != -1)
      {
        if(url.indexOf("?") != -1)
        {
          url = url.substr(0, url.indexOf("?"));
        }
        div_to_add = $("body").find("div.lay-main__inner").first();
        div_to_add.prepend(adddiv);
        // デフォルトはリンクに色がついてないので分かりにくい
        var scr = '<style type="text/css">\n a.actress_link { color:#D21577; }\n a.actress_link:hover { text-decoration:underline; } </style>';
        div_to_add.prepend(scr);
      }
      // FALENOの場合
      else if(url.indexOf(baseurl_faleno) != -1)
      {
        div_to_add = $("body").find("section.bread").first();
        div_to_add.prepend(adddiv);
        // デフォルトはリンクに色がついてないので分かりにくい
        var scr = '<style type="text/css">\n a.actress_link { color:#D21577; }\n a.actress_link:hover { text-decoration:underline; } </style>';
        div_to_add.prepend(scr);
      }
      // Perfect-Gの場合
      else if(url.indexOf(baseurl_perfectg) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(perfectgurl_detail) != -1)
          {
            div_to_add = $("body").find("div.co_ww").first();
            div_to_add.prepend(adddiv);
          }
        }
      }
      // 舞ワイフの場合
      else if(url.indexOf(baseurl_mywife) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(mywifeurl_detail) != -1)
          {
            div_to_add = $("body").find("div.model01").first();
            div_to_add.prepend(adddiv);
            div_to_add.attr("style", "color: white");
          }
        }
      }
      // RealFileの場合
      else if(url.indexOf(baseurl_realfile) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(realfileurl_teigaku_detail) != -1 || url.indexOf(realfileurl_tanpin_detail) != -1)
          {
            div_to_add = $("body").find("div#gallery_girl_intro");
            div_to_add.prepend(adddiv);
          }
        }
      }
      // HimeMixの場合
      else if(url.indexOf(baseurl_himemix) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(himemixurl_teigaku_detail) != -1 || url.indexOf(himemixurl_tanpin_detail) != -1)
          {
            div_to_add = $("body").find("div.movie_box").first();
            div_to_add.prepend(adddiv);
          }
        }
      }
      // GIRL'S BLUEの場合
      else if(url.indexOf(baseurl_girlsblue) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          div_to_add = $("body").find("div#wrapper");
          div_to_add.prepend(adddiv);
        }
      }
      // Happy Fishの場合
      else if(url.indexOf(baseurl_happyfish) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          div_to_add = $("body").find("div#wrapper");
          div_to_add.prepend(adddiv);
        }
      }
      // Tokyo247の場合
      else if(url.indexOf(baseurl_tokyo247) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(tokyo247url_detail) != -1)
          {
            div_to_add = $("body").find("div.main").first();
            div_to_add.prepend(adddiv);
          }
        }
      }
      // FC2の場合
      else if(url.indexOf(baseurl_fc2) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(fc2url_detail) != -1)
          {
            div_to_add = $("body").find("div.items_article_left").first();
            div_to_add.prepend(adddiv);
          }
        }
      }
      // デジグラ、LOVEPOPの場合
      else if(url.indexOf(baseurl_digigra) != -1 || url.indexOf(baseurl_lovepop) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          div_to_add = $("body").find("div.container").first();
          div_to_add.prepend(adddiv);
        }
      }
      // 色眼鏡の場合
      else if(url.indexOf(baseurl_iromegane) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          div_to_add = $("body").find("div#salix-main-section");
          div_to_add.prepend(adddiv);
        }
      }
      // S-Cuteの場合
      else if(url.indexOf(baseurl_scute) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          div_to_add = $("body").find("div.wrapper").first();
          div_to_add.prepend(adddiv);
        }
      }
      // AVEの場合
      else if(url.indexOf(baseurl_aventertainments) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          div_to_add = $("body").find("div.main").first();
          div_to_add.prepend(adddiv);
        }
      }
      // カリビアンコムの場合
      else if(url.indexOf(baseurl_carib) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          div_to_add = $("body").find("div#main");
          div_to_add.prepend(adddiv);
        }
      }
      // 一本道の場合
      else if(url.indexOf(baseurl_pondotv) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          div_to_add = $("body").find("div.contents").first();
          div_to_add.prepend(adddiv);
        }
      }
      // HEYZOの場合
      else if(url.indexOf(baseurl_heyzo) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          div_to_add = $("body").find("div#movie");
          div_to_add.prepend(adddiv);
        }
      }
      // 東京熱の場合
      else if(url.indexOf(baseurl_tokyohot) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          div_to_add = $("body").find("div#main");
          div_to_add.prepend(adddiv);
        }
      }
      // Getchuの場合
      else if(url.indexOf(baseurl_getchu) != -1)
      {
        // 女優まとめページのみ対応
        if(output = "actress")
        {
          div_to_add = $("body").find("table.info_bar").first();
          div_to_add.prepend(adddiv);
        }
      }
      // Twitterの場合
      else if(url.indexOf(baseurl_twitter) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          $("body").find("div").each( function() {
            var id = $(this).attr("data-testid");
            if(id == "UserDescription")
            {
              div_to_add = $(this);
              div_to_add.prepend(adddiv);
              return false;
            }
          });
        }
      }
      var pagetop = '<div id="dmm2ssw_pagetop"></div>';
      $("body").find("div#dmm2ssw").append(pagetop);
      if (output == "label") {
        // DVDのレーベルページのとき
        if(url.indexOf(url_dvd) != -1 && url.indexOf(url_label) != -1)
        {
          var labeltitle = $("p.headwithelem").find("span[itemprop=name]").last().text();
          console.log("labeltitle: " + labeltitle);
          dmm_label_name = labeltitle;
          var labelurl = url;
          var labelurllatter = labelurl.substr(labelurl.indexOf("id="));
          labelurllatter = labelurllatter.substr(0, labelurllatter.indexOf("/")) + "/sort=date/";
          labelurl = labelurl.substr(0, labelurl.indexOf("id=")) + labelurllatter;
          labeltitle = "<div id='dmm2ssw_pagetitle'>*[[" + '<a class="label_link" href="http://sougouwiki.com/d/' +EscapeEUCJP(dmm_label_name) + '" target="_blank">' + labeltitle + '</a>' + ">" + labelurl + "]]<br><br></div>";
          $("div#dmm2ssw_pagetop").append(labeltitle);
        }
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
        var exdvddiv = '<div id="exdvd_works" style="visibility:hidden">----\n<br>**その他作品(DVD・BD)\n<br></div>';
        var exbroadcastdiv = '<div id="exbroadcast_works" style="visibility:hidden">----\n<br>**その他作品(配信系)\n<br></div>';
        var doujindiv = '<div id="doujin_works" style="visibility:hidden">----\n<br>**同人サークル作品\n<br></div>';
        var twitterdiv = '<div id="twitter_part" style="visibility:hidden">----\n**Twitter\n</div>';
        // FANZAの場合
        if(url.indexOf(baseurl_dmm) != -1)
        {
          // DVDの女優ページのとき
          if(url.indexOf(url_dvd) != -1 && url.indexOf(url_actress) != -1)
          {
            var joyutitle = $("title").text();
            joyutitle = joyutitle.substr(0, joyutitle.indexOf("-") - 1);
            var joyuname = joyutitle.substr(0, joyutitle.indexOf("("));
            joyutitle = joyutitle.replace("(", "（");
            joyutitle = joyutitle.replace(")", "）");
            var joyuurl = url;
            var joyuurllatter = joyuurl.substr(joyuurl.indexOf("id="));
            joyuurllatter = joyuurllatter.substr(0, joyuurllatter.indexOf("/")) + "/sort=date/";
            joyuurl = joyuurl.substr(0, joyuurl.indexOf("id=")) + joyuurllatter;
            joyutitle = "<div id='dmm2ssw_pagetitle'>*[[" + '<a class="actress_link" href="http://sougouwiki.com/d/' +EscapeEUCJP(joyuname) + '" target="_blank">' + joyutitle + '</a>' + ">" + joyuurl + "]]<br><br></div>";
            $("div#dmm2ssw_pagetop").append(joyutitle);
          }
          $("body").find("div#dmm2ssw").append(basicdiv);
          $("body").find("div#dmm2ssw").append(vrdiv);
          $("body").find("div#dmm2ssw").append(ivdiv);
          $("body").find("div#dmm2ssw").append(omnidiv);
          $("body").find("div#dmm2ssw").append(adultsitediv);
        }
        // MGS/U-NEXT/FALENO/Perfect-G/舞ワイフ/RealFile/HimeMix/Happy Fish/Tokyo247/FC2/デジグラ/LOVEPOP/色眼鏡/GIRL'S BLUE/S-Cuteの場合は「アダルトサイト」のみ
        else if(url.indexOf(baseurl_mgs) != -1 || url.indexOf(baseurl_unext) != -1 || url.indexOf(baseurl_faleno) != -1 || url.indexOf(baseurl_perfectg) != -1 || url.indexOf(baseurl_mywife) != -1 || url.indexOf(baseurl_realfile) != -1 || url.indexOf(baseurl_himemix) != -1  || url.indexOf(baseurl_girlsblue) != -1 || url.indexOf(baseurl_happyfish) != -1 || url.indexOf(baseurl_tokyo247) != -1 || url.indexOf(baseurl_fc2) != -1 || url.indexOf(baseurl_digigra) != -1 || url.indexOf(baseurl_lovepop) != -1 || url.indexOf(baseurl_iromegane) != -1 || url.indexOf(baseurl_scute) != -1)
        {
          $("body").find("div#dmm2ssw").append(adultsitediv);
        }
        // AVEの場合は「その他作品(DVD・BD)」のみ
        else if(url.indexOf(baseurl_aventertainments) != -1)
        {
       $("body").find("div#dmm2ssw").append(exdvddiv);
        }
        // カリビアンコム/一本道/HEYZO/東京熱の場合は「その他作品(配信系)」のみ
        else if(url.indexOf(baseurl_carib) != -1 || url.indexOf(baseurl_pondotv) != -1 || url.indexOf(baseurl_heyzo) != -1 || url.indexOf(baseurl_tokyohot) != -1)
        {
          $("body").find("div#dmm2ssw").append(exbroadcastdiv);
        }
        // Getchuの場合は「同人サークル作品」のみ
        else if(url.indexOf(baseurl_getchu) != -1)
        {
          $("body").find("div#dmm2ssw").append(doujindiv);
        }
        else if(url.indexOf(baseurl_twitter) != -1)
        {
          $("body").find("div#dmm2ssw").append(twitterdiv);
        }
      }
      // FANZAの場合
      if (url.indexOf(baseurl_dmm) != -1) {
        // detail
        if (url.indexOf(url_details) != -1) {
          is_detail_page = true;
          send_to_parse();
          return true;
        }
        // list search
        else if (url.indexOf(url_list) != -1 || url.indexOf(url_search) != -1) {
          is_detail_page = false;
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
          is_detail_page = true;
          send_to_parse();
          return true;
        }
        // list
        else if(url.indexOf(mgsurl_search) != -1)
        {
          is_detail_page = false;
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
              return false;
            }
          });
        }
      }
      // U-NEXTの場合
      else if(url.indexOf(baseurl_unext) != -1)
      {
        // detail
        if(url.indexOf(unexturl_detail) != -1)
        {
          is_detail_page = true;
          send_to_parse();
          return true;
        }
        // list
        else if(url.indexOf(unexturl_list) != -1)
        {
          is_detail_page = false;
          $("article.ui-item-a--list-collection a").each( function () {
            var href = $(this).attr("href");
            if(href.indexOf(unexturl_detail) != -1)
            {
              href = "https://video.hnext.jp" + href;
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
      }      // FALENOの場合
      else if(url.indexOf(baseurl_faleno) != -1)
      {
        // detail
        if(url.indexOf(falenourl_detail) != -1)
        {
          is_detail_page = true;
          is_search_release_with_wiki = true;
          send_to_parse();
          return true;
        }
        // list/ actress
        else if(url.indexOf(falenourl_list) != -1 || url.indexOf(falenourl_actress) != -1)
        {
          is_detail_page = false;
          $("div.waku_kanren01").each( function() {
            var href = $(this).find("a").first().attr("href");
            
            if(href.indexOf(falenourl_detail) != -1)
            {
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
          // detail
          if(url.indexOf(perfectgurl_detail) != -1)
          {
            is_detail_page = true;
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
          // detail
          if(url.indexOf(mywifeurl_detail) != -1)
          {
            is_detail_page = true;
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
          // detail
          if(url.indexOf(realfileurl_teigaku_detail) != -1 || url.indexOf(realfileurl_tanpin_detail) != -1)
          {
            is_detail_page = true;
            is_search_release_with_wiki = true;
            send_to_parse();
            return true;
          }
        }
      }
      // HimeMixの場合
      else if(url.indexOf(baseurl_himemix) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(himemixurl_teigaku_detail) != -1 || url.indexOf(himemixurl_tanpin_detail) != -1)
          {
            is_detail_page = true;
            is_search_release_with_wiki = true;
            send_to_parse();
            return true;
          }
        }
      }
      // GIRL'S BLUEの場合
      else if(url.indexOf(baseurl_girlsblue) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(girlsblueurl_teigaku_detail) != -1 || url.indexOf(girlsblueurl_tanpin_detail) != -1)
          {
            is_detail_page = true;
            is_search_release_with_wiki = true;
            send_to_parse();
            return true;
          }
        }
      }
      // Happy Fishの場合
      else if(url.indexOf(baseurl_happyfish) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(happyfishurl_teigaku_detail) != -1 || url.indexOf(happyfishurl_tanpin_detail) != -1)
          {
            is_detail_page = true;
            is_search_release_with_wiki = true;
            send_to_parse();
            return true;
          }
        }
      }
      // Happy Fishの場合
      else if(url.indexOf(baseurl_tokyo247) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(tokyo247url_detail) != -1)
          {
            is_detail_page = true;
            is_search_release_with_wiki = true;
            send_to_parse();
            return true;
          }
        }
      }
      // FC2の場合
      else if(url.indexOf(baseurl_fc2) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(fc2url_detail) != -1)
          {
            is_detail_page = true;
            send_to_parse();
            return true;
          }
        }
      }
      // デジグラの場合
      else if(url.indexOf(baseurl_digigra) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // ppv detail
          if(url.indexOf(digiloveurl_detail) != -1)
          {
            is_detail_page = true;
            send_to_parse();
            return true;
          }
          // monthly actress/ PPV list
          else if(url.indexOf(digiloveurl_monthly) != -1 || url.indexOf(digiloveurl_list) != -1)
          {
            is_detail_page = false;
            $("div.article-image").each(function() {
              var href = $(this).find("a").attr("href");
              if(href.indexOf(baseurl_digigra) == -1)
              {
                href = "https://digi-gra.net/" + href;
              }
              link_list.push(href);
            });
          }
          // actress
          else if(url.indexOf(digiloveurl_actress) != -1)
          {
            is_detail_page = false;
            $("div.ppv-product-introduction-and-review-image").each(function() {
              var href = $(this).find("a").attr("href");
              if(href.indexOf(baseurl_digigra) == -1)
              {
                href = "https://digi-gra.net/" + href;
              }
              link_list.push(href);
            });
          }
        }
      }
      // LOVEPOPの場合
      if(url.indexOf(baseurl_lovepop) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // ppv detail
          if(url.indexOf(digiloveurl_detail) != -1)
          {
            is_detail_page = true;
            send_to_parse();
            return true;
          }
          // monthly actress/ PPV list
          else if(url.indexOf(digiloveurl_monthly) != -1 || url.indexOf(digiloveurl_list) != -1)
          {
            is_detail_page = false;
            $("div.article-image").each(function() {
              var href = $(this).find("a").attr("href");
              if(href.indexOf(baseurl_lovepop) == -1)
              {
                href = "https://lovepop.net/" + href;
              }
              link_list.push(href);
            });
          }
          // actress
          else if(url.indexOf(digiloveurl_actress) != -1)
          {
            is_detail_page = false;
            $("div.ppv-product-introduction-and-review-image").each(function() {
              var href = $(this).find("a").attr("href");
              if(href.indexOf(baseurl_lovepop) == -1)
              {
                href = "https://lovepop.net/" + href;
              }
              link_list.push(href);
            });
          }
        }
      }
      // 色眼鏡の場合
      else if(url.indexOf(baseurl_iromegane) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(iromeganeurl_iro_detail) != -1 || url.indexOf(iromeganeurl_faily_detail) != -1)
          {
            is_detail_page = true;
            send_to_parse();
            return true;
          }
          // actress pages
          else if(url.indexOf(iromeganeurl_actress) != -1)
          {
            is_detail_page = false;
            $("a").each( function() {
              var href = $(this).attr("href");
              if(href.indexOf(iromeganeurl_iro_detail) != -1 || url.indexOf(iromeganeurl_faily_detail) != -1)
              {
                var added = false;
                for(var i = 0; i < link_list.length; i++)
                {
                  if(link_list[i].match(href))
                  {
                    added = true;
                    break;
                  }
                }
                if(!added)
                {
                  link_list.push(href);
                }
              }
            });
          }
        }
      }
      // S-Cuteの場合
      else if(url.indexOf(baseurl_scute) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detial
          if(url.indexOf(scuteurl_detail) != -1)
          {
            is_detail_page = true;
            send_to_parse();
            return true;
          }
          // actress
          else if(url.indexOf(scuteurl_actress) != -1)
          {
            $("article.contents").children("a").each( function() {
              var href = $(this).attr("href");
              if(href.indexOf(scuteurl_detail) != -1)
              {
                link_list.push(href);
              }
            });
          }
        }
      }
      // AVEの場合
      else if(url.indexOf(baseurl_aventertainments) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(aventertainmentsurl_detail) != -1)
          {
            is_detail_page = true;
            send_to_parse();
            return true;
          }
          // list pages
          else
          {
            is_detail_page = false;
            $("div.list-cover").find("a").each( function() {
              var href = $(this).attr("href");
              if(href.indexOf(aventertainmentsurl_detail) != -1)
              {
                link_list.push(href);
              }
            });
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
            is_detail_page = true;
            send_to_parse();
            return true;
          }
          // list search searchact
          else if(url.indexOf(cariburl_list) != -1 || url.indexOf(cariburl_search) != -1 || url.indexOf(cariburl_searchact) != -1)
          {
            is_detail_page = false;
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
            is_detail_page = true;
            send_to_parse();
            return true;
          }
          // list search
          else if(url.indexOf(pondotvurl_list) != -1 || url.indexOf(pondotvurl_search) != -1)
          {
            is_detail_page = false;
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
      // HEYZOの場合
      else if(url.indexOf(baseurl_heyzo) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(heyzourl_detail) != -1)
          {
            is_detail_page = true;
            send_to_parse();
            return true;
          }
          // list search
          else if(url.indexOf(heyzourl_list) != -1 || url.indexOf(heyzourl_search) != -1)
          {
            is_detail_page = false;
            $("div.movie").find("a.actor").each( function() {
              var href = $(this).attr("href");
              if(href.indexOf(heyzourl_detail) != -1)
              {
                href = "https://www.heyzo.com" + href;
                link_list.push(href);
              }
            });
          }
        }
      }
      // 東京熱の場合
      else if(url.indexOf(baseurl_tokyohot) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          // detail
          if(url.indexOf(tokyohoturl_detail) != -1)
          {
            is_detail_page = true;
            send_to_parse();
            return true;
          }
          // list search
          else if(url.indexOf(tokyohoturl_list) != -1)
          {
            is_detail_page = false;
            $("li.detail").children("a").each( function() {
              var href = $(this).attr("href");
              if(href.indexOf(tokyohoturl_detail) != -1)
              {
                href = "https://my.tokyo-hot.com/" + href;
                link_list.push(href);
              }
            });
          }
          // actress
          else if(url.indexOf(tokyohoturl_actress) != -1)
          {
            is_detail_page = false;
            $("div.related").find("a").each( function() {
              var href = $(this).attr("href");
              if(href.indexOf(tokyohoturl_detail) != -1)
              {
                href = "https://my.tokyo-hot.com/" + href;
                link_list.push(href);
              }
            });
          }
        }
      }
      // Getchuの場合
      else if(url.indexOf(baseurl_getchu) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          is_detail_page = true;
          send_to_parse();
          return true;
        }
      }
      // Twitterの場合
      else if(url.indexOf(baseurl_twitter) != -1)
      {
        // 女優まとめページのみ対応
        if(output == "actress")
        {
          is_detail_page = true;
          send_to_parse();
          return true;
        }
      }
      open_next_tab();
      return true;
    }
    //================================================================================
    // 作品ページを解析
    else if (msg.type == "parse_detail") {
      url = msg.url;
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
          // たまにsmallimgにjs.jpgが使われている
          if (smallimg.indexOf("jp.jpg") != -1 || smallimg.indexOf("js.jpg") != -1) {
            // 一旦、js.jpgはjp.jpgに変換する
            smallimg = smallimg.replace("js.jpg", "jp.jpg");
            // 正方形は147px指定
            smallimg = "&ref(" + smallimg + ", 147)";
          }
          console.log("smallimg: " + smallimg);
          console.log("largeimg: " + largeimg);
        }
        var castlist = "";
        var more_cast = false;
        console.log("url: " + url);
        console.log("title: " + title);
        // 各種情報チェック
        $("td.nw").each(function () {
          var text = $(this).text();
          if (text.length > 0) {
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
              // 下半身タイガース/フェ地下のメーカー名はフェ地下。
              if(maker.indexOf("下半身タイガース/フェ地下") != -1)
              {
                maker = "フェ地下";
              }
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
              castlist = $(this).next().text();
              castlist = castlist.replace(/\u000a/g, '');
              // 「▼すべてを表示」など、出演者探索ができるものはajaxで取得
              if (use_ajax) {
                $.ajax({
                  type: "GET",
                  url: ajax_url,
                  success: function (msg) {
                    castlist = msg;
                    castlist = castlist.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
                    castlist = castlist.replace(/（/g, "(");
                    castlist = castlist.replace(/）/g, ")");
                    console.log("castlist: " + castlist);
                    // 女優の別名表記を削除
                    while(castlist.indexOf("(") != -1)
                    {
                      var cl = castlist;
                      castlist = cl.substr(0, cl.indexOf("(")) + cl.substr(cl.indexOf(")") + 1);
                    }
                    castlist = castlist.replace(/\r?\n/g, ",");
                    if (castlist.indexOf(",") == 0) {
                      castlist = castlist.substr(1);
                    }
                    if (castlist.lastIndexOf(",") == castlist.length - 1) {
                      castlist = castlist.substr(0, castlist.length - 1);
                    }
                    cast = castlist.split(",");
                    console.log("cast: " + cast);
                    if(label == "----")
                    {
                       label = maker;
                    }
                    var suburl = "";
                    send_detail_message(is_search_wiki, baseurl_dmm, url);
                  }
                });
              } else {
                castlist = castlist.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
                // 女優の別名表記を削除
                castlist = castlist.replace(/（/g, "(");
                castlist = castlist.replace(/）/g, ")");
                console.log("castlist: " + castlist);
                // 女優の別名表記を削除
                while(castlist.indexOf("(") != -1)
                {
                  var cl = castlist;
                  castlist = cl.substr(0, cl.indexOf("(")) + cl.substr(cl.indexOf(")") + 1);
                }
                castlist = castlist.replace(/\r?\n/g, ",");
                if (castlist.indexOf(",") == 0) {
                  castlist = castlist.substr(1);
                }
                if (castlist.lastIndexOf(",") == castlist.length - 1) {
                  castlist = castlist.substr(0, castlist.length - 1);
                }
                cast = castlist.split(",");
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
              // 最後がdodの場合はdod削除
              if(hinban.indexOf("dod") == hinban.length - 3)
              {
                hinban = hinban.replace("dod", "");
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
              number = parseInt(latterhalf.replace(/[^0-9]/g, ""));
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
          send_detail_message(is_search_wiki, baseurl_dmm, url);
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
        is_exdvd = false;
        is_exbroadcast = false;
        is_omnibus = false;
        smallimg = $("img.enlarge_image").attr("src");
        // 画像が大きい場合は小さいものに差し替え
        if(smallimg.indexOf("pb_p_") != -1)
        {
          smallimg = smallimg.replace("pb_p_", "pb_t1_");
        }
        else if(smallimg.indexOf("pf_o1_") != -1)
        {
          smallimg = "&ref(" + smallimg + ", 147)";
        }
        largeimg = $("a#EnlargeImage").attr("href");
        $("th").each( function() {
          var text = $(this).text();
          if(text.indexOf("出演") != -1)
          {
            anothername = $(this).next().text();
            anothername = anothername.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
            cast = [];
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
        send_detail_message(is_search_wiki, baseurl_mgs, url);
      }
      // U-NEXTの場合
      else if(url.indexOf(baseurl_unext) != -1)
      {
        title = $("h1.ttl-subinfo__text").text();
        title = title.replace(/\u3000/g, " "); // 全角スペースを半角スペースに
        hinban = url.substr(url.lastIndexOf("/") + 1);
        prefix = hinban.replace(/[0-9]/g, "");
        number = parseInt(hinban.replace(/[^0-9]/g, ""));
        release = $("span.ttl-subinfo__text").text();
        release = release.replace("年", "/");
        release = release.replace("月", "");
        broadcast_release = release;
        console.log("release: " + release);
        largeimg = $("img.ttl-package__thumb").attr("src");
        if(largeimg.indexOf("?") != -1)
        {
          largeimg = largeimg.substr(0, largeimg.indexOf("?"));
        }
        smallimg = "&ref(" + largeimg.replace(".jpg", "_F.jpg") + ", 147)";
        $("h2.ui-hd--3").next().find("dt").each( function() {
          var text = $(this).text();
          if(text.indexOf("女優") != -1)
          {
            $(this).parent().find("dd").each( function() {
              cast.push($(this).text());
            });
            console.log("cast: " + cast);
          }
          else if(text.indexOf("監督") != -1)
          {
            director = $(this).next().text();
            console.log("director: " + director);
          }
          else if(text.indexOf("ジャンル") != -1)
          {
            $(this).parent().find("dd").each( function() {
              genre.push($(this).text());
            });
            console.log("genre: " + genre);
          }
          else if(text.indexOf("シリーズ") != -1)
          {
            series = $(this).next().text();
            console.log("series: " + series);
          }
          else if(text.indexOf("メーカー") != -1)
          {
            label = $(this).next().text();
            console.log("label: " + label);
          }
        });
        maker = "U-NEXT";
        release = "";
        threesize = "";
        anothername = "";
        service = "";
        is_adultsite = true;
        is_exdvd = false;
        is_exbroadcast = false;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        send_detail_message(is_search_wiki, baseurl_unext, url);
      }
      // FALENOの場合
      else if(url.indexOf(baseurl_faleno) != -1)
      {
        title = $("div.bar02 h2").first().text();
        title = title.replace(/\u3000/g, " "); // 全角スペースを半角スペースに
        $("div.box_works01_list span").each(function() {
          var text = $(this).text();
          if(text.indexOf("出演女優") != -1)
          {
            cast = $(this).next().text().split(",");
          }
          else if(text.indexOf("配信開始日") != -1)
          {
            broadcast_release = $(this).next().text();
            console.log("broadcast_release: " + broadcast_release);
          }
          else if(text.indexOf("収録時間") != -1)
          {
            var dlist = $(this).next().text();
            duration = parseInt(dlist.replace(/[^0-9]/g, ""));
            console.log("duration: " + duration);
          }
          else if(text.indexOf("発売日") != -1)
          {
            release = $(this).next().text();
            console.log("release: " + release);
          }
        });
        largeimg = $("div.box_works01_img img").first().attr("src");
        smallimg = "&ref(" + largeimg.replace("_1200", "h1") + ", 147)";
        maker = "FALENO";
        label = "";
        series = "";
        genre = [];
        release = "";
        threesize = "";
        anothername = "";
        director = "";
        service = "";
        is_adultsite = true;
        is_exdvd = false;
        is_exbroadcast = false;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        send_detail_message(is_search_wiki, baseurl_faleno, url);
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
            title = title.replace(/[^A-Za-z0-9]/g, "");
            hinban = title;
            number = parseInt(title.replace(/[^0-9]/g, ""));
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
        
        largeimg = "https://www.g-area.com/img/main/748shoko_320_180.jpg";
        smallimg = "&ref(https://www.g-area.com/pg_info_thumb/pg_info_" + hinban + "150_100.jpg, 226)";
        maker = "G-AREA";
        label = "Perfect-G";
        series = "";
        genre = [];
        release = "";
        is_adultsite = true;
        is_exdvd = false;
        is_exbroadcast = false;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        cast = [];
        send_detail_message(is_search_wiki, baseurl_perfectg, url);
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
        smallimg = "&ref(" + largeimg + ", 226)";
        
        maker = "舞ワイフ";
        label = "";
        series = "";
        genre = [];
        release = "";
        is_adultsite = true;
        is_exdvd = false;
        is_exbroadcast = false;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        cast = [];
        duration = 0;
        send_detail_message(is_search_wiki, baseurl_mywife, url);
      }
      // RealFileの場合
      else if(url.indexOf(baseurl_realfile) != -1)
      {
        var text = $("div#gallery_girl_profile").find("p").text();
        text = text.replace(/\u0020/g, "");
        text = text.replace(/\u3000/g, "");
        text = text.replace(/\u0009/g, "");
        text = text.replace(/\u000a/g, ",");
        hinban = url.substring(url.indexOf("ID=") + 3);
        number = parseInt(hinban.replace(/[a-z]/g, ""));
        if(text.indexOf("名前") != -1)
        {
          title = text.substr(text.indexOf("名前") + 3);
          title = title.substr(0, title.indexOf(","));
          console.log("title: " + title);
          anothername = title;
        }
        
        if(text.indexOf("年齢") != -1)
        {
          var agetext = text.substr(text.indexOf("年齢") + 3);
          agetext = agetext.substr(0, agetext.indexOf(","));
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
          tall = tall.substr(0, tall.indexOf(","));
          tall = "T" + tall;
          console.log("tall: " + tall);
        }
        if(text.indexOf("サイズ") != -1)
        {
          threesize = text.substr(text.indexOf("サイズ") + 4);
          threesize = threesize.substr(0, threesize.indexOf(","));
          if(tall.length > 0)
          {
           threesize = tall + " " + threesize;
          }
          console.log("3size: " + threesize);
          anothername += " " + threesize;
        }
        console.log("anothername: " + anothername);
        
        largeimg = "https://www.r-file.com/free_photo/" + hinban + "/img2.jpg";
        smallimg = "&ref(https://www.r-file.com/free_photo/" + hinban + "/img1.jpg, 147)";
        
        maker = "Real File";
        label = "";
        series = "";
        genre = [];
        release = "";
        is_adultsite = true;
        is_exdvd = false;
        is_exbroadcast = false;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        cast = [];
        duration = 0;
        send_detail_message(is_search_wiki, baseurl_realfile, url);

      }
      // HimeMixの場合
      else if(url.indexOf(baseurl_himemix) != -1)
      {
        // 定額個別ページの場合
        if(url.indexOf(himemixurl_teigaku_detail) != -1)
        {
          title = $("div.mohime-login").find("h2").first().text();
          if(title.indexOf("No.") != -1)
          {
            number = parseInt(title.replace(/[^0-9]/g, ""));
            title = title.substr(title.indexOf("No.") + 3);
            title = title.replace(/[0-9]/g, "");
            title = title.replace(/\u3000/g, "");
//          console.log("uni:" + title.codePointAt(0).toString(16));
            console.log("title: " + title);
          }
          $("div.mohime-login").find("p").each( function() {
            var text = $(this).text();
            if(text.indexOf("AGE:") != -1 && text.indexOf("T:") != -1)
            {
              anothername = title + " ";
              var agetext = text.substr(text.indexOf("AGE:") + 4);
              agetext = agetext.substr(0, agetext.indexOf("T:"));
              agetext = agetext.replace(/[^0-9]/g, "");
              var age = parseInt(agetext);
              anothername += age + "歳 ";
              threesize = text.substr(text.indexOf("T:"));
              console.log("threesize: " + threesize);
              anothername += threesize;
              console.log("anothername: " + anothername);
            }
            else if(text.indexOf("配信開始日：") != -1)
            {
              release = text.substr(text.indexOf("配信開始日：") + 6);
              release = release.replace(/-/g, "/");
              release = release.replace(/[^0-9\/]/g, "");
              broadcast_release = release;
              console.log("release: " + release);
            }
          });
        }
        // 単品個別ページの場合
        else if(url.indexOf(himemixurl_tanpin_detail) != -1)
        {
          title = $("div.model_pr").last().find("h2").text();
          if(title.indexOf("No.") != -1)
          {
            number = parseInt(title.replace(/[^0-9]/g, ""));
            title = title.substr(title.indexOf("No.") + 3);
            title = title.replace(/[0-9]/g, "");
            title = title.replace(/\u3000/g, "");
//          console.log("uni:" + title.codePointAt(0).toString(16));
            console.log("title: " + title);
          }
          var strong = $("div.model_pr").last().find("h2").next();
          var text = strong.text();
          console.log("strong: " + text);
          if(text.indexOf("AGE:") != -1 && text.indexOf("T:") != -1)
          {
            anothername = title + " ";
            var agetext = text.substr(text.indexOf("AGE:") + 4);
            agetext = agetext.substr(0, agetext.indexOf("T:"));
            agetext = agetext.replace(/[^0-9]/g, "");
            var age = parseInt(agetext);
            anothername += age + "歳 ";
            threesize = text.substr(text.indexOf("T:"));
            strong.find("p").each(function() {
              threesize = threesize.replace($(this).text(), "");
            });
            console.log("threesize: " + threesize);
            anothername += threesize;
            console.log("anothername: " + anothername);
          }
          strong.find("p").each(function() {
            var tt = $(this).text();
            if(tt.indexOf("配信開始日：") != -1)
            {
              release = text.substr(text.indexOf("配信開始日：") + 6);
              release = release.replace($(this).next().text(), "");
              release = release.replace(/-/g, "/");
              release = release.replace(/[^0-9\/]/g, "");
              broadcast_release = release;
              console.log("release: " + release);
              return false;
            }
          });
        }
        // 3サイズ表記がなく、別名が入ってない場合は、タイトルを別名に
        if(anothername.length == 0)
        {
          anothername = title;
        }
        var number_for_image = parseInt(url.substr(url.lastIndexOf("/")).replace(/[^0-9]/g, ""));
        smallimg = "&ref(https://p02.himemix.com/common/thumb/" + ('00000' + number_for_image).slice(-5) + "/00/1.jpg, 226)";
        largeimg = "http://free.himemix.com/girl/" + ('00000' + number).slice(-5) + "/01.jpg";
        
        maker = "HimeMix";
        label = "";
        series = "";
        genre = [];
        is_adultsite = true;
        is_exdvd = false;
        is_exbroadcast = false;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        cast = [];
        duration = 0;
        send_detail_message(is_search_wiki, baseurl_himemix, url);
      }
      // GIRL'S BLUE/Happy Fishの場合
      else if(url.indexOf(baseurl_girlsblue) != -1 || url.indexOf(baseurl_happyfish) != -1)
      {
        hinban = url.substr(url.lastIndexOf("=") + 1);
        number = parseInt(hinban.replace(/[^0-9]/g, ""));
        // 注：画像への直リン禁止
        largeimg = $("div#gallery_girl_photo").find("img").attr("src");
        if(url.indexOf(baseurl_girlsblue) != -1)
        {
          smallimg = "&ref(https://www.girls-blue.com/free_photo/" + hinban + "/img1.jpg, 147)";
        }
        else if(url.indexOf(baseurl_happyfish) != -1)
        {
          smallimg = "&ref(https://www.h-fish.com/free_photo/" + hinban + "/img1.jpg, 147)";
        }
        var text = $("div#gallery_girl_profile").find("p").text();
        console.log("text: " + text);
        if(text.indexOf("名　前：") != -1 && text.indexOf("身　長：") != -1 && text.indexOf("サイズ：") != -1 && (text.indexOf("趣　味：") != -1 || text.indexOf("初自慰：") != -1))
        {
          title = text.substr(text.indexOf("名　前：") + 4);
          title = title.substr(0, title.indexOf("身　長："));
          title = title.replace(/\u3000/g, "");
          console.log("uni:" + title.codePointAt(5).toString(16));
          console.log("title: " + title);
          anothername = title;
          threesize = text.substr(text.indexOf("身　長：") + 4);
          if(text.indexOf("趣　味：") != -1)
          {
            threesize = threesize.substr(0, threesize.indexOf("趣　味："));
          }
          else if(text.indexOf("初自慰：") != -1)
          {
            threesize = threesize.substr(0, threesize.indexOf("初自慰："));
          }
          threesize = threesize.replace("サイズ：", "/");
          threesize = threesize.replace(/[^\/\-()A-Za-z0-9]/g, "");
          threesize = threesize.replace(/\u0020/g, "");
          threesize = "T:" + threesize;
          threesize = threesize.replace(/\//g, " ");
          console.log("uni:" + threesize.codePointAt(5).toString(16));
          console.log("threesize: " + threesize);
          anothername = title + threesize;
        }
        text = $("div#movie_gallery").find("div.gallery_discription").text();
        is_vr = false;
        if((text.indexOf("動画総分数") != -1 || text.indexOf("動画合計分数") != -1) && text.indexOf("分") != -1)
        {
          var dlist = "";
          if(text.indexOf("動画総分数") != -1)
          {
            text.substr(text.indexOf("動画総分数") + 6);
          }
          else if(text.indexOf("動画合計分数") != -1)
          {
           text.substr(text.indexOf("動画合計分数") + 7);
          }
          dlist = dlist.substr(dlist.indexOf("分"));
          dlist = dlist.replace(/[^0-9]/g, "");
          duration = parseInt(dlist);
          if(text.indexOf("VR") != -1)
          {
            dlist = text.substr(dlist.indexOf("VR") + 3);
            dlist = dlist.replace(/[^0-9]/g, "");
            var vrlength = parseInt(dlist);
            if(vrlength > 0)
            {
               is_vr = true;
            }
          }
        }
        label = "";
        series = "";
        genre = [];
        release = "";
        is_adultsite = true;
        is_exdvd = false;
        is_exbroadcast = false;
        is_omnibus = false;
        is_iv = false;
        cast = [];
        if(url.indexOf(baseurl_girlsblue) != -1)
        {
          maker = "Girl's Blue";
          send_detail_message(is_search_wiki, baseurl_girlsblue, url);
        }
        else if(url.indexOf(baseurl_happyfish) != -1)
        {
          maker = "HAPPY FISH";
            send_detail_message(is_search_wiki, baseurl_happyfish, url);
        }
      }
      // Tokyo247の場合
      else if(url.indexOf(baseurl_tokyo247) != -1)
      {
        hinban = url.substr(url.indexOf("/ms/") + 4);
        hinban = hinban.substr(0, hinban.indexOf("/contents"));
        hinban = hinban.replace(/^a-z0-9]/g, "");
        prefix = hinban.replace(/[0-9]/g, "");
        number = parseInt(hinban.replace(/[^0-9]/g, ""));
        title = $("div.modelname").first().text();
        cast = title.split(",");
        anothername = $("div.modelProfile").first().text();
        anothername = anothername.replace(/\u3000/g, " ");
        var tags = $("ul.tags").text();
        tags = tags.replace(/\u000a/g, ",");
        console.log("genre: " + tags);
        genre = tags.split(",");
                                       
        largeimg = "http://www.tokyo-247.net/ms/601erena/ms_" + hinban + "003.jpg";
        smallimg = "&ref(http://www.tokyo-247.net/ms/gallery_parts/" + hinban + "_1.jpg, 226)";
        maker = "Tokyo247";
        label = "";
        series = "";
        genre = [];
        is_adultsite = true;
        is_exdvd = false;
        is_exbroadcast = false;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        duration = 0;
        send_detail_message(is_search_wiki, baseurl_tokyo247, url);
      }
      // FC2
      else if(url.indexOf(baseurl_fc2) != -1)
      {
        title = $("div.items_article_headerInfo").first().find("h3").text();
        console.log("title: " + title);
        release = $("div.items_article_Releasedate").first().text();
        release = release.replace("販売日 : ", "");
        console.log("release: " + release);
        hinban = url.substr(url.indexOf("article/") + 8);
        hinban = hinban.replace("/", "");
        number = parseInt(hinban);
        hinban = "FC2 PPV " + hinban;
        largeimg = "https:" + $("div.items_article_MainitemThumb").first().find("img").attr("src");
        smallimg = "&ref(" + largeimg + ", 147)";
        var dlist = $("div.items_article_MainitemThumb").first().find("p.items_article_info").text();
        dlist = dlist.split(":");
        duration = 0;
        for(var i = 0; i < dlist.length; i++)
        {
          if(i == 0)
          {
            duration = dlist[i] * 60;
          }
          else if(i == 1)
          {
            duration += dlist[i];
          }
          else if(i == 2)
          {
            if(dlist[i] >= 30)
            {
              // 秒数は四捨五入
              duration += 1;
            }
          }
        }
        maker = $("section.items_comment_sellerBox").first().find("h4").find("a").text();
        label = "";
        series = "";
        genre = [];
        is_adultsite = true;
        is_exdvd = false;
        is_exbroadcast = false;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        cast = [];
        duration = 0;
        send_detail_message(is_search_wiki, baseurl_fc2, url);
      }
      // デジグラ、LOVEPOPの場合
      else if(url.indexOf(baseurl_digigra) != -1 || url.indexOf(baseurl_lovepop) != -1)
      {
        title = $("h2.ppv-item-detail-title").first().text();
        console.log("title: " + title);
        if(url.indexOf(baseurl_digigra) != -1)
        {
          maker = "デジグラ";
        }
        else
        {
          maker = "LOVEPOP";
        }
        var castlist = "";
        $("dt").each(function() {
          var text = $(this).text();
          if(text.indexOf("ファイル内容") != -1)
          {
             var dlist = $(this).next().text();
             if(dlist.indexOf("枚") != -1)
             {
               dlist = dlist.substr(dlist.indexOf("枚"));
             }
             dlist = dlist.replace("時間", ":");
             dlist = dlist.replace("分", ":");
             dlist = dlist.replace("秒", "");
             dlist = dlist.replace("4K", "");
             dlist = dlist.replace(/[^0-9:]/g, "");
             dlist = dlist.split(":");
             if(dlist.length >= 3)
             {
               duration = parseInt(dlist[0]) * 60 + parseInt(dlist[1]);
               if(parseInt(dlist[2]) >= 30)
               {
                 duration += 1;
               }
             }
             else if(dlist.length == 2){
               duration = parseInt(dlist[0]);
               if(parseInt(dlist[1]) >= 30)
               {
                 duration += 1;
               }
             }
             else if(dlist.length == 1)
             {
                duration = 1;
             }
             else
             {
               duration = 0;
             }
          }
          else if(text.indexOf("モデル名") != -1)
          {
            castlist = $(this).next().find("a").first().text();
            console.log("cast: " + castlist);
          }
        });
        
        genre = $("nav.c--tag-list").text();
        genre = genre.replace(/\u0020/g, "");
        genre = genre.replace(/\u0009/g, "");
        genre = genre.replace(/\u000a/g, ",");
        genre = genre.replace(/,+/g, ",");
        if (genre.indexOf(",") == 0) {
          genre = genre.substr(1);
        }
        if (genre.lastIndexOf(",") == genre.length - 1) {
          genre = genre.substr(0, genre.length - 1);
        }
        genre = genre.split(",");
        console.log("genre: " + genre);
        largeimg = $("img.ppv-key-visual-of-item-detail").first().attr("src");
        smallimg = largeimg;
        release = "";
        label = "";
        threesize = "";
        director = "";
        service = "";
        hinban = url.substr(url.indexOf("ID=") + 3).toUpperCase();
        prefix = hinban.replace(/[0-9]/g, "");
        number = parseInt(hinban.replace(/[^0-9]/g, ""));
        anothername = "";
        cast.push(castlist);
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        is_limited = false;
        is_dod = false;
        is_adultsite = true;
        is_exdvd = false;
        is_exbroadcast = false;
        is_title_fixed = false;
        send_detail_message(false, "", "");
      }
      // 色眼鏡の場合
      else if(url.indexOf(baseurl_iromegane) != -1)
      {
        // 色眼鏡の個別ページ
        var castlist = "";
        $("p").each( function() {
          var text = $(this).text();
          if(text.indexOf("配信日") != -1 && text.indexOf("タイトル") != -1 && text.indexOf("●") != -1 && text.indexOf("女優") != -1 && text.indexOf("品番") != -1 && text.indexOf("総分数") != -1 && text.indexOf("監督") != -1)
          {
            release = text.substr(text.indexOf("配信日") + 3);
            release = release.substr(0, release.indexOf("タイトル"));
            release = release.replace(/[^0-9\/]/g, "");
            broadcast_release = release;
            console.log("release: " + release);
                    
            title = text.substr(text.indexOf("●") + 1);
            title = title.substr(0, title.indexOf("女優"));
            console.log("title: " + title);
            
            castlist = text.substr(text.indexOf("女優") + 3);
            castlist = castlist.substr(0, castlist.indexOf("品番"));
            console.log("castlist: " + castlist);
            
            hinban = text.substr(text.indexOf("品番") + 3);
            hinban = hinban.substr(0, hinban.indexOf("総分数"));
            hinban = hinban.replace(/\u0020/g, "");
            hinban = hinban.replace(/\u000a/g, "");
            hinban = hinban.replace(/\u0009/g, "");
            prefix = hinban.replace(/[0-9]/g, "");
            number = parseInt(hinban.replace(/[^0-9]/g, ""));
            
            console.log("hinban: " + hinban);
            
            $("img").each( function() {
              var src = $(this).attr("src");
              console.log("src: " + src);
              console.log(hinban + "_01.jpg: " + src.indexOf(hinban + "_01.jpg"));
              if(src.indexOf(hinban + "_01.jpg") != -1 || src.indexOf(hinban + "_h1") != -1)
              {
                 largeimg = "http://iromegane.jp" + src;
                 smallimg = "&ref(" + largeimg + ", 147)";
                 console.log("largeimg: " + largeimg);
              }
            });
            var dlist = text.substr(text.indexOf("総分数") + 4);
            dlist = dlist.substr(0, dlist.indexOf("監督"));
            dlist = dlist.replace("時間", ":");
            dlist = dlist.replace("分", ":");
            dlist = dlist.replace("秒", "");
            dlist = dlist.split(":");
            if(dlist.length == 3)
            {
              duration = parseInt(dlist[0]) * 60 + parseInt(dlist[1]);
              if(parseInt(dlist[2]) >= 30)
              {
                duration += 1;
              }
            }
            else if(dlist.length == 2)
            {
              duration = parseInt(dlist[0]);
              if(parseInt(dlist[1]) >= 30)
              {
                duration += 1;
              }
            }
            console.log("duration: " + duration);
            
            director = text.substr(text.indexOf("監督") + 3);
            console.log("director: " + director);
            label = "色眼鏡";
            maker = label;
            series = "";
          }
          // FairyDollRebirth
          else if(text.indexOf("総分数") != -1 && text.indexOf("[ﾌｧｲﾙｻｲｽﾞ") != -1 &&text.indexOf("監督") != -1)
          {
            $(":header").each(function() {
              var tt = $(this).text();
              if(tt.indexOf("●") != -1)
              {
                title = tt.substr(tt.indexOf("●") + 1);
                if(title.indexOf("／") != -1)
                {
                  castlist = title.substr(title.indexOf("／") + 1);
                  cast = castlist.split(",");
                  console.log("cast: " + cast);
                  title = title.substr(0, title.indexOf("／"));
                }
                console.log("title: " + title);
                return false;
              }
            });
            hinban = url.substr(url.lastIndexOf("/") + 1);
            hinban = hinban.replace(/\u0020/g, "");
            hinban = hinban.replace(/\u000a/g, "");
            hinban = hinban.replace(/\u0009/g, "");
            prefix = hinban.replace(/[0-9]/g, "");
            number = parseInt(hinban.replace(/[^0-9]/g, ""));
            console.log("hinban: " + hinban);
            $("img").each( function() {
              var src = $(this).attr("src");
              console.log("src: " + src);
              console.log("index " + src.indexOf(hinban + "_01.jpg"));
              if(src.indexOf(hinban + "_01.jpg") != -1 || src.indexOf(hinban + "_h1") != -1)
              {
                 largeimg = "http://iromegane.jp" + src;
                 smallimg = "&ref(" + largeimg + ", 147)";
                 console.log("largeimg: " + largeimg);
              }
            });
            var dlist = text.substr(text.indexOf("総分数") + 4);
            dlist = dlist.substr(0, dlist.indexOf("[ﾌｧｲﾙｻｲｽﾞ"));
            dlist = dlist.replace("時間", ":");
            dlist = dlist.replace("分", ":");
            dlist = dlist.replace("秒", "");
            dlist = dlist.split(":");
            if(dlist.length == 3)
            {
              duration = parseInt(dlist[0]) * 60 + parseInt(dlist[1]);
              if(parseInt(dlist[2]) >= 30)
              {
                duration += 1;
              }
            }
            else if(dlist.length == 2)
            {
              duration = parseInt(dlist[0]);
              if(parseInt(dlist[1]) >= 30)
              {
                duration += 1;
              }
            }
            console.log("duration: " + duration);
            director = text.substr(text.indexOf("監督") + 3);
            console.log("director: " + director);
            release = "";
            broadcast_release = release;
            label = "FairyDollRebirth";
            maker = label;
            series = "";
          }
        });
        genre = [];
        console.log("genre: " + genre);
        threesize = "";
        service = "";
        anothername = castlist;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        is_limited = false;
        is_dod = false;
        is_adultsite = true;
        is_exdvd = false;
        is_exbroadcast = false;
        is_title_fixed = false;
        send_detail_message(false, "", "");
      }
      // S-Cuteの場合
      else if(url.indexOf(baseurl_scute) != -1)
      {
        title = $("h3.h1").text();
        if(title.indexOf("／") != -1)
        {
          anothername = title.substr(title.indexOf("／") + 1);
          title = title.substr(0, title.indexOf("／"));
          console.log("title: " + title);
          console.log("anothername: " + anothername);

        }
        hinban = url.substr(url.indexOf("contents/") + 9);
        hinban = hinban.replace(/\//g, "");
        number = parseInt(hinban.replace(/[^0-9]/g, ""));
        prefix = hinban.replace(/[0-9]/g, "");
        release = $("div.single-meta span.date").text();
        release = release.replace(/[^0-9\/]/g, "");
        broadcast_release = release;
        console.log("release: " + release);
        var dlist = $("div.single-meta span.comment").text();
        if(dlist.indexOf("動画") != -1 && dlist.indexOf("分") != -1)
        {
          dlist = dlist.substr(dlist.indexOf("動画") + 2);
          dlist = dlist.substr(0, dlist.indexOf("分"));
          duration = parseInt(dlist.replace(/[^0-9]/g, ""));
          console.log("duration: " + duration);
        }
        $("div.tags").find("a").each(function() {
          genre.push($(this).text());
        });
        console.log("genre: " + genre);
        $("div.about-author p").each(function() {
          var text = $(this).text();
          if(text.indexOf(")-W") != -1)
          {
            text = text.split("／");
            if(text.length == 3)
            {
              anothername += " " + text[0] + " " + text[2] + " " + text[1];
              threesize = text[2] + " " + text[1];
              console.log("anothername: " + anothername);
            }
          }
        });
        var suburl = $("div.about-author a").first().attr("href");
        if(suburl.indexOf(scuteurl_actress) != -1)
        {
          suburl = "https://www.s-cute.com" + suburl;
        }
        largeimg = $("div.content-cover img").first().attr("src");
        smallimg = "&ref(" + largeimg.replace(".jpg", "_800.jpg") + ", 226)";
        maker = "S-Cute";
        label = "";
        director = "";
        service = "";
        cast = [];
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        is_limited = false;
        is_dod = false;
        is_adultsite = true;
        is_exdvd = false;
        is_exbroadcast = false;
        is_title_fixed = false;
        send_detail_message(is_search_wiki, baseurl_scute, suburl);
      }
      // AVEの場合
      else if(url.indexOf(baseurl_aventertainments) != -1)
      {
        title = $("meta[property='og:title']").attr('content');
        largeimg = $("meta[property='og:image']").attr('content');
        smallimg = "&ref(" + largeimg + ", 147)";
        largeimg = largeimg.replace("jacket_images", "bigcover");
        var castlist = "";
        $("span.redtitle").each( function() {
          var text = $(this).text();
          if(text.indexOf("主演女優") != -1)
          {
            castlist = $(this).parent().text();
            castlist = castlist.replace("主演女優:", "");
            castlist = castlist.replace(/\u0020/g, "");
            cast = castlist.split(",");
//            console.log("uni:" + cast.codePointAt(0).toString(16));
            console.log("cast: " + cast);
          }
          else if(text.indexOf("スタジオ") != -1)
          {
            label = $(this).next().text();
            maker = label;
            console.log("label: " + label);
          }
          else if(text.indexOf("シリーズ") != -1)
          {
            series = $(this).next().text();
            console.log("series: " + series);
          }
          else if(text.indexOf("カテゴリ一覧") != -1)
          {
            // 全て見るがあるとき
            if($(this).parent().children("span.viewall").length > 0)
            {
              genre = $("a[name=AllCategory]").next().next().next().find("ul").text();
              genre = genre.replace(/\u000a/g, ",");
              genre = genre.replace(/\u0020/g, "");
              genre = genre.replace(/,+/g, ",");
              if (genre.indexOf(",") == 0) {
                genre = genre.substr(1);
              }
              if (genre.lastIndexOf(",") == genre.length - 1) {
                genre = genre.substr(0, genre.length - 1);
              }
              genre = genre.split(",");
//              console.log("uni:" + genre.codePointAt(0).toString(16));
              console.log("genre: " + genre);
            }
            else
            {
              genre = $(this).parent().text();
              genre = genre.replace("カテゴリ一覧:", "");
              genre = genre.replace(/\u000a/g, ",");
              genre = genre.replace(/\u0020/g, "");
              genre = genre.replace(/,+/g, ",");
              if (genre.indexOf(",") == 0) {
                genre = genre.substr(1);
              }
              if (genre.lastIndexOf(",") == genre.length - 1) {
                genre = genre.substr(0, genre.length - 1);
              }
              genre = genre.split(",");
              console.log("genre: " + genre);
            }
          }
          else if(text.indexOf("発売日") != -1)
          {
            release = $(this).parent().text();
            release = release.replace(/[^0-9\/]/g, "");
            var releaselist = release.split("/");
            if(releaselist.length == 3)
            {
              release = releaselist[2] + "/" + releaselist[0] + "/" + releaselist[1];
            }
            broadcast_release = release;
            console.log("release: " + release);
          }
          else if(text.indexOf("収録時間") != -1)
          {
            var dlist = $(this).parent().text();
            dlist = dlist.replace(/[^0-9]/g, "");
            duration = parseInt(dlist);
            console.log("duration: " + duration);
          }
        });
        threesize = "";
        director = "";
        service = "";
        hinban = $("div.top-title").text();
        hinban = hinban.replace("商品番号: ", "");
        prefix = hinban.substr(0, hinban.indexOf("-"));
        number = parseInt(hinban.replace(/[^0-9]/g, ""));
        anothername = "";
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        is_limited = false;
        is_dod = false;
        is_adultsite = false;
        is_exdvd = false;
        is_exbroadcast = false;
        is_exdvd = true;
        is_title_fixed = false;
        send_detail_message(false, "", "");
      }
      // カリビアンコムの場合
      else if(url.indexOf(baseurl_carib) != -1)
      {
        $("h1").each( function() {
          if($(this).attr("itemprop") == "name")
          {
            title = $(this).text();
            return false;
          }
        });
        console.log("title: " + title);
        is_adultsite = false;
        is_exdvd = false;
        is_exbroadcast = true;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        if($("div.movie-tag").find("div.is-vr").length > 0)
        {
          is_vr = true;
        }
        
        largeimg = url.replace("index.html", "l_l.jpg");
        smallimg = "&ref(" + largeimg + ", 226)";
        var castlist = "";
        $("li.movie-spec").each( function() {
          var text = $(this).children("span.spec-title").text();
          if(text.indexOf("出演") != -1)
          {
            castlist = $(this).children("span.spec-content").text();
            castlist = castlist.replace(/\u0009/g, "");
            castlist = castlist.replace(/\u000a/g, ",");
            if (castlist.indexOf(",") == 0) {
              castlist = castlist.substr(1);
            }
            if (castlist.lastIndexOf(",") == castlist.length - 1) {
              castlist = castlist.substr(0, castlist.length - 1);
            }
            cast = castlist.split(",");
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
        maker = "カリビアンコム";
        label = "";
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
        send_detail_message(false, "", "");
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
            var castlist = "";
            for(var i = 0; i < msg.ActressesJa.length; i++)
            {
              if(i != 0)
              {
                castlist += ",";
              }
              castlist += msg.ActressesJa[i];
            }
            cast = castlist.split(",");
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
            label = "";
            genre = msg.UCNAME;
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
            is_exdvd = false;
            is_exbroadcast = true;
            is_title_fixed = false;
            send_detail_message(false, "", "");
          }
        });
      }
      // HEYZOの場合
      else if(url.indexOf(baseurl_heyzo) != -1)
      {
        var movie_id = url.replace(/[^0-9]/g, "");
        title = $("div#movie").find("h1").first().text();
        title = title.replace(/\u000a/g, "");
        title = title.replace(/\u0020/g, "");
        title = title.replace(/\u0009/g, "");
        title = title.replace(/-/g, " - ");
        console.log("uni:" + title.codePointAt(0).toString(16));
        console.log("title: " + title);
        $("table.movieInfo").first().find("td").each( function() {
          var text = $(this).text();
          if(text.indexOf("公開日") != -1)
          {
            var release = $(this).next().text();
            release = release.replace(/-/g, "/");
            release = release.replace(/\u000a/g, "");
            release = release.replace(/\u0020/g, "");
            release = release.replace(/\u0009/g, "");
            broadcast_release = release;
//            console.log("uni:" + release.codePointAt(0).toString(16));
            console.log("release: " + release);
          }
          else if(text.indexOf("出演") != -1)
          {
            var castlist = $(this).next().text();
            castlist = castlist.replace(/\u000a/g, "");
            castlist = castlist.replace(/\u0020/g, "");
            castlist = castlist.replace(/\u0009/g, "");
            castlist = castlist.replace(/\u00a0/g, ",");
            if (castlist.indexOf(",") == 0) {
              castlist = castlist.substr(1);
            }
            if (castlist.lastIndexOf(",") == castlist.length - 1) {
              castlist = castlist.substr(0, castlist.length - 1);
            }
            cast = castlist.split(",");
            console.log("cast: " + cast);
          }
          else if(text.indexOf("タグキーワード") != -1)
          {
            var genreelem = $(this).next();
            if(genreelem.length > 0)
            {
              genre = genreelem.text();
              genre = genre.replace(/\u000a/g, ",");
              genre = genre.replace(/\u0020/g, "");
              genre = genre.replace(/\u0009/g, "");
              genre = genre.replace(/,+/g, ",");
              if (genre.indexOf(",") == 0) {
                genre = genre.substr(1);
              }
              if (genre.lastIndexOf(",") == genre.length - 1) {
                genre = genre.substr(0, genre.length - 1);
              }
              genre = genre.split(",");
              console.log("genre: " + genre);
            }
          }
        });
        maker = "HEYZO";
        label = "";
        series = "";
        threesize = "";
        director = "";
        service = "";
        hinban = "HEYZO-" + movie_id;
        prefix = "HEYZO";
        number = parseInt(movie_id);
        anothername = "";
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        is_limited = false;
        is_dod = false;
        is_adultsite = false;
        is_exdvd = false;
        is_exbroadcast = true;
        is_title_fixed = false;
        send_detail_message(false, "", "");
      }
      // 東京熱の場合
      else if(url.indexOf(baseurl_tokyohot) != -1)
      {
        title = $("div.contents").first().children("h2").first().text();
        genre = [];
        $("dl.info").find("dt").each( function() {
          var text = $(this).text();
          if(text.indexOf("出演者") != -1)
          {
            var castlist = "";
            $(this).next().find("a").each( function() {
              castlist += $(this).text() + ",";
            });
            if (castlist.lastIndexOf(",") == castlist.length - 1) {
              castlist = castlist.substr(0, castlist.length - 1);
            }
            cast = castlist.split(",");
            console.log("cast: " + cast);
          }
          else if(text.indexOf("プレイ内容") != -1)
          {
            var genrelist = "";
            $(this).next().find("a").each( function() {
              var gl = $(this).text();
              var added = false;
              for(var i = 0; i < genre.length; i++)
              {
                if(genre[i].match(gl))
                {
                  added = true;
                  break;
                }
              }
              if(!added)
              {
                genrelist += gl + ",";
              }
            });
            if (genrelist.lastIndexOf(",") == genrelist.length - 1) {
              genrelist = genrelist.substr(0, genrelist.length - 1);
            }
            genre = genre.concat(genrelist.split(","));
          }
          else if(text.indexOf("タグ") != -1)
          {
            var genrelist = "";
            $(this).next().find("a").each( function() {
              var gl = $(this).text();
              var added = false;
              for(var i = 0; i < genre.length; i++)
              {
                if(genre[i].match(gl))
                {
                  added = true;
                  break;
                }
              }
              if(!added)
              {
                genrelist += gl + ",";
              }
            });
            if (genrelist.lastIndexOf(",") == genrelist.length - 1) {
              genrelist = genrelist.substr(0, genrelist.length - 1);
            }
            genre = genre.concat(genrelist.split(","));
          }
          else if(text.indexOf("シリーズ") != -1)
          {
            series = "";
            $(this).next().find("a").each( function() {
              series += $(this).text() + ",";
            });
            if (series.lastIndexOf(",") == series.length - 1) {
              series = series.substr(0, series.length - 1);
            }
            // シリーズが複数ある場合は、最後がシリーズ名
            if(series.lastIndexOf(",") != -1)
            {
              series = series.substr(series.lastIndexOf(",") + 1);
            }
            console.log("series: " + series);
          }
          else if(text.indexOf("レーベル") != -1)
          {
            label = $(this).next().text();
            maker = label;
            console.log("label: " + label);
          }
          else if(text.indexOf("配信開始日") != -1)
          {
            release = $(this).next().text();
            console.log("release: " + release);
          }
          else if(text.indexOf("収録時間") != -1)
          {
            var dlist = $(this).next().text();
            dlist = dlist.split(":");
            if(dlist.length == 3)
            {
              duration = parseInt(dlist[0]) * 60 + parseInt(dlist[1]);
              if(parseInt(dlist[2]) >= 30)
              {
                duration += 1;
              }
            }
            console.log("duration: " + duration);
          }
          else if(text.indexOf("作品番号") != -1)
          {
            hinban = $(this).next().text();
            prefix = hinban.replace(/[0-9]\-/g, "");
            number = parseInt(hinban.replace(/[^0-9]/g, ""));
            console.log("hinban: " + hinban);
          }
        });
        console.log("genre: " + genre);
        threesize = "";
        director = "";
        service = "";
        anothername = "";
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        is_limited = false;
        is_dod = false;
        is_adultsite = false;
        is_exdvd = false;
        is_exbroadcast = true;
        is_title_fixed = false;
        send_detail_message(false, "", "");
      }
      // Getchuの場合
      else if(url.indexOf(baseurl_getchu) != -1)
      {
        title = $("meta[property='og:title']").attr('content');
        console.log("title: " + title);
        largeimg = $("meta[property='og:image']").attr('content');
        smallimg = "&ref(" + largeimg + ", 226)";
        $("td.bluetext").each( function() {
          var text = $(this).text();
          if(text.indexOf("サークル") != -1)
          {
            label = $(this).next().text();
            console.log("label: " + label);
          }
          else if(text.indexOf("配信開始日") != -1)
          {
            release = $(this).next().text();
            broadcast_release = release;
            console.log("release: "+ release);
          }
          else if(text.indexOf("趣向") != -1)
          {
            genre = $(this).next().text();
            console.log("genre: " + genre);
          }
        });
        maker = "Getchu";
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
        is_exdvd = false;
        is_exbroadcast = false;
        is_title_fixed = false;
        send_detail_message(is_search_wiki, baseurl_getchu, url);
      }
      // Twitterの場合
      else if(url.indexOf(baseurl_twitter) != -1)
      {
        title = $("div.css-1dbjc4n.r-15d164r.r-1g94qm0").text();
        title = title.substr(0, title.lastIndexOf("@")) + " (" + title.substr(title.lastIndexOf("@")) + ") | Twitter";
        console.log("title: " + title);
        $("div").each( function() {
          var id = $(this).attr("data-testid");
          if(id == "UserDescription")
          {
            anothername = $(this).text();
            anothername = anothername.replace("----\n**Twitter\n", "");
            anothername = anothername.replace(/\n/g, "~~\n>");
            anothername = ">" + anothername;
            console.log("description: " + anothername);
            return false;
          }
        });
        $("a").each( function() {
          var href = $(this).attr("href");
          var account_name = url.substr(url.indexOf("twitter.com/") + 12);
          if(href.indexOf(account_name + "/photo") != -1)
          {
            largeimg = $(this).find("img").attr("src");
            smallimg = "&ref(" + largeimg + ", 147)";
            console.log("img: " + largeimg);
            return false;
          }
        });
        maker = "";
        label = "";
        genre = [];
        threesize = "";
        director = "";
        service = "";
        hinban = "";
        prefix = "";
        number = 0;
        is_omnibus = false;
        is_iv = false;
        is_vr = false;
        is_limited = false;
        is_dod = false;
        is_adultsite = false;
        is_exdvd = false;
        is_exbroadcast = false;
        is_title_fixed = false;
        send_detail_message(false, "", "");
      }
      return true;
    }
    //================================================================================
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
      if(msg.largeimg.length > 0)
      {
        largeimg = msg.largeimg;
      }
      if(msg.smallimg.length > 0)
      {
        smallimg = msg.smallimg;
      }
      wiki_label = msg.wiki_label;
      wiki_series = msg.wiki_series;
      console.log("wiki label: " + wiki_label);
      send_detail_message(false, "", "");
      return true;
    //================================================================================
    // 次の作品を開く
    } else if (msg.type == "next_tab") {
      open_next_tab();
      console.log("next_tab");
      return true;
    }
    //================================================================================
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
      if(msg.is_replace_http)
      {
        msg.largeimg = msg.largeimg.replace("http://", "https://");
        msg.smallimg = msg.smallimg.replace("http://", "https://");
      }
      var matometitle = msg.title;
      var matomerelease = msg.release;
      if (msg.release == "") {
        matomerelease = msg.broadcast_release;
      }
      //================================================================================
      // 女優まとめページ用出力
      if (output == "actress") {
        console.log("msg.wiki_label: " + msg.wiki_label);
        console.log("msg.wiki_series: " + msg.wiki_series);
        if (msg.wiki_label.length > 0) {
          wiki_label = "　[[(レーベル一覧)>" + '<a class="actress_link" href="http://sougouwiki.com/d/' +EscapeEUCJP(msg.wiki_label) + '" target="_blank">' + msg.wiki_label + '</a>' + "]]";
        }
        if (msg.wiki_series.length > 0) {
          wiki_series = "　[[(シリーズ一覧)>" + '<a class="actress_link" href="http://sougouwiki.com/d/' +EscapeEUCJP(msg.wiki_series) + '" target="_blank">' + msg.wiki_series + '</a>' + "]]";
        }
        var cast_list = "";
        var omnibus = "";
        // 2人以上のときは出演者を表示
        if (msg.cast.length >= 2) {
          cast_list = "出演者：[[";
          for(var i = 0; i < msg.cast.length; i++)
          {
            if(msg.url.indexOf(baseurl_dmm) != -1 && msg.cast[i] == "/")
            {
               omnibus = "男優：";
               for(var j = i + 1; j < msg.cast.length; j++)
               {
                 if(j != i + 1)
                 {
                   omnibus += "／";
                 }
                 omnibus += msg.cast[j];
               }
               omnibus += "\n<br>";
               break;
            }
            if(i != 0)
            {
              cast_list += "]]／[[";
            }
            cast_list += '<a class="actress_link" href="http://sougouwiki.com/d/' +EscapeEUCJP(msg.cast[i]) + '" target="_blank">' + msg.cast[i] + '</a>';
          }
          cast_list += "]]\n<br>";
        }
        matomerelease = matomerelease.replace(/\u002f/g, '.');
        
        var matomelabel = "";
        var matomehinban = "";
        if(msg.hinban.length > 0)
        {
          matomehinban = " " + msg.hinban;
        }
        var matomelimited = "";
        // レーベル名の方がメーカー名より短く、かつメーカー名が「レーベル名/メーカー名」になっている場合は、レーベル名とメーカー名を同一にする
        if(msg.label.length < msg.maker.length)
        {
          if(msg.maker.indexOf(msg.label + "/") != -1)
          {
             msg.label = msg.maker;
          }
        }
        // レーベル名未記載の場合
        if(msg.label == "" || msg.label == "----")
        {
          // メーカー名も未記載の場合は無視
          if(msg.maker == "" || msg.maker == "----")
          {
          
          }
          // メーカー名があれば、メーカー名を記載
          else
          {
            matomelabel = msg.maker;
          }
        }
        // レーベル名記載ありの場合
        else
        {
          // メーカー名が未記載、またはレーベル名と同じ場合は、レーベル名のみ記載
          if(msg.maker == msg.label || msg.maker == "" || msg.maker == "----")
          {
            matomelabel = msg.label;
          }
          // メーカー名、レーベル名がそれぞれ存在する場合は、メーカー／レーベルで記載
          else
          {
            matomelabel = msg.maker + "／" + msg.label;
          }
        }
        // 限定盤の際は、その注意を記載
        if(msg.is_limited)
        {
          matomelimited = "<font color='red'>こちらは限定盤商品です。ご注意ください。</font>\n</br>"
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
        // U-NEXT/FALENOの場合
        else if(msg.url.indexOf(baseurl_unext) != -1 || msg.url.indexOf(baseurl_faleno) != -1)
        {
          matometitle = "";
          if(msg.maker.length > 0)
          {
            matometitle = msg.maker + " ";
          }
          matometitle += msg.title;
          matomelabel = "";
          if(msg.label.length > 0)
          {
            matomelabel = msg.label;
          }
        }
        // Perfect-G/舞ワイフ/RealFile/HimeMix/GIRL'S BLUE/Happy Fish/Tokyo247/S-Cuteの場合
        else if(msg.url.indexOf(baseurl_perfectg) != -1 || msg.url.indexOf(baseurl_mywife) != -1 || msg.url.indexOf(baseurl_realfile) != -1 || msg.url.indexOf(baseurl_himemix) != -1 || msg.url.indexOf(baseurl_girlsblue) != -1 || msg.url.indexOf(baseurl_happyfish) != -1 || msg.url.indexOf(baseurl_tokyo247) != -1 || msg.url.indexOf(baseurl_scute) != -1)
        {
          matometitle = "";
          if(msg.maker.length > 0)
          {
            matometitle = msg.maker + " ";
          }
          if(msg.label.length > 0)
          {
            matometitle += msg.label + " ";
          }
          if(msg.url.indexOf(baseurl_scute) != -1)
          {
            matometitle += msg.title + " " + anothername;
          }
          else
          {
            matometitle += "No." + number + " " + anothername;
          }
          matomelabel = "";
          matomehinban = "";
        }
        // FC2/デジグラ/LOVEPOP/色眼鏡/カリビアンコム/一本道/HEYZO/東京熱の場合
        else if(msg.url.indexOf(baseurl_fc2) != -1 || msg.url.indexOf(baseurl_digigra) != -1 || msg.url.indexOf(baseurl_lovepop) != -1 || msg.url.indexOf(baseurl_iromegane) != -1 || msg.url.indexOf(baseurl_carib) != -1 || msg.url.indexOf(baseurl_pondotv) != -1 || msg.url.indexOf(baseurl_heyzo) != -1 || msg.url.indexOf(baseurl_tokyohot) != -1)
        {
          matometitle = "";
          if(msg.maker.length > 0)
          {
            matometitle = msg.maker + " ";
          }
          if(msg.label.length > 0 && !msg.label.match(msg.maker))
          {
            matometitle += msg.label + " ";
          }
          matometitle += msg.title;
          matomelabel = "";
        }
        
        // デジグラ/LOVEPOPの場合
        if(msg.url.indexOf(baseurl_digigra) != -1 || msg.url.indexOf(baseurl_lovepop) != -1)
        {
            // sougouwikiから画像を引っ張ってこれた場合はOK
            if(msg.largeimg.indexOf(baseurl_seesaa) == -1)
            {
              var dlimg = 'サムネイル画像リンク：<a href="' + msg.largeimg + '" target="_blank" download="' + msg.largeimg.substr(msg.largeimg.lastIndexOf("/") + 1) + '">' + msg.largeimg + '</a>\n<br>';
              dlimg += '<div class="upload_link_' + msg.hinban + '"><form class="upload_to_sougouwiki" method="post"><input class="actress_name_for_sougouwiki" type="text" name="name" placeholder="女優名" value="' + msg.cast +'"><br></form><button class="button_for_sougouwiki" data-image="' + msg.largeimg + '">アップロード先リンクを取得</button></div>';
              $("body").find("div#adultsite_works").append(dlimg);
              msg.largeimg = "<font color='red'>サムネイル画像ファイルをsougouwiki.comにアップロードする必要があります</font>";
              msg.smallimg = "&ref(" + msg.largeimg + ", 226)";
            }
        }
               
        if(matomelabel.length > 0)
        {
          matomelabel = "（" + matomelabel + "）";
        }
        
        var joyumatome = '<span class="matome_' + msg.hinban + '"> //' + matomerelease + matomehinban + "\n<br>" + "[[" + matometitle + matomelabel + ">" + msg.url + "]]" + wiki_label + wiki_series + "\n<br>" + "[[" + msg.smallimg + ">" + msg.largeimg + "]]" + "\n<br>" + cast_list + omnibus + matomelimited + "\n<br></span>";
        // アダルトサイトと配信系は、総集編／VR／IV／であっても、それぞれのカテゴリに表示
        if (msg.is_adultsite) {
          $("body").find("div#adultsite_works").attr("style", "visibility:visible");
          $("body").find("div#adultsite_works").append(joyumatome);
        } else if(msg.is_exdvd) {
            joyumatome = "//" + matomerelease + matomehinban + "\n<br>" + "-[[" + matometitle + matomelabel + ">" + msg.url + "]]" + "\n<br>" + cast_list + "\n<br>";
            $("body").find("div#exdvd_works").attr("style", "visibility:visible");
            $("body").find("div#exdvd_works").append(joyumatome);
        } else if (msg.is_exbroadcast) {
          joyumatome = '<span class="matome_' + msg.hinban + '"> //' + matomerelease + matomehinban + "\n<br>" + "-[[" + matometitle + matomelabel + ">" + msg.url + "]]" + "\n<br>" + cast_list + "\n<br></span>";
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
        // Getchuの場合
        } else if(msg.url.indexOf(baseurl_getchu) != -1)
        {
          $("body").find("div#doujin_works").attr("style", "visibility:visible");
          $("body").find("div#doujin_works").append(joyumatome);
        // Twitterの場合
        } else if(msg.url.indexOf(baseurl_twitter) != -1)
        {
          joyumatome = '<span class="matome_' + msg.hinban + '"> //' + "[[" + matometitle + ">" + msg.url + "]]\n" + "[[" + msg.smallimg + ">" + msg.largeimg + "]]\n" + msg.cast + "\n<br><br><br></span>";
          $("body").find("div#twitter_part").attr("style", "visibility:visible");
          $("body").find("div#twitter_part").append(joyumatome);
        } else {
          $("body").find("div#basic_works").append(joyumatome);
        }
        if(msg.is_title_fixed)
        {
          var alert = $("div#title_fix_alert");
          if(alert.length == 0)
          {
            var adddiv = "<div id='title_fix_alert'><font color='red'>※ 赤字のタイトルは伏字を予測解除しています。コピペする際は注意してください。</font><br><br></div>";
            $("div#dmm2ssw_pagetop").prepend(adddiv);
          }
        }
        // 女優が一人の場合で、個別ページのとき
        if(msg.cast.length == 1 && is_detail_page)
        {
          if(!msg.cast[0].match("----"))
          {
            var actress_link = '<div class="actress_link" align="left"><font color="red"><a class="actress_link" href="http://sougouwiki.com/d/' +EscapeEUCJP(msg.cast[0]) + '" target="_blank">' + msg.cast[0] + '</a></font></div>';
            
            $("div#dmm2ssw_pagetop").append(actress_link);
          }
        }
      }
      //================================================================================
      // レーベルまとめページ用出力
      else
      {
        var matomecast = "";
        var omnibus = "";
        // 出演者情報なしの場合
        if (msg.cast.length == 0) {
          // 別名があるとき
          if (msg.anothername.length > 0) {
            matomecast = msg.anothername.replace(/\(/g, '');
            matomecast = matomecast.replace(/\)/g, '');
            matomecast = matomecast.replace(/[0-9]/g, '');
            matomecast = "(" + matomecast.replace("＆", ")／(") + ")";
          }
        }
        // 誰も情報がない場合
        else if (msg.cast[0].match("----")) {
          matomecast = "[[ ]]";
        }
        else
        {
          matomecast = "[[";
          for(var i = 0; i < msg.cast.length; i++)
          {
            if(msg.url.indexOf(baseurl_dmm) != -1 && msg.cast[i] == "/")
            {
               omnibus = "男優：";
               for(var j = i + 1; j < msg.cast.length; j++)
               {
                 if(j != i + 1)
                 {
                   omnibus += "／";
                 }
                 omnibus += msg.cast[j];
               }
               break;
            }
            if(i != 0)
            {
              matomecast += "]]／[[";
            }
            matomecast += '<a class="actress_link" href="http://sougouwiki.com/d/' +EscapeEUCJP(msg.cast[i]) + '" target="_blank">' + msg.cast[i] + '</a>';
          }
          matomecast += "]]";
        }
        matomerelease = matomerelease.replace(/\u002f/g, '-');
        if (url.indexOf(baseurl_dmm) != -1 && msg.is_adultsite) {
          matometitle = msg.anothername + "~~" + msg.threesize;
        }
        if (msg.is_omnibus) {
          if(omnibus.length > 0)
          {
             omnibus = "総集編作品~~" + omnibus;
          }
          else
          {
             omnibus = "総集編作品";
          }
        }
        var labelmatome = "";
        labelmatome = "";
        // 連番出力の場合は、連番の抜けを埋める
        if(is_renban && msg.number > 0)
        {
          var sum = 1;
          while(number + sum < msg.number)
          {
            var thishinban = msg.hinban.replace(String(msg.number), String(number + sum));
            // 既に要素がある場合は無視
            if($("span.matome_" + thishinban).length > 0)
            {
               sum++;
               continue;
            }
            else
            {
               var labelspan = '<span class="matome_' + thishinban + '"></span>';
                $("body").find("div#basic_works").append(labelspan);
            }
            labelmatome = "";
            // 10連番ごとに見出し行を挿入
            if((number+sum)%10 == 1)
            {
              if (!is_director) {
                labelmatome += "|~NO|PHOTO|TITLE|ACTRESS|RELEASE|NOTE|\n<br>";
              }
              else
              {
                labelmatome += "|~NO|PHOTO|TITLE|ACTRESS|DIRECTOR|RELEASE|NOTE|\n<br>";
              }
            }
            labelmatome += last_labelmatome.split(String(number)).join(String(number + sum));
            // 最初の場合
            if(is_first_product)
            {
              labelmatome += "|[[" + msg.hinban + ">" + msg.url + "]]|[[" + msg.smallimg + ">" + msg.largeimg + "]]|||--||\n<br>";
              labelmatome = labelmatome.split(String(msg.number)).join(String(number + sum));
            }
            $("span.matome_" + thishinban).first().append(labelmatome);
            // 最初の場合は一旦隠す
            if(is_first_product)
            {
              $("span.matome_" + thishinban).first().hide();
            }
            console.log("insert spans");
            sum++;
          }
        }
        labelmatome = "";
        // 最初じゃない
        if(!is_first_product)
        {

          // 10連番ごとに見出し行を挿入
          if(msg.number%10 == 1)
          {
            if (!is_director) {
              labelmatome += "|~NO|PHOTO|TITLE|ACTRESS|RELEASE|NOTE|\n<br>";
            }
            else
            {
              labelmatome += "|~NO|PHOTO|TITLE|ACTRESS|DIRECTOR|RELEASE|NOTE|\n<br>";
            }
          }
        }
        else
        {
          var adddiv = '<div class="another_wikipage_link"></div><br>';
            $("div#dmm2ssw_pagetop").append(adddiv);
        }
        number = msg.number;
        is_first_product = false;
        
        if(number > 0)
        {
           var num_page = Math.floor((number- 1) / 200);
           console.log("link_num: " + $("div.another_wikipage_link_" + num_page).length);
           if($("div.another_wikipage_link_" + num_page).length > 0)
           {
           }
           else
           {
             var labeltitle = " ";
             if(dmm_label_name.length > 0)
             {
               labeltitle = dmm_label_name;
               if(num_page > 0)
               {
                 labeltitle += " " + (num_page + 1);
               }
             }
             labeltitle = '<a class="label_link" href="http://sougouwiki.com/d/' +EscapeEUCJP(labeltitle) + '" target="_blank">' + labeltitle + '</a>';
             var adddiv = "<div class='another_wikipage_link_" + num_page + "'>※(注)''" + msg.prefix + "-" + (num_page * 2) + "01～" + msg.prefix + "-" + (num_page * 2 + 2) + "00の作品については「[[" + labeltitle + "]]」をご覧ください。''<br></div>";
               $("div.another_wikipage_link").append(adddiv);
               console.log("another wikipagelink added.");
           }
        }

        // 既に要素がある場合は中身を消して上書き
        if($("span.matome_" + msg.hinban).length > 0)
        {
          var span = $("span.matome_" + msg.hinban);
          span.empty();
          console.log("found span: " + msg.hinban + ", replace it.");
          // もし要素が隠れてる場合は、隠れてる要素を表示
          if(span.is(":hidden"))
          {
             var sum = 1;
             while(span.length > 0 && span.is(":hidden"))
             {
               span.show();
               var nexthinban = msg.hinban.replace(String(msg.number), String(number + sum));
               sum++;
               span = $("span.matome_" + nexthinban);
             }
          }
        }
        else
        {
            var labelspan = '<span class="matome_' + msg.hinban + '"></span>';
            $("body").find("div#basic_works").append(labelspan);
        }
        if (!is_director) {
          labelmatome += "|[[" + msg.hinban + ">" + msg.url + "]]|[[" + msg.smallimg + ">" + msg.largeimg + "]]|" + msg.title + "|" + matomecast + "|" + matomerelease + "|" + omnibus + "|\n<br>";
          last_labelmatome = "|[[" + msg.hinban + ">" + msg.url + "]]|[[" + msg.smallimg + ">" + msg.largeimg + "]]|||--||\n<br>";
        }
        else
        {
          labelmatome += "|[[" + msg.hinban + ">" + msg.url + "]]|[[" + msg.smallimg + ">" + msg.largeimg + "]]|" + matometitle + "|" + matomecast + "|" + msg.director + "|" + matomerelease + "|" + omnibus + "|\n<br>";
          last_labelmatome = "|[[" + msg.hinban + ">" + msg.url + "]]|[[" + msg.smallimg + ">" + msg.largeimg + "]]||||--||\n<br>";
        }
        $("span.matome_" + msg.hinban).first().append(labelmatome);
      }
      if(msg.is_title_fixed)
      {
        var alert = $("div#title_fix_alert");
        if(alert.length == 0)
        {
          var adddiv = "<div id='title_fix_alert'><font color='red'>※ 赤字のタイトルは伏字を予測解除しています。コピペする際は注意してください。</font><br><br></div>";
            $("div#dmm2ssw_pagetop").prepend(adddiv);
        }
      }
      console.log("result: " + msg.hinban);
      return true;
    }
    //================================================================================
    // 結果表示
    else if (msg.type == "uploadlink") {
      $("div." + msg.classname).first().empty();
      var uploadlink = 'アップロード先リンク：<a class="' + msg.classname + '" href="' + msg.uploadlink + '" target="_blank">' + msg.uploadlink + '</a>';
      $("div." + msg.classname).first().append(uploadlink);
    }
    return true;
  });
 
  //================================================================================
  open_next_tab = function () {
    if (link_list.length > 0) {
      console.log("send message: open_detail");
      chrome.runtime.sendMessage({
        type: "open_detail",
        url: url,
        link: link_list[0],
        output: output,
        is_search_wiki: is_search_wiki,
        is_search_release_with_wiki: is_search_release_with_wiki,
        is_replace_http: is_replace_http,
        is_add_www: is_add_www
      });
      link_list.splice(0, 1);
    }
  };
 
  //================================================================================
  initialize = function() {
    link_list = [];
    copy_list = [];
    url = "";
    output = "";
    div_to_add = null;
    self = false;
    is_replace_http = false;
    is_add_www = false;
    is_renban = false;
    is_director = false;
    is_ignore_limited = false;
    is_ignore_dod = false;
    is_search_wiki = false;
    is_search_release_with_wiki = false;
    is_first_product = false;
    is_detail_page = false;
    last_labelmatome = "";
    dmm_label_name = "";
    title = "";
    service = "";
    duration = "";
    release = "";
    broadcast_release = "";
    director = "----";
    label = "";
    maker = "";
    series = "";
    cast = [];
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
    is_exdvd = false;
    is_exbroadcast = false;
    is_limited = false;
    is_dod = false;
    is_title_fixed = false;
    title_list = [];
  };
 
  //================================================================================
  send_to_parse = function() {
    self = true;
    console.log("send message: to_parse");
    chrome.runtime.sendMessage({
      type: "to_parse",
      url: url,
      link: url,
      output: output,
      is_search_wiki: is_search_wiki,
      is_search_release_with_wiki: is_search_release_with_wiki,
      is_replace_http: is_replace_http,
      is_add_www: is_add_www
    });
  };
 
  //================================================================================
  send_detail_message = function(send_wiki, searchurl, suburl) {
    // レーベル名の方がメーカー名より長く、かつレーベル名にメーカー名が含まれる場合は、レーベル名の中からメーカー名を削除
    if(maker.length > 0 && label.length > maker.length)
    {
      if(label.indexOf(maker) != -1)
      {
        console.log("label: " + label + " is including maker: " + maker);
        label = label.replace(maker, "");
        label = label.replace("（）", ""); // 空になったカッコがあれば、消す
        console.log("label: " + label);
      }
    }
    // レーベル名とメーカー名が違って、メーカー名が「メーカー名/配信元」になっている場合、メーカー名から配信元を削除
    if(label != maker && maker.indexOf(label) == -1)
    {
      if(maker.indexOf("/") != -1)
      {
        maker = maker.substr(0, maker.indexOf("/"));
      }
    }
    // レーベル名が「レーベル名/配信元（またはメーカー名）のようになっている場合は、レーベル名からメーカー名を削除
    if(label.indexOf("/") != -1)
    {
       label = label.substr(0, label.indexOf("/"));
    }
    console.log("is_search_wiki:" + send_wiki);
    if (send_wiki && output == "actress") {
      var pos = suburl.indexOf(searchurl);
      if (pos != -1) {
        suburl = suburl.substr(pos);
      }
      console.log("send message: open_next_wiki");
      chrome.runtime.sendMessage({
        type: "open_next_wiki",
        url: url,
        suburl: suburl,
        label: label,
        maker: maker,
        series: series,
        prefix: prefix,
        output: output,
        is_search_wiki: is_search_wiki,
        is_search_release_with_wiki: is_search_release_with_wiki,
        is_replace_http: is_replace_http,
        is_add_www: is_add_www
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
        number: number,
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
        is_exdvd: is_exdvd,
        is_exbroadcast: is_exbroadcast,
        is_limited: is_limited,
        is_dod: is_dod,
        output: output,
        is_search_wiki: is_search_wiki,
        is_search_release_with_wiki: is_search_release_with_wiki,
        is_title_fixed: is_title_fixed,
        is_replace_http: is_replace_http,
        is_add_www: is_add_www
      }, function (response) {
        if (!self) {
          window.close();
        }
        console.log("response received");
      });
    }
  };
  
  //================================================================================
  $("body").on("click", function(e) {
    var text = $(e.target).text();
    if(text.indexOf("アップロード先リンクを取得") != -1)
    {
      var actress_name_for_sougouwiki = $(e.target).parent().find("input.actress_name_for_sougouwiki").val();
      var encoded = EscapeEUCJP(actress_name_for_sougouwiki);
      var classname = $(e.target).parent().attr("class");
      chrome.runtime.sendMessage({
        type: "upload_to_sougouwiki",
        cast: actress_name_for_sougouwiki,
        castencoded: encoded,
        classname: classname
      });
    }
  });
}).call(this);
