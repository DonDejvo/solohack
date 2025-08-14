// messenger.js
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
if (!ACCESS_TOKEN) {
  console.error("ACCESS_TOKEN not set in .env file");
  process.exit(1);
}

async function openConversation(participantId) {
  const url = `https://messenger.sololearn.com/conversations/null?participants=${encodeURIComponent(participantId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Accept-Encoding": "gzip",
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "SL-App-Build-Version": "1112",
      "SL-App-Version": "4.113.2",
      "SL-Locale": "en",
      "SL-Plan-Id": "1",
      "SL-Time-Zone": "0.0"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to open conversation: ${res.status} ${res.statusText}`);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function sendFirstMessage(message, invitedUserId) {
  const url = `https://messenger.sololearn.com/conversations?message=${encodeURIComponent(message)}&invitedUserIds=${encodeURIComponent(invitedUserId)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Accept-Encoding": "gzip",
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "SL-App-Build-Version": "1112",
      "SL-App-Version": "4.113.2",
      "SL-Locale": "en",
      "SL-Plan-Id": "1",
      "SL-Time-Zone": "0.0"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to send message: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

async function getMessages(conversationId, index, count) {
  const url = `https://messenger.sololearn.com/conversations/${conversationId}/messages?index=${index}&count=${count}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Accept-Encoding": "gzip",
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "SL-App-Build-Version": "1112",
      "SL-App-Version": "4.113.2",
      "SL-Locale": "en",
      "SL-Plan-Id": "1",
      "SL-Time-Zone": "0.0"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to send message: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

// CLI argumenty
const [,, funcName, ...args] = process.argv;

(async () => {
  try {
    let result;
    if (funcName === "openConversation") {
      if (args.length < 1) throw new Error("Usage: node messenger.js openConversation <participantId>");
      result = await openConversation(...args);
    } else if (funcName === "sendFirstMessage") {
      if (args.length < 2) throw new Error("Usage: node messenger.js sendFirstMessage <message> <invitedUserId> <message count>");
      const msgCount = args.length == 3 ? Number(args[2]) : 1;
      for(let i = 0; i < msgCount; ++i) {
        try {
            result = await sendFirstMessage(args[0] + (i == 0 ? "" : ` (${i})`), args[1]);
            console.log(`Message no.${i + 1} sent`);
        } catch(err) {
            console.log(`Message no.${i + 1} failed with error: ${err.message}`);
        }
      }
    } else if (funcName === "getMessages") {
      if (args.length < 3) throw new Error("Usage: node messenger.js getMessages <conversationId> <index> <count>");
      result = await getMessages(...args);
    } else {
      throw new Error(`Unknown function: ${funcName}`);
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
