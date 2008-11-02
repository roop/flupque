/*
 * This file is part of the Flupque software
 *
 * Copyright (c) 2008 Roopesh Chander <roop@forwardbias.in>
 *
 * This library is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License (GPL), version 2
 * only.  This library is distributed WITHOUT ANY WARRANTY, whether
 * express or implied. See the GNU GPL for more details.
 * http://www.gnu.org/licenses/gpl.html
 *
 */


#include <QApplication>
#include <QMainWindow>
#include <QtWebKit> 
#include <QFileDialog>

class FluFileDialog : public QFileDialog {
    Q_OBJECT
public:
    FluFileDialog(QWidget * parent = 0, Qt::WindowFlags flags = 0)
        : QFileDialog(parent, flags) {
        setFileMode(QFileDialog::ExistingFiles);
        setViewMode(QFileDialog::List);
        setDirectory(QDir::homePath() + "/Pictures");
    }

public slots:
   void setFileMode(QFileDialog::FileMode fileMode) {
       QFileDialog::setFileMode(fileMode);
   }
   void addNameFilter(QString filter) {
       QStringList filters = nameFilters();
       filters.append(filter);
       setNameFilters(filters);
   }
   void clearNameFilters() {
       QFileDialog::setNameFilters(QStringList());
   }
   void setViewMode(QFileDialog::ViewMode viewMode) {
       QFileDialog::setViewMode(viewMode);
   }
   void setDirectory(const QString& dir) {
       QFileDialog::setDirectory(dir);
   }
   QStringList selectedFiles() const {
       return QFileDialog::selectedFiles();
   }
};

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    FluFileDialog fluFileDialog;

    QWebView *view = new QWebView();
    view->load(QUrl("html/main.html"));
    view->show();

    view->page()->mainFrame()->addToJavaScriptWindowObject("fluFileDialog", &fluFileDialog);

    return app.exec();
}

#include "main.moc"
