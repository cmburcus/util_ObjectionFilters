NODE_BIN=node

# Colors that can be used for echo commands
RED=\033[1;31m
GREEN=\033[0;32m
YELLOW=\033[0;33m
WHITE=\033[1;37m
GRAY=\033[1;30m
RESET=\033[0m

#########################
# COMMAND COMBINATIONS
#########################

# Starts the environment but doesn't run the tests
.PHONY: build
build: start install-dependencies migrate-database

# Starts the environment, runs the tests and then closes the environment
.PHONY: test
test: build run-tests stop

#########################
# STARTING ENVIRONMENTS
#########################

# Builds the container for development
.PHONY: start
start:
	echo "$(GREEN)\n--- Starting development environment...\n$(GRAY)"
	docker-compose up -d --build

#########################
# STOPPING ENVIRONMENTS
#########################

# Stops the container for development
.PHONY: stop
stop:
	echo "$(GREEN)\n--- Stopping development environment...\n$(GRAY)"
	docker-compose down -v --remove-orphans

#########################
# CLEAN ENVIRONMENTS
#########################

# Removes the images and volumes for development
.PHONY: clean
clean:
	echo "$(GREEN)\n--- Removing development docker images and volumes...\n$(GRAY)"
	docker-compose down -v --remove-orphans --rmi all

#########################
# SCRIPTS
#########################

# Installs node dependencies
.PHONY: install-dependencies
install-dependencies:
	echo "$(GREEN)\n--- installing project dependencies...\n$(RESET)"
	docker-compose exec $(NODE_BIN) yarn

# Runs tests one time
.PHONY: run-tests
run-tests:
	echo "$(GREEN)\n---  Running tests...\n$(RESET)"
	docker-compose exec $(NODE_BIN) yarn test

# SSH access to the node container
.PHONY: ssh
ssh:
	docker-compose exec $(NODE_BIN) bash

# Displays logs of the node container
.PHONY: logs
logs:
	docker-compose logs -f $(NODE_BIN)

# Formats the code with ESLint and Prettier. Will manage container boot
.PHONY: format
format: start install-dependencies
	echo "$(GREEN)\n---  Formatting code...\n$(RESET)"
	docker-compose exec $(NODE_BIN) yarn format
	echo "$(GREEN)\n--- Stopping development environment...\n$(GRAY)"
	docker-compose down -v --remove-orphans

# Migrates the database with knex
.PHONY: migrate-database
migrate-database:
	echo "$(GREEN)\n--- migrating database...\n$(GRAY)"
	docker-compose exec $(NODE_BIN) node_modules/.bin/knex --knexfile database/knexfile.js migrate:latest
