var app = {
	modules : {}
}

app.modules.tree = (function(){
	var test_tree;
	var newId = 8;
	return {

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

		getTree : function(){
			return test_tree;
		},

		getId : function(){
			return newId;
		},

		init : function(){

			test_tree = [
			{
				text: "Root",
				type: "root",
				id: "0",
				nodes: [
				{
					text: "Person",
					type: "node",
					typeof : "Person",
					id: "1",
					nodes: [
					{
						text: "http://something/youKnow/name",
						type: "item",
						name: "name",
						property: "http://something/youKnow/name",
						id: "2"
					},
					{
						text: "http://something/youKnow/age",
						type: "item",
						name: "age",
						property: "http://something/youKnow/age",
						id: "3"
					},
					{
						text: "Adress",
						type: "node",
						typeof: "Adress",
						property: "",
						id: "5",
						nodes: [
							{
								text: "http://something/youKnow/street",
								type: "item",
								name: "street",
								property: "http://something/youKnow/street",
								id: "6"
							},
							{
								text: "http://something/youKnow/number",
								type: "item",
								name: "number",
								property: "http://something/youKnow/number",
								id: "7"
							},
						]
					},
					]
				},
				{
					text: "http://something/youKnow/health",
					type: "item",
					name: "health",
					property: "http://something/youKnow/health",
					id: "4"
				},
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

		showChild : function(node){
			if((node.type == "node")&&(node.nodes == undefined)){
				var termUrl = node.prop;
				var done = false;
				while(!done){
					if((termUrl[termUrl.length-1] == "/") || (termUrl[termUrl.length-1] == "#")){
						done = true;
					}else{
						termUrl = termUrl.slice(0, -1);
					}
				}

				console.log(termUrl);
				console.log(node.typeof);

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
							var i = node.id;
							res.results.bindings.forEach(function(e){
								var res = e.property.value.split("/");
								if(e.range.value == "http://www.w3.org/2000/01/rdf-schema#Literal"){
									var item = {
										text: e.property.value +"   "+e.range.value,
										type: "item",
										name: res[res.length-1],
										property: e.property.value,
										id: i+1,
									}
									if(node.nodes==undefined){
										node.nodes = [];
									}
									node.nodes.push(item);
									i++;
								}else{
									var n = {
										text: e.property.value +" "+e.range.value,
										type: "node",
										prop: e.property.value,
										id: i+1,
										typeof: e.range.value,
									}
									if(node.nodes==undefined){
										node.nodes = [];
									}
									node.nodes.unshift(n);
									i++;
								}
							});
							var check = $('#subTree').treeview('getChecked');
							var expand = $('#subTree').treeview('getExpanded');
							app.modules.term.replace(node,test_tree);
							console.log(test_tree);
							$('#subTree').treeview('remove');
							$('#subTree').treeview({data: test_tree , showCheckbox: true, selectable: false});
							$('#subTree').treeview('expandAll');
							check.forEach(function(e){
								if(e.nodeId>node.nodeId){
									e.nodeId = e.nodeId + res.results.bindings.length;
								}
								$('#subTree').treeview('checkNode',e.nodeId);
							});
							// expand.forEach(function(e){
							// 	if(e.nodeId>node.nodeId){
							// 		e.nodeId = e.nodeId + res.results.bindings.length;
							// 	}
							// });
							$('#subTree').on('nodeChecked', function(event, data) {
								app.modules.term.checkParent(data);
								app.modules.term.showChild(data);
							});
							$('#subTree').on('nodeUnchecked', function(event, data) {
									app.modules.term.unCheckChild(data);
							});
							console.log(check.length);
						}
				});

			}
		},

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

		unCheckChild : function(node){
			if((node.nodes != undefined)&&(node.nodes != null)){
				// node.nodes.forEach(function(e){
				// 	$('#subTree').treeview('uncheckNode', [ e.nodeId, { silent: true } ]);
				// 	if((e.nodes != undefined)&&(e.nodes != null)){
				// 		app.modules.term.unCheckChild(e);
				// 	}
				// });
				var checked = $('#subTree').treeview('getChecked');
				if(node.parentId != undefined){
					var parent = $('#subTree').treeview('getNode', node.parentId);
					var id = app.modules.term.getCloser(node,parent);
					if(id = false){
						checked.forEach(function(e){
							if(e.nodeId>node.id){
								$('#subTree').treeview('uncheckNode', [ e.nodeId, { silent: true } ]);
							}
						});
					}else{
						checked.forEach(function(e){
							if((e.nodeId>node.id)&&(e.nodeId<id)){
								$('#subTree').treeview('uncheckNode', [ e.nodeId, { silent: true } ]);
							}
						});
					}
				}else{
					checked.forEach(function(e){
						if(e.nodeId>node.id){
							$('#subTree').treeview('uncheckNode', [ e.nodeId, { silent: true } ]);
						}
					});
				}

			}
		},

		getCloser : function(node,parent){
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
				var GrandParent = $('#subTree').treeview('getNode', parent.parentId);
				app.modules.term.getCloser(node,GrandParent);
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
			if(test_tree != undefined){
				$('#subTree').treeview('checkAll', { silent: true });
			}
		},

		unCheck : function(){
			if(test_tree != undefined){
				$('#subTree').treeview('uncheckAll', { silent: true });
			}
		},

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

		generate : function(tab,term){
			$('#subTree').treeview('remove');;
			test_tree = [];
			var t;
			var root;
			if((tab[0]==undefined) || (tab[0] == null)){
				t = "item";
				var res = term.split(":");
				root = {
					text: term,
					name: res[1],
					property: term,
					type: t,
					id: "0",
				}
			}else{
				t = "node";
				root = {
					text: term,
					type: t,
					id: "0",
					typeof: term,
					nodes: []
				}
			}

			test_tree.push(root);
			if(t == "node"){
				var i = 1;
				tab.forEach(function(e){
					var res = e.property.value.split("/");
					if(e.range.value == "http://www.w3.org/2000/01/rdf-schema#Literal"){
						var item = {
							text: e.property.value +"   "+e.range.value,
							type: "item",
							name: res[res.length-1],
							property: e.property.value,
							id: i+1,
						}
						test_tree[0].nodes.push(item);
						i++;
					}else{
						var node = {
							text: e.property.value +" "+e.range.value,
							type: "node",
							prop: e.property.value,
							id: i+1,
							typeof: e.range.value,
						}
						test_tree[0].nodes.unshift(node);
						i++;
					}
				});
			}

			$('#subTree').treeview({data: test_tree , showCheckbox: true, selectable: false});
			$('#subTree').on('nodeChecked', function(event, data) {
				app.modules.term.checkParent(data);
				app.modules.term.showChild(data);
			});
			$('#subTree').on('nodeUnchecked', function(event, data) {
  				app.modules.term.unCheckChild(data);
			});
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
			var liste = $('#subTree').treeview('getSelected');
			console.log(liste);
		},


		init : function(){

			$('#subTree').on('nodeChecked', function(event, data) {
				console.log("bla");
				app.modules.term.checkParent(data);
				app.modules.term.showChild(data);
			});
			$('#subTree').on('nodeUnchecked', function(event, data) {
  				app.modules.term.unCheckChild(data);
			});

			$("#addTerm").click(app.modules.term.add);
			$("#check").click(app.modules.term.check);
			$("#unCheck").click(app.modules.term.unCheck);
		}
	}
})();


app.modules.table = (function(){
	var data;
	var tab = [];
	return{

		select : function(term){
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
						console.log(res.results.bindings);
						app.modules.term.generate(res.results.bindings,term);
					}
			});
		},

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
						console.log(tab);
						$('#table').bootstrapTable('destroy');
						$('#table').bootstrapTable({
								data: res.results
						});
					}
			});
		},

		init : function(){

			$('#table').on('click', 'tbody tr', function(event) {
				var x = $(this).children()[0].innerHTML;
				console.log(x);
				app.modules.table.select(x);
			});

			$('#submitTerm').click(app.modules.table.search);

		}
	}

})();

