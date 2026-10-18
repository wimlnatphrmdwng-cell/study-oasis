import os
import sys
import logging
from datetime import datetime

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
from typing import List, Optional, Literal
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import openai
from openai import AsyncOpenAI

# -------------------------------------------------------------
# 1. โหลด Environment Variables และตั้งค่า Logging
# -------------------------------------------------------------
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ai-assistant-api")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
ALLOWED_ORIGINS_RAW = os.getenv("ALLOWED_ORIGINS", "*")

# แยก origins กรณีระบุหลาย domain คั่นด้วย comma
if ALLOWED_ORIGINS_RAW.strip() == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [origin.strip() for origin in ALLOWED_ORIGINS_RAW.split(",") if origin.strip()]

# -------------------------------------------------------------
# 2. เริ่มต้น FastAPI App และตั้งค่า CORS
# -------------------------------------------------------------
app = FastAPI(
    title="AI Assistant Backend API",
    description="ระบบ Backend สำหรับเชื่อมต่อ OpenAI Chat Completion พร้อมรองรับ CORS และประวัติการสนทนา",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# เริ่มต้น OpenAI Async Client
openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# -------------------------------------------------------------
# 3. Pydantic Schemas สำหรับ Input และ Output
# -------------------------------------------------------------
class ChatHistoryItem(BaseModel):
    role: Literal["user", "assistant", "system"] = Field(
        ..., 
        description="บทบาทของผู้ส่งข้อความ ได้แก่ 'user', 'assistant', หรือ 'system'"
    )
    content: str = Field(
        ..., 
        min_length=1, 
        description="เนื้อหาข้อความ"
    )

class ChatRequest(BaseModel):
    message: str = Field(
        ..., 
        min_length=1, 
        description="ข้อความล่าสุดที่ผู้ใช้ส่งเข้ามา",
        example="สวัสดี ช่วยแนะนำแผนท่องเที่ยวกรุงเทพฯ 1 วันหน่อย"
    )
    history: Optional[List[ChatHistoryItem]] = Field(
        default_factory=list,
        description="ประวัติการสนทนาก่อนหน้า (เรียงตามลำดับเวลา)",
        example=[
            {"role": "user", "content": "สวัสดีครับ"},
            {"role": "assistant", "content": "สวัสดีครับ ยินดีให้บริการ มีอะไรให้ช่วยเหลือไหมครับ"}
        ]
    )
    system_instruction: Optional[str] = Field(
        default=None,
        description="คำสั่งกำหนดบทบาทหรือบุคลิกของ AI (System Prompt)",
        example="คุณคือผู้ช่วยอัจฉริยะ ให้ตอบคำถามอย่างกระชับ สุภาพ และใช้ภาษาไทยเป็นหลัก"
    )
    model: Optional[str] = Field(
        default=None,
        description="โมเดลที่ต้องการใช้งาน (ถ้าไม่ระบุจะใช้ค่าเริ่มต้นจาก .env คือ gpt-4o-mini)",
        example="gpt-4o-mini"
    )
    temperature: Optional[float] = Field(
        default=0.7,
        ge=0.0,
        le=2.0,
        description="ระดับความคิดสร้างสรรค์ (0.0 = เจาะจงมาก, 2.0 = สุ่ม/สร้างสรรค์สูง)"
    )
    max_tokens: Optional[int] = Field(
        default=1024,
        gt=0,
        le=4096,
        description="จำนวน Tokens สูงสุดในการตอบกลับ"
    )

class ChatUsage(BaseModel):
    prompt_tokens: Optional[int] = 0
    completion_tokens: Optional[int] = 0
    total_tokens: Optional[int] = 0

class ChatResponse(BaseModel):
    status: str = Field(..., example="success")
    reply: str = Field(..., description="ข้อความตอบกลับจากผู้ช่วย AI")
    model: str = Field(..., description="ชื่อโมเดลที่ถูกเรียกใช้งานจริง")
    usage: Optional[ChatUsage] = Field(default=None, description="สถิติการใช้ Token")

class HealthResponse(BaseModel):
    status: str = Field(..., example="ok")
    timestamp: str = Field(..., description="เวลาปัจจุบันของเซิร์ฟเวอร์ (UTC)")
    model_configured: str = Field(..., description="โมเดลที่ตั้งค่าไว้")
    openai_key_configured: bool = Field(..., description="ตรวจสอบว่ามี API Key หรือไม่")

# -------------------------------------------------------------
# 4. Endpoints
# -------------------------------------------------------------
@app.get("/health", response_model=HealthResponse, tags=["Monitoring"])
async def health_check():
    """
    Endpoint สำหรับตรวจสอบสถานะการทำงานของเซิร์ฟเวอร์
    """
    api_key_present = bool(OPENAI_API_KEY and OPENAI_API_KEY != "your_openai_api_key_here")
    return HealthResponse(
        status="ok",
        timestamp=datetime.utcnow().isoformat() + "Z",
        model_configured=DEFAULT_MODEL,
        openai_key_configured=api_key_present
    )

@app.post("/api/chat", response_model=ChatResponse, tags=["AI Assistant"])
async def chat_completion(request: ChatRequest):
    """
    Endpoint รับข้อความ สนทนากับ OpenAI API และตอบกลับ
    """
    # ตรวจสอบว่า API Key ถูกตั้งค่าไว้หรือไม่
    current_api_key = os.getenv("OPENAI_API_KEY", OPENAI_API_KEY)
    if not current_api_key or current_api_key == "your_openai_api_key_here":
        logger.error("OPENAI_API_KEY ยังไม่ได้ถูกตั้งค่าใน .env")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="กรุณาตั้งค่า OPENAI_API_KEY ในไฟล์ .env ก่อนใช้งาน"
        )

    # เลือกรุ่นโมเดล (ใช้ request.model ก่อน ถ้าไม่มีใช้ DEFAULT_MODEL)
    target_model = request.model or DEFAULT_MODEL

    # จัดเตรียมโครงสร้างข้อความ (Messages Payload)
    messages = []

    # 1. System Prompt / Instruction
    if request.system_instruction and request.system_instruction.strip():
        messages.append({
            "role": "system",
            "content": request.system_instruction.strip()
        })
    else:
        messages.append({
            "role": "system",
            "content": "คุณคือ AI ผู้ช่วยอัจฉริยะ ตอบคำถามอย่างสุภาพ ถูกต้อง และเป็นประโยชน์"
        })

    # 2. History (ประวัติการคุยเดิม)
    if request.history:
        for item in request.history:
            messages.append({
                "role": item.role,
                "content": item.content
            })

    # 3. Message ปัจจุบัน
    messages.append({
        "role": "user",
        "content": request.message.strip()
    })

    # เรียกใช้งาน OpenAI API พร้อม Error Handling ที่ครอบคลุม
    try:
        client = AsyncOpenAI(api_key=current_api_key)
        
        logger.info(f"กำลังส่งคำขอไปยังโมเดล: {target_model} (ข้อความทั้งหมด {len(messages)} รายการ)")

        response = await client.chat.completions.create(
            model=target_model,
            messages=messages,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )

        reply_content = response.choices[0].message.content or ""
        
        usage_info = None
        if response.usage:
            usage_info = ChatUsage(
                prompt_tokens=response.usage.prompt_tokens,
                completion_tokens=response.usage.completion_tokens,
                total_tokens=response.usage.total_tokens
            )

        logger.info(f"การตอบกลับสำเร็จ Token ที่ใช้ไป: {response.usage.total_tokens if response.usage else 'N/A'}")

        return ChatResponse(
            status="success",
            reply=reply_content,
            model=target_model,
            usage=usage_info
        )

    except openai.AuthenticationError as e:
        logger.error(f"Authentication Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="OpenAI API Key ไม่ถูกต้อง หรือหมดอายุ กรุณาตรวจสอบในไฟล์ .env"
        )
    except openai.RateLimitError as e:
        logger.error(f"Rate Limit Exceeded: {e}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="คำขอเกินโควตา (Rate Limit / Quota Exceeded) ของบัญชี OpenAI"
        )
    except openai.APITimeoutError as e:
        logger.error(f"API Timeout Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="การเชื่อมต่อไปยัง OpenAI API หมดเวลา กรุณาลองใหม่อีกครั้ง"
        )
    except openai.APIConnectionError as e:
        logger.error(f"API Connection Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ไม่สามารถเชื่อมต่อไปยัง OpenAI Server ได้ ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต"
        )
    except openai.BadRequestError as e:
        logger.error(f"Bad Request Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"คำขอไม่ถูกต้อง: {str(e)}"
        )
    except Exception as e:
        logger.exception(f"เกิดข้อผิดพลาดที่ไม่คาดคิด: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"เกิดข้อผิดพลาดภายในระบบ: {str(e)}"
        )

# -------------------------------------------------------------
# 5. สั่งรันเซิร์ฟเวอร์เมื่อรันไฟล์ main.py โดยตรง
# -------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 เริ่มการทำงานเซิร์ฟเวอร์ที่ http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)
