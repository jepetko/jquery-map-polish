/**
 * Created with JetBrains WebStorm.
 * User: katarina golbang
 * Date: 2/7/13
 * Time: 9:43 PM
 * To change this template use File | Settings | File Templates.
 */
(function($) {
    $.widget( "gis.layers", $.ui.mouse, {
        version: "1.0",
        widgetEventPrefix: 'layers',
        defaultElement: "<ul>",
        options: {
            groups: "<ul>",
            position: {
                my: "left top",
                at: "right top"
            },
            role: "layergroup",
            mapActions : []
        },
        _create: function() {
            this.groups = this.element;
            this.element.uniqueId()
                .addClass("gui-layers-group")
                .attr( { role: this.options.role, tabIndex: 0 } )
                .sortable();

            this.element.find("li").each($.proxy( function(id, el) {
                var $el = $(el);
                var texts = $el.contents().filter( function() {
                    return this.nodeType == 3 && $.trim(this.nodeValue).length > 0;
                } );
                $('<input type="checkbox">').insertBefore( texts );
                var attr = $el.attr("data-map-actions");
                if( attr ) {
                    var cssClz = attr.split(",");

                    var actions = "";
                    for(var i=0;i<cssClz.length;i++) {
                        var idx = cssClz[i];
                        if(!$.isNumeric(idx)) continue;
                        var mapAction = this.options.mapActions[parseInt(idx)];
                        if( mapAction ) {
                            actions += '<span class="ui-icon ' + mapAction + '"></span>';
                        }
                    }
                    if( actions != "" ) {
                        actions = '<span>' + actions + '</span>';
                        $(actions).insertAfter( texts );
                    }
                }
            }, this));

            this.element.find("ul").hide();

            this._postCreate();
        },
        _postCreate: function() {
            this.element.bind("click", function(evt) {
                if( evt.target.nodeName.toLowerCase() != "li" )
                    return;
                var $tgt = $(evt.target);
                if( $tgt.is(":hidden") ) return;
                var ch = $tgt.children("ul");
                var opts = {duration:500};
                if( ch.filter(":visible").length > 0 )
                    ch.hide(opts);
                else
                    ch.show(opts);
            });
        },
        _destroy: function() {
            this.element.removeClass( "gui-layers-group").empty().end();
        }
    });
}(jQuery));