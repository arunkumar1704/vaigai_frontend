export const SAMPLE_BOOKINGS = [
  { id: "BK001", name: "Priya Sharma", tour: "Madurai Temple Tour", date: "2025-03-15", people: 2, total: 9998, status: "Confirmed" },
  { id: "BK002", name: "Rahul Verma", tour: "Ooty Hill Station Package", date: "2025-04-01", people: 4, total: 31996, status: "Pending" },
  { id: "BK003", name: "Meena K", tour: "Rameswaram Spiritual Tour", date: "2025-03-20", people: 3, total: 22497, status: "Confirmed" },
  { id: "BK004", name: "Suresh Nair", tour: "Kanyakumari Sunset Tour", date: "2025-04-10", people: 2, total: 10998, status: "Cancelled" },
  { id: "BK005", name: "Divya Menon", tour: "Alleppey Houseboat Cruise", date: "2025-04-20", people: 2, total: 18998, status: "Confirmed" },
  { id: "BK006", name: "Arun Pillai", tour: "Kerala Grand Tour", date: "2025-05-01", people: 3, total: 89997, status: "Pending" },
];

export const SAMPLE_MESSAGES = [
  { id: "M001", name: "Anjali Singh", email: "anjali@example.com", message: "Looking for a honeymoon package to Munnar and Alleppey...", date: "2025-01-10", read: false },
  { id: "M002", name: "David Thomas", email: "david@example.com", message: "What is the availability for Rameswaram in April?", date: "2025-01-09", read: true },
  { id: "M003", name: "Kavitha R", email: "kavitha@example.com", message: "Need a custom itinerary for 8 people group tour to Kerala.", date: "2025-01-08", read: true },
];

export const STATUS_COLORS = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};
