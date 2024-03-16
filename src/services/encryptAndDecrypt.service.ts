import bcrypt from 'bcrypt';
import logger from '../logger';

const SALT_ROUNDS = 10;

// Function to hash (encrypt) 
export async function encryptData(value: string): Promise<string> {
    try {
        console.log(`----- value :: `,value)
        console.log(`----- SALT_ROUNDS :: `,SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(value, SALT_ROUNDS);
        return hashedPassword;
    } catch (error) {
        logger.error(`------ encryptData :: ERROR :: `, error)
        throw error;
    }
}

// Function to compare and verify 
export async function decryptData(value: string, hashedvalue: string): Promise<boolean> {
    try {
        const match = await bcrypt.compare(value, hashedvalue);
        return match;
    } catch (error) {
        logger.error(`------ decryptData :: ERROR :: `, error)
        throw error;

    }
}