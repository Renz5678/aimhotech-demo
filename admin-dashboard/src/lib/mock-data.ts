export const kpiData = {
  screeningsThisMonth: {
    value: "1,165",
    trend: "+12%",
    vsLabel: "vs last month",
    isPositive: true,
  },
  elevatedRiskShare: {
    value: "13.4%",
    trend: "+1.8 pts",
    vsLabel: "vs last month",
    isPositive: false,
  },
  referralCompletion: {
    value: "78%",
    trend: "+6 pts",
    vsLabel: "vs last month",
    isPositive: true,
  },
  stationsOnline: {
    value: "7 / 8",
    trend: "-1 kiosk",
    vsLabel: "vs last month",
    isPositive: false,
  },
};

export const topRiskDrivers = [
  { condition: "Severe Hypertension", value: 42, color: "#B0523F" },
  { condition: "Type 2 Diabetes", value: 28, color: "#C79A3C" },
  { condition: "Cardiovascular", value: 15, color: "#4C7A5A" },
  { condition: "Other", value: 15, color: "#A3B18B" },
];

export const aiTriageQueue = [
  {
    patient: "Rosa Manalo, 62",
    station: "Bgy. San Isidro",
    risk: "High Risk",
    reason: "BP 180/110, Glucose 210",
  },
  {
    patient: "Juanito Perez, 55",
    station: "Bgy. Sto Niño",
    risk: "High Risk",
    reason: "Chest Pain, SpO2 92%",
  },
  {
    patient: "Maria Santos, 48",
    station: "Bgy. San Roque",
    risk: "Moderate",
    reason: "BP 150/95",
  },
];
