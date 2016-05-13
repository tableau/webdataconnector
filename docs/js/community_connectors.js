function append(connector){
    var grid = document.querySelector('#columns');
    var item = document.createElement('div');
    
    var h = '<div>';
        h += '<div class="thumbnail">';
        h += '<a href="' + connector.url + '"><img src="' + connector.thumbnail_path + '" alt="Connector Link"></a>'
        h += '<div class="caption">';
        h += '<p><h5>' + connector.name + '</h5></p>';
        h += '<p>Written by: ' + connector.author + '</p>';
        //h += '<p>' + connector.tags + '</p>';
        
        connector.tags.forEach(function(tag) {
            h += '<span class="label label-pill label-primary">' + tag + '</span>' 
        });
      
        h += '</div>';
        h += '</div>';    
     
    salvattore['append_elements'](grid, [item])
    item.outerHTML = h;
}

$.getJSON("./community_connectors.json", function(data){
    $(data).each(function(i, connector) {
        append(connector);
    });
});