var app = {
	modules : {}
}

app.modules.tree = (function(){
	var test_tree;
	var newId = 9;
	return {

		add : function(new_tree){
			app.modules.tree.nodes(new_tree);
			var x = $('#tree').treeview('getSelected');
			y = x[0];
			if(y.type != "item"){
				app.modules.tree.changeId(new_tree);
				app.modules.tree.recursiveAdd(test_tree,y.id,new_tree[0]);
				$('#tree').treeview('selectNode', [ y.nodeId, { silent: true } ]);
				$('#tree').treeview('expandNode', [ y.nodeId, { silent: true } ]);
			}
		},

		addNode : function(){
			var x = $('#tree').treeview('getSelected');
			y = x[0];
			if(y.type != "item"){
				var newNode = {
					text: "Node",
					type: "node",
					id: newId
				};
				newId++;
				console.log(newId);
				app.modules.tree.recursiveAdd(test_tree,y.id,newNode);
				$('#tree').treeview('selectNode', [ y.nodeId, { silent: true } ]);
				$('#tree').treeview('expandNode', [ y.nodeId, { silent: true } ]);
			}
		},

		nodes : function(tab){
			tab.forEach(function(e){
				console.log(e);
				if((e.nodes == undefined) || (e.nodes.length <= 0)){
					console.log("yolo");
					delete e.nodes;
				}else{
					app.modules.tree.nodes(e.nodes);
				}
			});
		},

		changeId : function(tab){
			tab.forEach(function(e){
				e.id = newId;
				newId++;
				if(e.type == "node"){
					if(e.nodes != undefined){
						app.modules.tree.changeId(e.nodes);
					}
				}
			});
		},

		addItem : function(){
			var x = $('#tree').treeview('getSelected');
			y = x[0];
			if(y.type != "item"){
				var newItem = {
					text: "Item",
					type: "item",
					id: newId
				};
				newId++;
				console.log(newId);
				app.modules.tree.recursiveAdd(test_tree,y.id,newItem);
				$('#tree').treeview('selectNode', [ y.nodeId, { silent: true } ]);
				$('#tree').treeview('expandNode', [ y.nodeId, { silent: true } ]);
			}
		},

		recursiveAdd : function(t,id,obj){
			var done = false;
			var i = 0;
			while((!done) && (i < t.length)){
				var x = t[i];
				console.log(x);
				if(x.id == id){
					if(x.nodes == undefined){
						t[i].nodes = [];
						if(obj.type == "item"){
							t[i].nodes.push(obj);
						}else{
							t[i].nodes.unshift(obj);
						}
					}else{
						if(obj.type == "item"){
							t[i].nodes.push(obj);
						}else{
							t[i].nodes.unshift(obj);
						}
					}
					app.modules.tree.reload();
					return true;
				}else{
					if(x.nodes != undefined){
						done = app.modules.tree.recursiveAdd(x.nodes,id,obj);
						i++;
					}else {
						i++;
					}
				}
			}
			return false;
		},

		del : function(){
			var x = $('#tree').treeview('getSelected');
			y = x[0];
			if(y.type != "root"){
				app.modules.tree.recursiveDel(test_tree,y.id);
				if($('#tree').treeview('getParent', x).nodes.length <= 0){
					if($('#tree').treeview('getParent', x).type != "root"){
						delete $('#tree').treeview('getParent', x).nodes;
					}
				}
			}else{
				alert("You can't delete the Root object");
			}
		},

		recursiveDel : function(t,id){
			var done = false;
			var i = 0;
			while((!done) && (i < t.length)){
				var x = t[i];
				console.log(x);
				if(x.id == id){
					t.splice(i,1);
					app.modules.tree.reload();
					newId--;
					return true;
				}else{
					if(x.nodes != undefined){
						done = app.modules.tree.recursiveDel(x.nodes,id);
						i++;
					}else {
						i++;
					}
				}
			}
			return false;
		},

		reload : function(){
			var liste = $('#tree').treeview('getExpanded');
			$('#tree').treeview({data: test_tree});
			liste.forEach(function(e){
				$('#tree').treeview('expandNode', e.nodeId);
			});

		},

		test : function(){
			var liste = $('#tree').treeview('getSelected');
			console.log(liste[0]);
		},

		init : function(){
			//var buttonAddO = " <button type='button' data-toggle='tooltip' data-placement='top' title='Add a node' id='btnAddNode'  class='btn btn-xs custom glyphicon glyphicon-apple' onclick='app.modules.tree.del()'></button>";
			//var buttonAddI = " <button type='button' data-toggle='tooltip' data-placement='top' title='Add a item' id='btnAddItem'  class='btn btn-xs custom glyphicon glyphicon glyphicon-tags' onclick='app.modules.tree.test()'></button>";
			//var buttonDel = " <button type='button' data-toggle='tooltip' data-placement='top' title='Delete' id='btnDel'  class='btn btn-xs custom glyphicon glyphicon-minus' onclick='app.modules.tree.del()'></button>";



			test_tree = [
			{
				text: "Root",
				type: "root",
				id: "0",
				nodes: [
				{
					text: "Node",
					type: "node",
					id: "1",
					nodes: [
					{
						text: "Node",
						type: "node",
						id: "2"
					},
					{
						text: "Item",
						type: "item",
						id: "3"
					}
					]
				},
				{
					text: "Node",
					type: "node",
					id: "5"
				},
				{
					text: "Node",
					type: "node",
					id: "6"
				},
				{
					text: "Item",
					type: "item",
					id: "7"
				},
				{
					text: "Item",
					type: "item",
					id: "8"
				}
				]
			},
			];

			$('[data-toggle="tooltip"]').tooltip();
			$('#tree').treeview({data: test_tree});
			$("#addN").click(app.modules.tree.addNode);
			$("#addI").click(app.modules.tree.addItem);
			$("#del").click(app.modules.tree.del);

		}
	}
})();

