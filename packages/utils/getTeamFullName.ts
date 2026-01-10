export function getTeamFullName(teamAbbr: string): string {
  const teamNames: Record<string, string> = {
    MI: 'Mumbai Indians',
    DC: 'Delhi Capitals',
    KKR: 'Kolkata Knight Riders',
    RR: 'Rajasthan Royals',
    CSK: 'Chennai Super Kings',
    GT: 'Gujarat Titans',
    LSG: 'Lucknow Super Giants',
    PBKS: 'Punjab Kings',
    PK: 'Punjab Kings',
    RCB: 'Royal Challengers Bengaluru',
    SRH: 'Sunrisers Hyderabad',
    SH: 'Sunrisers Hyderabad',
  };

  return teamNames[teamAbbr] || teamAbbr;
}
