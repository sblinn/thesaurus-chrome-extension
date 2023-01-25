
$(document).ready(function() {
    synonymSearch.init();
})


/*
- search button clicked.
- clear the results div. 
- get word input.
- check if word input is valid (!= '').
- if invalid, append error block.
- else, perform AJAX call to dictionary API.
*/

var synonymSearch = {

    init: function() {
        synonymSearch.config = {
            input: $('#wordInput'),
            resultsContainer: $('#searchResultsDiv'),
            errorMessages: $('#errorMessages'),
            searchBtn: $('#searchBtn'),
            clearBtn: $('#clearBtn')
        };

        this.registerHandlers();
    },

    // the buttons and the methods associated with their functions.
    handlers: { 
        '#searchBtn': 'doSearch',
        '#clearBtn': 'doReset'
    },

    /* Adds click event listeners to the search and reset buttons. */
    registerHandlers: function() {
        var _this = this;
        $.each(_this.handlers, function(button, action) {
            var trigger = 'click';
            $(document).delegate(button, trigger, _this[action]);
        })
    },

    /* Performs the synonym search and displays the results. */
    doSearch: function(evt) {
        evt.preventDefault();
        synonymSearch.config.errorMessages.empty();
        synonymSearch.config.resultsContainer.empty();

        var word = $('#wordInput').val();
        if (word == '') {
            synonymSearch.config.errorMessages
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Please enter a word.'));
        } else {
            $.ajax({
                type: 'GET',
                url: 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word,
                success: function (data) {
                    var content = "";

                    $(data).each(function (index, result) {
                        var meanings = result.meanings;

                        $(meanings).each(function (meaningIndex, meaning) {
                            var pos = meaning.partOfSpeech;
                            content += '<p>' + '<span class="bold-def">' 
                                + word + '</span>' + ' (' + '<span class="italic-def">'
                                + pos + '</span>' + '): ';

                            if (meaning.synonyms.toString() == '') {
                                content += '--';
                            } else {
                                var synonyms = meaning.synonyms.toString().split(',').join(', ');
                                content += '<span class="synonym-list">' 
                                    + synonyms + '</span>';
                            }

                            content += '</p>';
                        })

                        synonymSearch.config.resultsContainer.append(content);
                    })
                },
                error: function () {
                    synonymSearch.config.errorMessages
                        .append($('<li>')
                            .attr({ class: 'list-group-item list-group-item-danger' })
                            .text('Error calling web service. Please try again later.'));
                }
            })
        }
    },

    /* Resets the text input, error messages and the results. */
    doReset: function(evt) {
        evt.preventDefault();
        synonymSearch.config.errorMessages.empty();
        synonymSearch.config.resultsContainer.empty();
        synonymSearch.config.input.val('');
    },
    
};