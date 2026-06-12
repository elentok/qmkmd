BIN := bin/qmkmd

.PHONY: help build install install-skill test generate fmt vet verify clean

help: ## Show this help
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "} {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

build: ## Build the qmkmd binary into bin/
	go build -o $(BIN) .

install: ## Install the qmkmd CLI into $GOBIN/$GOPATH/bin
	go install .

install-skill: ## Install the Claude skill (make install-skill MODE=copy to copy instead of symlink)
	scripts/install-skill.sh $(or $(MODE),symlink)

test: ## Run the test suite
	go test ./...

generate: ## Regenerate generated files (skill mapping table)
	go generate ./...

fmt: ## Format Go sources
	gofmt -w .

vet: ## Run go vet
	go vet ./...

verify: generate ## CI parity: regenerate and fail if anything is out of date
	git diff --exit-code

clean: ## Remove build artifacts
	rm -rf bin
