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
    let { weeklyMenu, day, breakfast, lunch, dinner, snacks } = req.body;

    let menuDoc = await MessMenu.findOne();
    const currentMenu = (menuDoc && menuDoc.weeklyMenu) ? menuDoc.weeklyMenu : defaultMenu;

    let mergedWeeklyMenu;
    if (weeklyMenu) {
      mergedWeeklyMenu = { ...defaultMenu, ...currentMenu, ...weeklyMenu };
    } else if (day) {
      mergedWeeklyMenu = {
        ...defaultMenu,
        ...currentMenu,
        [day]: {
          breakfast: breakfast !== undefined ? breakfast : (currentMenu[day]?.breakfast || ''),
          lunch: lunch !== undefined ? lunch : (currentMenu[day]?.lunch || ''),
          dinner: dinner !== undefined ? dinner : (currentMenu[day]?.dinner || ''),
          ...(snacks !== undefined ? { snacks } : (currentMenu[day]?.snacks ? { snacks: currentMenu[day].snacks } : {}))
        }
      };
    } else {
      return res.status(400).json({ message: "Weekly menu or day menu data is required" });
    }

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

