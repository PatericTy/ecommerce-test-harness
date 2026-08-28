# Test Harness Documentation

## Overview

This project runs automated tests across 3 E-commerce API implementations and compares them using a weighted scoring system.

## Implementations

| Branch | Description |
|--------|-------------|
| `impl-a` | Implementation A |
| `impl-b` | Implementation B |
| `impl-c` | Implementation C |

## Running Locally

### Prerequisites

- Node.js 20+
- npm 9+
- Docker Desktop (for PostgreSQL)
- Git

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PatericTy/ecommerce-test-harness.git
   cd ecommerce-test-harness
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start PostgreSQL (Docker):**
   ```bash
   docker run --rm -d -p 5432:5432 \
     -e POSTGRES_PASSWORD=testpass \
     -e POSTGRES_DB=ecommerce_test \
     postgres:15
   ```

### Running Tests

**Run the full test harness (all 3 branches):**
```bash
./run-tests.sh
```

**Run tests on a single branch:**
```bash
git checkout impl-a
npm test
```

**Run specific test suite:**
```bash
npm run test:unit
npm run test:integration
```

## Scoring System

### Formula
```
score = 0.7 × (pass_rate / 100) + 0.3 × (1 - latency / 500)
```

### Components

| Component | Weight | Description |
|-----------|--------|-------------|
| Pass Rate | 70% | Percentage of tests passing (0–100%) |
| Latency | 30% | Test execution time (normalized to 500ms max) |

### Example Scores

| Branch | Pass Rate | Latency | Score |
|--------|-----------|---------|-------|
| impl-a | 100% | 150ms | 0.881 |
| impl-b | 95% | 200ms | 0.785 |
| impl-c | 90% | 300ms | 0.630 |

## Acceptance Criteria

✅ **Pass** if **BOTH** conditions are met:
- Pass Rate ≥ 95%
- Latency < 250ms

❌ **Fail** if either condition is not met.

## Tie-Breaker

If two implementations have the same score, **lower latency wins**.

## Output

After running `./run-tests.sh`, results are saved to:

```json
// test-results.json
[
  {
    "branch": "impl-a",
    "pass_rate": 98.5,
    "latency": 175,
    "score": 0.8455,
    "criteria_pass": 1
  },
  ...
]
```

## CI/CD

Tests run automatically on:
- Every push to `main`, `impl-a`, `impl-b`, `impl-c`
- Every pull request to `main`

### Secrets Required

Set these in GitHub Settings → Secrets and variables → Actions:

| Secret | Description |
|--------|-------------|
| `DB_PASSWORD` | PostgreSQL password |
| `API_KEY` | API authentication key |

### Workflow Results

- Results artifact: `test-results.json`
- PR comments with summary
- Full logs available in Actions tab

## Troubleshooting

### Tests fail with "Port 5432 already in use"
```bash
docker ps
docker stop <container_id>
```

### Permission denied on run-tests.sh
```bash
chmod +x run-tests.sh
```

### Tests hang or timeout
Increase `TEST_TIMEOUT` in `.env`:
```bash
TEST_TIMEOUT=60000  # 60 seconds
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes in any of the 3 implementation branches
3. Push and create a PR to `main`
4. Wait for CI to run and compare scores
5. Merge the best-performing implementation

## Support

- 📧 Contact: @PatericTy
- 🐛 Issues: [GitHub Issues](https://github.com/PatericTy/ecommerce-test-harness/issues)

---

**Last updated:** 2024
