import User from '../models/User.js';
import Account from '../models/Account.js';

export const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const accounts = await Account.find({ userId: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        user,
        accounts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { name, preferredCurrency, themePreference, defaultDateRange } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    if (name) user.name = name;
    if (preferredCurrency) user.preferredCurrency = preferredCurrency;
    if (themePreference) user.themePreference = themePreference;
    if (defaultDateRange) user.defaultDateRange = defaultDateRange;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
