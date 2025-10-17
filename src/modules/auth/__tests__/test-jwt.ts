import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwt.utils";

const accessToken = generateAccessToken(1, "test@example.com");
const refreshToken = generateRefreshToken(1);

console.log("Access Token:", accessToken);
console.log("Refresh Token:", refreshToken);
