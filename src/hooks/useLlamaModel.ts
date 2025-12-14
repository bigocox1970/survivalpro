import { useState, useCallback, useRef } from 'react';
import * as FileSystem from 'expo-file-system';
import { initLlama, LlamaContext } from 'llama.rn';

// Model configuration - using 1B model for faster inference
const MODEL_CONFIG = {
  name: 'Llama-3.2-1B-Instruct-Q4_K_M',
  filename: 'llama-3.2-1b-instruct-q4_k_m.gguf',
  downloadUrl: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
  size: '0.75 GB',
  expectedSizeBytes: 750000000, // Approximate minimum size in bytes
};

// System prompt for survival assistant
const SURVIVAL_SYSTEM_PROMPT = `You are a helpful survival expert assistant. Answer the user's questions directly and concisely.

If asked about survival topics (fire, water, shelter, food, first aid, navigation), give practical step-by-step instructions.

If the user says hi or asks a general question, just respond naturally and briefly. Do NOT create fictional scenarios or roleplay situations. Only answer what the user actually asks.`;

interface UseLlamaModelResult {
  isLoaded: boolean;
  isLoading: boolean;
  isGenerating: boolean;
  modelStatus: string;
  downloadProgress: number;
  loadModel: () => Promise<void>;
  unloadModel: () => Promise<void>;
  generateResponse: (prompt: string) => Promise<string>;
  deleteModel: () => Promise<void>;
}

export function useLlamaModel(): UseLlamaModelResult {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelStatus, setModelStatus] = useState('Model not loaded');
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const contextRef = useRef<LlamaContext | null>(null);

  const getModelPath = () => {
    return `${FileSystem.documentDirectory}models/${MODEL_CONFIG.filename}`;
  };

  const checkModelExists = async (): Promise<boolean> => {
    try {
      const modelPath = getModelPath();
      const fileInfo = await FileSystem.getInfoAsync(modelPath);
      if (!fileInfo.exists) return false;

      // Check if file size is reasonable (at least 500MB for the 1B model)
      if (fileInfo.size && fileInfo.size < MODEL_CONFIG.expectedSizeBytes) {
        console.log(`Model file too small: ${fileInfo.size} bytes. Deleting and re-downloading...`);
        await FileSystem.deleteAsync(modelPath, { idempotent: true });
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  const downloadModel = async (): Promise<string> => {
    const modelPath = getModelPath();
    const modelDir = `${FileSystem.documentDirectory}models`;

    // Ensure models directory exists
    const dirInfo = await FileSystem.getInfoAsync(modelDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(modelDir, { intermediates: true });
    }

    setModelStatus('Downloading model...');
    setDownloadProgress(0);

    const downloadResumable = FileSystem.createDownloadResumable(
      MODEL_CONFIG.downloadUrl,
      modelPath,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress(progress * 100);
        setModelStatus(`Downloading: ${(progress * 100).toFixed(0)}%`);
      }
    );

    const result = await downloadResumable.downloadAsync();
    if (!result?.uri) {
      throw new Error('Download failed');
    }

    return result.uri;
  };

  const loadModel = useCallback(async () => {
    if (isLoading || isLoaded) return;

    setIsLoading(true);
    setModelStatus('Checking for model...');

    try {
      let modelPath = getModelPath();
      const exists = await checkModelExists();

      if (!exists) {
        modelPath = await downloadModel();
      }

      setModelStatus('Loading model into memory...');

      // Use conservative settings for better compatibility
      const context = await initLlama({
        model: modelPath,
        n_ctx: 512,      // Smaller context for memory efficiency
        n_batch: 128,    // Smaller batch size
        n_threads: 4,
        n_gpu_layers: 0,
      });

      if (!context) {
        throw new Error('Failed to create model context');
      }

      contextRef.current = context;

      setIsLoaded(true);
      setModelStatus('Model ready (offline)');
      setDownloadProgress(100);

    } catch (error) {
      console.error('Failed to load model:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';

      // Provide user-friendly error messages
      if (errorMsg.includes('context') || errorMsg.includes('memory')) {
        setModelStatus('Error: Not enough memory. Try closing other apps.');
      } else if (errorMsg.includes('model') || errorMsg.includes('load')) {
        setModelStatus('Error: Model corrupted. Go to Settings > Reset Model.');
      } else {
        setModelStatus(`Error: ${errorMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isLoaded]);

  const unloadModel = useCallback(async () => {
    if (contextRef.current) {
      await contextRef.current.release();
      contextRef.current = null;
    }
    setIsLoaded(false);
    setModelStatus('Model unloaded');
    setDownloadProgress(0);
  }, []);

  const deleteModel = useCallback(async () => {
    // First unload if loaded
    if (contextRef.current) {
      await contextRef.current.release();
      contextRef.current = null;
    }

    // Delete the model file
    const modelPath = getModelPath();
    try {
      await FileSystem.deleteAsync(modelPath, { idempotent: true });
      setIsLoaded(false);
      setModelStatus('Model deleted. Tap to re-download.');
      setDownloadProgress(0);
    } catch (error) {
      console.error('Failed to delete model:', error);
    }
  }, []);

  const generateResponse = useCallback(async (prompt: string): Promise<string> => {
    if (!contextRef.current) {
      return 'Model not loaded. Please wait for the AI model to initialize.';
    }

    setIsGenerating(true);

    try {
      const result = await contextRef.current.completion({
        prompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

${SURVIVAL_SYSTEM_PROMPT}<|eot_id|><|start_header_id|>user<|end_header_id|>

${prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

`,
        n_predict: 256,
        temperature: 0.7,
        top_p: 0.9,
        stop: ['<|eot_id|>', '<|end_of_text|>'],
      });

      return result.text.trim();

    } catch (error) {
      console.error('Generation error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';

      if (errorMsg.toLowerCase().includes('context') || errorMsg.toLowerCase().includes('limit')) {
        return 'Context limit reached. Please restart the app to reset the conversation.';
      }

      return 'I encountered an error generating a response. Please try again.';
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    isLoaded,
    isLoading,
    isGenerating,
    modelStatus,
    downloadProgress,
    loadModel,
    unloadModel,
    generateResponse,
    deleteModel,
  };
}
