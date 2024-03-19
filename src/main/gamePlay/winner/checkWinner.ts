import logger from "../../../logger";

export async function checkWinner(gameBoard: any[], gameType: number): Promise<{ isWinner: boolean; isTie: boolean }> {
    try {
        const n: number = gameType;
        let isWinner: boolean = false;
        // for row
        for (let i = 0; i < n; i++) {
            const index: number = i * n;
            const value: any[] = [];
            for (let j = 0; j < n; j++) {
                const gameBoardIndex: number = j + index;
                value.push(gameBoard[gameBoardIndex]);
            }
            if (value.every((element) => element === value[0]) && value[0] !== "") {
                isWinner = true;
                break;
            }
        }
        // for column
        if (!isWinner) {
            for (let i = 0; i < n; i++) {
                const index: number = i;
                const value: any[] = [];
                for (let j = 0; j < n; j++) {
                    const gameBoardIndex: number = i + j * n;
                    value.push(gameBoard[gameBoardIndex]);
                }
                if (value.every((element) => element === value[0]) && value[0] !== "") {
                    isWinner = true;
                    break;
                }
            }
        }

        // for diagonal
        if (!isWinner) {
            for (let i = 0; i < 2; i++) {
                const value: any[] = [];
                for (let j = 0; j < n; j++) {
                    let gameBoardIndex: number;
                    if (i === 0) {
                        gameBoardIndex = j * (n + 1);
                    } else {
                        gameBoardIndex = (n - 1) * (j + 1);
                    }
                    value.push(gameBoard[gameBoardIndex]);
                }
                if (value.every((element) => element === value[0]) && value[0] !== "") {
                    isWinner = true;
                    break;
                }
            }
        }
        
        let isTie: boolean = false;
        if (!gameBoard.includes("")) {
            isTie = true;
        }

        return {
            isWinner: isWinner,
            isTie: isTie
        };
    } catch (error) {
        logger.error("----- checkWinner :: ERROR :: ", error);
        throw error;
    }
}
