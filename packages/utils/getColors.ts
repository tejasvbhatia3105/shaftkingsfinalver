export function getTeamColors(teamName: string) {
  const teams: Record<string, { primary: string; secondary: string }> = {
    'Mumbai Indians': { primary: '#F79433', secondary: '#ED1C24' },
    MI: { primary: '#F79433', secondary: '#ED1C24' },

    'Delhi Capitals': { primary: '#265098', secondary: '#FAAD1B' },
    DC: { primary: '#265098', secondary: '#FAAD1B' },

    'Kolkata Knight Riders': { primary: '#3A225D', secondary: '#F4CA3F' },
    KKR: { primary: '#3A225D', secondary: '#F4CA3F' },

    'Rajasthan Royals': { primary: '#E60693', secondary: '#FFFFFF' },
    RR: { primary: '#E60693', secondary: '#FFFFFF' },

    'Chennai Super Kings': { primary: '#F25C19', secondary: '#253783' },
    CSK: { primary: '#F25C19', secondary: '#253783' },

    'Gujarat Titans': { primary: '#1B2133', secondary: '#EAD17D' },
    GT: { primary: '#1B2133', secondary: '#EAD17D' },

    'Lucknow Super Giants': { primary: '#3A5FAC', secondary: '#FFFFFF' },
    LSG: { primary: '#3A5FAC', secondary: '#FFFFFF' },

    'Punjab Kings': { primary: '#DD1F2D', secondary: '#D0AA82' },
    PBKS: { primary: '#DD1F2D', secondary: '#D0AA82' },
    PK: { primary: '#DD1F2D', secondary: '#D0AA82' },

    'Royal Challengers Bengaluru': { primary: '#D6BD57', secondary: '#264288' },
    RCB: { primary: '#D6BD57', secondary: '#264288' },

    'Sunrisers Hyderabad': { primary: '#ED1C24', secondary: '#F25C19' },
    SRH: { primary: '#ED1C24', secondary: '#F25C19' },
    SH: { primary: '#ED1C24', secondary: '#F25C19' },
    Yes: { primary: '#43A047', secondary: '#00B47114' },
    No: { primary: '#D32F2F', secondary: '#EE5F6714' },
  };

  return teams[teamName] || { primary: '#ED1C24', secondary: '#F25C19' };
}
