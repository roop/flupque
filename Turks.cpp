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
#include <QThreadPool>

Turks::Turks(QWebFrame *frame)
    : m_frame(frame) {};

Turks::~Turks() {
    for (int i = 0; i < thumbnails.size(); i++)
        if (QFile::exists(thumbnails[i]))
            QFile::remove(thumbnails[i]);
}

QString Turks::createThumbnail(QString imgPath, int width, int height,
                        QString javascriptOnResult) {
    ThumbnailWorker *thumbWorker = new ThumbnailWorker(imgPath, width, height, 
                                                        javascriptOnResult);
    thumbWorker->setAutoDelete(false);
    QThreadPool::globalInstance()->start(thumbWorker);
    QString thumbnailPath = thumbWorker->thumbnailPath();
    connect(thumbWorker, SIGNAL(thumbnailCreated(QString)),
            this, SLOT(evaluateJavascript(QString)));
    thumbnails.append(thumbnailPath);
    return thumbnailPath;
}

void Turks::evaluateJavascript(QString javascriptOnResult) {
    m_frame->evaluateJavaScript(javascriptOnResult);
}

