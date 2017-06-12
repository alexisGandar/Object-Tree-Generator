//Lavascript file for the step 3
var app = {
	modules : {}
}

//Liste of prefix
var listPref;

//Module for the import
app.modules.step3 = (function(){
	//Attributes
  //xml file
  var xml;
  //connection Mapping
  var connectionMap;
  //list of json from step 2
  var jsonList = [];
	//Tree of the data
	var data_tree = [];
	//tree xml from the step 2
	var xml_tree = [];
	//Tree that contains all the xml for all the occurence of the jsonFileList
	var listXml_tree = [];
	//id of the futur node
	var newId = 0;
	//id for the futur odf node
	var newODF = 0;
	//list of all the object Id allready used
	var objectId = [];
	//if for the futur id object
	var newIdObj = 0;

	return {

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
							i = app.modules.step3.space(i,res);
							if(res[i].includes("typeof")){
								if(res[i] == "typeof"){
									i++;
									i = app.modules.step3.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.step3.space(i,res);
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
										i = app.modules.step3.space(i,res);
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
							i = app.modules.step3.space(i,res);
							if(res[i].includes("score")){
								if(res[i] == "score"){
									i++;
									i = app.modules.step3.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.step3.space(i,res);
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
										i = app.modules.step3.space(i,res);
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
							tree: "odf",
              id: "ODF" + newId,
              nodes: [
								{
									text: "Object_Id",
		              type: "id",
		              id: "ODF" + (newId+1),
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
							i = app.modules.step3.space(i,res);
							if(res[i].includes("typeof")){
								if(res[i] == "typeof"){
									i++;
									i = app.modules.step3.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.step3.space(i,res);
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
										i = app.modules.step3.space(i,res);
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
							i = app.modules.step3.space(i,res);
							if(res[i].includes("property")){
								if(res[i] == "property"){
									i++;
									i = app.modules.step3.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.step3.space(i,res);
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
										i = app.modules.step3.space(i,res);
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
							i = app.modules.step3.space(i,res);
							if(res[i].includes("score")){
								if(res[i] == "score"){
									i++;
									i = app.modules.step3.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.step3.space(i,res);
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
										i = app.modules.step3.space(i,res);
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
							tree: "odf",
              property: pro,
              id: "ODF" + newId,
              nodes: [
								{
									text: "Object_Id",
									tree: "odf",
		              type: "id",
		              id: "ODF" + (newId+1),
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
							i = app.modules.step3.space(i,res);
							if(res[i].includes("name")){
								if(res[i] == "name"){
									i++;
									i = app.modules.step3.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.step3.space(i,res);
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
										i = app.modules.step3.space(i,res);
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
									i = app.modules.step3.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.step3.space(i,res);
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
										i = app.modules.step3.space(i,res);
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
							i = app.modules.step3.space(i,res);
							if(res[i].includes("range")){
								if(res[i] == "range"){
									i++;
									i = app.modules.step3.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.step3.space(i,res);
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
										i = app.modules.step3.space(i,res);
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
							i = app.modules.step3.space(i,res);
							if(res[i].includes("score")){
								if(res[i] == "score"){
									i++;
									i = app.modules.step3.space(i,res);
									if(res[i] == "="){
										i++;
										i = app.modules.step3.space(i,res);
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
										i = app.modules.step3.space(i,res);
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
							tree: "odf",
              id: "ODF" + newId,
              nodes: [
                {
                  text: "Item_Value",
            			type: "value",
            			id: "ODF" + (newId+1),
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
			Allow to import the zip file from the step 2

			@param : evt - event
		*/
		load : function(evt){
      var zip = new JSZip();
			xml = undefined;
			connectionMap = undefined;
			newId = 0;
			jsonList = [];
			data_tree = [];
			xml_tree = [];
			listXml_tree = [];
			$("#tree").treeview('remove');

      zip.loadAsync( this.files[0] /* = file blob */)
      .then(function(zip) {

        zip.file("data/O-DF.xml").async("string").then(function(result) {
          xml = result;
					var res = xml.split(">");
					var newNode = {
						text: "Root",
						type: "root",
						id: "ODF" + newId,
						nodes: []
					};
					newId++
					xml_tree.push(newNode);
					app.modules.step3.generate(res,xml_tree[0]);
        });

        zip.file("Mappings.json").async("string").then(function(result) {
          connectionMap = JSON.parse(result);
        });

        zip.file("json_name.txt").async("string").then(function(result) {
          var res = result.split(" ");
          res.forEach(function(e){
            zip.file("data/"+e).async("string").then(function(result) {
              jsonList.push({name:e,code:result});
							app.modules.step3.chooseStructure();
            });
          });
        });
      });
		},

		/*
			Show a modal window where the user can select the part of the data tree to show for all data file
		*/
		chooseStructure : function(){
			// On definit la taille de la fenetre modale
			app.modules.step3.add(0);
			app.modules.step3.resizeChoose();
			var id = '#modal';

			// Effet de transition
			$('#fond').fadeIn(1000);
			$('#fond').fadeTo("slow",0.8);
			// Effet de transition
			$(id).fadeIn(2000);

			$('.popup .close').click(function (e) {
				 // On désactive le comportement du lien
				 e.preventDefault();
				 // On cache la fenetre modale
				 app.modules.step3.hideModal();
			 });
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
			Display the current Data tree read and add the last tree read if there is one

			@param : idTree - id of the current tree
		*/
		add : function(idTree){
			console.log(idTree);
			if(idTree != jsonList.length){
				var newNode = {
					text: "Root",
					type: "root",
					id: -1,
					nodes: []
				};
				var t = [newNode];
				app.modules.step3.data(jsonList[idTree].code,t[0]);
				var id = '#modal';
				$(id).html('<h4>Please check the node who contains all the occurences</h4><div id="chooseTree"></div>');
				$('#chooseTree').treeview({data: t[0].nodes,showCheckbox: true});
				$('#chooseTree').treeview('expandAll');
				$('#chooseTree').on('nodeSelected', function(event, data) {
					if(data.nodes == undefined){
						alert("unvalid node");
					}else{
						data.nodes.forEach(function(e){
							e.text = "Object "+newId;
							e.type = "root";
							e.id = newId;
							newId++;
							data_tree.push(e);
						})
						app.modules.step3.add(idTree+1);
					}
				 });
			}else{
				app.modules.step3.hideChoose();
				$("#dataTree").treeview({data: data_tree,showCheckbox: true});
				$('#dataTree').on('nodeChecked', function(event, data) {
					app.modules.step3.newXml(data);
				});
				$('#dataTree').on('nodeUnchecked', function(event, data) {
					app.modules.step3.delXml(data);
				});
				$('#dataTree').treeview('collapseAll');
			}

		},

		/*
			add a new xml tree to the listXml_tree

			@param : node - node who have been checked
		*/
		newXml : function(node){
			var newNode = {
				text: "Root "+ node.id,
				type: "root",
				id: "ODF"+newODF,
				link: node.id,
				nodes: JSON.parse(JSON.stringify(xml_tree[0].nodes))
			};

			newODF++;
			$('#invisibleTree').treeview({data: [node]});
			var list = $('#invisibleTree').treeview('getEnabled');
			var listVal = [];
			list.forEach(function(e){
				if((e.type == "value")||(e.type == "id")){
					listVal.push(e);
				}
			});
			app.modules.step3.changeVal(newNode.nodes,node,listVal);
			app.modules.step3.changeId(newNode.nodes);
			listXml_tree.push(newNode);
			$('#tree').treeview({data: listXml_tree});
			$('#tree').treeview('collapseAll');
		},

		/*
			Change the id of the node

			@param : t - the children of the node that we want to change the id
		*/
		changeId : function(t){
			t.forEach(function(e){
				e.id = "ODF"+newODF;
				newODF++;
				if(e.nodes != undefined){
					app.modules.step3.changeId(e.nodes);
				}
			});
		},

		/*
			change the value of xml with teh real one from the jsonFileList

			@param : t - array of node
			@param : n - the node who have been checked
			@param : listVal - liste of value and id
		*/
		changeVal : function(t,n,listVal){
			t.forEach(function(e){
				if((e.type == "value")||(e.type == "id")){
					var find = false;
					var i = 0;
					var map;
					while((i<connectionMap.result.length)&&(!find)){
						if(connectionMap.result[i].odfId == e.id){
							map = connectionMap.result[i];
							find = true;
						}else{
							i++;
						}
					}
					if(find){
						val = [];
						map.json.forEach(function(x){
							find = false;
							i = 0;
							while(!find){
								path = "";
								var parent = $('#invisibleTree').treeview('getParent', listVal[i].nodeId);
								if(parent.type == "array"){
									var y = 0;
									var find2 = false;
									while((!find2)&&(y<parent.nodes.length)){
										if(parent.nodes[y].id ==listVal[i].id){
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
								path = "root\\Object\\"+path;
								if(path == x){
									val.push({path: x, value: listVal[i]})
									find = true;
								}else{
									i++;
								}
							}
						});
						var f = map.function;
						val.forEach(function(el){
							f = f.replace("("+el.path+")", el.value.value);
						});

						if(f.includes("Concat")){
							f = f.replace("Concat", "");
							if(e.type == "id"){
								objectId.push(f);
							}
							e.text = f;
							e.value = f;
						}else{
							try {
								if(e.type == "id"){
									objectId.push(eval(f));
								}
								e.text = eval(f);
								e.value = eval(f);
							}
							catch(err) {
								if(e.type == "id"){
									objectId.push(f);
								}
								e.text = f;
								e.value = f;
							}
						}
					}
				}else{
					if(e.nodes != undefined){
						app.modules.step3.changeVal(e.nodes,n,listVal);
					}
				}
			});
		},

		/*
			Delete an xml tree from the listXml_tree

			@param : node - node who have been uncheck
		*/
		delXml : function(node){
			var find = false;
			var i = 0;
			while((i<listXml_tree.length)&&(!find)){
				if(node.id == listXml_tree[i].link){
					find = true;
				}else{
					i++;
				}
			}
			listXml_tree.splice(i, 1);
			$('#tree').treeview({data: listXml_tree});
			$('#tree').treeview('collapseAll');
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
										value: value,
										id: (newId+1),
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
										value: value,
										id: (newId+1),
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
			Export the step 3
		*/
		export : function(){
			var check = $('#dataTree').treeview('getChecked');
			if(check[0] == undefined){
				alert("please check some node from the DATA tree");
			}else{
				var list = $('#tree').treeview('getEnabled');
				var idUnfill = false;
				var i = 0;
				while((i<list.length)&&(!idUnfill)){
					if(list[i].text == "Object_Id"){
						console.log("unfill");
						idUnfill = true;
					}else{
						i++;
					}
				}
				if(idUnfill){
					app.modules.step3.chooseFill();
				}else{
					app.modules.step3.chooseExport();
				}
			}
		},

		/*
			Show a modal widow to select the way to fill all the unfill object id
		*/
		chooseFill : function(){
			var id = '#modal';
			$(id).css("height","70%");
			$(id).html('<h4 id="instructionExport3" wrap="off">You have some Object ID not fill. Please select a method to fill them</h4><button class="btn custom2 btn-default" id="auto">Automatique</button><button class="btn custom2 btn-default" id="manual">Manual</button><button class="btn custom2 btn-default" id="cancel">cancel</button>');

			// On definit la taille de la fenetre modale
			app.modules.step3.resizeChooseFill();

			// Effet de transition
			$('#fond').show();
			// Effet de transition
			$(id).show();

			$('.popup .close').click(function (e) {
				 // On désactive le comportement du lien
				 e.preventDefault();
				 // On cache la fenetre modale
				app.modules.step3.hideChooseFill();
			 });
			 $('#cancel').click(app.modules.step3.hideChooseFill);
			 $('#manual').click(app.modules.step3.manualFill);
			 $('#auto').click(function(){
				 app.modules.step3.autoFill(listXml_tree);
				 app.modules.step3.chooseExport();
			 });
		},

		/*
			Show a modal widow to select the way to export the step 3
		*/
		chooseExport : function(){
			var id = '#modal';
			$(id).css("height","30%");
			$(id).html('<h4 id="instructionExport31" wrap="off">Please select a way to export your file</h4><button class="btn custom2 btn-default" id="download">Download</button><button class="btn custom2 btn-default" id="send">Send</button><button class="btn custom2 btn-default" id="cancel">cancel</button>');

			// On definit la taille de la fenetre modale
			app.modules.step3.resizeChooseFill();

			// Effet de transition
			$('#fond').show();
			// Effet de transition
			$(id).show();

			$('.popup .close').click(function (e) {
				 // On désactive le comportement du lien
				 e.preventDefault();
				 // On cache la fenetre modale
				app.modules.step3.hideChooseFill();
			 });
			 $('#cancel').click(app.modules.step3.hideChooseFill);
			 $('#send').click(function(){
				 $(id).html('<label>Please specify the URL of the send request</label><input class="form-control" id="inputCustom"><button class="btn custom btn-default" id="confirm">Confirm</button><button class="btn custom btn-default" id="cancel">cancel</button>');
				 $("#confirm").click(function(){
					 console.log($("#inputCustom").val());
					 if(($("#inputCustom").val()).includes(":8080")){
						 app.modules.step3.send($("#inputCustom").val());
					 }else{
						 alert("please enter a valid URL (you maybe forgot the port)");
					 }
				 });
				 $('#cancel').click(app.modules.step3.hideChooseFill);
			 });
			 $('#download').click(function(){
				 $(id).html('<h4 id="instructionExport31" wrap="off">Please select the type of file you want</h4><button class="btn custom2 btn-default" id="lite">Lite</button><button class="btn custom2 btn-default" id="heavy">Heavy</button><button class="btn custom2 btn-default" id="cancel">cancel</button>');
				 $('#cancel').click(app.modules.step3.hideChooseFill);
				 $('#lite').click(function(){
					 app.modules.step3.download("lite");
				 });
				 $('#heavy').click(function(){
					 app.modules.step3.download("heavy");
				 });

			 });
		},

	 /*
	 	Hide the modal window
	 */
	 hideChooseFill : function(){
			// On cache le fond et la fenêtre modale
			$('#fond, .popup').hide();
			$('.popup').html('');
	 },

	 /*
	 	Resize the modal window
	 */
	 resizeChooseFill : function(){
		 	newIdObj = 0;
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
	 	Fill all the empty object id automatikly

		@param : t - the tab of node
	 */
	 autoFill : function(t){
		 app.modules.step3.hideChooseFill();
		 t.forEach(function(e){
			 if(e.text == "Object_Id"){
			   var continuee = app.modules.step3.checkObjectId("OBJ"+newIdObj);
				 while(!continuee){
					 newIdObj++;
					 continuee = app.modules.step3.checkObjectId("OBJ"+newIdObj);
				 }
				 var newNode = {
					 id: e.id,
					 text: "OBJ"+newIdObj,
					 value: "OBJ"+newIdObj,
					 type: "id"
				 }
				 objectId.push("OBJ"+newIdObj);
				 var finish = false;
				 var i = 0;
				 while((i<listXml_tree.length)&&(!finish)){
					 finish = app.modules.step3.replace(newNode,e,listXml_tree[i].nodes);
					 i++;
				 }
				 $("#tree").treeview({data: listXml_tree});
			 }else{
				 if(e.nodes != undefined){
					 app.modules.step3.autoFill(e.nodes);
				 }
			 }
		 });
	 },

	 /*
	 	replace a node in the listXml_tree

		@param : newN - the new node
		@param : oldN - the old node to replace
		@param : t - the tree
	 */
	 replace : function(newN,oldN,t){
		 var find = false;
		 var i = 0;
		 while((i<t.length)&&(!find)){
			 if(oldN.id == t[i].id){
				 t.splice(i, 0, newN);
				 t.splice(i+1, 1);
				 find = true;
			 }else{
				 if(t[i].nodes != undefined){
					 find = app.modules.step3.replace(newN,oldN,t[i].nodes);
				 }
			 }
			 i++;
		 }
		 return find;
	 },

	 /*
	 	Fill all the empty object id manualy
	 */
	 manualFill : function(){
		 var object = app.modules.step3.getObjUnfill(listXml_tree,null,null);
		 if(object == undefined){
			 app.modules.step3.hideChooseFill();
			 app.modules.step3.chooseExport();
		 }else{
			 var id = '#modal';
			 $(id).css("height","30%");
	 		 $(id).html('<label>please put the id object of the object : '+object.link+' '+object.parent.text+'</label><input class="form-control" id="inputCustom"><button class="btn custom btn-default" id="next">Next</button><button class="btn custom btn-default" id="cancel">Cancel</button>');
			 $('#cancel').click(app.modules.step3.hideChooseFill);
			 $('#next').click(function(){
				 var fine = app.modules.step3.checkObjectId($("#inputCustom").val());
				 if(!fine){
					 alert("this ID is already use");
				 }else{
					 objectId.push($("#inputCustom").val());
					 object.node.text = $("#inputCustom").val();
					 object.node.value = $("#inputCustom").val();
					 $("#tree").treeview({data: listXml_tree});
					 app.modules.step3.manualFill();
				 }
			 });
		 }
	 },

	 /*
	 	Get all obj id not already fill

		@param : t - the tree
		@param : link - the id of the istance who is link to the object
		@param : parent - the parent of the tab of node
	 */
	 getObjUnfill : function(t,parent,link){
		 var i = 0;
		 var res;
		 while((i<t.length)&&(res == undefined)){
			 if(t[i].text == "Object_Id"){
				 res = {
					 parent: parent,
					 node: t[i],
					 link: link
				 }
			 }else{
				 if(t[i].link != undefined){
					 link = t[i].link;
				 }
				 if(t[i].nodes != undefined){
					 res = app.modules.step3.getObjUnfill(t[i].nodes,t[i],link);
				 }
			 }
			 i++;
		 }
		 return res;
	 },

	 /*
	 	check if the object id is not already use

		@param : id - the id to check
	 */
	 checkObjectId : function(id){
		 var find = false;
		 var i = 0;
		 while((i<objectId.length)&&(!find)){
			 if(objectId[i]==id){
				 find = true;
			 }else{
				 i++;
			 }
		 }
		 if(find){
			 return false;
		 }else{
			 return true;
		 }
	 },

	 /*
	 	 Dowload the final xml

		 @param : type - the type of download (lite or heavy)
	 */
	 download : function(type){
		 var res = '';
		 if(type == "lite"){
			 res = app.modules.step3.buildXml("lite",listXml_tree,0,"");
		 }else{
			 res = app.modules.step3.buildXml("heavy",listXml_tree,0,"");
		 }
		 console.log(res);
		 var textFileAsBlob = new Blob([res], {type:'text/xml'});
		 var fileNameToSaveAs = "OMI-ODF";

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
	 	build the xml file

		@param : type - the type of the xml file (lite or heavy)
		@param : t - the tree
		@param : lvl - the level in the tree
		@param : s - the actual xml string who have been build
		@return : s - the xml string
	 */
	 buildXml : function(type,t,lvl,s){
		 if(lvl == 0){
			 s = s + '<omiEnvelope xmlns="http://www.opengroup.org/xsd/omi/1.0/" version="1.0" ttl="0">' + "\n";
			 s = s + '<write msgformat="odf">'+ "\n";
			 s = s + '<msg>'+ "\n";
			 s = s + '<Objects xmlns="http://www.opengroup.org/xsd/odf/1.0/">' + "\n";
			 xml_tree[0].nodes.forEach(function(e){
				 s = s + "\t<Object>\n\t\t<id>"+e.text+"</id>\n";
				 listXml_tree.forEach(function(y){
					 y.nodes.forEach(function(k){
						 if(k.text == e.text){
							 s = s + "\t\t\t<Object>\n";
							 s = app.modules.step3.buildXml(type,k.nodes,4,s);
							 s = s + "\t\t\t</Object>\n";
						 }
					 });
				 });
				 s = s + "\t</Object>\n";
			 });

			 s = s + "</Objects>" + "\n";
			 s = s + "</msg>" + "\n";
			 s = s + "</write>" + "\n";
			 s = s + "</omiEnvelope>" + "\n";
		 }else {
			 t.forEach(function(e){
  			 if((e.type == "Node")||(e.type == "root")){
  				 if(lvl == 1){
  						s = s + '\t<Object>' + "\n";
  				 }else{
  					 var i = 0;
  					 while(i<lvl){
  						 i++;
  						 s = s + "\t";
  					 }
						 if(type == "lite"){
							 s = s + '<Object>' + "\n";
						 }else{
							 s = s + '<Object typeof ="'+e.typeof+'" property="'+e.property+'" range="'+e.typeof+'">' + "\n";
						 }
  				 }
  				 s = app.modules.step3.buildXml(type,e.nodes,lvl+1,s);
  				 i = 0;
  				 while(i<lvl){
  					 i++;
  					 s = s + "\t";
  				 }
  				 s = s + "</Object>" + "\n";
  			 }else{
					 if(e.type == "id"){
						 var i = 0;
						 while(i<lvl-1){
							i++;
							s = s + "\t";
						 }
						 s = s +'\t<id>'+e.value+'</id>' + "\n";
						}else{
							if(e.type == "value"){
								var i = 0;
		   				 	while(i<lvl){
		   					 i++;
		   					 s = s + "\t";
		   				  }
								s = s + '<value>'+e.value+'</value>' + "\n";
							}else{
								var i = 0;
								while(i<lvl){
								 i++;
								 s = s + "\t";
								}
								if(type == "lite"){
									s = s + '<InfoItem name="'+e.name+'">' + "\n";
								}else{
									s = s + '<InfoItem name="'+e.name+'" property="'+e.property+'" range="'+e.range+'">' + "\n";
								}
								s = app.modules.step3.buildXml(type,e.nodes,lvl+1,s);
								i = 0;
								while(i<lvl){
		   					 i++;
		   					 s = s + "\t";
		   				  }
								s = s + "</InfoItem>" + "\n";
							}
						}
  			 }
   		});
		 }
 		return s;
	 },

	 /*
	   Send the xml (lite verion) to the URL in parameter with a post request

		 @param : u - the URL
	 */
	 send : function(u){
		 var data = app.modules.step3.buildXml("lite",listXml_tree,0,"");
		 $.ajax({
			 url : u,
			 type: "POST",
			 data: data,
			 header: {
        "Access-Control-Allow-Origin":"http://127.0.0.1"
			},
			 contentType: "text/xml",
       dataType: "jsonp",
			 success :
				 function(res){
					 console.log("youpi");
				 }
		 });
	 },

		/*
			use for some test
		*/
		test : function(){
			var liste = $('#tree').treeview('getSelected');
			console.log(liste[0]);
		},

    /*
			Initialize all the events of the module
		*/
    init : function(){
      if(sessionStorage.getItem('Mappings') != undefined){

        //zip.file("data/"+e.name, e.data);
        var tab = JSON.parse(sessionStorage.getItem('jsonFiles'));
        tab.forEach(function(e){
          var res = e.name.split("/");
          jsonList.push({name:res[1],code:e.code});
        });
				data_tree = [];
				xml_tree = [];
				listXml_tree = [];
        xml = JSON.parse(sessionStorage.getItem('xml')).code;
        connectionMap = JSON.parse(JSON.parse(sessionStorage.getItem('Mappings')).code);
				var res = xml.split(">");
				var newNode = {
					text: "Root",
					type: "root",
					id: "ODF" + newId,
					nodes: []
				};
				newId++
				xml_tree.push(newNode);
				app.modules.step3.generate(res,xml_tree[0]);
				app.modules.step3.chooseStructure();
      }
			$('#export').click( app.modules.step3.export);
      document.getElementById('file-1').addEventListener('change', app.modules.step3.load, false);
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

  app.modules.step3.init();
});
