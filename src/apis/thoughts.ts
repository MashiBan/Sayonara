// pages/api/thoughts.ts
import { firestore } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";


const getThoughts = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "thoughts"));
    const thoughts: { name: string, thought: string, timestamp: string }[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      thoughts.push({
        name: data.name,
        thought: data.thought,
        timestamp: data.timestamp,
      });
    });

    return thoughts;
  } catch (error) {
    console.error("Error fetching thoughts from Firestore:", error);
    return [];
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const thoughts = await getThoughts();
    res.status(200).json(thoughts); // Return thoughts from Firestore
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
