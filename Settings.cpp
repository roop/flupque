#include <QSettings>
#include "Settings.h"

Settings::Settings(const QString & organization,
         const QString & application,
         QObject * parent)
    : QSettings(organization, application, parent) {};


// void Settings::setValue(const QString& key, int value) {
//     QSettings::setValue(key, value);
// }
void Settings::setValue(const QString& key, const QString& value) {
    QSettings::setValue(key, value);
}
int Settings::valueInt(const QString& key) const {
    return value(key).toInt();
}
QString Settings::valueString(const QString& key) const {
    return value(key).toString();
}
void Settings::beginWriteArray(const QString & prefix, int size) {
    QSettings::beginWriteArray(prefix, size);
}
int Settings::beginReadArray(const QString & prefix) {
    return QSettings::beginReadArray(prefix);
}
void Settings::endArray() {
    QSettings::endArray();
}
bool Settings::contains(const QString& key) const {
    QSettings::contains(key);
}
void Settings::remove(const QString& key) {
    QSettings::remove(key);
}
void Settings::sync() {
    QSettings::sync();
}
#include "moc_Settings.cpp"
