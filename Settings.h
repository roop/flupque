#include <QSettings>

#ifndef __FLUPQUE_SETTINGS_H
#define __FLUPQUE_SETTINGS_H

class Settings : public QSettings {
    Q_OBJECT
public:
    Settings(const QString & organization,
             const QString & application = QString(),
             QObject * parent = 0);
public slots:
   void setValue(const QString& key, const QString& value);
   int valueInt(const QString& key, int defaultValue = 0) const;
   QString valueString(const QString& key, const QString& defaultValue = QString()) const;
   void beginWriteArray(const QString & prefix, int size = -1);
   int beginReadArray(const QString & prefix);
   void endArray();
   bool contains(const QString& key) const;
   void remove(const QString& key);
   void sync();
};

#endif
