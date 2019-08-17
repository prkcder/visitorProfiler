var sub = document.getElementById("submit"),
    del = document.getElementById("delete"),
	IDSelection = document.getElementById("ddOption"),
	options = {
    	valueNames: ['attributeType', 'attributeTitle', 'attributeValue', 'attributeClass'],
        item: "#attribute"
    },
    attributeList = new List('attributes', options),
	groupings_by_attribute = {
        "Accessories Fan": "badges",
        "Bags & Luggage Seeker": "badges",
        "Books and Music Fan": "badges",
        "Browse Abandoner": "badges",
        "Buys Offline": "badges",
        "Cart Abandoned": "badges",
        "Cart Abandoner": "badges",
        "Cart Abandoner - High Value": "badges",
        "Cart Abandoner - Low Value": "badges",
        "Cart Abandoner - Medium Value": "badges",
        "Customer Service Seeker": "badges",
        "Electronics Fan": "badges",
        "Eyewear Fan": "badges",
        "Fan": "badges",
        "Frequent visitor": "badges",
        "High Value Customer": "badges",
        "Home Decor Fan": "badges",
        "Men Only Fan": "badges",
        "Men's Clothing Affinity": "badges",
        "Mens Apparel Fan": "badges",
        "Non-Purchaser - Received Memorial Day Promo Email": "badges",
        "Order Made <2 Weeks Ago - Opt Out of Email": "badges",
        "Purchaser": "badges",
        "Purchaser - Opted Out of Email": "badges",
        "Recent Purchase Made - Opted In to Email": "badges",
        "Sale Fan": "badges",
        "Unbadged": "badges",
        "VIP": "badges",
        "Visitor - Known": "badges",
        "Visitor - Logged In": "badges",
        "Visitor - Unknown": "badges",
        "WIndow Shopper": "badges",
        "Window Shopper": "badges",
        "Womens Apparel Fan": "badges",
        "Lifetime visit count": "behaviors",
        "Last Visit - Days Since": "behaviors",
        "Average visit duration in minutes": "behaviors",
        "Stitched Device User": "behaviors",
        "Active Device type (favorite)": "behaviors",
        "Average Order Subtotal - 30 Day": "orders",
        "Average Order Subtotal - 60 Day": "orders",
        "Average Order Subtotal - Lifetime": "orders",
        "Average Order Value": "orders",
        "Did Complete Order": "orders",
        "Lifetime Order Total": "orders",
        "Lifetime Orders": "orders",
        "Offline Lifetime Order Value": "orders",
        "Omnichannel - OrderTotal": "orders",
        "Order Complete": "orders",
        "Order Made <2 Weeks Ago - Opt Out of Email": "orders",
        "Order Subtotal - 30 Day": "orders",
        "Order Subtotal - 60 Day": "orders",
        "Order Subtotal - Lifetime": "orders",
        "Order Subtotal - Visit": "orders",
        "Order Total - Visit": "orders",
        "Order Total - 30 Day": "orders",
        "Order Total - 60 Day": "orders",
        "Order Total - Corder": "orders",
        "Order Total - Lifetime": "orders",
        "Order Total - Lifetime AOV": "orders",
        "Order Total - Metric": "orders",
        "Order Total via POS Data from OCE": "orders",
        "Orders - 30 Day": "orders",
        "Orders - 60 Day": "orders",
        "Orders - Last 30 Days": "orders",
        "Orders - Last 60 Days": "orders",
        "Order Total - Corder": "orders",
        "Orders - Lifetime": "orders",
        "Product Interest (favorite)": "affinities",
        "Category (favorite)": "affinities"
}

function displayFilters(){
	if(JSON.parse(sessionStorage.getItem('info')) === null || JSON.parse(sessionStorage.getItem('info'))['properties']['result']){
		jQuery('#search').css('display','none');
	}else{
		jQuery('#search').css('display','block');
	};
}

displayFilters();

function reqListener(res) {
	sessionStorage.setItem("info", res.target.response);
	displayFilters();
	handleASAttributes(JSON.parse(sessionStorage.getItem('info')));
	setTimeout(function(){$('#visitorProfileLoad').modal('toggle');},1000);
	setSearch();
};
      
sub.addEventListener('click', function() {
	sessionStorage.clear();
	attributeList.clear();
        
	var [val, inputValue] = getValues();
	
	if (inputValue.trim() === "") {
		$('#visitorProfileFail').modal('toggle');
		setTimeout(function(){$('#visitorProfileFail').modal('toggle');},1000);
	} else {
		$('#visitorProfileLoad').modal('toggle');
        makeRequest(val, inputValue, "getData");
	}
});

