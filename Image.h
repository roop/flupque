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
#include <QFile>

#ifndef __FLUPQUE_IMAGE_H
#define __FLUPQUE_IMAGE_H

class ThumbnailWorker : public QThread {
    Q_OBJECT
public:
    ThumbnailWorker(QString imagePath, int width, int height,
                    QString javascriptOnResult);
    ~ThumbnailWorker();
    QString thumbnailPath();
    void run();
signals:
    void thumbnailCreated(QString javascriptOnResult);
    void deleteThread(QThread *thread);
private:
    QString m_imagePath;
    int m_width;
    int m_height;
    QString m_thumbnailPath;
    QFile m_thumbnailFile;
    QString m_javascriptOnResult;
};

#endif
