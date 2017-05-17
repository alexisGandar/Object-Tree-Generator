//Lavascript file for the step 2
var app = {
	modules : {}
}

//Liste of prefix
var listPref;

//General module of this app
app.modules.target = (function(){
	//Attributes
	//the O-DF tree
  var test_tree;
	//the Data tree
	var data_tree;
	//id of the futur new node
  var newId = 0;
	//id of the value selected in the data tree
	var data_selected;
	//id of the value selected in the O-DF tree
	var test_selected;
	//Array of all the link beetween value
	var links = [];
	//the connection to delete
	var conn;
	return{

		/*
			Generate the O-DF tree from an xml string

			@param : s - xml String
		*/
		ODF : function(s){
			console.log(s);
			var res = s.split(">");
			test_tree = [];
			var newNode = {
				text: "Root",
				type: "root",
				id: newId,
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
              // Print the contents of the file
              var res = e.target.result.split(">");
							console.log(res);
              test_tree = [];
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
							sessionStorage.load = 0;
							sessionStorage.tree = JSON.stringify(test_tree);
							console.log(test_tree);
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
            var newNode = {
              text: term,
              typeof: term,
              type: "Node",
              id: newId,
              nodes: []
            };
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
              typeof: range,
              type: "Node",
              property: pro,
              id: newId,
              nodes: []
            };
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
              name: na,
              type: "item",
							range : range,
              property: pro,
              id: newId,
              nodes: [
                {
                  text: "Value",
            			type: "value",
            			id: newId+1,
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
			Allow to import Json file for the data tree. Open a modal window to allow the user to select a file to import

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
              // Print the contents of the file
							console.log(JSON.parse(e.target.result));
							var res = e.target.result;
							res = e.target.result.slice(1,e.target.result.length);
							console.log(res);
							data_tree = [];
              var newNode = {
                text: "Root",
                type: "root",
                id: newId,
                nodes: []
              };
              newId++;
              data_tree.push(newNode);
							app.modules.target.data(res,data_tree[0]);
              $('#dataTree').treeview({data: data_tree});
							$('#dataTree').treeview('expandAll');
							$('#dataTree').on('nodeCollapsed', function(event, data) {
								app.modules.target.reload();
							});
							$('#dataTree').on('nodeExpanded', function(event, data) {
								app.modules.target.reload();
							});
            };
          })(f);

          // Read in the file
          //reader.readAsDataText(f,UTF-8);
          reader.readAsText(f,"UTF-8");
        }
		},

		/*
			Read a table of char (the json file) and create the data tree from it

			@param : s - Array of char
			@param : n - Root node
		*/
		data : function(s,n){
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
								property: "",
								id: newId,
								nodes: []
							};
							newId++;
							node[node.length-1].nodes.push(newNode);
							node.push(newNode);
							newNode = {
								text: "Object",
								typeof: "Object",
								type: "Node",
								pop : true,
								property: "",
								id: newId,
								nodes: []
							};
						}else{
							newNode = {
								text: "Object",
								typeof: "Object",
								type: "Node",
								property: "",
								id: newId,
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
								id: newId,
								nodes: [
									{
										text: value,
										type: "value",
										tree: "data",
										value: value,
										id: newId+1,
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
								type: "array",
								property: "",
								id: newId,
								nodes: []
							};
						}else {
							newNode = {
								text: name,
								typeof: "Array",
								type: "array",
								property: "",
								id: newId,
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
								tree: "data",
								value: value,
								id: newId
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
								tree: "data",
								value: name,
								id: newId,
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
								id: newId,
								nodes: [
									{
										text: value,
										type: "value",
										tree: "data",
										value: value,
										id: newId+1,
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
									tree: "data",
									value: name,
									id: newId,
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
	        	if((s[i] != "'")&&(s[i] != '"')&&(s[i] != '[')){
							if(!switchNV){
								name = name + s[i];
							}else{
								value = value + s[i];
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
					find = true
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
			Select the value and call method to create links.

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
					console.log("unselected");
					app.modules.target.changeColor(id,"selected","round");
					data_selected = undefined;
				}else {
					if(data_selected != undefined){
						app.modules.target.changeColor(data_selected,"selected","round");
					}
					console.log("selected");
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
			console.log($("#"+id));
		},

		/*
			Create a link beetween two value

			@param : obj - object that contains the id of the both value to connect
			@param : color - the color of the connection
		*/
		addLink : function(obj,color){
			var add = true;
			links.forEach(function(e){
				if((e.data == obj.data)&&(e.test == obj.test)){
					add = false;
				}
			});
			if(add){
				links.push(obj);
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
			$(id).html('<p id="xmlVersion" wrap="off">Delete this connection ?</p><button class="btn custom btn-default" id="delete">yes</button><button class="btn custom btn-default" id="cancel">cancel</button>');

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
			 while((!find)&&(i<links.length)){
				 if(("p"+links[i].test == conn.sourceId)&&("p"+links[i].data == conn.targetId)){
					 find = true;
					 links.splice(i,1);
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
			Display the selected node from the data tree
		*/
    test : function(){
			var liste = $('#dataTree').treeview('getSelected');
		},

		/*
			Initialize all the events of the module and create the O-DF tree if there is one save in the sessionStorage
		*/
    init : function(){
      newId = sessionStorage.getItem('id');
      if(sessionStorage.getItem('tree') != undefined){
        test_tree = sessionStorage.getItem('tree');
      }
			if(sessionStorage.load == 1){
				app.modules.target.ODF(test_tree);
			}
			$('#sugestion').click(app.modules.target.sugest);
      $('#tree').treeview({data: test_tree});
			$('#tree').treeview('expandAll');
      document.getElementById('file-1').addEventListener('change', app.modules.target.import, false);
			document.getElementById('file-2').addEventListener('change', app.modules.target.json, false);
			$('#tree').on('nodeCollapsed', function(event, data) {
				app.modules.target.reload();
			});
			$('#tree').on('nodeExpanded', function(event, data) {
				app.modules.target.reload();
			});
			jsPlumb.bind('click', function (connection, e) {
				conn = connection;
				app.modules.target.showModal();
 			});
			$( window ).resize(function() {
  			jsPlumb.repaintEverything();
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
				console.log(listPref);
			}
	});

  app.modules.target.init();
});