del.addEventListener('click', function() {
	
	sessionStorage.clear();
	attributeList.clear();
	var [val, inputValue] = getValues();

    if (inputValue.trim() === "") {
		$('#visitorProfileFail').modal('toggle');
		setTimeout(function(){$('#visitorProfileFail').modal('toggle');},1000);
		//alert("Please enter a Visitor ID");
    } else {
		makeRequest(val, inputValue, "deleteData");
    }
});

function getValues(){
	return [ IDSelection.options[IDSelection.selectedIndex].value, document.getElementById("inputID").value]
}
function makeRequest(k,v,p){
	var oReq = new XMLHttpRequest();
	oReq.overrideMimeType("application/json");
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "/" + p + "?attr=" + k + "&" + "value=" + v);
    oReq.send();
}


 // AudienceStream attribute type names have changed throughout the years so this function is used to return the most recent naming convention of attributes
      var renameASAttributeTypes = function renameASAttributeTypes(key) {
        var newKey = "";
        switch (key) {
          case 'audiences': newKey = "Audience"; break;
          case 'badges': newKey = "Badge"; break;
          case 'flags': newKey = "Boolean"; break;
          case 'metrics': newKey = "Number"; break;
          case 'properties': newKey = "String"; break;
          case 'property_sets': newKey = "Set of Strings"; break;
          case 'dates': newKey = "Date"; break;
          case 'metric_sets': newKey = "Tally"; break;
          case 'funnels': newKey = "Funnel"; break;
          case 'sequences': newKey = "Timeline"; break;
        }
        return newKey;
      }

 // This block of code dynamically displays each attribute type, title, and value in separate list item cards
      var handleASAttributes = function handleASAttributes(objAS) {
        jQuery.each(objAS, function(key, value) {
          if (Object.prototype.toString.call(objAS[key]) === "[object Object]") { //handle Objects
            jQuery.each(value, function(_key, _val) {
              let attributeClass = groupings_by_attribute[_key] ? groupings_by_attribute[_key] : "nofilter";
              jQuery("#attribute").append("<li class='" + attributeClass + "'><div class='card bg-light attributeType'><h2>" + renameASAttributeTypes(key) + "</h2><div class='card-body text-center'><h4 class='card-title attributeTitle'>" + _key + "</h4><p class='card-text attributeValue'>" + _val + "</p></div></div></li>");
            })
          } else if (Array.isArray(objAS[key])) { //handle Arrays
            jQuery.each(value, function(_i, _val) {
              let attributeClass = groupings_by_attribute[_val] ? groupings_by_attribute[_val] : "nofilter";
              jQuery("#attribute").append("<li class='" + attributeClass + "'><div class='card bg-light attributeType'><h2>" + renameASAttributeTypes(key) + "</h2><div class='card-body text-center'><h4 class='card-title attributeValue'>" + _val + "</h4></div></div></li>");
            })
          }
        });
        if (document.getElementsByClassName("card").length > 0) { document.getElementById("attributeCards").style.display = "block"

  };
      }
      handleASAttributes(JSON.parse(sessionStorage.getItem('info')));
      //handleASAttributes(objAS);


  // This block of code handles showing and hidding each list item card based on the "Filter" buttons
      jQuery("#search>button").on("click", function(event) {
        let target = event.target;
        let filter = event.target.innerHTML.split(" ")[1] ? event.target.innerHTML.split(" ")[1].toLowerCase() : "clear";
        if (target.tagName != "BUTTON" && target.innerHTML.indexOf("Filter") == -1) return;
        showHide(target, filter);
      });
      var showHide = function showHide(button, filter) {
        a = document.getElementsByTagName("LI");
          jQuery.each(a, function(_i, _val) {
            a[_i].style.display = "block";
                });
        if (filter != "filter") {
          jQuery.each(a, function(_i, _val) {
            if (a[_i].className.indexOf(filter) != 0) a[_i].style.display = "none";
          });
        } else {
	  resetCards(a);
        }
      }

function resetCards(a){
	//clear input field & set focus
	jQuery('#search-field').val("");
	jQuery('#search-field').focus()

	//clear current search which will display all cards
	attributeList.search();

	//jQuery.each(a, function(_i, _val) {a[_i].style.display = "block";});
}

 // This block of code defines the logic for users to search against each cards attribute type, title and value per http://listjs.com/faq/
      var attributeList = new List('attributes', options);
      function setSearch(){
      	attributeList = new List('attributes', options);
      jQuery('#search-field').on('keyup', function() {
        var searchString = jQuery(this).val();
        attributeList.search(searchString);
      });
}
setSearch();

