
WASI_CLANG = /opt/wasi-sdk/bin/clang

CFLAGS = -Iinclude -include include/etc.h

busy.wasm: src/apps/busy.c include/wasi/trap64.c
	$(WASI_CLANG) $(CFLAGS) $^ -o $@ -Wl,-allow-undefined -Wl,--import-table

busy32.wasm: busy.wasm lower64.js
	node lower64.js

%.wat: %.wasm
	wasm2wat --dir=. $^ -o $@
