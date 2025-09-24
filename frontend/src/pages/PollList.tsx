import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

/**
 * PollList: simple scaffold with dummy data so we can test UI.
 * Later we will wire fetch() to VITE_API_URL + /api/polls
 */

const DUMMY = [
  { id: 1, question: "Should remote work be the new normal?", votes: 452 },
  { id: 2, question: "Do you support climate action policies?", votes: 327 },
  { id: 3, question: "Should the school year start later?", votes: 214 },
];

export default function PollList() {
  const nav = useNavigate();

  return (
    <div className="space-y-md">
      <h2 className="text-h2 text-textPrimary">Available Polls</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {DUMMY.map((p) => (
          <Card key={p.id}>
            <h3 className="text-h3 text-textPrimary mb-sm">{p.question}</h3>
            <p className="text-body text-textSecondary mb-sm">📊 {p.votes} votes</p>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  console.log("NAV to poll detail", p.id);
                  nav(`/polls/${p.id}`);
                }}
              >
                View / Vote
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}