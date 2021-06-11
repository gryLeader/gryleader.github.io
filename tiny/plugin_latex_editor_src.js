(function(){
	tinymce.PluginManager.requireLangPack('latex');
	tinymce.create('tinymce.plugins.LatexPlugin',{
		init:function(ed,url){			
			ed.addCommand('LatexPlugin',function(){				
				ed.windowManager.open({file:url+'/latex_dialog.htm',width:560+parseInt(ed.getLang('latex.delta_width',0)),
				height:420+parseInt(ed.getLang('latex.delta_height',0)),inline:1},{plugin_url:url})});
			ed.addButton('latex',{title:'Insert Math formulae with latex code',cmd:'LatexPlugin'});
			ed.onNodeChange.add(function(ed,cm,n){cm.setActive('latex',n.nodeName=='IMG')})},
		getInfo:function(){return{longname:'Latex plugin',author:'Diego Caponera',authorurl:'http://www.diegocaponera.com',infourl:'http://www.diegocaponera.com',version:"1.0"}}});
		
	tinymce.PluginManager.add('latex',tinymce.plugins.LatexPlugin)
})();