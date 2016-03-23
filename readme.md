#Url2PDF#
---
*Grab a URL and convert the HTML to PDF using PhantomJS for better rendering*

## Installation ##
    npm install url2pdf --save

## Usage ##

###Simple###

    var url2pdf = require("url2pdf");
    
    url2pdf.renderPdf("http://www.google.com")
    	.then(function(path){
	    	console.log("Rendered pdf @", path);
    	});

###In Express route as a download###

    var url2pdf = require("url2pdf");
    
    function myRoute(req, res){
        url2pdf.renderPdf(url)
            .then(function (path) {
                res.sendFile(path);
            })
            .catch(function(err){
                res.status(500).json(err);
            })
    }
    
   
### PDF From HTML String
So you have made your html in Jade etc and now you want to just turn it into a PDF without creating a whole website 
just for this purpose? Easy! Just do as below:
 
    var url2pdf = require("url2pdf");
    url2pdf.renderFromHTML("<html><body><h1>HELLO WORLD</h1></body></html>")
    	.then(function(path){
	    	console.log("Rendered pdf @", path);
    	});
        
### Configuration options
You can set the configuration options globally by editing the `url2pdf.opts` object. The default settings are shown below

    {
      paperSize: {format: "A4", orientation: 'portrait', margin: '1cm'}, //Pretty self explanatory, adjust as needed
      saveDir: path.join(__dirname, "pdfTemp"), //This is where the temporary files will be kept 
      idLength: 30 //The length of the file ID, adjust if you need to avoid conflicts or just want smaller filenames
    };

#### Cleanup
url2pdf comes with an auto cleanup function that will scan files in your temp directory and delete old ones as necessary. 
This is optional and should be used at your own risk (ie don't point the temp directory anywhere stupid!);

To use it call the following function, passing in the age in *seconds* you would like to delete

    url2pdf.cleanUp(5); //Clean up all files older than 5 seconds
    
    
#### Fonts/Page Too large?
There is a problem with PhantomJS related to this very long thread:
https://github.com/ariya/phantomjs/issues/12685

This is the hacky workaround for the moment:

    html {
        zoom: 0.55; /*workaround for phantomJS2 rendering pages too large*/
    }