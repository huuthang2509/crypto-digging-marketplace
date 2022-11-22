import { ErrorKey } from "./type";

export default {
  [ErrorKey.UnknownError]: "Unknown error",

  [ErrorKey.RecordNotFound]: "Record not found",

  // Auth
  [ErrorKey.NotAuthenticate]: "Please authenticate",
  [ErrorKey.AuthFailed]: "Login failed",
  [ErrorKey.InvalidAccountInfo]: "Invalid account info",
  [ErrorKey.UsernameExisted]: "User with username already existed",
  [ErrorKey.RequireUpdateUsernamePassword]: "You need to update username & password for more actions",

  // Hero
  [ErrorKey.HeroNotEnoughToPlay]: "You need to have at least 1 hero to playing the game",

  // Signature
  [ErrorKey.ActionFail]: "Invalid signature action",

  // Marketplace
  [ErrorKey.MarketplaceBuyOwnerItem]: "You need to remove from the market instead of purchase",

  // Withdraw
  [ErrorKey.WithdrawFail]: "You cannot have the Gem to withdraw",
} as Record<ErrorKey, string>;
