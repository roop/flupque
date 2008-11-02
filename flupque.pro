TEMPLATE = app

OBJECTS_DIR = build
MOC_DIR = moc

QT += webkit
CONFIG += debug

HEADERS = FileDialog.h \
          Turks.h \
          Image.h

SOURCES = FileDialog.cpp \
          Turks.cpp \
          Image.cpp \
          main.cpp
