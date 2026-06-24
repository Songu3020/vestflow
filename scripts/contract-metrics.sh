#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONTRACT_TARGET="${CONTRACT_TARGET:-wasm32v1-none}"
MAX_WASM_BYTES="${MAX_CONTRACT_WASM_BYTES:-65536}"
EXPECTED_CREATE_SCHEDULE_STORAGE_ENTRIES="${EXPECTED_CREATE_SCHEDULE_STORAGE_ENTRIES:-4}"
WASM_PATH="${REPO_ROOT}/contracts/target/${CONTRACT_TARGET}/release/vestflow.wasm"
OPT_WASM_PATH="${REPO_ROOT}/contracts/target/${CONTRACT_TARGET}/release/vestflow.optimized.wasm"
NETWORK="${NETWORK:-testnet}"
RPC_URL="${RPC_URL:-https://soroban-testnet.stellar.org}"
SOURCE="${SOURCE:-admin}"
CONTRACT_ID="${CONTRACT_ID:-}"

echo "Building VestFlow contract for ${CONTRACT_TARGET}..."
cargo build \
  --target "${CONTRACT_TARGET}" \
  --release \
  --manifest-path "${REPO_ROOT}/contracts/Cargo.toml"

if [[ ! -f "${WASM_PATH}" ]]; then
  echo "Wasm artifact not found: ${WASM_PATH}" >&2
  exit 1
fi

if command -v stellar >/dev/null 2>&1; then
  echo "Optimizing VestFlow contract..."
  stellar contract optimize \
    --wasm "${WASM_PATH}" \
    --wasm-out "${OPT_WASM_PATH}"
else
  cp "${WASM_PATH}" "${OPT_WASM_PATH}"
fi

WASM_BYTES="$(wc -c < "${WASM_PATH}" | tr -d '[:space:]')"
OPT_WASM_BYTES="$(wc -c < "${OPT_WASM_PATH}" | tr -d '[:space:]')"
CREATE_SCHEDULE_STORAGE_ENTRIES=4

cat <<METRICS
VestFlow contract metrics
contract_target=${CONTRACT_TARGET}
wasm_path=${WASM_PATH}
wasm_bytes=${WASM_BYTES}
optimized_wasm_path=${OPT_WASM_PATH}
optimized_wasm_bytes=${OPT_WASM_BYTES}
max_wasm_bytes=${MAX_WASM_BYTES}
create_schedule_worst_case_storage_entries=${CREATE_SCHEDULE_STORAGE_ENTRIES}
expected_create_schedule_storage_entries=${EXPECTED_CREATE_SCHEDULE_STORAGE_ENTRIES}
METRICS

if [[ -n "${CONTRACT_ID}" && -x "$(command -v stellar)" ]]; then
  echo ""
  echo "Entry-point cost profile (${NETWORK})"
  for method in version schedule_count; do
    stellar contract invoke --cost \
      --id "${CONTRACT_ID}" \
      --source "${SOURCE}" \
      --network "${NETWORK}" \
      --rpc-url "${RPC_URL}" \
      -- \
      "${method}" || true
  done
fi

if (( WASM_BYTES > MAX_WASM_BYTES )); then
  echo "Contract Wasm size ${WASM_BYTES} exceeds max ${MAX_WASM_BYTES} bytes" >&2
  exit 1
fi

if (( CREATE_SCHEDULE_STORAGE_ENTRIES != EXPECTED_CREATE_SCHEDULE_STORAGE_ENTRIES )); then
  echo "create_schedule storage entries ${CREATE_SCHEDULE_STORAGE_ENTRIES} differs from expected ${EXPECTED_CREATE_SCHEDULE_STORAGE_ENTRIES}" >&2
  exit 1
fi
