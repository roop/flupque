
var fileDialog = {
    add_photo: function() {
        var fuFileDialog = window.fuFileDialog;
        fuFileDialog.clearNameFilters();
        fuFileDialog.addNameFilter("Photos (*.jpg *.tiff)");
        fuFileDialog.addNameFilter("Images (*.jpg *.png *.gif *.bmp)");
        fuFileDialog.addNameFilter("All files (*.*)");
        if (fuFileDialog.exec()) {
            // alert("Got you");
            alert("files selected " + fuFileDialog.selectedFiles());
        } else {
            alert("Nothing to do!");
        }
    }
};

