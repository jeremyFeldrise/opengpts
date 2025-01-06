from fastapi import APIRouter, HTTPException, Path, Form, Request
import jwt
from datetime import datetime, timedelta, timezone
import os
from app.auth.handlers import AuthedUser

from starlette.responses import RedirectResponse

import stripe

stripe.api_key = os.environ["STRIPE_PRIVATE_KEY"]

router = APIRouter()

@router.post("/create-checkout-session")
async def checkout(user: AuthedUser, request: Request) -> dict:
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    'price': 'price_1QckXARpo8husWNl0Rs1O5Sc',
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url='test' + '?success=true',
            cancel_url='test' + '?canceled=true',
            automatic_tax={'enabled': True},
        )
    except Exception as e:
        return str(e)

    return RedirectResponse(checkout_session.url, code=303)