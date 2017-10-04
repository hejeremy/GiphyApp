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
let gifList = [];

//Access local storage
if (localStorage.getItem('jeremyheGifList') === null) {
    localStorage.setItem('jeremyheGifList', JSON.stringify(gifList));
} else {
    gifList = JSON.parse(localStorage.getItem('jeremyheGifList'));
}

function renderButton(inputArray) {
    $('#buttonHolder').empty();
    localStorage.setItem('jeremyheGifList', JSON.stringify(gifList));

    for (let i=0; i<inputArray.length; i++) {
        const newDiv = $('<div>');
        newDiv.addClass('buttonDiv');

        const newButton = $('<button>');
        newButton.addClass('btn btn-default displayGif');
        newButton.data('data-value', inputArray[i]);
        newButton.text(inputArray[i]);

        const removeThis = $('<button>');
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
let searchQuery = '';
$(document).on('mouseup', '.displayGif', function() {
    searchQuery = $(this).data('data-value');
    displayGif(searchQuery);
});

//Options for different search parameters
//Display limit
const displayLimit = $('#displayLimit');
const displayOptions = $('<select>');
displayOptions.attr('id', 'displayOptions');
for (let i=1; i<5; i++) {
    const option = $('<option>');
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
const catagoryType = $('#catagoryType');
catagoryOptions = $('<select>');
catagoryOptions.append('<option selected=\'selected\' value=\'search?\'>Search</option>');
catagoryOptions.append('<option value=\'trending?\'>Trending</option>');
//catagoryOptions.append('<option value=\'random?\'>Random</option>');
catagoryType.html(catagoryOptions);
catagoryOptions.on('change', function() {
    refreshButton.css('visibility', 'visible');
});

//Refresh button
const refreshButton = $('<button>');
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
    const apiKey = 'dc6zaTOxFJmzC';
    const apiURL = "https://api.giphy.com/v1/gifs/";
    const searchType = catagoryOptions.val();
    //console.log(searchType);

    const parameters = {
        'q': inputQuery,
        'api_key': apiKey,
        'limit': parseInt(displayOptions.val()),
    }

    //console.log(parseInt(displayOptions.val()));

    const queryURL = "https://api.giphy.com/v1/gifs/"
        + searchType
        + $.param(parameters);
    //console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).done(function(info) {
        const results = info.data;

        $('#gifHolder').empty();

        results.forEach(renderGif);
    }).fail(function(error) {
        throw error;
    });
}

//Function for rendering gifs
function renderGif(inputObject) {
    const newGif = $('<div>');
    newGif.addClass('gifFrame');
    const newP = $('<p>');
    newP.text('Rating: ' + inputObject.rating.toUpperCase());
    const newImage = $('<img>');
    newImage.addClass('gifClick');
    const staticImage = inputObject.images.fixed_height_still.url;
    const animatedImage = inputObject.images.fixed_height.url;
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
    const playStatus = $(this).attr('playStatus');
    let newStatus;

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
    const newValue = $('#searchValue').val().trim();
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
