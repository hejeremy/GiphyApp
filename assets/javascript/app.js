//
/* GiphyApp
 * HW - 06
 *
 * Jeremy He
 * Created: 6-21-2017
 * Last Edited: 6-22-2017
 */
//

//Start Here!
var gifList = [];

if (localStorage.getItem('jeremyGifList') === null) {
    localStorage.setItem('jeremyGifList', JSON.stringify(gifList));
} else {
    gifList = JSON.parse(localStorage.getItem('jeremyGifList'));
}

function renderButton(inputArray) {
    $('#buttonHolder').empty();
    localStorage.setItem('jeremyGifList', JSON.stringify(gifList));

    for (var i=0; i<inputArray.length; i++) {
        var newDiv = $('<div>');
        newDiv.addClass('buttonDiv');

        var newButton = $('<button>');
        newButton.addClass('btn btn-default displayGif');
        newButton.data('data-value', inputArray[i]);
        newButton.text(inputArray[i]);

        var removeThis = $('<button>');
        removeThis.addClass('btn btn-default removeButton');
        removeThis.data('data-value', inputArray[i]);
        removeThis.text('x');

        newDiv.append(newButton);
        newDiv.append(removeThis);
        $('#buttonHolder').append(newDiv);
    }
}

renderButton(gifList);

$(document).on('mouseup', '.displayGif', displayGif);

function displayGif() {
    var apiKey = 'dc6zaTOxFJmzC';

    var parameters = {
        'q': $(this).data('data-value'),
        'api_key': apiKey,
        'limit': 10,
    }

    var queryURL = "https://api.giphy.com/v1/gifs/search?"
        + $.param(parameters);

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).done(function(info) {
        var results = info.data;

        $('#gifHolder').empty();

        results.forEach(renderGif);
    }).fail(function(error) {
        throw error;
    });
}

function renderGif(inputObject) {
    var newGif = $('<div>');
    newGif.addClass('gifFrame');
    var newP = $('<p>');
    newP.text('Rating: ' + inputObject.rating.toUpperCase());
    var newImage = $('<img>');
    newImage.addClass('gifClick');
    var staticImage = inputObject.images.fixed_height_still.url;
    var animatedImage = inputObject.images.fixed_height.url;
    newImage.attr('src', staticImage);
    newImage.attr('animatedLink', animatedImage);
    newImage.attr('staticLink', staticImage);
    newImage.attr('playStatus', 'static');

    newGif.append(newP);
    newGif.append(newImage);

    $('#gifHolder').append(newGif);
}

$(document).on('mouseup', '.removeButton', removeButton);

function removeButton() {
    gifList.splice(gifList.indexOf($(this).data('data-value')),1);
    renderButton(gifList);
}

function gifClick() {
    var playStatus = $(this).attr('playStatus');
    var newStatus;

    if (playStatus === 'static') {
        $(this).attr('playStatus', 'animated');
        $(this).attr('src', $(this).attr('animatedLink'));
    } else {
        $(this).attr('playStatus', 'static');
        $(this).attr('src', $(this).attr('staticLink'));
    }
}

$(document).on('click', '.gifClick', gifClick);

function addButton() {
    event.preventDefault();
    var newValue = $('#searchValue').val().trim();
    if (gifList.indexOf(newValue) > -1 || newValue === '') {
        //alert('Search query ' + newValue + ' already in list!');
        return;
    } else {
        gifList.push(newValue);
        $('#searchValue').val('');
        renderButton(gifList);
    }
}

$(document).on('click', '#addGif', addButton);
$(document).on('click', '#clearGif', function() {
    $('#gifHolder').empty();
});
