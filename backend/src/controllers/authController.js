import User from "../models/userModel.js";

/**
 * walletLogin
 * - input: { wallet_address, username, contact, telegram_username (optional) }
 * - If user exists, return it. If not, create (username & contact required per your setting).
 */
export const walletLogin = async (req, res) => {
  try {
    const { wallet_address, username, contact, telegram_username } = req.body;

    if (!wallet_address)
      return res
        .status(400)
        .json({ success: false, message: "wallet_address required" });

    // find existing
    let user = await User.findOne({ wallet_address });

    if (!user) {
      // Because you said username & contact are required, enforce here:
      if (!username)
        return res
          .status(400)
          .json({ success: false, message: "username required for new users" });
      if (!contact && !telegram_username)
        return res
          .status(400)
          .json({ success: false, message: "contact or telegram required" });

      user = await User.create({
        wallet_address,
        username,
        contact: { phone: contact, email: null },
        telegram: { username: telegram_username || null },
      });
      return res.status(201).json({ success: true, user });
    }

    // existing user
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * updateProfile - update username / contact / telegram
 */
export const updateProfile = async (req, res) => {
  try {
    const { wallet_address, username, contact, telegram_username } = req.body;
    if (!wallet_address)
      return res
        .status(400)
        .json({ success: false, message: "wallet_address required" });

    const update = {};
    if (username) update.username = username;
    if (contact) update.contact = { phone: contact };
    if (telegram_username)
      update.telegram = { username: telegram_username, verified: false };

    const user = await User.findOneAndUpdate({ wallet_address }, update, {
      new: true,
      upsert: false,
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
