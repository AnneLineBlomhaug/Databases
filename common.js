function rentVehicle(id){
}

function cancelVehicle(id){
}

function updateColour(id){
    newColour = prompt("Update colour")

}

function deleteColour(id){
}

function updateType(id){
    newType = prompt("Update type")
}

function deleteType(id){
}

function showUpdateColourModal(id, name) {
    document.getElementById('update-color-id').value = id;
    document.getElementById('update-color-name').value = name;
    var updateColorModal = new bootstrap.Modal(document.getElementById('updateColorModal'));
    updateColorModal.show();
}

function showUpdateTypeModal(id, name) {
    document.getElementById('update-type-id').value = id;
    document.getElementById('update-type-name').value = name;
    var updateTypeModal = new bootstrap.Modal(document.getElementById('updateTypeModal'));
    updateTypeModal.show();
}
