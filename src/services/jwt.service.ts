import jwt from 'jsonwebtoken';

const secretKey = 'your_secret_key';

// Function to generate JWT token
export async function generateToken(payload: any): Promise<string> {
    const token = await jwt.sign(payload, secretKey, { expiresIn: '365h' }); // Token expires in 1 hour
    return token;
}

// Function to verify JWT token
export async function verifyToken(token: string): Promise<any | null> {
    try {
        const decoded = await jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        // Token verification failed
        return null;
    }
}