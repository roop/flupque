#include <QFileDialog>

#ifndef __FLUPQUE_FILEDIALOG_H
#define __FLUPQUE_FILEDIALOG_H

class FileDialog : public QFileDialog {
    Q_OBJECT
public:
    FileDialog(QWidget * parent = 0, Qt::WindowFlags flags = 0);

public slots:
   void setFileMode(QFileDialog::FileMode fileMode);
   void addNameFilter(QString filter);
   void clearNameFilters();
   void setViewMode(QFileDialog::ViewMode viewMode);
   void setDirectory(const QString& dir);
   QStringList selectedFiles() const;
};

#endif

