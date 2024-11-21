function append(connector) {
    var grid = document.querySelector('#grid');
    var item = document.createElement('div');
    var elemid = connector.name.replace(/\W/g,' ').trim().replace(/ +/g,'_').toLowerCase();
    var h = '<div id="'+ elemid +'">';
    h += '<div class="thumbnail">';
    h += '<div class="connector_title">';
    h += '<h2><a href="' + connector.url + '" alt="Connector Link">' + connector.name + '</a>';
    h += '</div>';
    h += '<div class="caption">';

    if (connector.github_username) {
        h += '<p><b>Written by: </b><a href="https://github.com/' + connector.github_username + '" alt="GH Link">' + connector.author + '</a></p>';
    } else {
        h += '<p><b>Written by: </b>' + connector.author + '</p>';
    }

    if (connector.source_code) {
        h += '<p><a href="' + connector.source_code + '" alt="Source code link">Source Code Available</a></p>';
    }

    if (connector.description) {
        h += '<p><b>Description: </b>' + connector.description + '</p>';
    }

    if (connector.tags) {
        connector.tags.forEach(function(tag) {
            h += '<span class="label label-pill label-primary">' + tag + '</span>';
        });
    }

    h += '</div>';
    h += '</div>';

    salvattore['append_elements'](grid, [item]);
    item.outerHTML = h;
}

function connectorSort(a , b) {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
    }

    return 1;
}

$.getJSON("./community_connectors.json", function(data) {
    var sorted = data.sort(connectorSort);
    $(sorted).each(function(i, connector) {
        append(connector);
    });
    if (window.location.href.search("#") > 1 ) {
        elemid = "#" + window.location.href.split("#")[1].toLowerCase();
        $(elemid).animate({opacity: 0.5}, 1000 );
        $("html, body").animate({scrollTop: $(elemid).offset().top - 66 }, 1000);
        $(elemid).animate({opacity: 1}, 1000 );
    }
});
