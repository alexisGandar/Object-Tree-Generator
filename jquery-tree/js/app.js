var app = {
	modules : {}
}

app.modules.tree = (function(){
	var selected = -1;
	var id = 6;
	return {
		addNode : function(){
			if(selected != -1){

			}
		},

		addItem : function(){
			if(selected != -1){
				var newli = $( "<li class='item' id="+selected+1+"></li>" );
				console.console.log();
				$( "#"+selected ).append( newli );
			}
		},

		del : function(){
			if(selected != -1){
				if(selected != "root"){
					selected = "#"+selected;
					$(selected).remove();
					selected = -1;
				}

			}

		},

		sel : function(){
			selected = $('#tree').jstree('get_selected')[0];
			console.log(selected);
		},

		test : function(){
			console.log('refr')
		},

		init : function(){
			$('#tree').jstree();
			$('#tree').bind("select_node.jstree", app.modules.tree.sel);
			$("#addN").click(app.modules.tree.addNode);
			$("#addI").click(app.modules.tree.addItem);
			$("#del").click(app.modules.tree.del);
		}
	}
})();

$(document).ready(function () {
  app.modules.tree.init();
});
