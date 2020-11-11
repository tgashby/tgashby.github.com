$(function() {
    var selected = null;

    $("a.section").each(function() {
        var defaultId = "work";
        if($(this).attr("id") != defaultId) {
            var ele = $("#" + $(this).attr("id") + "-content");
            ele.css("top", "-20px");
            ele.css("opacity", "0.0");
        } else {
            selected = $("#" + $(this).attr("id") + "-content");
            selected.css("z-index", "2");
        }
    });

    $("a.section").click(function() {
        var ele = $("#" + $(this).attr("id") + "-content");

        if(selected != null) {
            if(ele.attr("id") == selected.attr("id")) {
                return false;
            }

            selected.animate({
                opacity : 0.0,
                top : "20px"
            }, 300, function() {
                $(this).css("top", "-20px");
            });
            selected.css("z-index", "1");
        }

        ele.animate({
            opacity : 1.0,
            top : "0px"
        }, 300);
        ele.css("z-index", "2");
        selected = ele;

        return false;
    });
});