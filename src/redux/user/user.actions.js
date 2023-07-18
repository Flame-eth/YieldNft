export const setCurrentUser = (user) => ({
  type: "SET_CURRENT_USER",
  payload: user,
});

export const setReferralLink = (link) => ({
  type: "SET_REFERRAL_LINK",
  payload: link,
});

export const setReferrer = (referrer) => ({
  type: "SET_REFERRER",
  payload: referrer,
});
