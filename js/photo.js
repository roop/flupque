
var photo = {
    add_dialog: function() {
        var fluFileDialog = window.fluFileDialog;
        fluFileDialog.clearNameFilters();
        fluFileDialog.addNameFilter("Photos (*.jpg *.tiff)");
        fluFileDialog.addNameFilter("Images (*.jpg *.png *.gif *.bmp)");
        fluFileDialog.addNameFilter("All files (*.*)");
        if (fluFileDialog.exec()) {
            var files = fluFileDialog.selectedFiles();
            for (int i = 0; i < files.length; i++) {
                alert("picked " + files[i]);
            }
        } else {
            alert("Nothing to do!");
        }
    }
};

