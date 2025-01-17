from fastapi import APIRouter, HTTPException, Path, Form, Request
import jwt
from datetime import datetime, timedelta, timezone
import os
from app.auth.handlers import AuthedUser

from starlette.responses import RedirectResponse

import stripe

import app.storage as storage


stripe.api_key = os.environ["STRIPE_PRIVATE_KEY"]

router = APIRouter()

@router.post("/create-checkout-session")
async def checkout(user: AuthedUser, request: Request):
    data = await request.json()
    if (user["stripe_client_id"] is None):
        user = await storage.update_user_stripe_id(user)
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    'price': os.environ["STRIPE_TOKEN_PRICE"],
                    'quantity': data['quantity'],
                },
            ],
            client_reference_id=user["stripe_client_id"],
            mode='payment',
            success_url= os.environ["FRONTEND_URL"] + '/payment/success',
            cancel_url= os.environ["FRONTEND_URL"] + '/payment/canceled',
            automatic_tax={'enabled': True},
        )
    except Exception as e:
        return str(e)
    return checkout_session


@router.post("/webhook")
async def payment_webhook(request: Request):
    print("Webhook")
    payload = await request.body()
    sig_header = request.headers['Stripe-Signature']
    event = None
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.environ["STRIPE_ENDPOINT_SECRET"]
        )
    except ValueError as e:
        # Invalid payload
        return HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HTTPException(status_code=400, detail="Invalid signature")
    # Handle the checkout.session.completed event
    # print("Event type", event['type'])
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        line_items = stripe.checkout.Session.list_line_items(session['id'], limit=1)
        print("Line items", line_items.data[0].quantity)
        print("Client reference id", session['client_reference_id'])
        await storage.increment_user_token_counter(session['client_reference_id'], line_items.data[0].quantity)
        # id = event.data.object.id
        # checkout_session = await stripe.checkout.Session.retrieve(id, expand=['line_items'])
        # print("Checkout Session", checkout_session)
        # Fulfill the purchase...
    return {"status": "success"}