//helper function 1 for old IE
var getElementsByClassName = function (className, tag, elm){
	/*	getElementsByClassName
	Developed by Robert Nyman, http://www.robertnyman.com
	Code/licensing: http://code.google.com/p/getelementsbyclassname/
	*/	
	
	if (document.getElementsByClassName) {
		getElementsByClassName = function (className, tag, elm) {
			elm = elm || document;
			var elements = elm.getElementsByClassName(className),
				nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
				returnElements = [],
				current;
			for(var i=0, il=elements.length; i<il; i+=1){
				current = elements[i];
				if(!nodeName || nodeName.test(current.nodeName)) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	else if (document.evaluate) {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = "",
				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
				returnElements = [],
				elements,
				node;
			for(var j=0, jl=classes.length; j<jl; j+=1){
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
			}
			try	{
				elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
			}
			catch (e) {
				elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
			}
			while ((node = elements.iterateNext())) {
				returnElements.push(node);
			}
			return returnElements;
		};
	}
	else {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = [],
				elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
				current,
				returnElements = [],
				match;
			for(var k=0, kl=classes.length; k<kl; k+=1){
				classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
			}
			for(var l=0, ll=elements.length; l<ll; l+=1){
				current = elements[l];
				match = false;
				for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
					match = classesToCheck[m].test(current.className);
					if (!match) {
						break;
					}
				}
				if (match) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	return getElementsByClassName(className, tag, elm);
};

//helper function 2 for old IE
function stopPropagation(evt) {
    if (typeof evt.stopPropagation == "function") {
        evt.stopPropagation();
    } else {
        evt.cancelBubble = true;
    }
}

//Caret positioning manipulation
function setCaretToElem(a_editor, a_element, at_start) {
	var doc = a_editor.getDoc();
	if (at_start == "undefined")
		at_start = false;
	if (a_element) {			
		if (typeof doc.createRange != "undefined") {
			//IE 9+
			var range = doc.createRange();
			range.selectNodeContents(a_element);
			range.collapse(at_start);
			var win = doc.defaultView || doc.parentWindow;
			var sel = win.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		} else if (typeof doc.body.createTextRange != "undefined") {
			//IE 7-8
			var textRange = doc.body.createTextRange();
			textRange.moveToElementText(a_element);
			textRange.collapse(at_start);
			textRange.select();
		}	
	}
}
function setCaretToPara(a_editor, last_para, at_start) {
	var a_element;
	var doc = a_editor.getDoc();
	if (last_para == "undefined")
		last_para = false;	
	if (at_start == "undefined")
		at_start = false;
		
	var tabs_class = getElementsByClassName("mceMultiTabContent", "div", a_editor.getBody());
	var tabbed_doc = a_editor.settings.is_tabbed_document;

	if (tabbed_doc || tabs_class.length) {
		var tabs = getElementsByClassName("mtab current", "LI");
		if (tabs.length) {
			var panelID = "mceTabPanel_" + tabs[0].id.substr(7);
			a_element = a_editor.getDoc().getElementById(panelID);	 //get tab panel DIV			
		}
	}	else {
			a_element = a_editor.getBody(); //get BODY
	}
	
	var p_tags = a_element.getElementsByTagName("P").length;
	
	if (p_tags) {		
		if (last_para) {
			a_element = a_element.getElementsByTagName("P")[p_tags-1];
		} else {
			a_element = a_element.getElementsByTagName("P")[0];
		}	
	} else {	
		//if there are no paragraphs to put the caret on, create a blank paragraph and place caret there
		var para = a_editor.getDoc().createElement("P");
		
		if (last_para) {			 
			a_element.appendChild(para);			
			a_element = para;					
		} else {
			a_element.insertBefore(para, a_element.children[0]);		
			a_element = para;			
		}		
	}	
	
	if (typeof doc.createRange != "undefined") {
		//IE 9+
		var range = doc.createRange();
		range.selectNodeContents(a_element);
		range.collapse(at_start);
		var win = doc.defaultView || doc.parentWindow;
		var sel = win.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (typeof doc.body.createTextRange != "undefined") {
		//IE 7-8
		var textRange = doc.body.createTextRange();
		textRange.moveToElementText(a_element);
		textRange.collapse(at_start);
		textRange.select();
	}
}

//Run-Time set all editors to read-only mode
function allEditorsReadOnly() {
	//Hack to set read only at run-time (for TinyMCE 3.x)	
	var editorsfound, i, eds, readonly_prop, prev_settings;
	editorsfound = getElementsByClassName('mceEditor');
	//array of editors: 1) tinymce.EditorManager.editors 2) getElementsByClassName('mceEditor')
	
	readonly_prop = 0;		
		
	if (editorsfound) {		
		eds = tinymce.EditorManager.editors.length;		
		readonly_prop = tinymce.activeEditor.settings.readonly;
		prev_settings = tinymce.activeEditor.settings;
		if (readonly_prop == 'undefined') {
			//if read only was not defined in init and is undefined, it was false switch to true	
			readonly_prop = 1
		}	
		else {
			readonly_prop = !readonly_prop //alternate on/off
		}
		//now set all editors with the new read only property
		for (i = 0; i < eds; i++) {
			var ed_id = tinymce.EditorManager.editors[i].id;
			
			tinymce.EditorManager.execCommand('mceRemoveControl', false, ed_id);
			//tinyMCE.execCommand('mceRemoveControl', false, ed_id);			
			tinymce.settings = prev_settings;			
			tinymce.settings.readonly = readonly_prop;
					
				if (readonly_prop) {
					tinymce.settings.visual = false;					
					} 
				else {
					tinymce.settings.visual = true;								
				}	
			tinyMCE.EditorManager.execCommand('mceAddControl', false, ed_id); 

			//Re-Load Tabs
			if (tinymce.settings.is_tabbed_document) {
				mceLoadTabs(readonly_prop); 				
			}
		}
	}
}

//Multi-Tab Document related functions
function mceSelectTab(a_tab_id, a_panel_id) {
		
	// first of all get all tab content blocks (I think the best way to get them by class names)
	//(done like this for compatibility with IE6-7)	
	var x, i;
	x = getElementsByClassName("mceMultiTabContent", "div", tinymce.activeEditor.getDoc());
		
	for (i = 0; i < x.length; i++) {
		// hide all tab content panels
		x[i].className = "mceMultiTabContent hidden";	
	}
	
	tinymce.activeEditor.getDoc().getElementById(a_panel_id).className = "mceMultiTabContent";
 
	// now we get all tab menu items by class names (to highlight current tab)
	x = getElementsByClassName("mtab", "li");
	
	for (i = 0; i < x.length; i++) {	
		x[i].className = "mtab"; 
	}	
	document.getElementById(a_tab_id).className = "mtab current";
		
	//reset undo levels to avoid breaking the document if undo is pressed
	tinymce.activeEditor.undoManager.clear();
	tinymce.activeEditor.undoManager.add();
	tinymce.activeEditor.execCommand('mceRepaint');
		
	setCaretToPara(tinymce.activeEditor, false, true);	
}

function generateRndTabID(with_extra_letter) {
	var d = new Date();
	//var d = new Date().getTime() + ""; 
	
	if (with_extra_letter == true)
		return d.getMilliseconds() + String.fromCharCode(65+Math.floor(Math.random() * 26)) + "_" + d.getSeconds() + String.fromCharCode(65+Math.floor(Math.random() * 26));
	else
		return d.getMilliseconds() + "_" + d.getSeconds() + String.fromCharCode(65+Math.floor(Math.random() * 26));	

}

function renameTabDlg(tabID,panelID) {

	var panel_elm = tinymce.activeEditor.getDoc().getElementById(panelID); 
	
	if (tinymce.settings.readonly != true) {	
		tinyMCE.activeEditor.windowManager.open({
			url:'tab_rename_dialog.htm',
			width: 320,
			height: 130,
			inline : 1}, 
		{
			sender_param: tabID,
			panel_param: panelID,
			curr_text_param: panel_elm.getAttribute('data-tabname')});
	}	
		
	return false;	
}

function mceCloseTab(tabID, panelID) {

	var tab_elm, panel_elm, tab_elm_neighbor, panel_elm_neighbor;
	
	tab_elm = document.getElementById(tabID);
	panel_elm = tinymce.activeEditor.getDoc().getElementById(panelID);

	if (tab_elm && panel_elm) {

	tinymce.activeEditor.windowManager.confirm(tinymce.activeEditor.getLang('tabs.confirm_delete'), function(s) {
		if (s)	{
				if (tab_elm.nextSibling && tab_elm.nextSibling.className != "addtab") {
				tab_elm_neighbor = tab_elm.nextSibling;		
				panel_elm_neighbor = panel_elm.nextSibling;
				}
				else if (tab_elm.previousSibling) {
					tab_elm_neighbor = tab_elm.previousSibling;		
					panel_elm_neighbor = panel_elm.previousSibling;
				}
				else {		
					//there is no other tab to switch to, so create new blank tab
					mceAddNewTab(false);
					tab_elm_neighbor = tab_elm.nextSibling;		
					panel_elm_neighbor = panel_elm.nextSibling;			
				}

				tab_elm.parentNode.removeChild(tab_elm);
				panel_elm.parentNode.removeChild(panel_elm);	
				
				//select next available tab					
				mceSelectTab(tab_elm_neighbor.id , panel_elm_neighbor.id);
				//stop propagation of the click evnt to the parent element		
				stopPropagation(event || window.event);	
				
				
				//reset undo levels to avoid  breaking the document
				tinymce.activeEditor.undoManager.clear();
				tinymce.activeEditor.undoManager.add();	
				tinymce.activeEditor.execCommand('mceRepaint');				
											
		}
	});						
	}		
}

function mceAddNewTab(selectAfterCreation) {	
	
	if (tinymce.activeEditor.settings.readonly != 'true') {
		var NewTabName = tinymce.activeEditor.getLang('tabs.unnamed'),
			DeleteTab = tinymce.activeEditor.getLang('tabs.delete_tab');
		
		var	rnd_ID = generateRndTabID();
		//if element ID already existed create new random name with an extra-letter to avoid repetition
		if (tinymce.activeEditor.getDoc().getElementById(rnd_ID)) {
			rnd_ID = generateRndTabID(true);
		}
		// get all tab content blocks	
		var x = getElementsByClassName("mtab", "li"),
			tabID = "mceTab_" + rnd_ID,
			panelID = "mceTabPanel_" + rnd_ID;				
				
		x[x.length-1].insertAdjacentHTML('afterend', '<li id="' + tabID +'" class="mtab" oncontextmenu="javascript:renameTabDlg(\''+tabID+'\',\''+panelID+'\');return false;" onclick="javascript:mceSelectTab(\'' + tabID +'\',\'' + panelID +'\');return false;" ondblclick="javascript:renameTabDlg(\''+tabID+'\',\''+panelID+'\');return false;"><a href="javascript:;"><span class="tbtitle" title="'+ NewTabName +'">'+ NewTabName +'</span><span class="mceTabCloseIcon" title="'+DeleteTab+'" onclick="javascript:mceCloseTab(\'' + tabID +'\',\'' + panelID +'\');return false;"></span></a></li>');
		
		x = getElementsByClassName("mceMultiTabContent", "div", tinymce.activeEditor.getDoc());
		
		x[x.length-1].insertAdjacentHTML('afterend', '<div id="' + panelID +'" class="mceMultiTabContent" data-tabname="'+ NewTabName +'"><p style="font-family: Verdana; font-size: 8pt">' + tinymce.activeEditor.getLang('tabs.initial_content') + '</p></div>');
		
		if (selectAfterCreation == true) {	
			mceSelectTab(tabID , panelID);	
		}
		tinymce.activeEditor.undoManager.clear();
		tinyMCE.execCommand('mceRepaint');	
	}
}

function mceLoadTabs(isEditorReadOnly) {
	var row, tabContainer;
	var CreateTabName = tinymce.activeEditor.getLang('tabs.add_new'),
		DeleteTab = tinymce.activeEditor.getLang('tabs.delete_tab');
		
	var table_el = tinymce.activeEditor.getContentAreaContainer().parentNode.parentNode;
	//create tabs wrapper html			
	if (isEditorReadOnly) {				
			//table_el -> tBody;			
			row = table_el.insertRow(0);
			row.className = 'mceTabsRow'; 		
			tabContainer = row.insertCell(0);
			tabContainer.className = 'mceTabs ReadOnly';						
		}
	else {
		row = table_el.insertRow(1); //if not in read only mode insert tabs container below the toolbar (pos 1)
		row.className = 'mceTabsRow'; 		
		tabContainer = row.insertCell(0);
		tabContainer.className = 'mceTabs';
	}	
					
	//for every mceMultiTabContent panel div create a tab and finally a +Create tab button	
	var tabs_str = '<div class="maintabswrapper" role="presentation"><ul>';
			
	var panels, i;
	panels = getElementsByClassName("mceMultiTabContent", "div", tinymce.activeEditor.getDoc());	
	
	//if no content panels (.mceMultiTabContent) probably a new document, surround the body contents with the html for the initial panel 
	if (!panels.length) {
		var body_content = tinymce.activeEditor.getBody();
		
		var	rnd_ID = generateRndTabID();
		//if element ID already existed create new random name with an extra-letter to avoid repetition
		if (tinymce.activeEditor.getDoc().getElementById(rnd_ID)) {
			rnd_ID = generateRndTabID(true);
		}
		
		
		if (body_content.innerHTML.length < 9) {		 		
			body_content.innerHTML = '<div id="mceTabPanel_' + rnd_ID +'" class="mceMultiTabContent" data-tabname="'+ tinymce.activeEditor.getLang('tabs.unnamed') +'"><p>' + tinymce.activeEditor.getLang('tabs.initial_content') + '</p>' + '</div>';
		}		
		else {
			body_content.innerHTML = '<div id="mceTabPanel_' + rnd_ID +'" class="mceMultiTabContent" data-tabname="'+ tinymce.activeEditor.getLang('tabs.unnamed') +'">' +  body_content.innerHTML + '</div>';		
		}
			
		panels[0] = body_content.children[0];
	}
	
	//for each panel present in the body generate a tab 	
	for (i = 0; i < panels.length; i++) {
		var tabClass = "",
			tabID = "mceTab_" + panels[i].id.substr(12),
			panelID = panels[i].id,
			tab_panel_params = '\''+tabID+'\',\''+panelID+ '\'',
			data_tabname = panels[i].getAttribute('data-tabname');				
		
		if (i == 0)
			tabClass = "mtab current";
		else 
			tabClass = "mtab";				
			
		panels[i].className = "mceMultiTabContent hidden";
		
		tabs_str = tabs_str + '<li id="' + tabID + '" class="' + tabClass + '" oncontextmenu="javascript:renameTabDlg('+tab_panel_params+');return false;" onclick="javascript:mceSelectTab('+tab_panel_params+');return false;" ondblclick="javascript:renameTabDlg('+tab_panel_params+');return false;"><a href="javascript:;"><span class="tbtitle"  title="'+ data_tabname +'">'+ data_tabname +'</span>';
					
		if (!isEditorReadOnly)
			tabs_str = tabs_str + '<span class="mceTabCloseIcon" title="'+DeleteTab+'" onclick="javascript:mceCloseTab('+ tab_panel_params +');return false;"></span>';
		
		tabs_str = tabs_str + '</a></li>'; 				
	}
	
	//finally add + Create tab button if not in ReadOnly mode
	if (!isEditorReadOnly)		
		tabs_str = tabs_str + '<li class="addtab" title="'+CreateTabName +'" onclick="mceAddNewTab(true);return false;"><a href="javascript:;"><span class="addtabspan">+</span></a></li>';
	
	tabs_str = tabs_str + '</ul></div>';		
	
	tabContainer.insertAdjacentHTML('beforeend', tabs_str);		
	
	var tabslist = getElementsByClassName("mtab", "li");		
	
	//select the first tab and panel
	mceSelectTab(tabslist[0].id , panels[0].id);
	
}

function updateTabs() {
	//this function is also called in files: editor_template_advanced(_src).js
	
	var tabs_content_class = getElementsByClassName("mceMultiTabContent", "div", tinymce.activeEditor.getBody());
	var tabbed_doc = tinymce.activeEditor.settings.is_tabbed_document;
	
	//remove existing tabs row (not the content panels in the body) before loading them again (required for read-only switch)
	var table_el = tinymce.activeEditor.getContentAreaContainer().parentNode.parentNode;		
	var rowdel = getElementsByClassName("mceTabsRow", "tr", table_el);		
	if (rowdel.length) {
		table_el.removeChild(rowdel[0]);		
	}
	//Load tabs if it was set on init settings (is_tabbed_document), or if a div with class mceMultiTabContent is found in the body
	if (tabbed_doc || tabs_content_class.length) {		
		mceLoadTabs(tinymce.activeEditor.settings.readonly);
	} 
}
