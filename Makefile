BUN_CMD = bun
SERVER_FILE = server.js
PORT = 8000

.PHONY: install start clean

install:
	@$(BUN_CMD) install

start:
	@PORT=$(PORT) $(BUN_CMD) $(SERVER_FILE)

clean:
	rm -rf node_modules
	rm -rf .bun
	rm -f *.log
	rm -f .env