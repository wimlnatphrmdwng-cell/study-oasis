# AI Assistant Backend (FastAPI + OpenAI)

ระบบ Backend API สำหรับ AI Assistant รองรับโมเดล `gpt-4o-mini` และโมเดลตระกูล OpenAI อื่นๆ พร้อมระบบ CORS, Error Handling, และจัดเก็บ Context ประวัติการสนทนา

## โครงสร้างไฟล์
```
├── main.py              # โค้ด Backend API ตัวเต็ม
├── requirements.txt     # รายการแพ็กเกจที่ต้องติดตั้ง
├── .env                 # ไฟล์กำหนดค่า Environment (ใส่ API Key ที่นี่)
├── .env.example         # ตัวอย่างไฟล์ Environment
└── README.md            # คู่มือการใช้งาน
```

## วิธีติดตั้งและเริ่มใช้งาน

1. สร้าง Virtual Environment (แนะนำ):
   ```bash
   python -m venv venv
   # บน Windows:
   venv\Scripts\activate
   # บน macOS/Linux:
   source venv/bin/activate
   ```

2. ติดตั้งแพ็กเกจ:
   ```bash
   pip install -r requirements.txt
   ```

3. ใส่ OpenAI API Key ในไฟล์ `.env`:
   ```env
   OPENAI_API_KEY=sk-...
   ```

4. สั่งรันเซิร์ฟเวอร์:
   ```bash
   python main.py
   # หรือ
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

5. เข้าดูเอกสาร Swagger API Docs:
   - http://localhost:8000/docs
