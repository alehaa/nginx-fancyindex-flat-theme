# This file is part of nginx-fancyindex-flat-theme.
#
# nginx-fancyindex-flat-theme is free software: you can redistribute it and/or
# modify it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or (at your
# option) any later version.
#
# nginx-fancyindex-flat-theme is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
# Public License for more details.
#
# You should have received a copy of the GNU General Public License along with
# this program. If not, see
#
#  http://www.gnu.org/licenses/
#
#
# Copyright (C)
#  2018 Alexander Haase <ahaase@alexhaase.de>

all: build/theme.css         \
     build/js/list.js        \
     build/js/breadcrumbs.js \
     build/header.html       \
     build/footer.html

# Generate the build directory if it doesn't exist yet.
build:
	mkdir -p build build/js

# The following definitions will be used to generate CSS files from the
# corresponding LESS files.
#
# NOTE: Developers need to install lessc by the platform-dependent package
#       manager or npm.
LESSC ?= lessc
LESSC_FLAGS ?= --clean-css
build/%.css: layout/%.less build
	$(LESSC) -M $< $@ > layout/$*.d
	$(LESSC) $(LESSC_FLAGS) ${} $< $@

# Include the generated dependency list of the main less file to regenerate the
# CSS file, if one of its imported files is touched.
-include layout/theme.d

# The following definitions will be used to minify the JavaScript files of the
# theme.
#
# NOTE: Developers need to install uglifyjs by the platform-dependent package
#       manager or npm.
UGLIFYJS ?= uglifyjs
UGLIFYJS_FLAGS = --compress --mangle --comments '/^!/'
build/js/%.js: layout/js/%.js build
	$(UGLIFYJS) $(UGLIFYJS_FLAGS) ${} -- $< > $@

# Most of the files just need to be copied into the build directory. This rule
# will match all files, that are not matched by any other (specialized) rule
# above.
build/%: layout/% build
	cp $< $@

# Clean the build directory.
.PHONY: clean
clean:
	rm -rf build layout/*.d