app.modules.term = (function(){
	var test_tree;
	var liste_del = [];
	return{

		unCheckChild : function(node){
			if((node.nodes != undefined)&&(node.nodes != null)){
				node.nodes.forEach(function(e){
					$('#subTree').treeview('uncheckNode', [ e.nodeId, { silent: true } ]);
					if((e.nodes != undefined)&&(e.nodes != null)){
						app.modules.term.unCheckChild(e);
					}
				});
			}
		},

		checkParent : function(node){
			$('#subTree').treeview('checkNode', [ node.nodeId, { silent: true } ]);
			if((node.parentId != undefined) && (node.parentId != null)){
				var parent = $('#subTree').treeview('getParent', node);
				app.modules.term.checkParent(parent);
			}
		},

		check : function(){
			$('#subTree').treeview('checkAll', { silent: true });
		},

		unCheck : function(){
			$('#subTree').treeview('uncheckAll', { silent: true });
		},

		add : function(){
			var x = $('#tree').treeview('getSelected');
			if((x[0] == undefined) || (x[0].type == "item")){
				alert("Please select a valid node");
			}else{
				app.modules.term.recursiveAdd(test_tree);
				liste_del.forEach(function(e){
					app.modules.term.recursiveDel(test_tree,e);
				});
				liste_del = [];
				app.modules.tree.add(test_tree);
				test_tree = undefined;
				$('#subTree').treeview('remove');
			}
		},

		recursiveDel : function(t,id){
			var done = false;
			var i = 0;
			while((!done) && (i < t.length)){
				var x = t[i];
				if(x.id == id){
					console.log("del");
					t.splice(i,1);
					return true;
				}else{
					if(x.nodes != undefined){
						done = app.modules.term.recursiveDel(x.nodes,id);
						i++;
					}else {
						i++;
					}
				}
			}
			return false;
		},


		recursiveAdd : function(tab){
			var liste = $('#subTree').treeview('getChecked');
			tab.forEach(function(e){
				var check = false;
				var i = 0;
				while((i < liste.length)&&(!check)){
					if(liste[i].id == e.id){
						check = true;
					}else{
						i++;
					}
				}
				if(!check){
					liste_del.push(e.id);
				}else{
					if(e.type == "node"){
						app.modules.term.recursiveAdd(e.nodes);
					}
				}
			});
		},

		test : function(){
			var liste = $('#tree').treeview('getSelected');
			console.log(test_tree);
		},


		init : function(){
			test_tree = [
				{
					text: "Node",
					type: "node",
					id: "0",
					nodes: [
						{
							text: "Node",
							type: "node",
							id: "1",
							nodes: [
								{
									text: "Item",
									type: "item",
									id: "2"
								},
								{
									text: "Item",
									type: "item",
									id: "3"
								},
							]
						},
						{
							text: "Item",
							type: "item",
							id: "4"
						}
					]
				},
			];
			$('#subTree').treeview({data: test_tree , showCheckbox: true, selectable: false});
			$("#addTerm").click(app.modules.term.add);
			$("#check").click(app.modules.term.check);
			$("#unCheck").click(app.modules.term.unCheck);
			$('#subTree').on('nodeChecked', function(event, data) {
  			app.modules.term.checkParent(data);
			});
			$('#subTree').on('nodeUnchecked', function(event, data) {
  			app.modules.term.unCheckChild(data);
			});
		}
	}
})();


app.modules.table = (function(){
	var data;
	return{

		search : function(){
			var param = $('#inputTerm').val();
			var uri = 'http://lov.okfn.org/dataset/lov/api/v2/term/search?q='+param;
			var pr = $.ajax({
				url : uri,
				type: "GET",
				dataType: "json",
				success :
					function(res){
						$('#table').bootstrapTable('destroy');
						$('#table').bootstrapTable({
								data: res.results
						});
					}
			});
		},

		init : function(){

			$('#table').on('click', 'tbody tr', function(event) {
				var x = $(this).children()[0];
				console.log(x);
			});

			$('#submitTerm').click(app.modules.table.search);
		}
	}

})();


$(document).ready(function () {
	app.modules.table.init();
  app.modules.tree.init();
	app.modules.term.init();
});
