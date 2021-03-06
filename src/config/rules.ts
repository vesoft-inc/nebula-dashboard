export const usernameRulesFn = intl => [
  {
    required: true,
    message: intl.get('rules.usernameRequired'),
  },
];

export const passwordRulesFn = intl => [
  {
    required: true,
    message: intl.get('rules.passwordRequired'),
  },
];

export const versionRulesFn = intl => [
  {
    required: true,
    message: intl.get('rules.versionRequired'),
  },
];
