import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken {
  id: number;
  email: string;
}

const verifyDecodeToken = (authorizationHeader: string): DecodedToken => {
  if (!authorizationHeader) {
    throw { code: 401, message: "No token provided" };
  }

  const [bearer, token] = authorizationHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    throw { code: 401, message: "Invalid token format" };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!decoded || typeof decoded !== "object" || !decoded.email || !decoded.id) {
      throw { code: 401, message: "Invalid token or email/id not present" };
    }

    return { id: decoded.id as number, email: decoded.email };
  } catch (error) {
    console.error("Error verifying or decoding token:", error);
    throw { code: 401, message: "Invalid or expired token" };
  }
};

export { verifyDecodeToken };
