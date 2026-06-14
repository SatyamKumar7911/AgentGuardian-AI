import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, AlertCircle } from 'lucide-react';
import { uploadEvidence } from './api';
import type { Investigation } from './types';
import { motion } from 'framer-motion';

interface UploadAreaProps {
  onUploadSuccess: (investigation: Investigation) => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const file = acceptedFiles[0];
      const investigation = await uploadEvidence(file);
      onUploadSuccess(investigation);
    } catch (err) {
      console.error(err);
      setError('Failed to upload and start investigation. Make sure backend is running.');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 1
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div 
        {...getRootProps()} 
        className={`p-10 border-2 border-dashed rounded-2xl transition-all duration-300 backdrop-blur-md bg-white/5 cursor-pointer flex flex-col items-center justify-center
          ${isDragActive ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-600 hover:border-cyan-500 hover:bg-slate-800/50'}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`w-16 h-16 mb-6 ${isDragActive ? 'text-cyan-400' : 'text-slate-400'}`} />
        
        {isUploading ? (
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-slate-200">Foundry IQ Agent is analyzing...</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-200 mb-2">Drop evidence here</p>
            <p className="text-slate-400">or click to browse files</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
              <span className="px-3 py-1 rounded-full bg-slate-800">Emails (.eml)</span>
              <span className="px-3 py-1 rounded-full bg-slate-800">PDF Documents</span>
              <span className="px-3 py-1 rounded-full bg-slate-800">Images / Screenshots</span>
              <span className="px-3 py-1 rounded-full bg-slate-800">Video / Audio</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
    </motion.div>
  );
};
