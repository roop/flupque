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

class Turks : public QObject {
    Q_OBJECT
public:
    Turks() {};
    ~Turks() {};
    QString createThumbnail(QString imgPath, int width, int height,
                            QString javascriptOnResult);
public slots:
    void evaluateJavascript(QString javascriptOnResult);
    void deleteThread(QThread *thread);
};
