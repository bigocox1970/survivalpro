/**
 * Morse Code Service
 * Handles encoding text to Morse code and controlling timing for flashlight signals
 */

const MORSE_CODE: Record<string, string> = {
  'A': '.-',
  'B': '-...',
  'C': '-.-.',
  'D': '-..',
  'E': '.',
  'F': '..-.',
  'G': '--.',
  'H': '....',
  'I': '..',
  'J': '.---',
  'K': '-.-',
  'L': '.-..',
  'M': '--',
  'N': '-.',
  'O': '---',
  'P': '.--.',
  'Q': '--.-',
  'R': '.-.',
  'S': '...',
  'T': '-',
  'U': '..-',
  'V': '...-',
  'W': '.--',
  'X': '-..-',
  'Y': '-.--',
  'Z': '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  ' ': ' ',
};

// Timing constants (in milliseconds)
const DOT_DURATION = 200;
const DASH_DURATION = DOT_DURATION * 3; // 600ms
const INTRA_CHARACTER_GAP = DOT_DURATION; // Gap between dots/dashes in same letter
const INTER_CHARACTER_GAP = DOT_DURATION * 3; // 600ms - Gap between letters
const WORD_GAP = DOT_DURATION * 7; // 1400ms - Gap between words

export class MorseCodeService {
  private isRunning: boolean = false;
  private abortController: AbortController | null = null;

  /**
   * Convert text to Morse code string representation
   */
  static textToMorse(text: string): string {
    return text
      .toUpperCase()
      .split('')
      .map((char) => MORSE_CODE[char] || '')
      .join(' ');
  }

  /**
   * Convert text to displayable Morse code (using · and ─ symbols)
   */
  static toMorseDisplay(text: string): string {
    return text
      .toUpperCase()
      .split('')
      .map((char) => {
        const morse = MORSE_CODE[char];
        if (!morse) return '';
        if (morse === ' ') return '   ';
        return morse.replace(/\./g, '·').replace(/-/g, '─');
      })
      .join('  ');
  }

  /**
   * Get the complete alphabet reference for display
   */
  static getAlphabetReference(): Array<{ letter: string; morse: string }> {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    return letters.map((letter) => ({
      letter,
      morse: MORSE_CODE[letter].replace(/\./g, '·').replace(/-/g, '─'),
    }));
  }

  /**
   * Flash a message in Morse code
   * @param text The text to flash
   * @param onFlash Callback function called with true (flash on) or false (flash off)
   */
  async flashMorse(
    text: string,
    onFlash: (isOn: boolean) => void
  ): Promise<void> {
    if (this.isRunning) {
      this.stop();
      return;
    }

    this.isRunning = true;
    this.abortController = new AbortController();

    try {
      const morse = MorseCodeService.textToMorse(text);
      
      for (let i = 0; i < morse.length; i++) {
        if (!this.isRunning) break;

        const symbol = morse[i];

        if (symbol === '.') {
          // Dot
          onFlash(true);
          await this.delay(DOT_DURATION);
          onFlash(false);
          await this.delay(INTRA_CHARACTER_GAP);
        } else if (symbol === '-') {
          // Dash
          onFlash(true);
          await this.delay(DASH_DURATION);
          onFlash(false);
          await this.delay(INTRA_CHARACTER_GAP);
        } else if (symbol === ' ') {
          // Check if this is a word gap (double space) or letter gap (single space)
          const nextSymbol = morse[i + 1];
          if (nextSymbol === ' ') {
            // Word gap
            await this.delay(WORD_GAP - INTER_CHARACTER_GAP);
            i++; // Skip the next space
          } else {
            // Letter gap
            await this.delay(INTER_CHARACTER_GAP - INTRA_CHARACTER_GAP);
          }
        }
      }
    } finally {
      onFlash(false);
      this.isRunning = false;
      this.abortController = null;
    }
  }

  /**
   * Stop any ongoing Morse code transmission
   */
  stop(): void {
    this.isRunning = false;
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  /**
   * Check if currently transmitting
   */
  get transmitting(): boolean {
    return this.isRunning;
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isRunning) {
        resolve();
        return;
      }
      setTimeout(resolve, ms);
    });
  }

  /**
   * Calculate total duration of a message in seconds
   */
  static calculateDuration(text: string): number {
    const morse = MorseCodeService.textToMorse(text);
    let duration = 0;

    for (let i = 0; i < morse.length; i++) {
      const symbol = morse[i];
      if (symbol === '.') {
        duration += DOT_DURATION + INTRA_CHARACTER_GAP;
      } else if (symbol === '-') {
        duration += DASH_DURATION + INTRA_CHARACTER_GAP;
      } else if (symbol === ' ') {
        const nextSymbol = morse[i + 1];
        if (nextSymbol === ' ') {
          duration += WORD_GAP;
          i++;
        } else {
          duration += INTER_CHARACTER_GAP;
        }
      }
    }

    return duration / 1000; // Convert to seconds
  }
}

export default MorseCodeService;
