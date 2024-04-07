import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro';
import { connectDB } from '@/libs/mongoose/connectDB';
import { deleteUser, createOrUpdateUser } from '@/libs/actions/user';

export const config = {
  api: {
    bodyParser: false,
  }
}
 
export default async function handler(req , res) {
  if (req.method !== 'POST') {
    return res.status(405)
  }
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
 
  // Get the headers
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];
 
 
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Error occured -- no svix headers' })
  }
 
  console.log('headers', req.headers, svix_id, svix_signature, svix_timestamp)
  // Get the body
  const body = (await buffer(req)).toString()
 
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
 
  let evt;
 
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).json({ 'Error': err })
  }
 
  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
 
  if(eventType === "user.created" || eventType === "user.updated" ){
    const { id, first_name, last_name, image_url, email_addresses, username } = evt?.data;

    try {
        await createOrUpdateUser(id, first_name, last_name, image_url, email_addresses, username);

        return new Response("User is created or updated", {
            status: 200
        })
    } catch (error) {
        console.error("Error occured", error);
        return new Response("Error occured", {
            status: 400
        })
    }
  }

  if(eventType === "user.deleted"){
    try {
        const {id} = evt?.data;
        await deleteUser(id);

        return new Response("User is deleted", {
            status: 200
        })
    } catch (error) {
        console.error("Error deleting user", error);
        return new Response("Error occured", {
            status: 500
        })
    }
  }

  return res.status(200).json()
}