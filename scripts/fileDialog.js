
var fileDialog = {
    add_photo: function() {
        var qFileDialog = window.qFileDialog;
        if (qFileDialog.exec()) {
            // alert("Got you");
            alert("files selected");
        } else {
            alert("Nothing to do!");
        }
    }
};

