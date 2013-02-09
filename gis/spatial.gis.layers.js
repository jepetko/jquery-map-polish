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
                this._addCheckboxes($el, texts);
                this._addActions($el, texts);
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
            var indicators = this._getVisIndicators(this.element,{recursive:true});
            indicators.each( $.proxy(function(id, el) {
                var $el = $(el);
                $el.bind("change", $.proxy(function(evt) {
                    var tgt = evt.target;
                    var bChecked = $(tgt).prop("checked");
                    var x = this._getVisIndicators(tgt,{recursive:false});
                        x.each( function(id, el) {
                            $(el).prop("checked", bChecked).change();
                    });
                }, this) );
            }, this));
        },
        _destroy: function() {
            this.element.removeClass( "gui-layers-group").empty().end();
        },
        _addCheckboxes: function(el, texts) {
            $('<input type="checkbox">').insertBefore( texts );
        },
        _addActions: function(el, texts) {
            var attr = el.attr("data-map-actions");
            if( !attr ) return;
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
        },
        /**
         *
         * @param el
         * @return {*|HTMLElement[]} "li" elements which are children of the passed element
         * @private
         */
        _getChildren: function(el) {
            var $el = $(el);
            if(el.nodeName.toLowerCase() != "li") {
                $el = $el.parent("li");
            }
            return $el.children("ul").children("li");
        },
        _hasChildren: function(el) {
            var ch = this._getChildren(el);
            if( !ch ) return false;
            return ch.length > 0;
        },
        /**
         * get visibility indicators (actually checkboxes) of the passed element el.
         *
         * @param el element to be passed. If el hasn't nodeName "li" then the parent "li" element is detected.
         * @param opts { recursive : Boolean (default-value is true) }.
         * @return {Array}
         * @private
         */
        _getVisIndicators: function(el,opts) {
            var $el = this._getLayerContainerFrom(el);
            var selector = 'input[type="checkbox"]';
            if( $el == null )
                return this.element.find(selector);

            if( opts && opts['recursive'] === true ) {
                $el = $el.find(selector);
            } else {
                $el = $el.children("ul").children("li").children(selector);
            }
            return $el;
        },
        _isRoot: function(el) {
            if( !el ) return false;
            if( el.length ) el = el.get(0);
            if( el.nodeName.toLowerCase() != "ul") return false;
            return this.element.get(0) === el;
        },
        _isLayerContainer: function(el) {
            if( !el ) return false;
            if( el.length ) el = el.get(0);
            return el.nodeName.toLowerCase() == "li";
        },
        _getLayerContainerFrom: function(el) {
            if( this._isLayerContainer(el)) return $(el);
            if( this._isRoot(el) ) return null;
            return $(el).parent("li");
        }
    });
}(jQuery));