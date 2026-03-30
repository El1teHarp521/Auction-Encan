from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

app = FastAPI(title="Encan API (PostgreSQL)")

DB_CONFIG = {
    "dbname": "encan_db",
    "user": "postgres",
    "password": "6145", # Твой пароль
    "host": "localhost",
    "port": "5432"
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"ОШИБКА ПОДКЛЮЧЕНИЯ: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

# --- ЭНДПОИНТЫ ДЛЯ ЛОТОВ ---

@app.get("/lots")
def get_lots(all_lots: bool = Query(False, alias="all")):
    conn = get_db_connection()
    cur = conn.cursor()
    sql = """
        SELECT id, title, description, address, type, status, area, rooms, floor,
               image_url AS "imageUrl", 
               current_price AS "currentPrice", 
               seller_name AS "sellerName", 
               seller_id AS "sellerId",
               end_date AS "endDate", 
               bids_count AS "bidsCount"
        FROM lots
    """
    if not all_lots:
        cur.execute(sql + " WHERE status = 'active' ORDER BY id DESC;")
    else:
        cur.execute(sql + " ORDER BY id DESC;")
    
    lots = cur.fetchall()
    cur.close()
    conn.close()
    return lots

@app.get("/lots/{lot_id}")
def get_lot(lot_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    # Просто забираем всё как есть из базы
    cur.execute("SELECT * FROM lots WHERE id = %s;", (lot_id,))
    lot = cur.fetchone()
    cur.close()
    conn.close()
    if not lot:
        raise HTTPException(status_code=404)
    return lot


@app.post("/lots")
def create_lot(data: dict):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """INSERT INTO lots 
               (title, description, address, type, status, image_url, current_price, area, seller_name, end_date, bids_count, seller_id, rooms, floor) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (
                data.get('title', 'Новый лот'), 
                data.get('description', ''), 
                data.get('address', ''), 
                data.get('type', 'apartment'), 
                data.get('status', 'pending'), # При создании сразу pending
                data.get('imageUrl', ''), 
                float(data.get('startingPrice', 0)), 
                int(data.get('area', 0)), 
                data.get('sellerName', 'Unknown'), 
                data.get('endDate'), 
                0,
                str(data.get('sellerId')), 
                int(data.get('rooms', 1)),
                int(data.get('floor', 1))
            )
        )
        new_id = cur.fetchone()['id']
        conn.commit()
        print(f"--- ЛОТ СОЗДАН УСПЕШНО! ID: {new_id} ---")
        return {"id": new_id, "status": "success"}
    except Exception as e:
        conn.rollback()
        print(f"!!! ОШИБКА БАЗЫ ДАННЫХ: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.patch("/lots/{lot_id}")
def update_lot_status(lot_id: int, data: dict):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        if 'status' in data:
            cur.execute('UPDATE lots SET status = %s WHERE id = %s', (data['status'], lot_id))
        # Если нужно обновить endDate (например, при закрытии торгов)
        if 'endDate' in data and data['endDate']:
             cur.execute('UPDATE lots SET end_date = %s WHERE id = %s', (data['endDate'], lot_id))

        conn.commit()
        return {"status": "success"}
    except Exception as e:
        conn.rollback()
        print(f"!!! ОШИБКА ОБНОВЛЕНИЯ ЛОТА: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.delete("/lots/{lot_id}")
def delete_lot(lot_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM lots WHERE id = %s", (lot_id,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Лот не найден")
        print(f"--- ЛОТ {lot_id} УДАЛЕН ---")
        return {"status": "deleted"}
    except Exception as e:
        conn.rollback()
        print(f"!!! ОШИБКА УДАЛЕНИЯ ЛОТА: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

# --- ПОЛЬЗОВАТЕЛИ ---

@app.post("/users")
def register(user_data: dict):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM users WHERE email = %s", (user_data['email'],))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Email уже занят")

        cur.execute(
            "INSERT INTO users (name, email, pass, role) VALUES (%s, %s, %s, 'client') RETURNING id, name, email, role",
            (user_data['name'], user_data['email'], user_data['pass'])
        )
        new_user = cur.fetchone()
        conn.commit()
        return new_user
    except Exception as e:
        conn.rollback()
        print(f"!!! ОШИБКА РЕГИСТРАЦИИ: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.post("/login")
def login(credentials: dict):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id, name, email, role FROM users WHERE email = %s AND pass = %s",
            (credentials['email'], credentials['password'])
        )
        user = cur.fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="Неверная почта или пароль")
        return user
    except Exception as e:
        print(f"!!! ОШИБКА ЛОГИНА: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# --- АДМИНКА ---

@app.get("/admin/users")
def get_all_users():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, role FROM users ORDER BY id DESC;")
    users = cur.fetchall()
    cur.close()
    conn.close()
    return users

@app.patch("/admin/users/{user_id}/role")
def update_user_role(user_id: int, data: dict):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("UPDATE users SET role = %s WHERE id = %s", (data['role'], user_id))
        conn.commit()
        return {"status": "success"}
    except Exception as e:
        conn.rollback()
        print(f"!!! ОШИБКА СМЕНЫ РОЛИ: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# --- СТАВКИ ---

@app.get("/bids")
def get_bids(lotId: int):
    conn = get_db_connection()
    cur = conn.cursor()
    # Забираем чистые имена: user_name и created_at
    cur.execute("SELECT * FROM bids WHERE lot_id = %s ORDER BY created_at DESC;", (lotId,))
    bids = cur.fetchall()
    cur.close()
    conn.close()
    return bids

@app.post("/bids")
def create_bid(bid: dict):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO bids (lot_id, user_id, user_name, amount) VALUES (%s, %s, %s, %s)",
            (bid['lot_id'], bid['user_id'], bid['user_name'], bid['amount']))
        cur.execute('UPDATE lots SET current_price = %s, bids_count = bids_count + 1 WHERE id = %s',
            (bid['amount'], bid['lot_id']))
        conn.commit()
        return {"status": "success"}
    except Exception as e:
        conn.rollback()
        print(f"!!! ОШИБКА СОЗДАНИЯ СТАВКИ: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)