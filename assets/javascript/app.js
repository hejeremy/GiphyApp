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

//Access local storage
if (localStorage.getItem('jeremyheGifList') === null) {
    localStorage.setItem('jeremyheGifList', JSON.stringify(gifList));
} else {
    gifList = JSON.parse(localStorage.getItem('jeremyheGifList'));
}

function renderButton(inputArray) {
    $('#buttonHolder').empty();
    localStorage.setItem('jeremyheGifList', JSON.stringify(gifList));

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
        removeThis.text('X');

        newDiv.append(newButton);
        newDiv.append(removeThis);
        $('#buttonHolder').append(newDiv);
    }
}

renderButton(gifList);

//Creates a searchQuery value in case of refresh
var searchQuery = '';
$(document).on('mouseup', '.displayGif', function() {
    searchQuery = $(this).data('data-value');
    displayGif(searchQuery);
});

//Options for different search parameters
//Display limit
var displayLimit = $('#displayLimit');
var displayOptions = $('<select>');
displayOptions.attr('id', 'displayOptions');
for (var i=1; i<5; i++) {
    var option = $('<option>');
    option.attr('value', i*5);
    if (i === 2) {
        option.attr('selected', 'selected');
    }
    option.text(i*5);
    displayOptions.append(option);
}
displayLimit.html(displayOptions);
displayOptions.on('change', function() {
    if (searchQuery !== '') {
        refreshButton.css('visibility', 'visible');
    }
});

//Catagories such as trending, recent, etc
var catagoryType = $('#catagoryType');
catagoryOptions = $('<select>');
catagoryOptions.append('<option selected=\'selected\' value=\'search?\'>Search</option>');
catagoryOptions.append('<option value=\'trending?\'>Trending</option>');
//catagoryOptions.append('<option value=\'random?\'>Random</option>');
catagoryType.html(catagoryOptions);
catagoryOptions.on('change', function() {
    refreshButton.css('visibility', 'visible');
});

//Refresh button
var refreshButton = $('<button>');
refreshButton.addClass('btn btn-primary');
refreshButton.attr('id', 'refreshButton');
refreshButton.text('Reload Display');
$('#extraButton').html(refreshButton);
refreshButton.on('mouseup', function() {
    displayGif(searchQuery);
    refreshButton.css('visibility', 'hidden');
});
refreshButton.css('visibility', 'hidden');

function displayGif(inputQuery) {
    var apiKey = 'dc6zaTOxFJmzC';
    var apiURL = "https://api.giphy.com/v1/gifs/";
    var searchType = catagoryOptions.val();
    //console.log(searchType);

    var parameters = {
        'q': inputQuery,
        'api_key': apiKey,
        'limit': parseInt(displayOptions.val()),
    }

    //console.log(parseInt(displayOptions.val()));

    var queryURL = "https://api.giphy.com/v1/gifs/"
        + searchType
        + $.param(parameters);
    //console.log(queryURL);

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

//Function for rendering gifs
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

//Function for removing an added query from the button list
function removeButton() {
    gifList.splice(gifList.indexOf($(this).data('data-value')),1);
    renderButton(gifList);
}

//Handles when a gif is clicked
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

//Adds buttons from query search
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

//Clears searchQuery and empties #gifHolder
$(document).on('click', '#clearGif', function() {
    searchQuery = '';
    $('#gifHolder').empty();
});
