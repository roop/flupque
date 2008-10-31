#include <QApplication>
#include <QMainWindow>
#include <QtWebKit> 
#include <QFileDialog>

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    QFileDialog qFileDialog;
    qFileDialog.setFileMode(QFileDialog::ExistingFiles);
    qFileDialog.setNameFilter("Photos (*.jpg *.tiff)");
    qFileDialog.setViewMode(QFileDialog::List);
    qFileDialog.setDirectory(QDir::homePath() + "/Pictures");
    qDebug() << "labelText(3) = " << qFileDialog.labelText((QFileDialog::DialogLabel)3);

    QWebView *view = new QWebView();
    view->load(QUrl("html/main.html"));
    view->show();

    view->page()->mainFrame()->addToJavaScriptWindowObject("qFileDialog", &qFileDialog);

    return app.exec();
}

