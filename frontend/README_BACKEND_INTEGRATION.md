# IoT IDS Frontend — Backend Connected

## Run
Backend:
```bat
cd C:\Projects\IoT_IDS\backend
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

Frontend:
```bat
npm install
npm run dev
```

The frontend uses `VITE_API_BASE_URL=http://127.0.0.1:8000`.

## Connected pages
- Dashboard `/` -> `/health`, `/summary`, `/performance`, `/unseen-evaluation`
- Model Performance -> `/performance`
- Unseen Attacks -> `/unseen-evaluation`
- Reliability -> `/reliability`
- Traffic Analysis -> `/predict` for one flow and `/predict-batch` for CSV upload

## CSV batch demo
Use a CICIoT2023-compatible CSV containing the 20 selected features:
Protocol Type, Number, Tot size, Tot sum, fin_count, Min, UDP, Variance, HTTPS, AVG, SSH, syn_count, syn_flag_number, TCP, fin_flag_number, rst_count, Std, psh_flag_number, ack_count, Header_Length.

The UI displays backend predictions, attack/benign prediction counts, attack-family distribution, processing time, throughput and a 100-row preview.

Important: attack/benign counts for an uploaded CSV are model predictions, not ground-truth accuracy.

## Important terminology
The project supports live feature-level inference and CSV batch inference through FastAPI. It is not production packet capture or guaranteed real-world zero-day detection.
