from fastapi import APIRouter, HTTPException, Path, Form, Request
import jwt
from datetime import datetime, timedelta, timezone
import os
from app.auth.handlers import AuthedUser

import app.storage as storage

import stripe


router = APIRouter()

stripe.api_key = os.environ["STRIPE_PRIVATE_KEY"]


@router.get("/agent")
async def get_agent_price(user: AuthedUser, agent_name:str) -> dict:
    """Get the price of a thread."""
    if not agent_name:
        return {"price": 1}
    threads_info = await storage.get_agent_price(agent_name)
    print("threads_info", threads_info)
    if not threads_info["price"]:
        {"price": 1}
    return {"price": threads_info["price"]}

@router.get("/token")
async def get_token_price() :
    """Get the price of a token."""
    print("Token ID", os.environ["STRIPE_TOKEN_ID"])
    product = stripe.Product.retrieve(os.environ["STRIPE_TOKEN_ID"])
    price = stripe.Price.retrieve(product.default_price)
    return price
    
   