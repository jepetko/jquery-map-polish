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
        _injectMethods: function() {
            jQuery.fn.extend(
                {
                    _isRoot: function() {
                        return this.hasClass("gui-layers-group");
                    },
                    _ownerLayers: function() {
                        var ret = $();
                        this.each( function(id,el) {
                           if(el.nodeName.toLowerCase() == "li")
                                ret = ret.add( $(el) );
                           else
                                ret = ret.add( $(el).parent("li") );
                        });
                        return ret;
                    },
                    _visIndicators: function(opts) {
                        var selector = 'input[type="checkbox"]';
                        if( opts && opts['recursive'] === true ) {
                            return this.find(selector);
                        } else {
                            return this.children(selector);
                        }
                    },
                    _childrenLayers: function(opts) {
                        if( this._isRoot() ) {
                            if( opts && opts['recursive'] === true )
                                return this.find("li");
                            else
                                return this.children("li");
                        }

                        var $el = this._ownerLayers();
                        if( opts && opts['recursive'] === true )
                            return $el.find("li");
                        else
                            return $el.children("ul").children("li");
                    },
                    _parentLayer: function() {
                        var $el = this._ownerLayers();
                        return $el.parent("ul").parent("li");
                    },
                    _hasChildrenLayers: function() {
                        var ch = this._childrenLayers();
                        if( !ch ) return false;
                        return ch.length > 0;
                    },
                    _hasVisChildrenLayers: function() {
                        var layers = this._childrenLayers();
                        var bHas = false;
                        layers.each( function(id, el) {
                            var $el = $(el);
                            var indicators = $el._visIndicators();
                            indicators.each( function(id, el) {
                                if( $(el).prop("checked") === true ) {
                                    if( !bHas ) bHas = true;
                                }
                            });
                        });
                        return bHas;
                    }
                }
            );
        },
        _create: function() {

            this._injectMethods();

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

            this.element.find("ul").hide(); //TODO: remove this

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
            var layers = $(this.element)._childrenLayers({recursive:true});
            var indicators = layers._visIndicators();

            indicators.each( $.proxy(function(id, el) {
                var $el = $(el);
                $el.bind("change", $.proxy(function(evt) {
                    var tgt = evt.target;
                    var $tgt = $(tgt);
                    var bChecked = $tgt.prop("checked");
                    var layers = $tgt._childrenLayers({recursive:false});
                    var indicators = layers._visIndicators();

                    indicators.each( function(id, el) {
                            $(el).prop("checked", bChecked).change();
                    });

                    var parent = $tgt._parentLayer();
                    parent._visIndicators().prop("checked", parent._hasVisChildrenLayers());//.change();
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
        }
    });
}(jQuery));