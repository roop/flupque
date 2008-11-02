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

#include <QFileInfo>
#include <QDir>
#include "Image.h"

ThumbnailWorker::ThumbnailWorker(QString imagePath, int width, int height,
                                    QString javascriptOnResult)
    : m_imagePath(imagePath), m_width(width), m_height(height), 
      m_javascriptOnResult(javascriptOnResult) {

    QFileInfo imageFile(imagePath);
    if (!imageFile.exists() || !imageFile.isFile() || !imageFile.isReadable()) {
        m_imagePath = QString();
        qDebug() << "returning prematurely because " << imagePath << " doesnt exist";
        return;
    }

    // find a filename for the thumbnail
    QString prefix = QDir::tempPath() + "/" + imageFile.baseName() + "_th";
    int i = 0;
    while (QFileInfo(prefix + QString::number(i) + ".jpg").exists())
        i++;
    m_thumbnailPath = prefix + QString::number(i) + ".jpg";
    qDebug() << "thumb name = " << m_thumbnailPath;

    // create a zero-byte file by that name right away
    m_thumbnailFile.setFileName(m_thumbnailPath);
    if (!m_thumbnailFile.open(QIODevice::WriteOnly)) {
        m_thumbnailPath = QString();
    }
}

ThumbnailWorker::~ThumbnailWorker() {
    m_thumbnailFile.close();
};

QString ThumbnailWorker::thumbnailPath() {
    return m_thumbnailPath;
}

void ThumbnailWorker::run() {
    sleep(5);
    // create the thumbnail
    if (m_imagePath.isEmpty() || m_thumbnailPath.isEmpty())
        return;
    QImage image(m_imagePath);
    QImage thumb = image.scaled(m_width, m_height, Qt::KeepAspectRatio);
    thumb.save(&m_thumbnailFile, "jpg");
    // insert the thumbnail filename in the javascript
    m_javascriptOnResult.replace(m_javascriptOnResult.indexOf("$1"), 2,
                                    m_thumbnailPath);
    m_javascriptOnResult.replace(m_javascriptOnResult.indexOf("$2"), 2,
                                    QString::number(thumb.width()));
    m_javascriptOnResult.replace(m_javascriptOnResult.indexOf("$3"), 2,
                                    QString::number(thumb.height()));
    // tell the main thread that we're done
    qDebug() << "Created thumbnail " << m_thumbnailPath;
    emit thumbnailCreated(m_javascriptOnResult);
    emit deleteThread(this);
}

