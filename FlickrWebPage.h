#include <QWebView>

#ifndef __FLUPQUE_FLICKR_AUTHPAGE_H
#define __FLUPQUE_FLICKR_AUTHPAGE_H

class FlickrWebPage : public QWebView {
    Q_OBJECT
public:
    FlickrWebPage(QWidget* parent = 0);
public slots:
   void setUrlString(const QString& urlstr);
   QString urlString() const;
};

#endif

