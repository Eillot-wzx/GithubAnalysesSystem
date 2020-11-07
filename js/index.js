function queryData(url) {
    if (url.indexOf('?') == -1) {
        // 第一次需要将数据展示出来
        $("table").show();
        // 将展示区域清空
        $("tbody").empty()
        nextUrl = ""
    }


    $.ajax({
        // url: "https://api.github.com/repos/" + owner + "/" + repo + "/contributors" + page === 0 ? "" : "?page=" + page,
        url: url,
        async: false,
        success: function (data, textStatus, jqXHR) {
            for (var value of data) {
                dom = "<tr>\n" +
                    "            <th scope=\"row\">\n" +
                    "                <img src=\"" + value['avatar_url'] + "\"\n" +
                    "                     style=\"height: 38px;width: 38px; border-radius: 50%\">\n" +
                    "                <label>" + value['login'] + "</label>\n" +
                    "            </th>\n" +
                    "            <td>" + value['contributions'] + "</td>\n" +
                    "            <td>" + value['type'] + "</td>\n" +
                    "            <td><a href=\"" + value['html_url'] + "\">" + value['html_url'] + "</a></td>\n" +
                    "        </tr>"
                $("tbody").append(dom);
            }
            links = jqXHR.getResponseHeader("link");
            urlReg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
            if (links) {
                linkData = links.split(",")
                for (let valueKey of linkData) {
                    // trans = valueKey.split(";")[1]
                    // dumpUrl = valueKey.split(";")[0]
                    if (valueKey.indexOf("rel=\"next\"") != -1) {
                        nextUrl = valueKey.match(urlReg)[0];
                        return;
                        console.log(nextUrl)
                        // queryData(nextUrl)
                    }
                }
                nextUrl = "";
            }

        }
    });
}

// 查询按钮点击事件
$("#queryButton").click(function () {
    var owner = $("#ownerInput").val();
    var repo = $("#repoInput").val();
    if (owner === "" || repo === "") {
        alert("请将需要查询的仓库地址补充完整！！！")
    } else {
        firstUrl = "https://api.github.com/repos/" + owner + "/" + repo + "/contributors";
        queryData(firstUrl);
    }

})
// 复位按钮点击事件
$("#resetButton").click(function () {
    $("#ownerInput").val("");
    $("#repoInput").val("");
})

$(window).on('scroll', function () {
    if (scrollTop() + windowHeight() >= (documentHeight() - 50/*滚动响应区域高度取50px*/)) {
        // alert(222) # 在这里完善一下 滚动条的防抖策略
        if (nextUrl && nextUrl !== "") {
            queryData(nextUrl);
        }
    }
});

//获取页面顶部被卷起来的高度
function scrollTop() {
    return Math.max(
        //chrome
        document.body.scrollTop,
        //firefox/IE
        document.documentElement.scrollTop);
}

//获取页面文档的总高度
function documentHeight() {
    //现代浏览器（IE9+和其他浏览器）和IE8的document.body.scrollHeight和document.documentElement.scrollHeight都可以
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}

function windowHeight() {
    return (document.compatMode == "CSS1Compat") ?
        document.documentElement.clientHeight :
        document.body.clientHeight;
}

$(function () {
    // 没有数据的时候 将表格隐藏
    $("table").hide();
})



