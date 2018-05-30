
/* 1st way*/
/* $.ajax({
        url: 'test.html',
        type: 'get',
        success: function(data){
            //If the success function is execute,
            //then the Ajax request was successful.
            //Add the data we received in our Ajax
            //request to the "content" div.
            $('#content').html(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Ajax request failed: ' + xhr.responseText;
            $('#content').html(errorMsg);
          }
    });*/

/* 2nd way*/

loadPage("pages/home.html");

function loadPage(pageURL){
    $('#mainContent').load(pageURL);
}

function loadPageByJS(buttonID, pageURL){
    $(buttonID).on("click", function(){
        $('#mainContent').load(pageURL);
    });
}