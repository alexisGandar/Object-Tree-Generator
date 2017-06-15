//Lavascript file for the step 1
var app = {
	modules : {}
}

//Liste of prefix
var listPref;

//Module for the O-DF tree
app.modules.tree = (function(){
	//Attributes

	//Structure of the tree
	var test_tree;
	//Id of the futur new node (I know that Bootstrap Treewiew include id for node but I had to add an other id because I can't access the other one everywhere)
	var newId = 8;
	return {

		/*
			Add a tree to the selected node

			@param : new_tree - new tree to add
		*/
		add : function(new_tree){
			app.modules.tree.nodes(new_tree);
			var x = $('#tree').treeview('getSelected');
			y = x[0];
			if(y.type != "item"){
				if(y.type != "root"){
					new_tree[0].property = "";
				}
				app.modules.tree.changeId(new_tree);
				app.modules.tree.recursiveAdd(test_tree,y.id,new_tree[0]);
				$('#tree').treeview('selectNode', [ y.nodeId, { silent: true } ]);
				$('#tree').treeview('expandNode', [ y.nodeId, { silent: true } ]);
			}
		},

		/*
			Add a custom node to the O-DF tree
		*/
		addCustom : function(){
			if(($("#inputCustom").val() == undefined) || ($("#inputCustom").val() == "")){
				alert("Please enter a name");
			}else{
				var n = {
					text: $("#inputCustom").val(),
					type: "node",
					score: -1, // when you create a custom node the score is -1
					prop: undefined,
					id: 0,
					typeof: $("#inputCustom").val(),
				}
				var t = [];
				t.push(n);
				app.modules.tree.add(t);
				app.modules.tree.hideModal();
			}
		},

		/*
			Delete the nodes attribute of all the node from a tree if nodes is empty

			@param : tab - tree
		*/
		nodes : function(tab){
			tab.forEach(function(e){
				if((e.nodes == undefined) || (e.nodes.length <= 0)){
					delete e.nodes;
				}else{
					app.modules.tree.nodes(e.nodes);
				}
			});
		},

		/*
			Change the id attribute of all the node from a tree

			@param : tab - tree
		*/
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

		/*
			Change the id attribute of all the node from a tree

			@param : t - tree
			@param : id - id of the node to add
			@param : obj - tree to add
			@return : done - if the add is complete
		*/
		recursiveAdd : function(t,id,obj){
			var done = false;
			var i = 0;
			while((!done) && (i < t.length)){
				var x = t[i];
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

		/*
			Delete selected node
		*/
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

		/*
			find the rigth node to delete

			@param : t - tree
			@param : id - id of the node to delete
			@return : done - if the delete is complete
		*/
		recursiveDel : function(t,id){
			var done = false;
			var i = 0;
			while((!done) && (i < t.length)){
				var x = t[i];
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

		/*
			Show a modal window with input to create a term
		*/
		showModal : function(){
			var selected = $('#tree').treeview('getSelected');
			if(selected.length == 0){
				alert("Please select a valid node to add");
			}else{

				var id = '#modal4';
				$(id).html('<label>Name</label><input class="form-control" id="inputCustom"><button class="btn custom btn-default" id="confirm">Confirm</button><button class="btn custom btn-default" id="cancel">Cancel</button>');

				app.modules.tree.resizeModal();

				$('#fond4').fadeIn(1000);
				$('#fond4').fadeTo("slow",0.8);
				$(id).fadeIn(200);

				$("#cancel").click(app.modules.tree.hideModal);
				$("#confirm").click(app.modules.tree.addCustom);

				$('.popup4 .close').click(function (e) {
					 e.preventDefault();
					 app.modules.tree.hideModal();
				 });
			}
	 },

	 /*
	 	Hide the modal window
	 */
	 hideModal : function(){
			// On cache le fond et la fenêtre modale
			$('#fond4, .popup4').hide();
			$('.popup4').html('');
	 },

	 /*
	 	Resize the modal window
	 */
	 resizeModal : function(){
			var modal = $('#modal4');
			// On récupère la largeur de l'écran et la hauteur de la page afin de cacher la totalité de l'écran
			var winH = $(document).height();
			var winW = $(window).width();

			// le fond aura la taille de l'écran
			$('#fond4').css({'width':winW,'height':winH});

			// On récupère la hauteur et la largeur de l'écran
			var winH = $(window).height();
			// On met la fenêtre modale au centre de l'écran
			modal.css('top', winH/2 - modal.height()/2);
			modal.css('left', winW/2 - modal.width()/2);
	 },

		/*
			Reload the tree
		*/
		reload : function(){
			var liste = $('#tree').treeview('getExpanded');
			$('#tree').treeview({data: test_tree});
			liste.forEach(function(e){
				$('#tree').treeview('expandNode', e.nodeId);
			});

		},

		/*
			find a node

			@param : t - tree
			@param : id - id of the node to find
			@return : res - the node
		*/
		find : function(t,id){
			var i = 0;
			var res;
			while((i<t.length) && (res == undefined)){
				if(t[i].id == id){
					res = t[i];
				}else{
					if(t[i].nodes != undefined){
						res = app.modules.tree.find(t[i].nodes,id);
					}else{
						i++;
					}
				}
			}
			return res;
		},

		/*
			Display the selected node (just to test)
		*/
		test : function(){
			var liste = $('#tree').treeview('getSelected');
		},

		/*
			Get the tree

			@return : attribute getTree
		*/
		getTree : function(){
			return test_tree;
		},

		/*
			Get the new Id

			@return : attribute newId
		*/
		getId : function(){
			return newId;
		},

		/*
			Initialize all the event from the module (launch when the window is load)
		*/
		init : function(){

			test_tree = [
			{
				text: "Root",
				type: "root",
				id: "0",
				nodes: []
			},
			];

			$('[data-toggle="tooltip"]').tooltip();
			$('#tree').treeview({data: test_tree});
			$("#addN").click(app.modules.tree.addNode);
			$("#addI").click(app.modules.tree.addItem);
			$("#del").click(app.modules.tree.del);
			$("#customTerm").click(app.modules.tree.showModal);
			$("#step2").click(function(){
				if(test_tree[0].nodes[0] != undefined){
					app.modules.convert.conv();
				}else{
					document.location.href = "view/step2.html";
				}
			});

		}
	}
})();

//Module for the Term tree
app.modules.term = (function(){
	//Attributes
	//The strcture of the tree
	var test_tree;
	//liste of the nodes to delete (use when you add something to the O-DF tree)
	var liste_del = [];
	//Id of the futur new node
	var newId;
	//score of the main term
	var score;
	return{

		/*
			Display the childrens nodes of a node (call when you check a node)

			@param : node - the node check
		*/
		showChild : function(node){
			if((node.type == "node")&&(node.nodes == undefined)){
				var newN ={
					type:"node",
					text:node.text,
					id: node.id,
					prop:node.prop,
					score: node.score,
					typeof:node.typeof
				}
				var termUrl = node.prop;
				var done = false;
				while(!done){
					if((termUrl[termUrl.length-1] == "/") || (termUrl[termUrl.length-1] == "#")){
						done = true;
					}else{
						termUrl = termUrl.slice(0, -1);
					}
				}


				var query = 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'

										+'SELECT DISTINCT ?property ?range'
										+'{'
	    							+' GRAPH <'+termUrl+'>'
	  								+'{'
	  								+'?property rdfs:domain <'+node.typeof+'>.'
										+'?property rdfs:range ?range.'
										+'}}';

				var uri = 'http://localhost:3030/LOV/query?query=' + encodeURIComponent(query);

				var pr = $.ajax({
					url : uri,
					type: "GET",
					dataType: "json",
					async	: true,
					success :
						function(res){
							res.results.bindings.forEach(function(e){
								var res = e.property.value.split("/");
								var tmp = res[res.length-1].split("#");
								var nameVal = tmp[tmp.length-1];
								var prefixVal;
								var done = false;
								var y = 0;
								while((!done)&&(y<listPref.length)){
									if(e.property.value.includes(listPref[y].vocabURI.value)){
										prefixVal = listPref[y].vocabPrefix.value;
										done = true;
									}else{
										y++;
									}
								}
								var res2 = e.range.value.split("/");
								tmp = res2[res2.length-1].split("#");
								var nameRange = res2[res2.length-1];
								var prefixRange;
								done = false;
								y = 0;
								while((!done)&&(y<listPref.length)){
									if(e.range.value.includes(listPref[y].vocabURI.value)){
										prefixRange = listPref[y].vocabPrefix.value;
										done = true;
									}else{
										y++;
									}
								}
								var n = {
									text: prefixVal +"/"+ nameVal + "      "+ prefixRange +"/"+ nameRange +"      "+ e.property.value + "      " + e.range.value,
									type: "node",
									score: score,
									prop: e.property.value,
									id: newId,
									typeof: e.range.value,
								}
								newId++;
								if(newN.nodes==undefined){
									newN.nodes = [];
								}
								newN.nodes.push(n);
							});

							var check = $('#subTree').treeview('getChecked');
							var expand = $('#subTree').treeview('getExpanded');
							app.modules.term.replace(newN,test_tree);
							$('#subTree').treeview('remove');
							$('#subTree').treeview({data: test_tree , showCheckbox: true, selectable: false});
							$('#subTree').treeview('expandNode',node.nodeId);
							check.forEach(function(e){
								if(e.nodeId>node.nodeId){
									e.nodeId = e.nodeId + res.results.bindings.length;
								}
								$('#subTree').treeview('checkNode',e.nodeId);
							});
							expand.forEach(function(e){

								$('#subTree').treeview('expandNode',e.nodeId);
							});
							$('#subTree').on('nodeChecked', function(event, data) {
								app.modules.term.checkParent(data,data,'#subTree');
							});
							$('#subTree').on('nodeUnchecked', function(event, data) {
									app.modules.term.unCheckChild(data,'#subTree');
							});
						}
				});

			}
		},

		/*
			Replace a node in the tree

			@param : node - the node to replace in the tree
			@param : t - the tree
		*/
		replace : function(node,t){
			var done = false;
			var i = 0;
			while((!done)&&(i<t.length)){
				if(t[i].id==node.id){
					t[i] = node;
					done = true;
				}else{
					if(t[i].nodes != undefined){
						done = app.modules.term.replace(node,t[i].nodes)
					}
				}
				i++;
			}
			return done;
		},

		/*
			Uncheck the child of a node in a tree

			@param : node - the parent node uncheck
			@param : tree - the tree
		*/
		unCheckChild : function(node,tree){
			if((node.nodes != undefined)&&(node.nodes != null)){
				if(tree == "#editTree"){
					node.nodes.forEach(function(e){
						$(tree).treeview('uncheckNode', [ e.nodeId, { silent: true } ]);
						if((e.nodes != undefined)&&(e.nodes != null)){
							app.modules.term.unCheckChild(e,tree);
						}
					});
				}else{
					var checked = $(tree).treeview('getChecked');
					if(node.parentId != undefined){
						var parent = $(tree).treeview('getNode', node.parentId);
						var id = app.modules.term.getCloser(node,parent,tree);
						if(id == false){
							checked.forEach(function(e){
								if(e.nodeId>node.id){
									$(tree).treeview('uncheckNode', [ e.nodeId, { silent: true } ]);
								}
							});
						}else{
							checked.forEach(function(e){

								if((e.nodeId>node.nodeId)&&(e.nodeId<id)){
									$(tree).treeview('uncheckNode', [ e.nodeId, { silent: true } ]);
								}
							});
						}
					}else{
						checked.forEach(function(e){
							if(e.nodeId>node.id){
								$(tree).treeview('uncheckNode', [ e.nodeId, { silent: true } ]);
							}
						});
					}
				}
			}
			if((node.nodes != undefined)&&(node.nodes != null)){
				node.nodes.forEach(function(e){
					$(tree).treeview('uncheckNode', [ e.nodeId, { silent: true } ]);
					if((e.nodes != undefined)&&(e.nodes != null)){
						app.modules.term.unCheckChild(e,tree);
					}
				});
			}
		},

		/*
			Find the closest node on the same level or on above level from a node

			@param : node - the node to get the closest neighbour or parent
			@param : parent - the parent of the node
			@param : tree - the tree
			@return : find - if a node have been find
		*/
		getCloser : function(node,parent,tree){
			var find = false;
			var i = 0;
			while((!find)&&(i<parent.nodes.length)){
				if(node.nodeId < parent.nodes[i].nodeId){
					return parent.nodes[i].nodeId;
				}else{
					i++;
				}
			}
			if(!find){
				if(parent.parentId==undefined){
					return false;
				}
				var GrandParent = $(tree).treeview('getNode', parent.parentId);
				app.modules.term.getCloser(node,GrandParent);
			}
		},

		/*
			Check all the parents of a node in a tree

			@param : node - the node to check all it's parent
			@param : first - the first node who have been check (first time you call the fonction the attribute first is the same that the attribute node and don't change in all the iteration)
			@param : tree - the tree
		*/
		checkParent : function(node,first,tree){
			$(tree).treeview('checkNode', [ node.nodeId, { silent: true } ]);
			if((node.parentId != undefined) && (node.parentId != null)){
				var parent = $(tree).treeview('getParent', node);
			 	app.modules.term.checkParent(parent,first,tree);
			}else{
				if(tree == '#subTree'){
					app.modules.term.showChild(first);
				}
			}
		},

		/*
			Add all the node check to the selecte node from the Term tree
		*/
		add : function(){
			var x = $('#tree').treeview('getSelected');
			if((x[0] == undefined) || (x[0].type == "item")){
				alert("Please select a valid node");
			}else{
				if($('#subTree').treeview('getChecked').length != 0 ){
					app.modules.term.recursiveAdd(test_tree);
					liste_del.forEach(function(e){
						app.modules.term.recursiveDel(test_tree,e);
					});
					liste_del = [];
					app.modules.tree.add(test_tree);
					test_tree = undefined;
					$('#subTree').treeview('remove');
				}else{
					alert("Check a term to add");
				}
			}
		},

		/*
			Add to the liste_del attribute all the node who are not check in the treeview

			@param : tab - the tree
		*/
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
						if(e.nodes != undefined){
							app.modules.term.recursiveAdd(e.nodes);
						}
					}
				}
			});
		},

		/*
			Delete the a node from the tree

			@param : t - the tree
			@param : id - id of the node to delete
		*/
		recursiveDel : function(t,id){
			var done = false;
			var i = 0;
			while((!done) && (i < t.length)){
				var x = t[i];
				if(x.id == id){
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

		/*
			Generate the tree

			@param : tab - the tree to generate
			@param : term - name of the parent node who is the term itself
		*/
		generate : function(tab,term,s){
			newId = 0;
			score = s;
			$('#subTree').treeview('remove');;
			test_tree = [];
			var t;
			var root;
			t = "node";
			root = {
				text: term,
				type: t,
				id: newId,
				score: score,
				typeof: term,
				nodes: []
			}
			if((tab[0]==undefined) || (tab[0] == null)){
				root.nodes = undefined;
			}
			newId++;
			test_tree.push(root);
			if(t == "node"){
				var i = 1;
				tab.forEach(function(e){
					var res = e.property.value.split("/");
					var tmp = res[res.length-1].split("#");
					var nameVal = tmp[tmp.length-1];
					var prefixVal;
					var done = false;
					var y = 0;
					while((!done)&&(y<listPref.length)){
						if(e.property.value.includes(listPref[y].vocabURI.value)){
							prefixVal = listPref[y].vocabPrefix.value;
							done = true;
						}else{
							y++;
						}
					}
					var res2 = e.range.value.split("/");
					tmp = res2[res2.length-1].split("#");
					var nameRange = tmp[tmp.length-1];
					var prefixRange;
					done = false;
					y = 0;
					while((!done)&&(y<listPref.length)){
						if(e.range.value.includes(listPref[y].vocabURI.value)){
							prefixRange = listPref[y].vocabPrefix.value;
							done = true;
						}else{
							y++;
						}
					}
					var node = {
						text: prefixVal +"/"+ nameVal + "      "+ prefixRange +"/"+ nameRange +"      "+ e.property.value + "      " + e.range.value,
						type: "node",
						score: score,
						prop: e.property.value,
						id: newId,
						typeof: e.range.value,
					}
					test_tree[0].nodes.unshift(node);
					i++;
					newId++;
				});
			}
			//refrech the event
			$('#subTree').treeview({data: test_tree , showCheckbox: true, selectable: false});
			$('#subTree').on('nodeChecked', function(event, data) {
				app.modules.term.checkParent(data,data,'#subTree');
			});
			$('#subTree').on('nodeUnchecked', function(event, data) {
  			app.modules.term.unCheckChild(data,'#subTree');
			});
		},

		/*
			Display the node selected (just use for test)
		*/
		test : function(){
			var liste = $('#subTree').treeview('getSelected');
		},

		/*
			Initialize all the event from the module (launch when the window is load)
		*/
		init : function(){

			$('#subTree').on('nodeChecked', function(event, data) {
				app.modules.term.checkParent(data,data,'#subTree');
			});
			$('#subTree').on('nodeUnchecked', function(event, data) {
  			app.modules.term.unCheckChild(data,'#subTree');
			});

			$("#addTerm").click(app.modules.term.add);
			$("#check").click(app.modules.term.check);
			$("#unCheck").click(app.modules.term.unCheck);
		}
	}
})();

//Module for the table of term
app.modules.table = (function(){
	//Attribute
	//Table of the term to display
	var data;
	//Array of the terms
	var tab = [];
	return{

		/*
			Get informations to generate the Term tree and call the generate function from the term modue with those informations

			@param : term - the selected term
		*/
		select : function(term,score){
			var termUrl;
			var prefix;
			var name;
			var done = false;
			var i = 0;
			while(!done){
				if(tab.results[i].prefixedName[0] == term){
					termUrl = tab.results[i].uri[0];
					prefix = tab.results[i]["vocabulary.prefix"][0];
					name = tab.results[i].prefixedName[0];
					done = true;
				}
				i++;
			}
			done = false;
			while(!done){
				if((termUrl[termUrl.length-1] == "/") || (termUrl[termUrl.length-1] == "#")){
					done = true;
				}else{
					termUrl = termUrl.slice(0, -1);
				}
			}

			var query = 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'
									+'PREFIX '+prefix+':  <'+termUrl+'>'

									+'SELECT DISTINCT ?property ?range'
									+'{'
    							+' GRAPH <'+termUrl+'>'
  								+'{'
  								+'?property rdfs:domain '+name+'.'
									+'?property rdfs:range ?range.'
									+'}}';

			var uri = 'http://localhost:3030/LOV/query?query=' + encodeURIComponent(query);

			var pr = $.ajax({
				url : uri,
				type: "GET",
				dataType: "json",
				success :
					function(res){
						app.modules.term.generate(res.results.bindings,term,score);
					}
			});
		},

		/*
			Get informations from LOV with the val of the search bar in parameter
		*/
		search : function(){
			var param = $('#inputTerm').val();
			var uri = 'http://lov.okfn.org/dataset/lov/api/v2/term/search?q='+param;
			var pr = $.ajax({
				url : uri,
				type: "GET",
				dataType: "json",
				success :
					function(res){
						tab = res;
						$('#table').bootstrapTable('destroy');
						$('#table').bootstrapTable({
								data: res.results
						});
					}
			});
		},

		/*
			Initialize all the event from the module (launch when the window is load)
		*/
		init : function(){

			$('#table').on('click', 'tbody tr', function(event) {
				var x = $(this).children()[0].innerHTML;
				var y = $(this).children()[1].innerHTML;
				app.modules.table.select(x,y);
			});

			$('#submitTerm').click(app.modules.table.search);

		}
	}

})();

//Module to convert the tree in xml
app.modules.convert = (function(){
	return{

		/*
			convert the tree in a xml string
		*/
		conv : function(){
			var tree = app.modules.tree.getTree();
			var s = app.modules.convert.recursiveConv(tree,0,"");
			app.modules.convert.showModal(s);
		},

		/*
			Read every node of the O-DF tree to create the xml string

			@param : t - the tree
			@param : lvl - the level in the tree
			@param : s - the actual xml string who have been build
			@return : s - the xml string
		*/
		recursiveConv : function(t,lvl,s){
			t.forEach(function(e){
				if(lvl == 0){
					s = s + '<?xml version="1.0"?>' + "\n";
					s = s + '<objects xmlns="odf.xsd">'+ "\n";
					s = app.modules.convert.recursiveConv(e.nodes,1,s);
					s = s + "</objects>";
				}else{
					if((e.type == "node")&&(e.nodes == undefined)){
						var res = e.typeof.split("/");
						e.name = res[res.length-1];
						e.property = e.prop;
						e.range = e.typeof;
					}
					if(e.nodes != undefined){
						if(lvl == 1){
							s = s + '\t<object typeof ="'+e.typeof+'" score ="'+e.score+'">' + "\n";
						}else{
							var i = 0;
							while(i<lvl){
								i++;
								s = s + "\t";
							}
							s = s + '<object typeof ="'+e.typeof+'" property="'+e.prop+'" range="'+e.typeof+'" score ="'+e.score+'">' + "\n";
						}
						var i = 0;
						while(i<lvl){
							i++;
							s = s + "\t";
						}
						s = s +'\t<id>Placeholder_value</id>' + "\n";
						s = app.modules.convert.recursiveConv(e.nodes,lvl+1,s);
						i = 0;
						while(i<lvl){
							i++;
							s = s + "\t";
						}
						s = s + "</object>" + "\n";
					}else{
						var i = 0;
						while(i<lvl){
							i++;
							s = s + "\t";
						}
						s = s + '<infoItem name="'+e.name+'" property="'+e.property+'" range="'+e.range+'" score ="'+e.score+'"></infoItem>' + "\n";
					}
				}
			});
			return s;
		},

		/*
			Show a modal window with the xml string in it and option to go to step 2 or to download the xml

			@param : s - the xml string
		*/
		 showModal : function(s){
		   var id = '#modal';
		   $(id).html('<textarea id="xmlVersion" wrap="off">'+s+'</textarea><button class="btn custom2 btn-default" id="dl">Download<span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span></button><button class="btn custom2 btn-default" id="step2">Step2<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></button><button class="btn custom2 btn-default" id="cancel">Cancel</button>');

		   // On definit la taille de la fenetre modale
		   app.modules.convert.resizeModal();

		   // Effet de transition
		   $('#fond').fadeIn(1000);
		   $('#fond').fadeTo("slow",0.8);
		   // Effet de transition
		   $(id).fadeIn(2000);

		   $('.popup .close').click(function (e) {
		      // On désactive le comportement du lien
		      e.preventDefault();
		      // On cache la fenetre modale
		      app.modules.convert.hideModal();
		    });
				$('#step2').click(app.modules.convert.step2);
				$('#cancel').click(app.modules.convert.hideModal);
				$('#dl').click(app.modules.convert.saveTextAsFile);
		},

		/*
			Hide the modal window
		*/
		hideModal : function(){
		   // On cache le fond et la fenêtre modale
		   $('#fond, .popup').hide();
		   $('.popup').html('');
		},

		/*
			resize the modal window
		*/
		resizeModal : function(){
		   var modal = $('#modal');
		   // On récupère la largeur de l'écran et la hauteur de la page afin de cacher la totalité de l'écran
		   var winH = $(document).height();
		   var winW = $(window).width();

		   // le fond aura la taille de l'écran
		   $('#fond').css({'width':winW,'height':winH});

		   // On récupère la hauteur et la largeur de l'écran
		   var winH = $(window).height();
		   // On met la fenêtre modale au centre de l'écran
		   modal.css('top', winH/2 - modal.height()/2);
		   modal.css('left', winW/2 - modal.width()/2);
		},

		/*
			Download the xml file
		*/
		saveTextAsFile : function(){
    	var textToWrite = $(xmlVersion).val();
    	var textFileAsBlob = new Blob([textToWrite], {type:'text/xml'});
    	var fileNameToSaveAs = "Tree";

    	var downloadLink = document.createElement("a");
    	downloadLink.download = fileNameToSaveAs;
    	downloadLink.innerHTML = "Download File";
    	if (window.webkitURL != null)
    	{
        	// Chrome allows the link to be clicked
        	// without actually adding it to the DOM.
        	downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    	}
    	else
    	{
        	// Firefox requires the link to be added to the DOM
        	// before it can be clicked.
        	downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        	//downloadLink.onclick = destroyClickedElement;
        	downloadLink.style.display = "none";
        	document.body.appendChild(downloadLink);
    	}

    	downloadLink.click();
	},

	/*
		Go to the step2 with the tree O-DF tree that you made in the step 1
	*/
	step2 : function(){
		var id = app.modules.tree.getId();
		var tree = $('#xmlVersion').val();
		sessionStorage.id = id;
		sessionStorage.tree = tree;
		document.location.href = "view/step2.html";
	},

		init : function(){
			$('#convert').click(app.modules.convert.conv);
		}
	}

})();

//Module to edit the O-DF tree
app.modules.edit = (function(){
		//Attributes
		//A part of the O-DF tree to edit
		var treeEdit;
		//liste of node to delete
		var liste_del = [];
	return{

		/*
			Show a modal window with the edit tree. The tree edit is the selected node of the O-DF tree. This method delete the node from the O-DF tree to add it later.
		*/
		showModal : function(){
			var selected = $('#tree').treeview('getSelected');
			if((selected.length == 0) || (selected[0].type == "root")){
				alert("Please select a valid note to edit");
			}else{
				$('#tree').treeview('collapseNode', selected);
				var treeToModif = app.modules.tree.getTree();
				treeEdit = [];
				treeEdit.push(app.modules.tree.find(treeToModif,selected[0].id));
				app.modules.tree.del();
				$('#tree').treeview('selectNode', selected[0].parentId);

				var id = '#modal3';
				$(id).html('<div id="editTree"></div><button class="btn custom2 btn-default" id="confirm">Confirm</button>');

				// On definit la taille de la fenetre modale
				app.modules.edit.resizeModal();

				// Effet de transition
				$('#fond3').fadeIn(1000);
				$('#fond3').fadeTo("slow",0.8);
				// Effet de transition
				$(id).fadeIn(2000);

				$('.popup3 .close').click(function (e) {
					 // On désactive le comportement du lien
					 e.preventDefault();
					 // On cache la fenetre modale
					 app.modules.edit.hideModal();
				 });
				 selected[0].parentId = undefined;
				 $('#editTree').treeview({data: selected, showCheckbox: true, selectable: false});
				 $('#editTree').treeview('checkAll', { silent: true });
				 $('#editTree').on('nodeChecked', function(event, data) {
	 				app.modules.term.checkParent(data,data,'#editTree');
	 			});
	 			$('#editTree').on('nodeUnchecked', function(event, data) {
	   			app.modules.term.unCheckChild(data,'#editTree');
	 			});
				 $('#confirm').click(app.modules.edit.add);
			}
	 },

	 /*
	 	Hide the modal window
	 */
	 hideModal : function(){
			// On cache le fond et la fenêtre modale
			$('#fond3, .popup3').hide();
			$('.popup3').html('');
	 },

	 /*
	 	Resize the modal window
	 */
	 resizeModal : function(){
			var modal = $('#modal3');
			// On récupère la largeur de l'écran et la hauteur de la page afin de cacher la totalité de l'écran
			var winH = $(document).height();
			var winW = $(window).width();

			// le fond aura la taille de l'écran
			$('#fond3').css({'width':winW,'height':winH});

			// On récupère la hauteur et la largeur de l'écran
			var winH = $(window).height();
			// On met la fenêtre modale au centre de l'écran
			modal.css('top', winH/2 - modal.height()/2);
			modal.css('left', winW/2 - modal.width()/2);
	 },

	 /*
	 	Add the edit tree to the O-DF tree
	 */
	 add : function(){
		 var x = $('#tree').treeview('getSelected');
		 if((x[0] == undefined) || (x[0].type == "item")){
			 alert("Please select a valid node");
		 }else{
			 if($('#editTree').treeview('getChecked').length != 0 ){
				 app.modules.edit.recursiveAdd(treeEdit);
				 liste_del.forEach(function(e){
					 app.modules.edit.recursiveDel(treeEdit,e);
				 });
				 liste_del = [];
				 app.modules.tree.add(treeEdit);
				 treeEdit = undefined;
				 $('#editTree').treeview('remove');
				 app.modules.edit.hideModal();
			 }else{
				 alert("Check a term to add");
			 }
		 }
	 },

	 /*
	 	Add all the uncheck node to the attribute liste_del

		@param : tab - the tree
	 */
	 recursiveAdd : function(tab){
		 var liste = $('#editTree').treeview('getChecked');
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
				 if(e.nodes != undefined){
					 app.modules.edit.recursiveAdd(e.nodes);
				 }
			 }
		 });
	 },

	 /*
		Delete a node from the tree

		@param : t - the tree
		@param : id - id of the node to delete
	 */
	 recursiveDel : function(t,id){
		 var done = false;
		 var i = 0;
		 while((!done) && (i < t.length)){
			 var x = t[i];
			 if(x.id == id){
				 t.splice(i,1);
				 return true;
			 }else{
				 if(x.nodes != undefined){
					 done = app.modules.edit.recursiveDel(x.nodes,id);
					 i++;
				 }else {
					 i++;
				 }
			 }
		 }
		 return false;
	 },

	 /*
	 	Initialize all the events of the module
	 */
		init : function(){
			$('#edit').click(app.modules.edit.showModal);
		}
	}
})();

//start all the init function and get the list of prefix from LOV
$(document).ready(function () {
	app.modules.edit.init();
	app.modules.table.init();
  app.modules.tree.init();
	app.modules.term.init();
	app.modules.convert.init();
	$('#fond').click(function () {
		 app.modules.convert.hideModal();
	});
	$(window).resize(function () {
    app.modules.convert.resizeModal()
	});
	var query = 'PREFIX vann:<http://purl.org/vocab/vann/>'
							+'PREFIX voaf:<http://purl.org/vocommons/voaf#>'

							+'SELECT DISTINCT ?vocabPrefix ?vocabURI {'
							+'GRAPH <http://lov.okfn.org/dataset/lov>{'
							+'?vocabURI a voaf:Vocabulary.'
							+'?vocabURI vann:preferredNamespacePrefix ?vocabPrefix.'
							+'}} ORDER BY ?vocabPrefix';

	var uri = 'http://localhost:3030/LOV/query?query=' + encodeURIComponent(query);

	var pr = $.ajax({
		url : uri,
		type: "GET",
		dataType: "json",
		success :
			function(res){
				listPref = res.results.bindings;
			}
	});
});
