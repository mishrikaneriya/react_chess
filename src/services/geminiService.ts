import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async getNextMove(boardState: string, moveHistory: string): Promise<string> {
    const prompt = `
      As a chess AI, analyze this board state and suggest the best move for black:
      Current board state:
      ${boardState}
      
      Move history:
      ${moveHistory}
      
      Respond only with the move in algebraic notation (e.g., "e2e4" or "g8f6").
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const move = response.text().trim();
      
      // Validate move format (basic check)
      if (/^[a-h][1-8][a-h][1-8]$/.test(move)) {
        return move;
      }
      throw new Error('Invalid move format received from AI');
    } catch (error) {
      console.error('Error getting AI move:', error);
      throw error;
    }
  }
}