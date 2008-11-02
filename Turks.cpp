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

#include "Turks.h"
#include "Image.h"

QString Turks::createThumbnail(QString imgPath, int width, int height,
                        QString javascriptOnResult) {
    ThumbnailWorker *thumbWorker = new ThumbnailWorker(imgPath, width, height, 
                                                        javascriptOnResult);
    QString thumbnailPath = thumbWorker->thumbnailPath();
    connect(thumbWorker, SIGNAL(thumbnailCreated(QString)),
            this, SLOT(evaluateJavascript(QString)));
    connect(thumbWorker, SIGNAL(deleteThread(QThread*)),
            this, SLOT(deleteThread(QThread*)));
    thumbWorker->start();
    return thumbnailPath;
}

void Turks::evaluateJavascript(QString javascriptOnResult) {
    qDebug() << "Evaluating " << javascriptOnResult;
}

void Turks::deleteThread(QThread *thread) {
   delete thread;
}
