import React from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

/**
 * PollDetail: stub page — shows poll id and dummy options.
 * Later: replace dummy with fetch(VITE_API_URL + `/polls/${id}`)
 */

export default function PollDetail() {
  const { id } = useParams();
  const options = ["Yes", "No", "Maybe"];

  return (
    <div>
      <h2 className="text-h2 text-textPrimary mb-md">Poll #{id}</h2>
      <Card>
        <h3 className="text-h3 text-textPrimary mb-sm">(Dummy) Should we adopt this policy?</h3>
        <div className="space-y-sm">
          {options.map((o) => (
            <div key={o} className="flex items-center justify-between">
              <span className="text-body">{o}</span>
              <Button
                onClick={() => {
                  // smoke action - will be replaced by API call later
                  console.log("VOTE", { pollId: id, option: o });
                  alert(`Vote recorded (local stub): ${o}`);
                }}
              >
                Vote
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}