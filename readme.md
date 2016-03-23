#Url2PDF#
---
*Grab a URL and convert the HTML to PDF using PhantomJS for better rendering*



## Usage ##
Install PhantomJS on your system. ie `brew install phantomjs` etc.

###Simple###

    var url2pdf = require("url2pdf");
    
    url2pdf.renderPdf("http://www.google.com")
    	.then(function(path){
	    	console.log("Rendered pdf @", path);
    	});

###In Express as a download###

    app.use("/getPdf", function(req, res){
    var url = req.protocol + '://' + req.get('host') + "/pathToViewToRender";
        url2pdf.renderPdf(url)
          .then(function(path){
            res.download(path, function(err){
              if(err){
                res.send(500);
                setTimeout(function(){
	              //After 10 Mins clear the PDF from the system
                  url2pdf.removeFile(path);
                }, 1000 * 60 * 10)
              }
            })
          })
        })
