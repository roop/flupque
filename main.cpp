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
#include "FileDialog.h"
#include "Turks.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    FileDialog fluFileDialog;

    QWebView *view = new QWebView();
    view->load(QUrl("html/main.html"));
    view->show();

    QWebFrame *webFrame = view->page()->mainFrame();
    Turks fluTurks(webFrame);

    webFrame->addToJavaScriptWindowObject("fluFileDialog", &fluFileDialog);
    webFrame->addToJavaScriptWindowObject("fluTurks", &fluTurks);

    return app.exec();
}

