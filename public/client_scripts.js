var wTable = document.getElementById("workoutTable");
wTable.addEventListener("click", tableClick);

var updateFlag = 0;
function tableClick(event){
    var target = event.target;
    var targetRow = target.parentNode;

    while (targetRow.tagName != 'TR'){
        targetRow = targetRow.parentNode;
    }

    if(target.textContent == "Edit" && !updateFlag){
        target.textContent = "Update";
        updateFlag = 1;
        unlockInputs(targetRow);
    } else if (target.textContent == "Update"){
        updateFlag = 0;
        sendUpdateQuery(targetRow);
    }
    else if (target.textContent == "Delete"){
        sendDeleteQuery(targetRow);
    }
}

function unlockInputs(row){
    var cells = row.children;
    // console.log(cells);
    for(var cell of cells){
        var cellInput = cell.children[0];
        if (typeof cellInput !== "undefined" && cellInput.tagName != "BUTTON"){
            cellInput.disabled = false;
        }
    }
}

// On an insert button, send new data off to the database.
// As a response, delete the current table and create a new one
// based on the information sent back from the database.
document.addEventListener('DOMContentLoaded', bindInsertButton);

function bindInsertButton(){
    document.getElementById("insertRowButton").addEventListener("click", sendInsertQuery);
}

function sendInsertQuery(event){

    var payload = {name:null, reps:null, weight:null, units:null, date:null};
    payload.name = document.getElementById("insertName").value;
    payload.reps = document.getElementById("insertReps").value;
    payload.weight = document.getElementById("insertWeight").value;
    payload.units = getRadioButtonVal();
    payload.date = document.getElementById("insertDate").value;
    
    var req = new XMLHttpRequest();
    req.open('POST', 'http://flip2.engr.oregonstate.edu:8003', true)
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
            var response = JSON.parse(req.responseText);

            // Remake table
            deleteTable();
            makeTable(response);

            // Clear the fields
            document.getElementById("insertName").value = null;
            document.getElementById("insertReps").value = null;
            document.getElementById("insertWeight").value = null;
            document.getElementById("insertDate").value = null;
        }
        else{
            console.log(req.status);
        }

    });

    req.send(JSON.stringify(payload));
    event.preventDefault();
}

function getRadioButtonVal(){
    lbsOption = document.getElementById("lbs");
    kgsOption = document.getElementById("kgs");

    if (lbsOption){
        lbsOption.checked = false;
        return 0;
    } else {
        kgsOption.checked = false;
        return 1;
    }
}

// On an edit button, send new data off to the database.
// As a response, delete the current table and create a new one
// based on the information sent back from the database.
function sendUpdateQuery(row){

    var payload = {id:null, name:null, reps:null, weight:null, units:null, date:null};
    var cells = row.children;
    for (cell of cells){
        var myInput = cell.firstChild;
        if (myInput != null && myInput.tagName != "BUTTON"){
            payload[myInput.name] = myInput.value;
        }
    }
    
    var req = new XMLHttpRequest();
    req.open('PUT', 'http://flip2.engr.oregonstate.edu:8003', true)
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
            var response = JSON.parse(req.responseText);
            console.log(response);

            // Remake table
            deleteTable();
            makeTable(response);
        }
        else{
            console.log(req.status);
        }

    });

    req.send(JSON.stringify(payload));
}

// On an delete button, send new data off to the database.
// As a response, delete the current table and create a new one
// based on the information sent back from the database.
function sendDeleteQuery(row){
    console.log(row);

    var payload = {id: null};
    payload.id = row.firstChild.firstChild.value;
    console.log(payload);

    var req = new XMLHttpRequest();
    req.open('DELETE', 'http://flip2.engr.oregonstate.edu:8003', true)
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
            var response = JSON.parse(req.responseText);
            console.log(response);

            // Remake table
            deleteTable();
            makeTable(response);
        }
        else{
            console.log(req.status);
        }

    });

    req.send(JSON.stringify(payload));
}

// Delete table
function deleteTable(){
    var tableElement = document.getElementById("workoutTable");
    var tableDiv = document.getElementById("tableDiv");
    tableDiv.removeChild(tableElement);
}

// Make new table
function makeTable(queryResponse){

    var tableDiv = document.getElementById("tableDiv");
    var newTable = document.createElement("table");

    // Create a new table header
    var newTableHeader = document.createElement("thead");
    var newTableHeaderRow = document.createElement("tr");

    var tableHeaders = ["Name", "Reps", "Weight", "Units", "Date"];
    for (var i = 0; i < 5; i++){
        var newTableHeaderColumn = document.createElement("th");
        newTableHeaderColumn.textContent = tableHeaders[i];
        newTableHeaderRow.appendChild(newTableHeaderColumn);
    }

    newTableHeader.appendChild(newTableHeaderRow);
    newTable.appendChild(newTableHeader);

    // Create a new table body
    var newTableBody = document.createElement("tbody");

    for (var i=0; i<queryResponse["rows"].length; i++){
        var newTableBodyRow = document.createElement("tr");
        var thisIsARow = queryResponse["rows"][i];
        for(var key in thisIsARow){
            var newTableBodyColumn = document.createElement("td");
            if(key == "id"){
                var newInput = document.createElement("input");
                newInput.type = "number";
                newInput.name = "id"
                newInput.disabled = true;
                newInput.value = thisIsARow[key];
                newTableBodyColumn.appendChild(newInput);
                newTableBodyColumn.style.display = "none";
            }else if(key == "name"){
                var newInput = document.createElement("input");
                newInput.type = "text";
                newInput.name = "name"
                newInput.disabled = true;
                newInput.value = thisIsARow[key];
                newTableBodyColumn.appendChild(newInput);
            }else if(key == "reps"){
                var newInput = document.createElement("input");
                newInput.type = "number";
                newInput.name = "reps"
                newInput.disabled = true;
                newInput.value = thisIsARow[key];
                newTableBodyColumn.appendChild(newInput);
            }else if(key == "weight"){
                var newInput = document.createElement("input");
                newInput.type = "number";
                newInput.name = "weight"
                newInput.disabled = true;
                newInput.value = thisIsARow[key];
                newTableBodyColumn.appendChild(newInput);
            }else if(key == "units"){
                var newInput = document.createElement("input");
                newInput.type = "number";
                newInput.name = "units"
                newInput.disabled = true;
                newInput.value = thisIsARow[key];
                newTableBodyColumn.appendChild(newInput);
            }else if(key == "date"){
                var newInput = document.createElement("input");
                newInput.type = "date";
                newInput.name = "date"
                newInput.disabled = true;
                newInput.value = thisIsARow[key];
                newTableBodyColumn.appendChild(newInput);
            }

            newTableBodyRow.appendChild(newTableBodyColumn);
        }
        var newTableBodyColumn = document.createElement("td");
        var newUpdateButton = document.createElement("button");
        newUpdateButton.textContent = "Edit";
        newTableBodyColumn.appendChild(newUpdateButton);
        newTableBodyRow.appendChild(newTableBodyColumn);

        var newTableBodyColumn = document.createElement("td");
        var newDeleteButton = document.createElement("button");
        newDeleteButton.textContent = "Delete";
        newTableBodyColumn.appendChild(newDeleteButton);
        newTableBodyRow.appendChild(newDeleteButton);

        newTableBody.appendChild(newTableBodyRow);
    }

    newTable.appendChild(newTableBody);
    newTable.id = "workoutTable";
    tableDiv.appendChild(newTable);

    newTable.addEventListener("click", tableClick);
}