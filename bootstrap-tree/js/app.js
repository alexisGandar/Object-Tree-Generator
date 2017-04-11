var app = {
	modules : {}
}

app.modules.tree = (function(){
	var test_tree;
	return {
		addNode : function(){

		},

		addItem : function(){

		},

		del : function(){
			var x = $('#tree').treeview('getSelected');
			x = x[0];
			if(x.value != "root"){
				app.modules.tree.recursive(test_tree,x.nodeId);
			}
		},

		recursive : function(t,id){
			var done = false;
			var i = 0;
			while((!done) && (i < t.length)){
				var x = $('#tree').treeview('getSelected');
				console.log(x);
				if(x.nodeId == id){
					console.log("del");
					//t.splice(i,1);
					return true;
				}else{
					if(typeof x.nodes !== 'undefined'){
						done = app.modules.tree.recursive(x.nodes,id);
					}else {
						i++;
					}
				}
				return false;
			}
		},

		test : function(){
			var liste = $('#tree').treeview('getSelected');
			console.log(liste[0]);
		},

		init : function(){
			test_tree = [
			{
				text: "Root",
				value: "root",
				nodes: [
				{
					text: "Node 1",
					value: "node",
					nodes: [
					{
						text: "Node 2",
						value: "node"
					},
					{
						text: "Item 1",
						value: "item"
					}
					]
				},
				{
					text: "Item 2",
					value: "item"
				}
				]
			},
			{
				text: "Node 1",
				value: "node"
			},
			{
				text: "Node 2",
				value: "node"
			},
			{
				text: "Item 3",
				value: "item"
			},
			{
				text: "Item 4",
				value: "item"
			}
			];

			$('#tree').treeview({data: test_tree});
			$("#addN").click(app.modules.tree.addNode);
			$("#addI").click(app.modules.tree.addItem);
			$("#del").click(app.modules.tree.del);
		}
	}
})();

$(document).ready(function () {
  app.modules.tree.init();
});
