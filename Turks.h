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

#include <QThread>
#include <QDebug>
#include <QImage>
#include <QWebFrame>

#ifndef __FLUPQUE_TURKS_H
#define __FLUPQUE_TURKS_H

class Turks : public QObject {
    Q_OBJECT
public:
    Turks(QWebFrame *frame);
    ~Turks();
public slots:
    QString createThumbnail(QString imgPath, int width, int height,
                            QString javascriptOnResult);
    void evaluateJavascript(QString javascriptOnResult);
    void deleteThread(QThread *thread);
private:
    QWebFrame *m_frame;
    QList<QThread*> threads;
};

#endif
