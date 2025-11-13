from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import os
import pandas as pd

# Import portfolio_tool living next to this file
from portfolio_tool import (
    load_all_sector_data,
    get_dataset_summary,
    get_recommendations_for_tickers,
    get_recommendations_by_sector,
    SECTORS_DATA
)

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])

# Ensure data is loaded once at startup
_df_loaded = False

def ensure_loaded():
    global _df_loaded
    if not _df_loaded:
        load_all_sector_data()
        _df_loaded = True

class RecommendByTickersReq(BaseModel):
    amount: float = Field(..., gt=0)
    tickers: List[str]

class RecommendBySectorReq(BaseModel):
    amount: float = Field(..., gt=0)
    sectors: List[str] = []
    risk: str = Field("medium", description="one of low|medium|high")

@router.get("/sectors")
def list_sectors():
    return {"sectors": list(SECTORS_DATA.keys())}

@router.get("/summary")
def dataset_summary():
    ensure_loaded()
    summary = get_dataset_summary()
    return {"summary": summary}

@router.post("/recommend/tickers")
def recommend_by_tickers(req: RecommendByTickersReq):
    ensure_loaded()
    if not req.tickers:
        raise HTTPException(400, "tickers required")
    try:
        alloc, latest, history = get_recommendations_for_tickers(req.tickers, req.amount)
    except Exception as e:
        raise HTTPException(400, str(e))
    # make JSON serializable
    latest = {k: float(v) for k, v in latest.items()}
    history_data = {c: [float(x) for x in history[c].fillna(0).values] for c in history.columns}
    dates = [d.isoformat() for d in history.index]

    return {
        "allocation": alloc,
        "latest": latest,
        "history": {"dates": dates, "series": history_data},
    }

@router.post("/recommend/sectors")
def recommend_by_sectors(req: RecommendBySectorReq):
    ensure_loaded()
    try:
        result = get_recommendations_by_sector(req.sectors, req.amount, req.risk)
    except Exception as e:
        raise HTTPException(400, str(e))
    # result is expected to contain allocation and chosen tickers
    return result
