document.addEventListener('DOMContentLoaded', dailyEntryButton);

// ASYNC FORM SUBMISSION
function dailyEntryButton(){
    document.getElementById("Submit").addEventListener("click", function(event){
        
        // Make JSON to be sent with HTTP request
        var payload = {userName:null, userAge:null, userPhrase:null};
        // payload.userName = document.getElementById("user_name").value;
        // payload.userAge = document.getElementById("user_age").value;
        // payload.userPhrase = document.getElementById("user_phrase").value;

        // Create HTTP request
        var req = new XMLHttpRequest();
        req.open('POST', '/', true);
        req.setRequestHeader('Content-Type', 'applicaiton/json');
        req.addEventListener('load', function(){
            if(req.status >= 200 && req.status < 400){
                
                // Parse response and display it to the page
                var response = JSON.parse(req.responseText);

                // var txt = document.createTextNode(response["json"]["userName"]);
                // document.getElementById("outputName").appendChild(txt);
                // txt = document.createTextNode(response["json"]["userAge"]);
                // document.getElementById("outputAge").appendChild(txt);
                // txt = document.createTextNode(response["json"]["userPhrase"]);
                // document.getElementById("outputPhrase").appendChild(txt);
            } else {
                console.log("Error in network request: " + req.statusText);
            }
        });

        // Send request with payload
        req.send(JSON.stringify(payload));
        event.preventDefault();
    });
}