import mongoose from "mongoose";

const messMenuSchema = new mongoose.Schema(
  {
    weeklyMenu: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("MessMenu", messMenuSchema);
