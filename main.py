from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI(title="Encan API Docs")

# Разрешаем фронтенду подключаться к бэкэнду
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "db.json"

# Инициализация базы данных
if not os.path.exists(DB_FILE):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump({"lots": [], "bids": []}, f)

def read_db():
    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def write_db(data):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# --- ЭНДПОИНТЫ ДЛЯ ЛОТОВ ---

@app.get("/lots")
def get_lots():
    return read_db()["lots"]

@app.get("/lots/{lot_id}")
def get_lot(lot_id: str):
    db = read_db()
    lot = next((l for l in db["lots"] if l["id"] == lot_id), None)
    if not lot:
        raise HTTPException(status_code=404, detail="Лот не найден")
    return lot

@app.post("/lots")
def create_lot(lot: dict):
    db = read_db()
    db["lots"].append(lot)
    write_db(db)
    return {"status": "success"}

@app.patch("/lots/{lot_id}")
def update_lot(lot_id: str, update_data: dict):
    db = read_db()
    for lot in db["lots"]:
        if lot["id"] == lot_id:
            lot.update(update_data)
            write_db(db)
            return lot
    raise HTTPException(status_code=404, detail="Лот не найден")

@app.delete("/lots/{lot_id}")
def delete_lot(lot_id: str):
    db = read_db()
    db["lots"] = [l for l in db["lots"] if l["id"] != lot_id]
    write_db(db)
    return {"status": "deleted"}

# --- ЭНДПОИНТЫ ДЛЯ СТАВОК ---

@app.get("/bids")
def get_bids(lotId: Optional[str] = None):
    db = read_db()
    if lotId:
        return [b for b in db["bids"] if b["lotId"] == lotId]
    return db["bids"]

@app.post("/bids")
def create_bid(bid: dict):
    db = read_db()
    db["bids"].append(bid)
    write_db(db)
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    import sys

    print("\n" + "="*60)
    print("      ИНФОРМАЦИОННАЯ СИСТЕМА ENCAN: БЭКЭНД ЗАПУЩЕН")
    print("="*60)
    print(f"👉 ПАНЕЛЬ УПРАВЛЕНИЯ (API DOCS): http://127.0.0.1:8000/docs")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")