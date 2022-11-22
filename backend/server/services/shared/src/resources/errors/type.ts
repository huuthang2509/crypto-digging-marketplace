export enum ErrorKey {
  UnknownError = "unknown_error",

  RecordNotFound = "record_not_found",

  // Auth
  NotAuthenticate = "not_authenticate",
  AuthFailed = "auth_failed",
  InvalidAccountInfo = "invalid_account_info",
  UsernameExisted = "username_existed",
  RequireUpdateUsernamePassword = "require_update_username_password",

  // Hero
  HeroNotEnoughToPlay = "hero_not_enough_to_play",

  // Signature
  ActionFail = "action_fail",

  // Marketplace
  MarketplaceBuyOwnerItem = "marketplace_buy_ownew_item",

  // Transaction
  WithdrawFail = "withdraw_fail",
}
