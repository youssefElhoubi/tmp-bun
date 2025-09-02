import jwt from "jsonwebtoken";

const sign = (user: any) => {
    const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
    const token = jwt.sign(
        { sub: user._id, role: "user" },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
    return token
}

export default sign