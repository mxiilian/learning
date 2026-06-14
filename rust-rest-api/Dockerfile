# ── Build Stage ─────────────────────────────────────────────────────────────
FROM rust:1.88-slim AS builder

RUN apt-get update \
 && apt-get install -y pkg-config libssl-dev \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Cache Cargo dependencies before copying source (invalidated only on Cargo.toml/lock changes)
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo 'fn main() {}' > src/main.rs \
 && SQLX_OFFLINE=true cargo build --release \
 && rm -rf src

# Build the real binary
# Requires .sqlx/ query cache — run `cargo sqlx prepare` once before building
COPY . .
RUN touch src/main.rs \
 && SQLX_OFFLINE=true cargo build --release

# ── Runtime Stage ────────────────────────────────────────────────────────────
FROM debian:bookworm-slim

RUN apt-get update \
 && apt-get install -y libssl3 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/target/release/rust-rest-api .
COPY --from=builder /app/migrations ./migrations

EXPOSE 8080
CMD ["./rust-rest-api"]
