
var photo = {
    // Member variables
    photolist: [],
    photocount: 0,

    // Methods
    add_dialog: function() {
        var fluFileDialog = window.fluFileDialog;
        fluFileDialog.clearNameFilters();
        fluFileDialog.addNameFilter("Photos (*.jpg *.tiff)");
        fluFileDialog.addNameFilter("Images (*.jpg *.png *.gif *.bmp)");
        fluFileDialog.addNameFilter("All files (*.*)");
        if (fluFileDialog.exec()) {
            var files = fluFileDialog.selectedFiles();
            for (var i = 0; i < files.length; i++) {
                this.add_photo(files[i]);
            }
        }
    },

    add_photo: function(path) {
        var id = this.photocount;
        this.photolist[this.photocount++] = path;

        // hide the "Drag photos here" message in the middle of the window
        document.getElementById('photos_init').style.display = 'none';

        // show "Loading..." gif
        var img = document.createElement('img');
        img.className = "loading";
        img.setAttribute('width', 16);
        img.setAttribute('height', 8);
        img.src = '../skin/balls-16x8-trans.gif';
        var li = document.createElement('li');
        li.id = 'photo' + id;
        li.appendChild(img);
        var list = document.getElementById('photos_list');
        list.insertBefore(li, list.firstChild);

    }
};

