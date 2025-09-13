let url = location.host;//so it works locally and online

$("table").rtResponsiveTables();//for the responsive tables plugin

$("#add_drug").submit(function(event){//on a submit event on the element with id add_drug
    alert($("#name").val() + " sent successfully!");//alert this in the browser
})



$("#update_drug").submit(function(event){// on clicking submit
    event.preventDefault();//prevent default submit behaviour

    //var unindexed_array = $("#update_drug");
    var unindexed_array = $(this).serializeArray();//grab data from form
    var data = {}

    $.map(unindexed_array, function(n, i){//assign keys and values from form data
        data[n['name']] = n['value']
    })


    var request = {//use a put API request to use data from above to replace what's on database
    "url" : `https://${url}/api/drugs/${data.id}`,
    "method" : "PUT",
    "data" : data
}

$.ajax(request).done(function(response){
    alert(data.name + " Updated Successfully!");
		window.location.href = "/manage";//redirects to index after alert is closed
    })

})

if(window.location.pathname == "/manage"){//since items are listed on manage
    $ondelete = $("table tbody td a.delete"); //select the anchor with class delete
    $ondelete.click(function(){//add click event listener
        let id = $(this).attr("data-id") // pick the value from the data-id

        let request = {//save API request in variable
            "url" : `https://${url}/api/drugs/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this drug?")){// bring out confirm box
            $.ajax(request).done(function(response){// if confirmed, send API request
                alert("Drug deleted Successfully!");//show an alert that it's done
                location.reload();//reload the page
            })
        }

    })
}

if(window.location.pathname == "/purchase"){
    // Get drugs data from table rows (rendered by EJS)
    let drugs = [];
    $("#purchase_table tbody tr").each(function() {
        let $tds = $(this).find('td');
        drugs.push({
            id: $tds.eq(0).text(),
            name: $tds.eq(1).text(),
            card: parseInt($tds.eq(2).attr('data-card')),
            pack: parseInt($tds.eq(3).attr('data-pack')),
            perDay: parseInt($tds.eq(1).attr('data-perday'))
        });
    });

    function updatePurchaseTable(days) {
        $("#purchase_table tbody tr").each(function(i) {
            let drug = drugs[i];
            let pills = days * drug.perDay;
            let cardsToBuy = Math.ceil(pills / drug.card);
            let packsToBuy = Math.ceil(pills / drug.pack);
            $(this).find('td').eq(2).text(cardsToBuy + ' (' + (drug.pack/drug.card) + (drug.pack/drug.card < 2 ? ' card' : ' cards') + ' per pack)');
            $(this).find('td').eq(3).text(packsToBuy);
        });
    }

    $("#drug_days").submit(function(event){
        event.preventDefault();
        let days = +$("#days").val();
        updatePurchaseTable(days);
        $("#purchase_table").show();
    });
}
