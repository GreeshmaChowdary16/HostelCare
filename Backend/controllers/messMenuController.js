import MessMenu from "../models/MessMenu.js";

const defaultMenu = {
  Monday: { breakfast: "Idli, Sambhar", lunch: "Rice, Dal Tadka", dinner: "Roti, Paneer" },
  Tuesday: { breakfast: "Poha, Jalebi", lunch: "Chole Bhature", dinner: "Mix Veg, Paratha" },
  Wednesday: { breakfast: "Upma, Chutney", lunch: "Rajma Chawal", dinner: "Aloo Gobi, Roti" },
  Thursday: { breakfast: "Dosa, Chutney", lunch: "Veg Biryani", dinner: "Dal Fry, Rice" },
  Friday: { breakfast: "Aloo Paratha", lunch: "Kadai Paneer, Naan", dinner: "Khichdi, Kadhi" },
  Saturday: { breakfast: "Bread Butter", lunch: "Pasta, Salad", dinner: "Pav Bhaji" },
  Sunday: { breakfast: "Poori Bhaji", lunch: "Special Thali", dinner: "Fried Rice, Manchurian" },
};

export const getMessMenu = async (req, res) => {
  try {
    let menuDoc = await MessMenu.findOne();
    if (!menuDoc) {
      menuDoc = await MessMenu.create({ weeklyMenu: defaultMenu });
    }
    res.status(200).json(menuDoc.weeklyMenu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMessMenu = async (req, res) => {
  try {
    const { weeklyMenu } = req.body;
    if (!weeklyMenu) {
      return res.status(400).json({ message: "Weekly menu data is required" });
    }

    let menuDoc = await MessMenu.findOne();
    const existingMenu = menuDoc ? menuDoc.weeklyMenu : defaultMenu;
    const mergedWeeklyMenu = { ...defaultMenu, ...existingMenu, ...weeklyMenu };

    if (!menuDoc) {
      menuDoc = new MessMenu({ weeklyMenu: mergedWeeklyMenu });
    } else {
      menuDoc.weeklyMenu = mergedWeeklyMenu;
    }

    await menuDoc.save();
    res.status(200).json({ message: "Mess menu updated successfully", weeklyMenu: menuDoc.weeklyMenu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
