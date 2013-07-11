/*!
 * jQuery UI Colresizable @VERSION
 * PSA PEUGEOT CITROEN
 *
 * Copyright 2013 PSA PEUGEOT CITROEN By Karlos Presumido AKA OnekO
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 *
 * http://api.jqueryui.com/selectmenu
 *
 * Depends:
 *   jquery
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.resizable.js
 *	jquery.ui.widget.js
 */

$.widget( "psa.colresizable", {

    /**
     * Options
     * @param boolean table_resizable Set if the table is resizable
     * @param string class Set the class of the table
     * @param string dragger_class Set the class of the draggers   
     */
    options: {
	 table_resizable : true,
	 class : 'psa_grid_colresizable',
	 dragger_class : 'psa_grid_dragger'
     },
     
     /**
      * Widget constructor
      **/
     _create: function() {
	 /**
	  * Reference to this object
	  */
	 var owner = this;
	 /**
	  * Draggers array
	  */
	 var draggers = [];
	 
	 this.element.addClass( this.options.class );
	 var height = parseInt(this.element.children('thead').height()) + parseInt(this.element.children('tbody').height());

	 /**
	  * This function will add the dragger to the DOM (document.body)
	  */
	 this.element.find('th:not(.actions)').each(function(){
	     var dragger = $('<div class="' + owner.options.dragger_class + '">&nbsp;</div>').css({
//		 'background-color' : 'red',
		 'cursor' : 'e-resize',
		 'position' : 'absolute',
		 'z-index' : 999999
	     });
	     dragger.draggable({ 
		 axis: "x",
		 drag : owner._dragging,
		 stop : owner._stop
	     });
	     dragger.data('parent', $(this));
	     dragger.data('owner', owner);
	     owner.element.data('colresizable', owner);
	     dragger.appendTo(document.body);
	     draggers.push(dragger);
	 });
	 
	 // Set dragger's position
	 this._relocateDraggers();
	 
	 $(this).data('draggers', draggers);
	 
	 // If the table is resizable, we made it posible
	 if (this.options.table_resizable) 
	 {
	     this.element.resizable({
		 // We need to relocate the draggers when the table is resized
		 stop: function( event, ui ){
		     owner._relocateDraggers();
		 }
	     });
	 }
	 
	// We need to relocate the draggers when the window is resized (and only the window)
	 window.onresize = function(event){
	     if (event.target.tagName == undefined)
		 owner._relocateDraggers();
	 };
     },
     
     /**
      * Will relocate the draggers when a dragger is moved
      * @param event
      * @param ui
      */
     _stop: function(event, ui) {
	 $(ui.helper).data('owner')._relocateDraggers();
	 
     },
     
     /**
      * Relocate all draggers on DOM
      */
     _relocateDraggers: function(){
	 var owner = this;
	 $('div.' + this.options.dragger_class).each(function(){
	     owner._relocateDragger($(this));
	 });
     },
     
     /**
      * Relocate a dragger
      * @param dragger DOM Element
      */
     _relocateDragger: function(dragger){
	 var parent = dragger.data('parent');
	 var left = parent.offset().left + parent.width() + parseInt(parent.css('padding-left'));
	 var height = parseInt(parent.parent().height()) + parseInt(parent.parent().parent().parent().children('tbody').height());
	 var top = parent.offset().top;
	 dragger.css({
	     'top' : top,
	     'left' : left,
	     'height' : height + 'px'
	 });
	 dragger.data('position', {top: top, left: left, width: parent.width()});
     },
     
     /**
      * This function will change the width of the column on dragger's move
      * @param event
      * @param ui
      */
     _dragging: function(event, ui) {
	 var data = $(ui.helper).data('position');
	 var parent = $(ui.helper).data('parent');
	 var width = 0;
	 
	 if (event.clientX < data.left)
	 {
	     width = (parent.width()  - (data.left - event.clientX));
	 }
	 else
	 {
	     width = parent.width() + (event.clientX - data.left);
	 }
	 parent.css('width', width);
	 data.width = width;
	 data.left = event.clientX; 
	 $(ui.helper).data('position', data);
     },
     
    /**
     * On destroy
     */
    _destroy: function() {
        // remove generated elements
        this.element
            .removeClass(this.options.class);
    }
});
