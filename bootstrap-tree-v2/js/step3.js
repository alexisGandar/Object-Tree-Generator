//Lavascript file for the step 3
var app = {
	modules : {}
}

//Liste of prefix
var listPref;

//Module for the import
app.modules.step3 = (function(){
	//Attributes
  //Mapping of all Id
  var idMapping;
  //xml file
  var xml;
  //connection Mapping
  var connectionMap;
  //list of json from step 2
  var jsonList = [];

	return {

    /*
			Allow to import the zip file from the step 2

			@param : evt - event
		*/
		load : function(evt){
      var zip = new JSZip();
      zip.loadAsync( this.files[0] /* = file blob */)
      .then(function(zip) {

        zip.file("idMapping.txt").async("string").then(function(result) {
          idMapping = result;
        });

        zip.file("data/O-DF.xml").async("string").then(function(result) {
          xml = result;
        });

        zip.file("Mappings.json").async("string").then(function(result) {
          connectionMap = JSON.parse(result);
        });

        zip.file("json_name.txt").async("string").then(function(result) {
          var res = result.split(" ");
          res.forEach(function(e){
            zip.file("data/"+e).async("string").then(function(result) {
              jsonList.push({name:e,code:result});
            });
          });
        });
      });
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
        idMapping = JSON.parse(sessionStorage.getItem('idMapping')).code;
        xml = JSON.parse(sessionStorage.getItem('xml')).code;
        connectionMap = JSON.parse(JSON.parse(sessionStorage.getItem('Mappings')).code);


        console.log(jsonList);
        console.log(idMapping);
        console.log(xml);
        console.log(connectionMap);

      }

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
