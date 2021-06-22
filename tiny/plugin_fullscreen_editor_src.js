/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	var DOM = tinymce.DOM;	

	tinymce.create('tinymce.plugins.FullScreenPlugin', {
		init : function(ed, url) {			
			
			// Register commands
			ed.addCommand('mceFullScreen', function() {
				var stngs = ed.settings;	
		
				if (!ed.getParam('fullscreen_is_enabled')) {
				//turn on fullscreen
				
					if (stngs.theme_advanced_toolbar_location === 'external')
						stngs.theme_advanced_toolbar_location = 'top';
					
					stngs.theme_advanced_resizing = false;
					
					ed.dom.addClass(ed.getContainer(), "fullscreen");
					//ed.dom.removeClass(ed.getContainer(), "fullscreen");
					
					//IE6 
					if (tinymce.isIE6) {
						tinymce.DOM.setStyle(ed.getContainer(), 'position', 'absolute');			
					}

					//table .mceLayout
					//tinymce.DOM.setStyle(tinymce.DOM.get(ed.id + '_tbl'), 'height', '100%');
					//iframe
					//tinymce.DOM.setStyle(tinymce.DOM.get(ed.id + '_ifr'), 'height', '100%');
							
					//if IE 10 or older adjust Iframe size in exact pixels
					if (document.all) {	
						var tbl_children = tinymce.DOM.get(ed.id + '_tbl').children[0].children;
						var adjustHeight = tbl_children[0].clientHeight + tbl_children[1].clientHeight + tbl_children[3].clientHeight;
						adjustHeight = tinymce.DOM.getViewPort().h - adjustHeight;
						tinymce.DOM.setStyle(ed.getContentAreaContainer(), 'height', adjustHeight);
						tinymce.DOM.setStyle(tinymce.DOM.get(ed.id + '_ifr'), 'height', adjustHeight);	
						
						tinymce.DOM.setStyle(document.documentElement, 'overflow', 'hidden');
					}
					
					stngs.fullscreen_is_enabled = true;		
					ed.controlManager.setActive('fullscreen', true);
				}	
				else {
				//turn off fullscreen			
					
					ed.dom.removeClass(ed.getContainer(), "fullscreen");
					
					stngs.theme_advanced_resizing = true;
					
					//Use absolute position if IE6 
					if (tinymce.isIE6)
						tinymce.DOM.setStyle(ed.getContainer(), 'position', 'relative');
							
					//table .mceLayout
					//tinymce.DOM.setStyle(tinymce.DOM.get(ed.id + '_tbl'), 'height', '100%');
					
					//iframe
					//tinymce.DOM.setStyle(tinymce.DOM.get(ed.id + '_ifr'), 'height', '100%');
					
					//if IE 10 or older adjust Iframe size in exact pixels
					if (document.all) {	
						var tbl_children = tinymce.DOM.get(ed.id + '_tbl').children[0].children;
						var adjustHeight = tbl_children[0].clientHeight + tbl_children[1].clientHeight + tbl_children[3].clientHeight;
						adjustHeight = tinymce.DOM.getViewPort().h - adjustHeight;
						tinymce.DOM.setStyle(ed.getContentAreaContainer(), 'height', adjustHeight);
						tinymce.DOM.setStyle(tinymce.DOM.get(ed.id + '_ifr'), 'height', adjustHeight);	
						
						tinymce.DOM.setStyle(document.documentElement, 'overflow', 'hidden');
					}
					
					stngs.fullscreen_is_enabled = false;
					ed.controlManager.setActive('fullscreen', false);		
				}					
			});

			// Register buttons
			ed.addButton('fullscreen', {title : 'fullscreen.desc', cmd : 'mceFullScreen'});
			
		},

		getInfo : function() {
			return {
				longname : 'Fullscreen',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/fullscreen',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('fullscreen', tinymce.plugins.FullScreenPlugin);
})();
