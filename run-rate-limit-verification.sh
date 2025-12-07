#!/bin/bash
# run-rate-limit-verification.sh

deno test --allow-net --allow-env tests/integration/verify-rate-limiting.ts
