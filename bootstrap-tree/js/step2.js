var app = {
	modules : {}
}


app.modules.target = (function(){
  var test_tree;
	var data_tree;
  var newId = 0;
	return{

    addValue : function(t){
      if(t != null){
        t.forEach(function(e) {
          console.log(e);
          if(e.type == "root"){
            console.log("sbloup");
            app.modules.target.addValue(e.nodes);
          }else{
            if(e.type == "node"){
              if((e.nodes == undefined) || (e.nodes.length == 0)){
                e.type = "item";
                e.nodes = [
                  {
                    text: "Value",
            				type: "value",
            				id: newId,
                  }
                ];
                newId++;
              }else{
                app.modules.target.addValue(e.nodes);
              }
            }else{
              e.nodes = [
                {
                  text: "Value",
                  type: "value",
                  id: newId,
                }
              ];
              newId++;
            }
          }
        });
      }
    },


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
							sessionStorage.load = true;
							sessionStorage.tree = JSON.stringify(test_tree);
              $('#tree').treeview({data: test_tree});
            };
          })(f);

          // Read in the file
          //reader.readAsDataText(f,UTF-8);
          reader.readAsText(f,"UTF-8");
        }
    },

    generate : function(t,n){
      var node = [];
      node.push(n);
      t.forEach(function(e){
        var res = e.split(" ");
        var r = res[0].split("\t");
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
          if(!done){
						var term;
						var i = 0;
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
          }else{
						var term;
						var i = 0;
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
            //term = res[2].slice(2,res[2].length-1);
            var newNode = {
              text: term,
              typeof: term,
              type: "Node",
              property: "",
              id: newId,
              nodes: []
            };
            newId++;
            node[node.length-1].nodes.push(newNode);
            node.push(newNode);
          }
        }else{
          if(r[r.length-1] == "<infoItem"){
						var na;
						var pro;
						var i = 0;
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
            //na = res[1].slice(6,res[1].length-1);
            //pro = res[2].slice(10,res[2].length-2);
            var newNode = {
              text: pro,
              name: na,
              type: "item",
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

		space : function(i,res){
			while((res[i] == "")&&(i<res.length)){
				i++;
			}
			return i;
		},

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
							var res = e.target.result.slice(1,e.target.result.length);
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
            };
          })(f);

          // Read in the file
          //reader.readAsDataText(f,UTF-8);
          reader.readAsText(f,"UTF-8");
        }
		},

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
						if(name != ""){
							var newNode = {
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
						}
						if(last == ":"){
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
					case "]" :
						if(last == "["){
							var newNode = {
								text: name,
								name: name,
								type: "item",
								property: name,
								id: newId,
								nodes: [
									{
										text: "empty",
										type: "value",
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
							node.pop();
							break;
						}
					case ",":
						console.log(name);
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

		link : function(){
			console.log("work!");
			//var e = $(this);
			//console.log(e);
		},

		listener : function(){
			$('.link').click(app.modules.target.link);
		},

    test : function(){
			var liste = $('#dataTree').treeview('getSelected');
		},

    init : function(){
      newId = sessionStorage.getItem('id');
      if(sessionStorage.getItem('tree') != undefined){
        test_tree = JSON.parse(sessionStorage.getItem('tree'));
      }
			if(sessionStorage.load == false){
				app.modules.target.addValue(test_tree);
			}
			$('.link').click(app.modules.target.link);
      $('#tree').treeview({data: test_tree});
      document.getElementById('import').addEventListener('change', app.modules.target.import, false);
			document.getElementById('json').addEventListener('change', app.modules.target.json, false);
			$('#tree').on('nodeExpanded', function(event, data) {
  			app.modules.target.listener();
			});
			$('#dataTree').on('nodeExpanded', function(event, data) {
  			app.modules.target.listener();
			});
    }
  }
})();


$(document).ready(function () {
  app.modules.target.init();
});

function lien(){
	console.log("work!");
	//var e = $(this);
	//console.log(e);
}