app.modules.convert = (function(){
	var id = 0;
	return{

		conv : function(){
			var tree = app.modules.tree.getTree();
			var s = app.modules.convert.recursiveConv(tree,0,"");
			console.log(s);
			app.modules.convert.showModal(s);
			id = 0;
		},

		recursiveConv : function(t,lvl,s){
			t.forEach(function(e){
				if(lvl == 0){
					s = s + '<?xml version="1.0"?>' + "\n";
					s = s + '<objects xmlns="odf.xsd">'+ "\n";
					s = app.modules.convert.recursiveConv(e.nodes,1,s);
					s = s + "</objects>";
				}else{
					if((e.type == "node")&&(e.nodes == undefined)){
						console.log('lol');
						var res = e.typeof.split(":");
						e.name = res[1];
						e.property = e.typeof;
					}
					if(e.nodes != undefined){
						if(lvl == 1){
							s = s + '\t<object typeof ="'+e.typeof+'">' + "\n";
						}else{
							var i = 0;
							while(i<lvl){
								i++;
								s = s + "\t";
							}
							s = s + '<object typeof ="'+e.typeof+'" property="'+e.property+'">' + "\n";
						}
						var i = 0;
						while(i<lvl){
							i++;
							s = s + "\t";
						}
						s = s +'\t<id>'+e.typeof+id+'</id>'  + "\n";
						id++;
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
						s = s + '<infoItem name="'+e.name+'" property="'+e.property+'">' + "\n";
					}
				}
			});
			return s;
		},

		 showModal : function(s){
		   var id = '#modal';
		   $(id).html('<textarea id="xmlVersion" wrap="off">'+s+'</textarea><button class="btn custom btn-default" id="dl">download</button><button class="btn custom btn-default"  id="step2">step2</button><button class="btn custom btn-default" id="cancel">cancel</button>');

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

		hideModal : function(){
		   // On cache le fond et la fenêtre modale
		   $('#fond, .popup').hide();
		   $('.popup').html('');
		},

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
        	downloadLink.onclick = destroyClickedElement;
        	downloadLink.style.display = "none";
        	document.body.appendChild(downloadLink);
    	}

    	downloadLink.click();
	},

	step2 : function(){
		var id = app.modules.tree.getId();
		var tree = app.modules.tree.getTree();
		sessionStorage.id = id;
		sessionStorage.tree = JSON.stringify(tree);
		sessionStorage.load = 1;
		var link = document.createElement("a");
		link.href = "view/step2.html";
		link.click();
	},

		init : function(){
			$('#convert').click(app.modules.convert.conv);
		}
	}

})();


$(document).ready(function () {
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
});
