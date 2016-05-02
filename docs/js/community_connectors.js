function append(connector){
    var grid = document.querySelector('#columns');
    var item = document.createElement('div');
    
    /*
<div class="thumbnail">
    <a href="{{ site.baseurl }}community/community_home.html"><img src="{{ site.baseurl }}assets/community.jpg" alt="News Link"></a>
    <div class="caption">
        <h3>Community</h3>
        <p>Browse connectors built by the community that you can use to connect to data from Tableau!</p>
    </div>
</div>
    */
    
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