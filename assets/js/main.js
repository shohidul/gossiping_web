
loadPage("pages/home.html");

function loadPage(pageURL){
    $('#mainContent').load(pageURL);
}

function loadPageByJS(buttonID, pageURL){
    $(buttonID).on("click", function(){
        $('#mainContent').load(pageURL);
    });
}