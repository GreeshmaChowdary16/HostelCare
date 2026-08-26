import User from "../models/User.js";

const genderFromText = (value) => {
  const text = String(value || "").toLowerCase();
  if (/\bboys?\b|\bmale\b|\bmen\b/.test(text)) return "boys";
  if (/\bgirls?\b|\bfemale\b|\bwomen\b/.test(text)) return "girls";
  return "";
};

export const getAssignedGender = (user) =>
  user?.gender || genderFromText(user?.office || user?.roomInfo);

export const getRectorStudentFilter = (rector) => {
  const gender = getAssignedGender(rector);
  if (!gender) return null;

  const legacyPattern = gender === "boys" ? /boys?|male|men/i : /girls?|female|women/i;
  return {
    role: "student",
    $or: [{ gender }, { gender: { $in: ["", null] }, roomInfo: legacyPattern }],
  };
};

export const getRectorStudentIds = async (rector) => {
  const filter = getRectorStudentFilter(rector);
  if (!filter) return [];
  return User.find(filter).distinct("_id");
};
