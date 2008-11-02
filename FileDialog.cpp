#include "FileDialog.h"

FileDialog::FileDialog(QWidget * parent, Qt::WindowFlags flags)
    : QFileDialog(parent, flags) {
    setFileMode(QFileDialog::ExistingFiles);
    setViewMode(QFileDialog::List);
    setDirectory(QDir::homePath() + "/Pictures"); //FIXME: Other platforms??!
}

void FileDialog::setFileMode(QFileDialog::FileMode fileMode) {
   QFileDialog::setFileMode(fileMode);
}

void FileDialog::addNameFilter(QString filter) {
   QStringList filters = nameFilters();
   filters.append(filter);
   setNameFilters(filters);
}

void FileDialog::clearNameFilters() {
   QFileDialog::setNameFilters(QStringList());
}

void FileDialog::setViewMode(QFileDialog::ViewMode viewMode) {
   QFileDialog::setViewMode(viewMode);
}

void FileDialog::setDirectory(const QString& dir) {
   QFileDialog::setDirectory(dir);
}

QStringList FileDialog::selectedFiles() const {
   return QFileDialog::selectedFiles();
}

#include "moc_FileDialog.cpp"
