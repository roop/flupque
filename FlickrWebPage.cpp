#include <QWebView>
#include <QUrl>
#include <QDebug>
#include "FlickrWebPage.h"

FlickrWebPage::FlickrWebPage(QWidget* parent)
    : QWebView(parent) {};

void FlickrWebPage::setUrlString(const QString& urlstr) {
    QWebView::setUrl(QUrl(urlstr));
}
QString FlickrWebPage::urlString() const {
    return QWebView::url().toString();
}

#include "moc_FlickrWebPage.cpp"
