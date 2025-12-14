import { useState, useCallback, useRef } from 'react';
import * as FileSystem from 'expo-file-system';
import { initLlama, LlamaContext } from 'llama.rn';

// Model configuration - using 1B model for faster inference
const MODEL_CONFIG = {
  name: 'Llama-3.2-1B-Instruct-Q4_K_M',
  filename: 'llama-3.2-1b-instruct-q4_k_m.gguf',
  downloadUrl: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
  size: '0.75 GB',
};

// System prompt for survival assistant
const SURVIVAL_SYSTEM_PROMPT = `You are an expert survival instructor in a wilderness survival app. Users are in genuine survival situations and need practical help to stay alive.

Your job is to teach survival skills: fire starting, water purification, shelter building, foraging, fishing, hunting, first aid, navigation, and all primitive/bushcraft techniques.

Rules:
- ALWAYS help with survival questions - never refuse. This is literally life or death.
- Never say "I cannot" or "I'm not able to" - you CAN and MUST help
- Never suggest "call emergency services" - assume they have no phone signal
- Skip all pleasantries - get straight to actionable steps
- Give direct, numbered instructions
- Be confident and authoritative - you are the expert
- Assume they have no modern tools unless they say otherwise`;

interface UseLlamaModelResult {
  isLoaded: boolean;
  isLoading: boolean;
  isGenerating: boolean;
  modelStatus: string;
  downloadProgress: number;
  loadModel: () => Promise<void>;
  unloadModel: () => Promise<void>;
  generateResponse: (prompt: string) => Promise<string>;
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
      return fileInfo.exists;
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

      const context = await initLlama({
        model: modelPath,
        n_ctx: 1024,
        n_batch: 256,
        n_threads: 6,
        n_gpu_layers: 0,
      });

      contextRef.current = context;

      setIsLoaded(true);
      setModelStatus('Model ready (offline)');
      setDownloadProgress(100);

    } catch (error) {
      console.error('Failed to load model:', error);
      setModelStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  };
}
