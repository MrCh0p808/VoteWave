// --- DashboardHome: Analytics + Recent Polls ---
// Issue: #65 extension

import React from "react";
import { PieChart, Activity, Users, Flame } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="space-y-lg">
      {/* Analytics Section */}
      <section>
        <h2 className="text-h2 text-textPrimary mb-md">Your Voting Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
          {/* Card 1 */}
          <div className="bg-surface rounded-lg shadow-md p-md flex flex-col items-start">
            <Activity className="w-6 h-6 text-primary mb-sm" />
            <p className="text-body text-textSecondary">Total Votes Cast</p>
            <p className="text-h2 text-primary font-bold">124</p>
          </div>

          {/* Card 2 */}
          <div className="bg-surface rounded-lg shadow-md p-md flex flex-col items-start">
            <Flame className="w-6 h-6 text-accent mb-sm" />
            <p className="text-body text-textSecondary">Trending Polls</p>
            <p className="text-h2 text-accent font-bold">8</p>
          </div>

          {/* Card 3 */}
          <div className="bg-surface rounded-lg shadow-md p-md flex flex-col items-start">
            <Users className="w-6 h-6 text-secondary mb-sm" />
            <p className="text-body text-textSecondary">Engagement %</p>
            <p className="text-h2 text-secondary font-bold">72%</p>
          </div>

          {/* Card 4 */}
          <div className="bg-surface rounded-lg shadow-md p-md flex flex-col items-start">
            <PieChart className="w-6 h-6 text-error mb-sm" />
            <p className="text-body text-textSecondary">Vote Frequency</p>
            <p className="text-h2 text-error font-bold">Daily</p>
          </div>
        </div>
      </section>

      {/* Polls Section */}
      <section>
        <h2 className="text-h2 text-textPrimary mb-md">Cast Your Vote</h2>
        <div className="space-y-md">
          {/* Example Poll Card */}
          <div className="bg-surface rounded-lg shadow-md p-md">
            <h3 className="text-h3 text-textPrimary">Should remote work be the new normal?</h3>
            <p className="text-body text-textSecondary mb-sm">
              Vote on whether companies should allow permanent remote work.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-caption text-textSecondary">📊 452 votes</span>
              <button className="bg-primary text-surface px-md py-sm rounded-md hover:opacity-90">
                Vote ➜
              </button>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-md p-md">
            <h3 className="text-h3 text-textPrimary">Do you support climate action policies?</h3>
            <p className="text-body text-textSecondary mb-sm">
              Quick vote on environment policies in your region.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-caption text-textSecondary">📊 327 votes</span>
              <button className="bg-primary text-surface px-md py-sm rounded-md hover:opacity-90">
                Vote ➜
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
