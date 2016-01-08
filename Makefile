#Name of the output file
TARGET	= jsdap

#Input files
SOURCES = src/header.js src/parser.js src/xdr.js src/api.js

#Binaries used in the build process
CAT		= cat
COMPILER	= uglifyjs
CP		= cp
RM		= rm -f

all: $(TARGET).min.js

$(TARGET).min.js: $(TARGET).js
	$(COMPILER) $(TARGET).js > $(TARGET).min.js
	$(CP) $(TARGET).min.js examples/js

$(TARGET).js:
	$(CAT) $(SOURCES) > $(TARGET).js
	$(CP) $(TARGET).js examples/js

clean:
	-$(RM) $(TARGET).min.js examples/js/$(TARGET).min.js
	-$(RM) $(TARGET).js examples/js/$(TARGET).js
