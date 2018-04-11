$(document).ready(function () {
    
    // Show home component
    $('#menu-home').click(function () { 
        $('#instructions').hide();
        $('#play').hide();
        $('#home').show();
    })

    // Show instructions component
    $('#menu-inst').click(function () { 
        $('#home').hide();
        $('#play').hide();
        $('#instructions').show(); 
    })

    // Show play component
    $('#menu-play').click(function () { 
        $('#home').hide();
        $('#instructions').hide();
        $('#play').show(); 
    })

})