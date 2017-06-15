//Lavascript file for the step 2
var app = {
	modules : {}
}

//Liste of prefix
var listPref;

//General module of this app
app.modules.target = (function(){
	//Attributes
	//xml file of the O-DF tree
	var xml;
	//the O-DF tree
  var test_tree;
	//the Data tree
	var data_tree;
	//id of the futur new node
  var newId = 0;
	//list of all the file
	var jsonFileList = [];
	//Array of data tree
	var listData = [];
	//Json version of the listData
	var listJson = [];
	//id of the current data tree display
	var dataId;
	//id of the value selected in the data tree
	var data_selected;
	//id of the value selected in the O-DF tree
	var test_selected;
	//file selected
	var file_selected;
	//Array of all the links beetween value
	var linksVal = [];
	//Array of all the links beetween value and id
	var linksId = [];
	//Array of all the links
	var links = [];
	//Id of the current connection read (use in export)
	var exportId;
	//the connexion export
	var exportJson = {};
	//the current object to add in the exportJson
	var currentObj;
	//the current id use in the export function with their path
	var idPath = [];
	//id of the current json value use in the currentObj
	var currentJson = [];
	//True if the list of json is display
	var listDisplay = false;
	//the connection to delete
	var conn;
	return{

		/*
			Generate the O-DF tree from an xml string

			@param : s - xml String
		*/
		ODF : function(s){
			xml = s;
			newId = 0;
			var res = s.split(">");
			test_tree = [];
			var newNode = {
				text: "Root",
				type: "root",
				id: "ODF"+newId,
				nodes: []
			};
			newId++;
			test_tree.push(newNode);
			app.modules.target.generate(res,test_tree[0]);
		},

		/*
			Allow to import xml file for the O-DF tree. Open a modal window to allow the user to select a file to import

			@param : evt - event
		*/
    import : function(evt){
      newId = 0;
      var files = evt.target.files; // FileList object

        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {

          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
							app.modules.target.deleteAllConn();
              // Print the contents of the file
							xml = e.target.result;
              var res = e.target.result.split(">");
							linksId = [];
							linksVal = [];
              test_tree = [];
							data_selected = undefined;
							test_selected = undefined;
              var newNode = {
                text: "Root",
                type: "root",
                id: newId,
                nodes: []
              };
              newId++;
              test_tree.push(newNode);
              app.modules.target.generate(res,test_tree[0]);
							sessionStorage.id = newId;
							sessionStorage.tree = e.target.result;
              $('#tree').treeview({data: test_tree});
							$('#tree').treeview('expandAll');
            };
          })(f);

          // Read in the file
          //reader.readAsDataText(f,UTF-8);
          reader.readAsText(f,"UTF-8");
        }
    },

		/*
			Generate the O-DF tree from a root node and an array of stringify

			@param : t - the tree
			@param : n - the root node
		*/
    generate : function(t,n){
      var node = [];
      node.push(n);
      t.forEach(function(e){
        var res = e.split(" ");
        var r = res[0].split("\t");
				//if it's an Object
        if(r[r.length-1] == "<object"){
					var y = 0;
					var done = false;
					while((!done)&&(y<res.length)){
						if(res[y].includes("property")){
							done = true;
						}else{
							y++;
						}
					}
					//if it's an Object who have for parent the root node
          if(!done){
						var term;
						var i = 0;
						//get the typeof value
						while((term == undefined)&&(i<res.length)){
							i = app.modules.target.space(i,res);
							if(res[i].includes("typeof")){
								if(res[i] == "typeof"){
									i++;
									i = app.modules.target.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											term = res[i].slice(1,res[i].length-2);
										}else{
											term = res[i].slice(1,res[i].length-1);
										}
									}else{
										if(res[i].includes(">")){
											term = res[i].slice(2,res[i].length-2);
										}else{
											term = res[i].slice(2,res[i].length-1);
										}
									}
								}else{
									if(res[i] == "typeof="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											term = res[i].slice(1,res[i].length-2);
										}else{
											term = res[i].slice(1,res[i].length-1);
										}
									}else {
										if(res[i].includes(">")){
											term = res[i].slice(8,res[i].length-2);
										}else{
											term = res[i].slice(8,res[i].length-1);
										}
									}
								}
							}else{
								i++;
							}
						}

						var score;
						//get the score
						while((score == undefined)&&(i<res.length)){
							i = app.modules.target.space(i,res);
							if(res[i].includes("score")){
								if(res[i] == "score"){
									i++;
									i = app.modules.target.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											score = res[i].slice(1,res[i].length-2);
										}else{
											score = res[i].slice(1,res[i].length-1);
										}
									}else{
										if(res[i].includes(">")){
											score = res[i].slice(2,res[i].length-2);
										}else{
											score = res[i].slice(2,res[i].length-1);
										}
									}
								}else{
									if(res[i] == "score="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											score = res[i].slice(1,res[i].length-2);
										}else{
											score = res[i].slice(1,res[i].length-1);
										}
									}else {
										if(res[i].includes(">")){
											score = res[i].slice(7,res[i].length-2);
										}else{
											score = res[i].slice(7,res[i].length-1);
										}
									}
								}
							}else{
								i++;
							}
						}
            var newNode = {
              text: term,
              typeof: term,
              type: "Node",
							score: score,
              id: "ODF"+newId,
              nodes: [
								{
									text: "Object_Id",
		              type: "id",
		              id: "ODF"+(newId+1),
								}
							]
            };
            newId++;
						newId++;
            node[node.length-1].nodes.push(newNode);
            node.push(newNode);

          }else{ //if it's an Object in an Object
						var range;
						var i = 0;
						//get the typeof value
						while((range == undefined)&&(i<res.length)){
							i = app.modules.target.space(i,res);
							if(res[i].includes("typeof")){
								if(res[i] == "typeof"){
									i++;
									i = app.modules.target.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											range = res[i].slice(1,res[i].length-2);
										}else{
											range = res[i].slice(1,res[i].length-1);
										}
									}else{
										if(res[i].includes(">")){
											range = res[i].slice(2,res[i].length-2);
										}else{
											range = res[i].slice(2,res[i].length-1);
										}
									}
								}else{
									if(res[i] == "typeof="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											range = res[i].slice(1,res[i].length-2);
										}else{
											range = res[i].slice(1,res[i].length-1);
										}
									}else {
										if(res[i].includes(">")){
											range = res[i].slice(8,res[i].length-2);
										}else{
											range = res[i].slice(8,res[i].length-1);
										}
									}
								}
							}else{
								i++;
							}
						}
						i = 0
						var pro;
						//get the property value
						while((pro == undefined)&&(i<res.length)){
							i = app.modules.target.space(i,res);
							if(res[i].includes("property")){
								if(res[i] == "property"){
									i++;
									i = app.modules.target.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											pro = res[i].slice(1,res[i].length-2);
										}else{
											pro = res[i].slice(1,res[i].length-1);
										}
									}else{
										if(res[i].includes(">")){
											pro = res[i].slice(2,res[i].length-2);
										}else{
											pro = res[i].slice(2,res[i].length-1);
										}
									}
								}else{
									if(res[i] == "property="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											pro = res[i].slice(1,res[i].length-2);
										}else{
											pro = res[i].slice(1,res[i].length-1);
										}
									}else {
										if(res[i].includes(">")){
											pro = res[i].slice(10,res[i].length-2);
										}else{
											pro = res[i].slice(10,res[i].length-1);
										}
									}
								}
							}else{
								i++;
							}
						}

						var score;
						//get the score
						while((score == undefined)&&(i<res.length)){
							i = app.modules.target.space(i,res);
							if(res[i].includes("score")){
								if(res[i] == "score"){
									i++;
									i = app.modules.target.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											score = res[i].slice(1,res[i].length-2);
										}else{
											score = res[i].slice(1,res[i].length-1);
										}
									}else{
										if(res[i].includes(">")){
											score = res[i].slice(2,res[i].length-2);
										}else{
											score = res[i].slice(2,res[i].length-1);
										}
									}
								}else{
									if(res[i] == "score="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											score = res[i].slice(1,res[i].length-2);
										}else{
											score = res[i].slice(1,res[i].length-1);
										}
									}else {
										if(res[i].includes(">")){
											score = res[i].slice(7,res[i].length-2);
										}else{
											score = res[i].slice(7,res[i].length-1);
										}
									}
								}
							}else{
								i++;
							}
						}

						var res = pro.split("/");
						var tmp = res[res.length-1].split("#");
						var nameVal = tmp[tmp.length-1];
						var prefixVal;
						var done = false;
						var y = 0;
						while((!done)&&(y<listPref.length)){
							if(pro.includes(listPref[y].vocabURI.value)){
								prefixVal = listPref[y].vocabPrefix.value;
								done = true;
							}else{
								y++;
							}
						}
						var res2 = range.split("/");
						tmp = res2[res2.length-1].split("#");
						var nameRange = tmp[tmp.length-1];
						var prefixRange;
						done = false;
						y = 0;
						while((!done)&&(y<listPref.length)){
							if(range.includes(listPref[y].vocabURI.value)){
								prefixRange = listPref[y].vocabPrefix.value;
								done = true;
							}else{
								y++;
							}
						}
            var newNode = {
              text: prefixVal +"/"+ nameVal + "      "+ prefixRange +"/"+ nameRange +"      "+ pro+"      "+range,
							score: score,
							typeof: range,
              type: "Node",
              property: pro,
              id: "ODF"+newId,
              nodes: [
								{
									text: "Object_Id",
		              type: "id",
		              id: "ODF"+(newId+1),
								}
							]
            };
            newId++;
						newId++;
            node[node.length-1].nodes.push(newNode);
            node.push(newNode);
          }
        }else{ //if it's an Item
          if(r[r.length-1] == "<infoItem"){
						var na;
						var pro;
						var range;
						var i = 0;
						//get the name value
						while ((i<res.length)&&(na==undefined)) {
							i = app.modules.target.space(i,res);
							if(res[i].includes("name")){
								if(res[i] == "name"){
									i++;
									i = app.modules.target.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											na = res[i].slice(1,res[i].length-2);
										}else{
											na = res[i].slice(1,res[i].length-1);
										}
									}else{
										if(res[i].includes(">")){
											na = res[i].slice(2,res[i].length-2);
										}else{
											na = res[i].slice(2,res[i].length-1);
										}
									}
								}else{
									if(res[i] == "name="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											na = res[i].slice(1,res[i].length-2);
										}else{
											na = res[i].slice(1,res[i].length-1);
										}
									}else{
										if(res[i].includes(">")){
											na = res[i].slice(6,res[i].length-2);
										}else{
											na = res[i].slice(6,res[i].length-1);
										}
									}
								}
							}else{
								i++;
							}
						}

						i=0;

						//get the property value
						while((i<res.length)&&(pro==undefined)){
							if(res[i].includes("property")){
								if(res[i] == ("property")){
									i++;
									i = app.modules.target.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											pro = res[i].slice(1,res[i].length-2);
										}else{
											pro = res[i].slice(1,res[i].length-1);
										}
									}else{
										if(res[i].includes(">")){
											pro = res[i].slice(2,res[i].length-2);
										}else{
											pro = res[i].slice(2,res[i].length-1);
										}
									}
								}else{
									if(res[i] == "property="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											pro = res[i].slice(1,res[i].length-2);
										}else{
											pro = res[i].slice(1,res[i].length-1);
										}
									}else{
										if(res[i].includes(">")){
											pro = res[i].slice(10,res[i].length-2);
										}else{
											pro = res[i].slice(10,res[i].length-1);
										}
									}
								}
							}else{
								i++;
							}
						}

						i = 0;

						//get the range value
						while((range == undefined)&&(i<res.length)){
							i = app.modules.target.space(i,res);
							if(res[i].includes("range")){
								if(res[i] == "range"){
									i++;
									i = app.modules.target.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											range = res[i].slice(1,res[i].length-2);
										}else{
											range = res[i].slice(1,res[i].length-1);
										}
									}else{
										if(res[i].includes(">")){
											range = res[i].slice(2,res[i].length-2);
										}else{
											range = res[i].slice(2,res[i].length-1);
										}
									}
								}else{
									if(res[i] == "range="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											range = res[i].slice(1,res[i].length-2);
										}else{
											range = res[i].slice(1,res[i].length-1);
										}
									}else {
										if(res[i].includes(">")){
											range = res[i].slice(7,res[i].length-2);
										}else{
											range = res[i].slice(7,res[i].length-1);
										}
									}
								}
							}else{
								i++;
							}
						}

						var score;
						//get the score
						while((score == undefined)&&(i<res.length)){
							i = app.modules.target.space(i,res);
							if(res[i].includes("score")){
								if(res[i] == "score"){
									i++;
									i = app.modules.target.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											score = res[i].slice(1,res[i].length-2);
										}else{
											score = res[i].slice(1,res[i].length-1);
										}
									}else{
										if(res[i].includes(">")){
											score = res[i].slice(2,res[i].length-2);
										}else{
											score = res[i].slice(2,res[i].length-1);
										}
									}
								}else{
									if(res[i] == "score="){
										i++;
										i = app.modules.target.space(i,res);
										if(res[i].includes(">")){
											score = res[i].slice(1,res[i].length-2);
										}else{
											score = res[i].slice(1,res[i].length-1);
										}
									}else {
										if(res[i].includes(">")){
											score = res[i].slice(7,res[i].length-2);
										}else{
											score = res[i].slice(7,res[i].length-1);
										}
									}
								}
							}else{
								i++;
							}
						}

						var res = pro.split("/");
						var tmp = res[res.length-1].split("#");
						var nameVal = tmp[tmp.length-1];
						var prefixVal;
						var done = false;
						var y = 0;
						while((!done)&&(y<listPref.length)){
							if(pro.includes(listPref[y].vocabURI.value)){
								prefixVal = listPref[y].vocabPrefix.value;
								done = true;
							}else{
								y++;
							}
						}
						var res2 = range.split("/");
						tmp = res2[res2.length-1].split("#");
						var nameRange = tmp[tmp.length-1];
						var prefixRange;
						done = false;
						y = 0;
						while((!done)&&(y<listPref.length)){
							if(range.includes(listPref[y].vocabURI.value)){
								prefixRange = listPref[y].vocabPrefix.value;
								done = true;
							}else{
								y++;
							}
						}
            var newNode = {
              text: prefixVal +"/"+ nameVal + "      "+ prefixRange +"/"+ nameRange +"      "+ pro+"      "+range,
							score: score,
							name: na,
              type: "item",
							range : range,
              property: pro,
              id: "ODF"+newId,
              nodes: [
                {
                  text: "Item_Value",
            			type: "value",
            			id: "ODF"+(newId+1),
                }
              ]
            };
            newId++;
            newId++;
            node[node.length-1].nodes.push(newNode);
          }else{
            if(r[r.length-1] == "</object"){
              node.pop();
            }
          }
        }
      });
    },

		/*
			Skip the space in a table of string

			@param : i - id of the string
			@param : res - array of string
			@return : i
		*/
		space : function(i,res){
			while((res[i] == "")&&(i<res.length)){
				i++;
			}
			return i;
		},

		/*
			Allow to import Json file for the data tree. Open a modal window to allow the user to select a file to import.

			@param : evt - event
		*/
		json : function(evt){
			var files = evt.target.files; // FileList object

        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {

          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
							newId = 0;
							var x = listData.length;
							var prefixId = "JS"+x;
							app.modules.target.deleteAllConn();
              // Print the contents of the file
							var res = e.target.result;
							var file = {
								name: theFile.name,
								data: res,
							}
							jsonFileList.push(file);

							res = e.target.result.slice(1,e.target.result.length);
							data_tree = [];
							data_selected = undefined;
              var newNode = {
                text: "Root",
								tree : "data",
								file: theFile.name,
                type: "root",
                id: prefixId + newId,
                nodes: []
              };
              newId++;
              data_tree.push(newNode);
							app.modules.target.data(res,data_tree[0],prefixId);
							app.modules.target.chooseStructure(data_tree);
							//listData.push(data_tree);
							//dataId = listData.length-1;
							var obj = {
								name : theFile.name,
							};
							listJson.push(obj);
							$('#table2').bootstrapTable('destroy');
							$('#table2').bootstrapTable({
									data: listJson
							});

            };
          })(f);

          // Read in the file
          //reader.readAsDataText(f,UTF-8);
          reader.readAsText(f,"UTF-8");
        }
		},

		/*
			Show a modal window where the user can select the part of the data tree to show

			@param : tree - tree to display
		*/
		chooseStructure : function(tree){
			var id = '#modal';
			$(id).html('<h4>Please check the node of the structure</h4><div id="chooseTree"></div>');
			$('#chooseTree').treeview({data: tree[0].nodes,showCheckbox: true});
			$('#chooseTree').treeview('expandAll');
			$('#chooseTree').on('nodeChecked', function(event, data) {
			 	app.modules.target.add(data);
		 	});
			// On definit la taille de la fenetre modale
			app.modules.target.resizeChoose();

			// Effet de transition
			$('#fond').fadeIn(1000);
			$('#fond').fadeTo("slow",0.8);
			// Effet de transition
			$(id).fadeIn(2000);

			$('.popup .close').click(function (e) {
				 // On désactive le comportement du lien
				 e.preventDefault();
				 // On cache la fenetre modale
				 app.modules.target.hideModal();
			 });
		},

		/*
			Create the data tree with the check node

			@param : node - the check node
		*/
		add : function(node){
			n = {
				text : "Root",
				type : "root",
				id: 0,
				nodes:[]
			}
			n.nodes.push(node);
			var x = listData.length;
			var prefixId = "JS"+x;
			app.modules.target.changeId(n.nodes,1,prefixId);
			dataTree = [];
			dataTree.push(n);
			listData.push([n]);
			dataId = listData.length-1;
			$('#dataTree').treeview({data: dataTree});
			$('#dataTree').treeview('expandAll');
			app.modules.target.hideChoose();
		},

		/*
			Change the id attribute of all the node from a tree

			@param : tab - tree
		*/
		changeId : function(tab,id,prefixId){
			tab.forEach(function(e){
				e.id = prefixId+id;
				id++;
				if(e.tree == "choose"){
					e.tree = "data";
				}
				if(e.nodes != undefined){
					id = app.modules.target.changeId(e.nodes,id,prefixId);
				}
			});
			return id;
		},

		/*
			Hide the modal window
		*/
		hideChoose : function(){
		   // On cache le fond et la fenêtre modale
		   $('#fond, .popup').hide();
		   $('.popup').html('');
		},

		/*
			resize the modal window
		*/
		resizeChoose : function(){
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
			Select the json file and display it

			@param : file - the name of the json file selected
		*/
		select : function(file){
			var i = 0;
			var find = false;
			while((i<listJson.length)&&(!find)){
				if(listJson[i].name == file){
					find = true;
					dataId = i;
					data_tree = listData[i];
				}else{
					i++;
				}
			}
			data_selected = undefined;
			test_selected = undefined;
			app.modules.target.deleteAllConn();
			$('#tree').treeview("remove");
			$('#tree').treeview({data: test_tree});
			$('#tree').treeview('expandAll');
			$('#dataTree').treeview({data: data_tree});
			$('#dataTree').treeview('expandAll');
			app.modules.target.reload();
		},

		/*
			Read a table of char (the json file) and create the data tree from it

			@param : s - Array of char
			@param : n - Root node
		*/
		data : function(s,n,prefixId){
			var node = [];
      node.push(n);
			var name = "";
			var value = "";
			var switchNV = false;
			var last = "";
			var i = 0;

			while(i<s.length){
				switch(s[i]) {
	    		case "{":
						var newNode;
						if(last == ":"){
							newNode = {
								text: name,
								typeof: name,
								type: "Node",
								tree: "choose",
								property: "",
								id: prefixId + newId,
								nodes: []
							};
							newId++;
							node[node.length-1].nodes.push(newNode);
							node.push(newNode);
							newNode = {
								text: "Object",
								typeof: "Object",
								type: "Node",
								tree: "choose",
								pop : true,
								property: "",
								id: prefixId + newId,
								nodes: []
							};
						}else{
							newNode = {
								text: "Object",
								typeof: "Object",
								type: "Node",
								tree: "choose",
								property: "",
								id: prefixId + newId,
								nodes: []
							};
						}
						newId++;
						node[node.length-1].nodes.push(newNode);
						node.push(newNode);
						name = "";
						value = "";
						switchNV = false;
	        	break;
	    		case "}":
						if((name != "")&&(value != "")){
							var newNode = {
								text: name,
								name: name,
								type: "item",
								property: name,
								tree: "choose",
								id: prefixId + newId,
								nodes: [
									{
										text: value,
										type: "value",
										tree: "choose",
										value: value,
										id: prefixId + (newId+1),
									}
								]
							};
							newId++;
							newId++;
							node[node.length-1].nodes.push(newNode);
							name = "";
							value = "";
						}
	        	if(node[node.length-1].pop == true){
							node[node.length-1].pop = undefined;
							node.pop();
							node.pop();
						}else{
							node.pop();
						}
						switchNV = false;
	        	break;
					case "[" :
						var newNode;
						if(name == ""){
							newNode = {
								text: "Object",
								typeof: "Array",
								tree: "choose",
								type: "array",
								property: "",
								id: prefixId + newId,
								nodes: []
							};
						}else {
							newNode = {
								text: name,
								typeof: "Array",
								type: "array",
								tree: "choose",
								property: "",
								id: prefixId + newId,
								nodes: []
							};
						}
						newId++;
						node[node.length-1].nodes.push(newNode);
						node.push(newNode);
						name = "";
						value = "";
						switchNV = false;
						break;
					case "]" :
						if(last == "["){
							var newNode = {
								text: "empty",
								type: "value",
								tree: "choose",
								value: value,
								id: prefixId + newId
							};
							newId++;
							node[node.length-1].nodes.push(newNode);
							name = "";
							value = "";
						}
						if(name != ""){
							var newNode = {
								text: name,
								type: "value",
								tree: "choose",
								value: name,
								id: prefixId + newId,
							}
							newId++;
							node[node.length-1].nodes.push(newNode);
							name = "";
							value = "";
						}
						node.pop();
						break;
					case ",":
						if((name != "")&&(value != "")){
							var newNode = {
								text: name,
								name: name,
								type: "item",
								property: name,
								tree: "choose",
								id: prefixId + newId,
								nodes: [
									{
										text: value,
										type: "value",
										tree: "choose",
										value: value,
										id: prefixId + (newId+1),
									}
								]
							};
							newId++;
							newId++;
							node[node.length-1].nodes.push(newNode);
							name = "";
							value = "";
						}else{
							if((name != "")&&(value == "")){
								var newNode = {
									text: name,
									type: "value",
									tree: "choose",
									value: name,
									id: prefixId + newId,
								}
								newId++;
								node[node.length-1].nodes.push(newNode);
								name = "";
								value = "";
							}
						}
						switchNV = false;
						break;
					case ":":
						switchNV = true;
						break;
	    		default:
						if((s[i] != "'")&&(s[i] != '"')&&(s[i] != '[')&&(s[i] != '\n')&&(s[i] != '\t')&&(s[i] != '\r')&&(s[i] != '\b')){
							if((s[i] != '\f')){
								if(!switchNV){
									name = name + s[i];
								}else{
									value = value + s[i];
								}
							}
						}
					}
					if(s[i] != " "){
						last = s[i];
					}
					i++;
			};
		},

		/*
			Search if a node is in a tree

			@param : tree - the tree
			@param : id - the id of the node to search
			@return : find - if the node is contain
		*/
		contain : function(tree,id){
			var find = false;
			var i = 0;
			while((!find)&&(i<tree.length)){
				if(tree[i].id == id){
					find = true;
				}else{
					if(tree[i].nodes != undefined){
						find = app.modules.target.contain(tree[i].nodes,id);
					}
				}
				i++;
			}
			return find;
		},

		/*
			Select the value and call method to create linksVal.

			@param : id - id of the value who have been click
		*/
		link : function(id){
			if(app.modules.target.contain(test_tree,id)){
				if(test_selected == id){
					app.modules.target.changeColor(id,"selected","round");
					test_selected = undefined;
				}else {
					if(test_selected != undefined){
						app.modules.target.changeColor(test_selected,"selected","round");
					}
					test_selected = id;
					$("#"+id).attr("class", "selected");
					app.modules.target.changeColor(id,"round","selected");
					if(data_selected != undefined){
          	var obj = {
							test : test_selected,
							data : data_selected
						}
						app.modules.target.changeColor(test_selected,"selected","round");
						app.modules.target.changeColor(data_selected,"selected","round");
						test_selected = undefined;
						data_selected = undefined;
						app.modules.target.addLink(obj,"black");
					}
				}
			}else{
				if(data_selected == id){
					app.modules.target.changeColor(id,"selected","round");
					data_selected = undefined;
				}else {
					if(data_selected != undefined){
						app.modules.target.changeColor(data_selected,"selected","round");
					}
					data_selected = id;
					app.modules.target.changeColor(id,"round","selected");
					if(test_selected != undefined){
						var obj = {
							test : test_selected,
							data : data_selected
						}
						app.modules.target.changeColor(test_selected,"selected","round");
						app.modules.target.changeColor(data_selected,"selected","round");
						test_selected = undefined;
						data_selected = undefined;
						app.modules.target.addLink(obj,"black");
					}
				}
			}
		},

		/*
			Change the color of a value selector

			@param : id - id of the value
			@param : old - old class to remove
			@param : n - new class to add
		*/
		changeColor : function(id,old,n){
			$("#"+id).removeClass( old ).addClass( n );
		},

		/*
			Create a link beetween two value

			@param : obj - object that contains the id of the both value to connect
			@param : color - the color of the connection
		*/
		addLink : function(obj,color){
			var add = true;
			var res = app.modules.target.find(test_tree,obj.test);
			if(res.type == "value"){
				linksVal.forEach(function(e){
					if((e.data == obj.data)&&(e.test == obj.test)){
						add = false;
					}
				});
				if(add){
					linksVal.push(obj);
				}
			}else {
				linksId.forEach(function(e){
					if((e.data == obj.data)&&(e.test == obj.test)){
						add = false;
					}
				});
				if(add){
					linksId.push(obj);
				}
			}
			if(add){
				$("#"+obj.test).parent().attr('id',"p"+obj.test);
				$("#"+obj.data).parent().attr('id',"p"+obj.data);
				jsPlumb.connect({
							source: "p"+obj.test,
							target: "p"+obj.data,
					paintStyle:{ stroke: color, strokeWidth:5 },
					endpointStyle:{ stroke:"black" },
					anchor:["Left", "Right"],
					detachable: false,
						});
				jsPlumb.repaintEverything();
			}
		},

		/*
			Show a modal window to delete a link
		*/
		showModal : function(){
			var id = '#modal2';
			$(id).html('<p id="xmlVersion" wrap="off">Delete this connection ?</p><button class="btn custom3 btn-default" id="delete">yes</button><button class="btn custom3 btn-default" id="cancel">cancel</button>');

			// On definit la taille de la fenetre modale
			app.modules.target.resizeModal();

			// Effet de transition
			$('#fond2').show();
			// Effet de transition
			$(id).show();

			$('.popup2 .close').click(function (e) {
				 // On désactive le comportement du lien
				 e.preventDefault();
				 // On cache la fenetre modale
				 app.modules.target.hideModal();
			 });
			 $('#cancel').click(app.modules.target.hideModal);
			 $('#delete').click(app.modules.target.delete);
	 },

	 /*
	 	Hide the modal window
	 */
	 hideModal : function(){
			// On cache le fond et la fenêtre modale
			$('#fond2, .popup2').hide();
			$('.popup2').html('');
	 },

	 /*
	 	Resize the modal window
	 */
	 resizeModal : function(){
			var modal = $('#modal2');
			// On récupère la largeur de l'écran et la hauteur de la page afin de cacher la totalité de l'écran
			var winH = $(document).height();
			var winW = $(window).width();

			// le fond aura la taille de l'écran
			$('#fond2').css({'width':winW,'height':winH});

			// On récupère la hauteur et la largeur de l'écran
			var winH = $(window).height();
			// On met la fenêtre modale au centre de l'écran
			modal.css('top', winH/2 - modal.height()/2);
			modal.css('left', winW/2 - modal.width()/2);
	 },

	 /*
	 	Delete the link (the attribute conn)
	 */
	 delete : function(){
		 if(conn != undefined){
			 var find = false;
			 var i = 0;
			 while((!find)&&(i<linksVal.length)){
				 if(("p"+linksVal[i].test == conn.sourceId)&&("p"+linksVal[i].data == conn.targetId)){
					 find = true;
					 linksVal.splice(i,1);
				 }else{
					 i++;
				 }
			 }
			 i=0;
			 while((!find)&&(i<linksId.length)){
				 if(("p"+linksId[i].test == conn.sourceId)&&("p"+linksId[i].data == conn.targetId)){
					 find = true;
					 linksId.splice(i,1);
				 }else{
					 i++;
				 }
			 }
			 jsPlumb.detach(conn);
			 jsPlumb.recalculateOffsets($("ul"));
			 jsPlumb.repaintEverything();
			 conn = undefined;
			 app.modules.target.hideModal();
		 }
	 },

	 /*
	 	Make sugestion connection in red beetween the both tree
	 */
	 sugest : function(){
		 if((test_tree == undefined) || (data_tree == undefined)){
			 alert("Please import all the data require");
		 }else{
			 var data_val = app.modules.target.getVal(data_tree, "");
			 var test_val = app.modules.target.getVal(test_tree, "");
			 data_val.forEach(function(e){
				 if(e.parent != "Object"){
					 test_val.forEach(function(i){
						 if(i.parent.toLowerCase().includes(e.parent.toLowerCase())){
							 var obj = {
	 						 	 test : i.id,
	 							 data : e.id
	 					 	 }
							 app.modules.target.addLink(obj,"red");
						 }
					 });
				 }
			 });
		 }
	 },

	 /*
		 find a node

		 @param : t - tree
		 @param : id - id of the node to find
		 @return : res - the node
	 */
	 find : function(tree,id){
		 var find = false;
		 var i = 0;
		 var res;
		 while((!find)&&(i<tree.length)&&(res == undefined)){
			 if(tree[i].id == id){
				 find = true
				 res = tree[i];
			 }else{
				 if(tree[i].nodes != undefined){
					 res = app.modules.target.find(tree[i].nodes,id);
				 }
			 }
			 i++;
		 }
		 return res;
	 },

	 /*
	 	Reload all the connection of the current data tree
	 */
	 reload : function(){
		 linksVal.forEach(function(e){
			 if(app.modules.target.contain(data_tree,e.data)){
				$("#"+e.test).parent().attr('id',"p"+e.test);
 				$("#"+e.data).parent().attr('id',"p"+e.data);
				jsPlumb.connect({
							source: "p"+e.test,
							target: "p"+e.data,
					paintStyle:{ stroke: "black", strokeWidth:5 },
					endpointStyle:{ stroke:"black" },
					anchor:["Left", "Right"],
					detachable: false,
						});
				jsPlumb.repaintEverything();
			 }
		 });
		 linksId.forEach(function(e){
			 if(app.modules.target.contain(data_tree,e.data)){
				 $("#"+e.test).parent().attr('id',"p"+e.test);
				 $("#"+e.data).parent().attr('id',"p"+e.data);
				 jsPlumb.connect({
							 source: "p"+e.test,
							 target: "p"+e.data,
					 paintStyle:{ stroke: "black", strokeWidth:5 },
					 endpointStyle:{ stroke:"black" },
					 anchor:["Left", "Right"],
					 detachable: false,
						 });
				 jsPlumb.repaintEverything();
			 }
		 });
		 jsPlumb.bind('click', function (connection, e) {
			 conn = connection;
			 app.modules.target.showModal();
		 });
	 },

	 /*
	 	Get all the value of a tree

		@return : val - Array of value
	 */
	 getVal : function(t,parent){
		 var val = [];
		 t.forEach(function(e){
			 if((e.type == "value")){
				 e.parent = parent;
				 val.push(e);
			 }else{
				 if(e.nodes != undefined){
					 var res = app.modules.target.getVal(e.nodes,e.text);
					 res.forEach(function(i){
			 		 	 val.push(i);
					 });
				 }
			 }
		 });
		 return val;
	 },

	 /*
	 	Delete all the connection of jsPlumb
	 */
	 deleteAllConn : function(){
		jsPlumb.reset();
		jsPlumb.bind('click', function (connection, e) {
			conn = connection;
			app.modules.target.showModal();
		});
	 },

	 /*
	 	Toggle the display of the list of json file
	 */
	 display : function(e){
		 if(listDisplay){
		 	$("#table2").hide();
		 	listDisplay = false;
		 }else{
		 	$("#table2").show();
		 	listDisplay = true;
		 }
		 jsPlumb.repaintEverything();
	 },

	 /*
		 Show a modal window to export the mappings
	 */
	 export : function(){
		 if(linksVal.length == 0){
			 alert('No connection detected');
		 }else{
		   exportJson = {};
			 exportJson.result = [];
		   var currentObj = undefined;
			 exportId = 0;
			 links = linksVal.concat(linksId);
			 app.modules.target.next();
			 //$(id).html('<button class="btn custom3 btn-default" id="cancel">Cancel</button><button class="btn custom3 btn-default" id="next">Next</button>');

			 // On definit la taille de la fenetre modale
			 app.modules.target.resizeExport();

			 // Effet de transition
			 $('#fond').show();
			 // Effet de transition
			 $('#modal').show();

			 $('.popup .close').click(function (e) {
					// On désactive le comportement du lien
					e.preventDefault();
					// On cache la fenetre modale
					app.modules.target.hideExport();
				});
		 }
	},

	/*
	 Hide the modal window of the export
	*/
	hideExport : function(){
		 // On cache le fond et la fenêtre modale
		 $('#fond, .popup').hide();
		 $('.popup').html('');
	},

	/*
	 Resize the modal window of the export
	*/
	resizeExport : function(){
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
		Display the next connection in the modal
	*/
	next : function(){
		var b = true;
		if(exportId != 0){
			if($('#function').val() == ""){
				b = false;
				alert('please fill the text area');
			}else{
				var f = $('#function').val();
				currentJson.forEach(function(e){
					var find = false;
					var p;
					var y = 0;
					while(!find){
						if(idPath[y].id == e.id){
							find = true
							p = idPath[y].path;
						}else{
							y++;
						}
					}
					var res = f.split(e.id);
					f = "";
					y = 0;
					while(y < res.length){
					res[y] = res[y] + "("+p+")";
					f = f + res[y];
						y++;
					}
					var slice = f.length - p.length - 2;
					f = f.slice(0,slice);
				});
				currentObj.function = f;
				exportJson.result.push(currentObj);
				currentObj = undefined;
				idPath = [];
			}
		}
		if(b){
			if(links.length>0){
				var i = 0;
				var json = [];
				var JsonId = [];
				var current = links[0].test;
				while(i<links.length){
					if(links[i].test == current){
						json.push(links[i]);
						JsonId.push(links[i].data);
						links.splice(i,1);
					}else{
						i++;
					}
				}
				var score = [];
				var parentODF = "";
				var parentPath = "";
				var parentJson = [];
				var listNodeTree = $('#tree').treeview('getEnabled');
				var listNodeData = [];
				var tmp;
				listData.forEach(function(e){
					$('#invisibleTree').treeview({data: e});
					$('#invisibleTree').treeview("expandAll");
					listNodeData = listNodeData.concat($('#invisibleTree').treeview('getEnabled'));
				});
				i=0;
				while((i<listNodeTree.length)){
					if(listNodeTree[i].id == json[0].test){
						var n;
						parentPath = listNodeTree[i].text;
						n = $('#tree').treeview('getParent', listNodeTree[i].nodeId);
						if(n.type == "item"){
							tmp = n.property + " " + n.range;
						}else{
							tmp = n.typeof;
						}
						score.push({value: n.score,name: tmp});
						parentODF = n.text;
						parentPath = tmp + "\\" + parentPath;
						while(($('#tree').treeview('getParent', n.nodeId)).type != "root"){
							n = $('#tree').treeview('getParent', n.nodeId);
							score.push({value: n.score,
															name: tmp});
							if(n.type == "item"){
								tmp = n.property + " " + n.range;
							}else{
								tmp = n.typeof;
							}
							parentPath = tmp + "\\" + parentPath;
							parentODF = n.text + " - " + parentODF;
						}
						parentODF = "root" + " - " + parentODF;
						parentPath = "root" + "\\" + parentPath;
					}
					i++;
				}

				listNodeData.forEach(function(e){
					json.forEach(function(d){
						if(d.data == e.id){
							var idTree = e.id.charAt(2);
							$('#invisibleTree').treeview({data: listData[idTree]});
							var p = $('#invisibleTree').treeview('getParent', e.nodeId)
							while(p.text == "Object"){
								p = $('#invisibleTree').treeview('getParent', p.nodeId)
							}

							parentJson.push({
								id: d.data,
								parent: p.text
							});
						}
					});
				});

				var s = [];

				JsonId.forEach(function(e){
					var find3 = false;
					i = 0;
					var node;
					while((!find3)&&(i<listNodeData.length)){
						if(listNodeData[i].id == e){
							node = listNodeData[i];
							find3 = true;
						}else{
							i++;
						}
					}
					var idTree = node.id.charAt(2);
					$('#invisibleTree').treeview({data: listData[idTree]});
					var parent = $('#invisibleTree').treeview('getParent', node.nodeId);
					var path = "";
					if(parent.type == "array"){
						var y = 0;
						var find2 = false;
						while((!find2)&&(y<parent.nodes.length)){
							if(parent.nodes[y].id == node.id){
								find2 = true;
							}else{
								y++;
							}
						}
						path = path + y;
					}else{
						path = path + "0";
					}
					path = parent.text + "\\" + path;
					while(($('#invisibleTree').treeview('getParent', parent.nodeId)).type != "root"){
						parent = $('#invisibleTree').treeview('getParent', parent.nodeId);
						path = parent.text + "\\" + path;
					}
					path = "root\\"+path;
					idPath.push({id:e, path: path});
					s.push(path);
				});

				currentObj = {
					odfId: json[0].test,
					path: parentPath,
					score: score,
					json: s,
				}
				var string = "input : <br>";
				currentJson = parentJson;
				parentJson.forEach(function (e){
					string = string + e.parent + " => id : <button id=b" + e.id + ">" + e.id + "</button> --- ";
				});
				string = string.slice(0, string.length-5);
				var obj = links[exportId];
				var id = '#modal';
				var operation = "<div class='operationBox'><button class='operation' id='bPlus'>+</button><button class='operation' id='bMoins'>-</button><button class='operation' id='bMult'>*</button><button class='operation' id='bDiv'>/</button><button class='operation' id='bConcat'>Concat</div>"
				if(parentJson.length == 1){
					$(id).html('<h5>'+ parentODF +'</h5><div class="idName"><p>'+string+'</p></div>'+operation+'<textarea placeholder="Please use the inputs id to create the function of the current O-DF item" id="function" wrap="off">'+parentJson[0].id+'</textarea><button class="btn custom3 btn-default" id="cancel">Cancel</button><button class="btn custom3 btn-default" id="next">Next</button>');
				}else{
					$(id).html('<h5>'+ parentODF +'</h5><div class="idName"><p>'+string+'</p></div>'+operation+'<textarea placeholder="Please use the inputs id to create the function of the current O-DF item" id="function" wrap="off"></textarea><button class="btn custom3 btn-default" id="cancel">Cancel</button><button class="btn custom3 btn-default" id="next">Next</button>');
				}
				parentJson.forEach(function (e){
					$('#b'+e.id).click(function(){
						$('#function').val($('#function').val() + e.id);
					});
				});
				$('#bPlus').click(function(){
					$('#function').val($('#function').val()+"+");
				});
				$('#bMoins').click(function(){
					$('#function').val($('#function').val()+"-");
				});
				$('#bMult').click(function(){
					$('#function').val($('#function').val()+"*");
				});
				$('#bDiv').click(function(){
					$('#function').val($('#function').val()+"/");
				});
				$('#bConcat').click(function(){
					$('#function').val($('#function').val()+"Concat");
				});
				$('#cancel').click(app.modules.target.hideExport);
				$('#next').click(app.modules.target.next);
			}else{
				var string = JSON.stringify(exportJson);
				var id = '#modal';
				$(id).html('<textarea id="function" readonly="readonly" wrap="off">'+string+'</textarea><button class="btn custom2 btn-default" id="cancel">Cancel</button><button class="btn custom2 btn-default" id="step3">Step 3<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></button><button class="btn custom2 btn-default" id="dl">Download<span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span></button>');
				$('#cancel').click(app.modules.target.hideExport);
				$('#dl').click(app.modules.target.download);
				$('#step3').click(app.modules.target.step3);
			}
			exportId++;
		}
	},

	/*

	*/
	download : function (){
		var zip = new JSZip();
		var jsonName;
		jsonFileList.forEach(function(e){
			zip.file("data/"+e.name, e.data);
			if(jsonName == undefined){
				jsonName = e.name;
			}else{
				jsonName = jsonName + " " + e.name;
			}
		});
		zip.file("json_name.txt", jsonName);
		zip.file("data/O-DF.xml", xml);
		var obj = JSON.stringify(exportJson);
		zip.file("Mappings.json", obj);

		zip.generateAsync({type:"blob"})
		.then(function (blob) {
    saveAs(blob, "data.zip");
});
	},

	/*
		Go to the step 3 with the connection create in the step 2
	*/
	step3 : function (){
		var zip = new JSZip();
		var JsonFiles = [];
		jsonFileList.forEach(function(e){
			zip.file("data/"+e.name, e.data);
			var o = {
				name: "data/"+e.name,
				code: e.data
			}
			JsonFiles.push(o);
		});
		sessionStorage.jsonFiles = JSON.stringify(JsonFiles);
		zip.file("data/O-DF.xml", xml);
		var o = {
			name: "data/O-DF.xml",
			code: xml
		}
		sessionStorage.xml =  JSON.stringify(o);
		var obj = JSON.stringify(exportJson);
		zip.file("Mappings.json", obj);
		var o = {
			name: "Mappings.json",
			code: obj
		}
		sessionStorage.Mappings =  JSON.stringify(o);

		document.location.href = "step3.html";
	},
		/*
			Use for test
		*/
    test : function(){
		},

		/*
			Initialize all the events of the module and create the O-DF tree if there is one save in the sessionStorage
		*/
    init : function(){
      newId = sessionStorage.getItem('id');
      if(sessionStorage.getItem('tree') != undefined){
        test_tree = sessionStorage.getItem('tree');
      }
			if(test_tree != null){
				app.modules.target.ODF(test_tree);
			}
			$('#jsonList').click(app.modules.target.display);
			$('#sugestion').click(app.modules.target.sugest);
			$('#export').click(app.modules.target.export);
      $('#tree').treeview({data: test_tree});
			$('#tree').treeview('expandAll');
      document.getElementById('file-1').addEventListener('change', app.modules.target.import, false);
			document.getElementById('file-2').addEventListener('change', app.modules.target.json, false);
			jsPlumb.bind('click', function (connection, e) {
				conn = connection;
				app.modules.target.showModal();
 			});
			$( window ).resize(function() {
  			jsPlumb.repaintEverything();
			});
			$('#table2').on('click', 'tbody tr', function(event) {
				if(file_selected != undefined){
					$(file_selected).css("background-color","white");
					$(file_selected).css("color","black");
				}
				var x = $(this).children()[0].innerHTML;
				$(this).css("background-color","#428BCA");
				$(this).css("color","white");
				file_selected = $(this);
				app.modules.target.select(x);
			});
			$("#step3").click(function(){
				if(linksVal[0] != undefined){
					app.modules.target.export();
				}else{
					document.location.href = "step3.html";
				}
			});
    }
  }
})();

//launch all the init function of the app and get the list of prefix from LOV
$(document).ready(function () {

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
		async: false,
		success :
			function(res){
				listPref = res.results.bindings;
			}
	});

  app.modules.target.init();
});
