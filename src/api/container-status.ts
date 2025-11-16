import type { NextApiRequest, NextApiResponse } from "next";

const PORTAINER_URL = process.env.PORTAINER_URL; // np. "http://localhost:9000/api"
const PORTAINER_TOKEN = process.env.PORTAINER_TOKEN; // Bearer token Portainera
const CONTAINER_ID = process.env.CONTAINER_ID; // ID kontenera Valheim

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const headers = {
    "Authorization": `Bearer ${PORTAINER_TOKEN}`,
    "Content-Type": "application/json",
  };

  try {
    if (req.method === "GET") {
      // Pobranie statusu kontenera
      const statusRes = await fetch(`${PORTAINER_URL}/endpoints/1/docker/containers/${CONTAINER_ID}/json`, { headers });
      const data = await statusRes.json();
      res.status(200).json({ running: data.State.Running });
    }

    if (req.method === "POST") {
      // Akcja: start / stop
      const { action } = req.body; // "start" | "stop"
      const actionUrl = `${PORTAINER_URL}/endpoints/1/docker/containers/${CONTAINER_ID}/${action}`;
      await fetch(actionUrl, { method: "POST", headers });
      res.status(200).json({ success: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
